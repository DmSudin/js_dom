
export default
class ColumnChart {

    constructor() {
        this.data = [];
        this.label = '';
        this.link = '';
        this.value = 0;
        this.chartHeight = 50;

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

    getDataHtml = function(data) {
        let htmlString = '';
        const maxValue = Math.max(...data);
        const scale = this.chartHeight / maxValue;
        const rowCount = data.length;

        htmlString =
        data.map(elem => {
            const percent = (elem / maxValue * 100).toFixed();
            return `<div class="column-chart__row" data-tooltip=${percent}%
            style="--value: ${Math.floor(scale * elem)}; height: ${percent}%;"></div>`;
        }).join('');

        return htmlString;
    }

    render() {
        const div = document.createElement('div');
        div.innerHTML = `
        <div class="column-chart">
            <div class="column-chart__caption">
                <div class="column-chart__title">${this.label}</div>
                <div class="column-chart__link">${this.linkText}</div>
            </div>
            <div class="column-chart__header">${this.value}</div>
            <div class="column-chart__chart"></div>
        </div>`;

        if (this.link) {
            this.linkText = `<a href="${this.link}">View all</a>`;
        }
        if (this.data) {
            const graph = div.querySelector('div.column-chart__chart');
            graph.innerHTML = this.getDataHtml(this.data);
        }

        if (!this.data.length && !this.link && !this.value && !this.label) {
            div.firstElementChild.classList.add('column-chart_loading');
        }

        return div.firstElementChild;
    }

    update(newData) {
        const graph = document.querySelector('div.column-chart__chart');
        graph.innerHTML = this.getDataHtml(newData);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
    }
}

// to comment before tests:

//  should have ability to define "formatHeading" function
// const formatHeading = data => `USD ${data}`;
// const value = 100;
// columnChart = new ColumnChart({ formatHeading, value });
// root.append(columnChart.element);
