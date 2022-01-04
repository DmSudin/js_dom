import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
    element;
    subElements;

    onWindowScroll = async() => {
        const spaceToBottom = 50; // margins, paddings...
        const { bottom } = this.element.getBoundingClientRect();
        const pageBottom = document.documentElement.clientHeight;

        if (bottom <= pageBottom + spaceToBottom && !this.loading) {
            this.loading = true;
            this.start = this.end;
            this.end = this.start + this.step;
            const data = await this.loadData(this.start, this.end);
            this.data = [...this.data, ...data];
            const wrapper = document.createElement('div');
            wrapper.innerHTML = this.getTableRows(data);
            this.subElements.body.append(...wrapper.childNodes);
            this.loading = false;
        }
    }

    onSortClick = event => {
        const clickedColumn = event.target.closest('[data-sortable="true"]');

        const toggleOrder = order => {
            const orders = {
                asc: 'desc',
                desc: 'asc',
            };
            return orders[order];
        };

        if (clickedColumn) {

            if (clickedColumn.dataset.id === this.sorted.id) {
                //click on the same column
                const currentOrder = this.sorted.order;
                clickedColumn.dataset.order = toggleOrder(currentOrder);
                this.sorted.order = clickedColumn.dataset.order;
                this.updateArrowDirection();
                this.sortRows();
            } else {
                //click on the different column
                this.placeArrow(this.sorted.id, clickedColumn.dataset.id);
                this.sorted.id = clickedColumn.dataset.id;
                this.sorted.order = clickedColumn.dataset.order;
                this.sortRows();
            }
        } else {
            alert('Column is not sortable!');
        }
    }

    constructor(headerConfig = [], {
        url = '',
        sorted = {
            id: headerConfig.find(elem => elem.sortable === true).id,
            order: 'asc',
        },
        isSortLocally = false,
    } = {}) {
        this.start = 1;
        this.step = 20;
        this.end = this.start + this.step;
        this.headerConfig = headerConfig;
        this.sorted = sorted;
        this.isSortLocally = isSortLocally;
        this.url = new URL(url, BACKEND_URL);
        this.render();
    }

    getTable() {
        return `
        <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody()}

        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        No products
        </div>
        </div>
        `;
    }

    getTableHeader() {
        this.arrow = this.generateArrow();
        let result = `
        <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">`;

        result += this.headerConfig.map(element => {
            const attrDataOrder = `data-order=${this.sorted.order}`;
            return `
            <div class="sortable-table__cell" data-id="${element.id}" data-sortable="${element.sortable}" ${attrDataOrder}>
            <span>${element.title}</span>
            </div>`;
        }).join('');
        result += `</div>`;
        return result;
    }

    generateArrow() {
        const result = document.createElement('span');
        result.classList.add('sortable-table__sort-arrow');
        result.innerHTML = `<span class="sortable-table__sort-arrow_${this.sorted.order}"></span>`;
        return result;
    }

    appendArrow(element) {
        const elements = element.querySelectorAll('[data-id]');
        const cell = Array.from(elements).find(elem => elem.dataset.id === this.sorted.id);
        cell.appendChild(this.arrow);
    }

    placeArrow(from, to = null) {
        if (from && to) {
            const fromCell = this.subElements.header.querySelector(`[data-id="${from}"]`);
            const toCell = this.subElements.header.querySelector(`[data-id="${to}"]`);
            fromCell.removeChild(this.arrow);
            toCell.appendChild(this.arrow);
        } else if (!to) {
            const cell = this.subElements.header.querySelector(`[data-id="${from}"]`);
            cell.appendChild(this.arrow);
        }
    }

    updateArrowDirection() {
        const arrow = this.arrow.firstElementChild;
        Array.from(arrow.classList).forEach(elem => {
            arrow.classList.remove(elem);
        });
        arrow.classList.add(`sortable-table__sort-arrow_${this.sorted.order}`);
    }

    getTableBody() {
        let rowsHtml = this.getTableRows(this.data) ?? '';
        if (this.data) {
            rowsHtml = this.getTableRows(this.data);
        }
        else rowsHtml = '';
        return `
        <div data-element="body" class="sortable-table__body">
        ${rowsHtml}
        </div>`;
    }

    getTableRows(data) {
        if (!this.data) return '';

        return data.map(element => {
            return `
            <a href = "products/${element.id}" class="sortable-table__row">${this.getTableRow(element)}</a>
            `;
        }).join('');
    }

    getTableRow(element) {
        let result = '';
        this.headerConfig.map(configItem => {
            if (configItem.template) {
                result += configItem.template(element[configItem['id']]);
            } else
                result += `<div class="sortable-table__cell">${element[configItem['id']]}</div>`;

        });
        return result;
    }

    async render() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getTable();
        this.element = wrapper.firstElementChild;
        this.data = await this.loadData();
        this.subElements = this.getSubElements(this.element);
        this.placeArrow(this.sorted.id);
        this.renderRows();
        this.initEventListeners();
    }

    initEventListeners() {
        document.addEventListener('scroll', this.onWindowScroll);
        this.subElements.header.addEventListener('pointerdown', this.onSortClick);
    }

    getSubElements(element) {
        const result = {};
        const elements = element.querySelectorAll('[data-element]');
        elements.forEach(subElement => {
            const name = subElement.dataset.element;
            result[name] = subElement;
        });
        return result;
    }

    renderRows() {
        this.subElements.body.innerHTML = this.getTableRows(this.data);
    }

    async loadData(start = this.start, end = this.end) {
        this.url.searchParams.set('_sort', this.sorted.id);
        this.url.searchParams.set('_order', this.sorted.order);
        this.url.searchParams.set('_start', start);
        this.url.searchParams.set('_end', end);

        let json;
        const response = await fetch(this.url);
        if (response.ok) {
            json = await response.json();
            return json;
        }
        else {
            return null;
        }

    }

    sortRows(id = this.sorted.id, order = this.sorted.order) {
        if (this.isSortLocally) {
            this.sortLocally(id, order);
        }
        else {
            this.sortOnServer();
        }
    }

    sortLocally(field, order) {
        const sortedData = this.sortData(field, order);
        this.subElements.body.innerHTML = this.getTableRows(sortedData);
    }

    async sortOnServer() {
        const sortedData = await this.loadData(1);
        this.subElements.body.innerHTML = this.getTableRows(sortedData);
    }

    // helper to sort data locally
    sortData(field, order) {
        const directions = {
            'asc': 1,
            'desc': -1,
        };
        const direction = directions[order];
        const column = this.headerConfig.find(item => item.id === field);

        const { sortType } = column;
        const arr = [...this.data];
        arr.sort((a, b) => {
            switch (sortType) {
            case 'string':
                return direction * a[field].localeCompare(b[field]);
            case 'number':
                return direction * (a[field] - b[field]);
            }
        });
        return arr;
    }

    destroy() {
        if (this.element) {
            this.element.remove();
        }
        this.element = null;
        this.subElements = null;
    }
}

