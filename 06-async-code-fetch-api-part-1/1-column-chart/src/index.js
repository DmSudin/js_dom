import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';


// to uncomment before tests
export default
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
        this.render();
    }

    getColumnBody = function(data) {
        let htmlString = '';
        const maxValue = Math.max(...data);
        const scale = this.chartHeight / maxValue;

        htmlString =
        data.map(elem => {
            const percent = (elem / maxValue * 100).toFixed();
            return `<div style="--value: ${Math.floor(scale * elem)}; height: ${percent}%;" data-tooltip=${percent}% class="column-chart__row"
            ></div>`;
        }).join('');

        return htmlString;
    }

    getSubElements(element) {
        const result = {};
        const elements = element.querySelectorAll('[data-element]');

        for (const subElement of elements) {
            const name = subElement.dataset.element;
            result[name] = subElement;
        }

        return result;
    }

    getLink() {
        return this.link ? `<a class=column-chart__link href="${this.link}">View all</a>` : '';
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
        const element = document.createElement('div');
        element.innerHTML = this.template;

        if (this.link) {
            this.linkText = `<a href="${this.link}">View all</a>`;
        }
        if (this.data.length) {
            element.firstElementChild.classList.remove('column-chart_loading');
            const graph = element.querySelector('div.column-chart__chart');
            graph.innerHTML = this.getColumnBody(this.data);
        }

        this.element = element.firstElementChild;
        this.subElements = this.getSubElements(element.firstElementChild);
        return element.firstElementChild;
    }

    update(newData) {
        const columnBody = this.subElements.body;
        columnBody.innerHTML = this.getColumnBody(newData);
        // const graph = document.querySelector('div.column-chart__chart');
        // graph.innerHTML = this.getColumnBody(newData);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
    }
}

// to comment before tests:
// const formatHeading = data => `USD ${data}`;
// const data = [10, 300, 30];
// const data2 = [30, 10, 300];
// const label = 'sells';
// const link = 'https://ya.ru';
// const value = 999;
// const columnChart = new ColumnChart({ data, label, link, value });
// root.append(columnChart.element);

// setTimeout(() => {
//     columnChart.update(data2);

// }, 3000);

