
// export default
class ColumnChart {
    chartHeight = 50;
    subElements = {};
    element;

    constructor({
        data = [],
        label = '',
        link = '',
        value = 0,
        formatHeading = formatString => formatString,
    } = {}) {
        this.data = data;
        this.label = label;
        this.link = link;
        this.value = formatHeading(value);

        if (arguments.length && Array.isArray(Object.values(arguments[0])[0])) {
            this.data = Object.values(arguments[0])[0];
        }

        if (typeof arguments[0] === 'object') {
            const argument = arguments[0];

            if (Object.keys(argument).length === 1 && (!Array.isArray(Object.keys(argument)[0]))) {
                switch (typeof Object.values(argument)[0]) {
                case 'number':
                    this.value = Object.values(argument)[0];
                    break;

                case 'string':
                    if (Object.values(argument)[0].startsWith('http')) this.link = Object.values(argument)[0];
                    else this.label = Object.values(argument)[0];
                    break;
                }

            }
            else if (Object.keys(argument).length === 1 && (Array.isArray(Object.keys(argument)[0]))) {
                console.error('data array');
            }
            else {
                //  should have ability to define "formatHeading" function
                // this.formatHeadingFunction = Object.values(argument)[0];
                // const amount = Object.values(argument)[1];
                // this.value = this.formatHeadingFunction(amount);
            }
        }
        this.element = this.render();
    }

    getColumnBody = function(data) {
        let htmlString = '';
        const maxValue = Math.max(...data);
        const scale = this.chartHeight / maxValue;
        const rowCount = data.length;

        htmlString =
        data.map(elem => {
            const percent = (elem / maxValue * 100).toFixed();
            return `<div style="--value: ${Math.floor(scale * elem)}; height: ${percent}%;" data-tooltip=${percent}% class="column-chart__row"
            ></div>`;
        }).join('');

        return htmlString;
    }

    getLink() {
        return this.link ? `<a class=column_chart__link href="${this.link}">View all</a>` : '';
    }

    get template() {
        return `
        <div class="column-chart column-chart_loading style="--chart-height: ${this.chartHeight}">
            <div class="column-chart__caption">
                <div class="column-chart__title">Total ${this.label}</div>
                <div class="column-chart__link">${this.getLink()}</div>
            </div>
            <div data-element="header" class="column-chart__header">${this.value}</div>
            <div data-element="body" class="column-chart__chart">${this.getColumnBody(this.data)}</div>
        </div>`;
    }

    render() {
        const wrapperDiv = document.createElement('div');
        const dataDiv = document.createElement('div');
        dataDiv.classList.add(['column-chart', 'column-chart_loading']);
        dataDiv.innerHTML = `
        <div class="column-chart__caption">

        </div>
        `;

        //todo continue
        wrapperDiv.innerHTML = this.template;

        if (this.link) {
            this.linkText = `<a href="${this.link}">View all</a>`;
        }
        if (this.data.length) {
            wrapperDiv.firstElementChild.classList.remove('column-chart_loading');
            const graph = div.querySelector('div.column-chart__chart');
            graph.innerHTML = this.getColumnBody(this.data);
        }
        wrapperDiv.append(dataDiv);

        return wrapperDiv.firstElementChild;
    }

    update(newData) {
        const graph = document.querySelector('div.column-chart__chart');
        graph.innerHTML = this.getColumnBody(newData);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
    }
}

// to comment before tests:

//  should have ability to define "formatHeading" function
const formatHeading = data => `USD ${data}`;
const value = 100;
const data = [];
const columnChart = new ColumnChart({ data });
root.append(columnChart.element);
data2 = [10, 20, 30];

setTimeout(() => {
    columnChart.update(data2);
}, 3000);
