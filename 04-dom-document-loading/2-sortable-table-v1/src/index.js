export default class SortableTable {
    element;
    subElements;

    constructor(headerConfig = [], data = []) {
        this.headerConfig = headerConfig;
        this.data = data;
        this.render();
    }

    getTable() {
        return `
        ${this.getTableHeader()}
        ${this.getTableBody()}
        `;
    }

    getTableHeader() {
        let result = `
        <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">

        `;
        result += this.headerConfig.map(element => {
            let spanSortableAdditional = '';
            if (element.sortable) {
                spanSortableAdditional += `
                <span class="sortable-table__sort-arrow">
                    <span class="sort-arrow"></span>
                </span>`;
            }

            return `
            <div class="sortable-table__cell" data-name="${element.id}" data-sortable="${element.sortable}">
                <span>${element.title}</span>${spanSortableAdditional}
            </div>`;
        }).join('');
        result += `</div>`;
        return result;
    }

    getTableBody() {
        const div = document.createElement('div');
        div.classList.add('sortable-table__body');
        div.dataset.element = 'body';
        div.innerHTML = this.getTableRows(this.data);
        return div.outerHTML;
    }

    getTableRows(data) {
        let elementInnerHtml = '';

        const elem = document.createElement('div');
        data.map(element => {
            elementInnerHtml += `
            <a href = "products/${element.id}" class="sortable-table__row">
                ${this.getTableRow(element)}
            </a>`;

        });
        elem.innerHTML = elementInnerHtml;
        return elem.innerHTML;
    }

    getTableRow(element) {
        let result = '';
        this.headerConfig.map(configItem => {
            result += `<div class="sortable-table__cell">${element[configItem['id']]}</div>`;
        });
        return result;
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getTable();
        this.element = wrapper.firstElementChild;
        this.subElements = this.getSubElements(this.element);
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


    sort(field, order) {
        const sortedData = this.sortData(field, order);
        this.subElements.body.innerHTML = this.getTableRows(sortedData);
    }

    sortData(field, order) {
        const directions = {
            'asc': 1,
            'desc': -1,
        }
        const direction = directions[order];
        const column = this.headerConfig.find(item => item.id === field);
        const { sortType } = column;
        const arr = [...this.data];
        arr.sort((a,b) => {
            switch (sortType) {
                case 'string': 
                    return direction * a[field].localeCompare(b[field]);
                    break;
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