// const data = [
// 	{
// 		'id': 'soska-(pustyshka)-nuk-10729357',
// 		'title': 'Соска (пустышка) NUK 10729357',
// 		'price': 3,
// 		'sales': 14
// 	},
// 	{
// 		'id': 'tv-tyuner-d-color--dc1301hd',
// 		'title': 'ТВ тюнер D-COLOR  DC1301HD',
// 		'price': 15,
// 		'sales': 13
// 	},
// 	{
// 		'id': 'detskiy-velosiped-lexus-trike-racer-trike',
// 		'title': 'Детский велосипед Lexus Trike Racer Trike',
// 		'price': 53,
// 		'sales': 11
// 	},
// 	{
// 		'id': 'soska-(pustyshka)-philips-scf182/12',
// 		'title': 'Соска (пустышка) Philips SCF182/12',
// 		'price': 9,
// 		'sales': 11
// 	},
// 	{
// 		'id': 'powerbank-akkumulyator-hiper-sp20000',
// 		'title': 'Powerbank аккумулятор Hiper SP20000',
// 		'price': 30,
// 		'sales': 11
// 	},
// ];

// const headerConfig = [
// 	{
// 		id: 'title',
// 		title: 'Name',
// 		sortable: true,
// 		sortType: 'string'
// 	},
// 	{
// 		id: 'price',
// 		title: 'Price',
// 		sortable: true,
// 		sortType: 'number'
// 	},
// 	{
// 		id: 'sales',
// 		title: 'Sales',
// 		sortable: true,
// 		sortType: 'number'
// 	},
// ];

// const sortableTable = new SortableTable(headerConfig, data);

// document.body.append(sortableTable.element);