import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

// to uncomment before tests
export default
class ColumnChart {
    chartHeight = 50;
    subElements = {};
    element;

    constructor({
        url = '',
        range = {
            from: null,
            to: null,
        },
        data = [],
        label = '',
        link = '',
        value = 0,
        formatHeading = formatString => formatString,
    } = {}) {
        this.url = url;
        this.range = range;
        this.data = data;
        this.label = label;
        this.link = link;
        this.value = formatHeading(value);
        this.render();
        this.subElements = this.getSubElements(this.element);
        this.update(this.range.from, this.range.to);
        // console.log('header', this.subElements.header.innerHTML);
        // console.log('body', this.subElements.body.innerHTML);
    }

    render() {
        if (this.range) {
             this.getData().then(result => {
                this.data = result;
            });
        }

        const wrapper = document.createElement('div');

        wrapper.innerHTML = this.getTemplate();

        if (this.data.length) {
            wrapper.firstElementChild.classList.remove('column-chart_loading');
        }

        this.element = wrapper.firstElementChild;
        this.subElements = this.getSubElements(wrapper.firstElementChild);
        
        document.body.append(this.element);
        
        // return wrapper.firstElementChild;
    }

    getColumnBody(data) {
        const maxValue = Math.max.apply(null, Object.values(data));
        const scale = this.chartHeight / maxValue;

        const htmlString =
        (Object.entries(data)).map(([key, currentValue]) => {
            const percent = ((currentValue / maxValue) * 100).toFixed();
            return `<div style="--value: ${currentValue}; height: ${percent}%;" data-tooltip=${currentValue}% class="column-chart__row"
            ></div>`;
        }).join('');

        return htmlString;
    }

    getSubElements(element) {
        const result = {};
        const elements = this.element.querySelectorAll('[data-element]');

        for (const subElement of elements) {
            const name = subElement.dataset.element;
            result[name] = subElement;
        }
        return result;
    }

    getLink() {
        return this.link ? `<a class=column-chart__link href="${this.link}">View all</a>` : '';
    }

    getDataCount() {
        const sum = Object.entries(this.data)
        .map(([key, value]) => {
            return value;
        })
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        if (!sum) return 0;
        return sum;
    }

    async getData() {
        // todo separate function:
        const formatDateField = field => {
            return (+field < 10) ? '0' + field : field;
        };
        const formatDate = date => {
            return `${date.getUTCFullYear()}-${formatDateField(date.getUTCMonth()+1)}-${formatDateField(date.getUTCDate())}`;
        };

        let json;
        const suffix = 'T12:03:24.777Z';
        const requestURL = BACKEND_URL + '/' + this.url + `?from=${formatDate(this.range.from)}&to=${formatDate(this.range.to)}`;

        const response = await fetch(requestURL);
        if (response.ok) {
            json = await response.json();
        } else {
            
            json = null;
        }
        return json;
    }

    getTemplate() {
        return `
        <div class="column-chart column-chart_loading style="--chart-height: ${this.chartHeight}">
            <div class="column-chart__caption">
                <div class="column-chart__title">Total ${this.label}</div>
                <div class="column-chart__link">${this.getLink()}</div>
            </div>
            <div data-element="header" class="column-chart__header">${this.value}</div>
            <div data-element="body" class="column-chart__chart"></div>

        </div>`;
    }

    async update(from, to) {
        
        const formatDateField = field => {
            return (+field < 10) ? '0' + field : field;
        };

        const formatDate = date => {
            return `${date.getUTCFullYear()}-${formatDateField(date.getUTCMonth() + 1)}-${formatDateField(date.getUTCDate())}`;
        };

        const requestURL = BACKEND_URL + '/' + this.url + `?from=${formatDate(from)}&to=${formatDate(to)}`;

        let jsonResponse;
        const response = await fetch(requestURL);

        if (response.ok) {
            jsonResponse = await response.json();
        } else {
            console.error('error', response.status);
        }

        this.data = jsonResponse;
        this.value = this.getDataCount();
        if (this.data) this.element.classList.remove('column-chart_loading');
        this.subElements.body.innerHTML = this.getColumnBody(this.data);        
        this.subElements.header.innerText = this.value;  
        console.error(this.subElements.body.children.length);
    }

    remove() {
        if (this.element) {
            this.element.remove();
        }
    }

    destroy() {
        this.remove();
        this.element = null;
        this.subElements = null;
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
