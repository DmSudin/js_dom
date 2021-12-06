export default class SortableTable {
    element;
    subElements;

    onSortClick = event => {

        const newColumn = event.target.closest('[data-sortable="true"]');


        const toggleOrder = order => {
            const orders = {
                asc: 'desc',
                desc: 'asc',
            };

            return orders[order];
        };


        if (newColumn) {
            newColumn.dataset.order = toggleOrder(newColumn.dataset.order);
            // if (newColumn.dataset.order) {
            //     newColumn.dataset.order = toggleOrder(newColumn.dataset.order);
            // } else {
            //     newColumn.dataset.order = 'asc';
            // }

            this.sorted.id = newColumn.dataset.id;
            this.sorted.order = newColumn.dataset.order;
            const sortedData = this.sortData(this.sorted.id, this.sorted.order);
            this.subElements.body.innerHTML = this.getTableRows(sortedData);

            if (!newColumn.querySelector('.sortable-table__sort-arrow')) {

                const prevElementWithArrow = this.subElements.header.querySelector('.sortable-table__sort-arrow').parentElement;
                // prevElementWithArrow.removeAttribute('data-order');
                const arrowElement = prevElementWithArrow.querySelector('.sortable-table__sort-arrow');
                prevElementWithArrow.removeChild(arrowElement);

                newColumn.appendChild(this.getArrowElement());
                // newColumn.dataset.order = 'asc';
            }
        }

    }

    constructor(headerConfig = [], {
        data = [],
        sorted = {
            id: headerConfig.find(item => item.sortable).id,
            order: 'asc'
        }
    } = {}) {
        this.headerConfig = headerConfig;
        this.data = Array.isArray(data) ? data : data.data;
        this.sorted = sorted;
        this.render();
    }

    render() {
        // sorted = {
        //     id: headerConfig.find(item => item.sortable).id,
        //     order: 'asc'
        // }
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getTable();
        this.element = wrapper.firstElementChild;
        this.subElements = this.getSubElements(this.element);
        this.initEventListeners();
    }

    initEventListeners() {
        this.subElements.header.addEventListener('pointerdown', this.onSortClick);
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

        result += this.headerConfig.map(configItem => {
            let arrowHTML = '';
            let orderHTML = '';

            if (this.sorted.id === configItem.id) {
                arrowHTML = `
                <span  data-element="arrow" class="sortable-table__sort-arrow">
                    <span class="sort-arrow"></span>
                </span>
                `;
            }
            orderHTML = ` data-order=${this.sorted.order}`;

            return `
            <div class="sortable-table__cell" data-id="${configItem.id}" data-sortable="${configItem.sortable}" ${orderHTML}>
                <span>${configItem.title}</span>${arrowHTML}
            </div>`;
        }).join('');
        result += `</div>`;
        return result;
    }

    getTableBody() {
        const div = document.createElement('div');
        div.classList.add('sortable-table__body');
        div.dataset.element = 'body';
        const sortedData = this.sortData(this.sorted.id, this.sorted.order);
        div.innerHTML = this.getTableRows(sortedData);
        return div.outerHTML;
    }

    getTableRows (data) {
        return data.map(element => {
            return `
            <a href = "products/${element.id}" class="sortable-table__row">${this.getTableRow(element)}</a>
            `;
        }).join('');
    }

    getTableRow(element) {
        let result = '';
        this.headerConfig.map(configItem => {
            let rowHTMLString = '';

            if (configItem.template) {
                rowHTMLString = configItem.template(element[configItem['id']]);
            } else rowHTMLString = element[configItem['id']];
            result += `<div class="sortable-table__cell">${rowHTMLString}</div>`;
        });
        return result;
    }

    getArrowElement() {
        const arrow = document.createElement('span');
        arrow.dataset.element = 'arrow';
        arrow.classList.add('sortable-table__sort-arrow');
        arrow.innerHTML = `<span class="sort-arrow"></span>`;
        return arrow;
    }

    removeArrowElement(element) {
        const arrow = element.querySelector('.sortable-table__sort-arrow');
        element.removeChild(arrow);
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
        };
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