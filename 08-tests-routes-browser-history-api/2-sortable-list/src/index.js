export default class SortableList {
    element;

    onPointerDown(event) {
        const elem = event.target.closest('span[data-grab-handle]');
        if (elem) {
            console.error('elem', elem);
            const li = elem.closest('li.sortable-list__item');
            console.error('li', li);
            const placeholder = li.cloneNode();
            document.body.append(placeholder);
            //todo continue
        }
        

    }

    constructor(elementList) {
        this.elementList = elementList.items;
        this.element = this.render();
        
    }

    render() {
        const ul = document.createElement('ul');        
        ul.classList.add('sortable-list');
        ul.innerHTML = this.template();
        this.element = ul;
        this.initEventListeners();
        return this.element;
    }

    template () {
        debugger
        let result = '';
        this.elementList.map(item => {
            item.classList.add('sortable-list__item')
        });
        this.elementList.forEach(element => {
            result += element.outerHTML;    
        });
        return result;
    }

    initEventListeners() {
        this.element.addEventListener('pointerdown', event => {
            this.onPointerDown(event);
        });
    }

}
