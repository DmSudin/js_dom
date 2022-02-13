export default class SortableList {
    element;

    onPointerDown(event) {
        const elem = event.target.closest('span[data-grab-handle]') || event.target.closest('span[data-delete-handle]');
        if (elem && elem.hasAttribute('data-grab-handle')) {
            this.li = elem.closest('li.sortable-list__item');

            //diff between clicked place and top left corner of the element
            this.shiftX = event.clientX - this.li.getBoundingClientRect().left;
            this.shiftY = event.clientY - this.li.getBoundingClientRect().top;
            
            const placeholderWidth = this.li.offsetWidth + 'px';
            const placeholderHeight = this.li.offsetHeight + 'px';
            debugger
            this.prevElem = this.li.previousElementSibling;
            this.nextElem = this.li.nextElementSibling;
            this.placeholder = document.createElement('li');
            this.placeholder.classList.add('sortable-list__placeholder');
            this.placeholder.style.width = placeholderWidth;
            this.placeholder.style.height = placeholderHeight;

            if (this.prevElem) {
                this.element.insertBefore(this.placeholder, this.prevElem.nextSibling);
            } else {
                this.element.prepend(this.placeholder);
            }

            this.li.style.position = 'absolute';
            this.li.style.zIndex = 10000;
            this.li.style.width = placeholderWidth;
            this.li.style.height = placeholderHeight;
            this.li.classList.add('sortable-list__item_dragging');
            this.element.appendChild(this.li);

            this.li.style.top = event.clientY - this.shiftY + 'px';
            this.li.style.left = event.clientX - this.shiftX + 'px';

            document.addEventListener('pointermove', this.onPointerMove);
            document.addEventListener('pointerup', this.OnPointerUp);
        } else if (elem && elem.hasAttribute('data-delete-handle')) {
            const li = elem.closest('li.sortable-list__item');
            li.remove();
        }
    }

    onPointerMove = ({clientX, clientY}) => {
        this.li.style.left = clientX - this.shiftX + 'px';
        this.li.style.top = clientY - this.shiftY + 'px';        
        
        const {top, bottom} = this.li.getBoundingClientRect();
        
        //todo some bug while moving

        // drag up
        if (this.prevElem && top <= this.getElementMiddleY(this.prevElem)) {
            this.checkBorders();
            if (this.prevElem) {
                this.prevElem.before(this.placeholder);
                this.prevElem = this.placeholder.previousElementSibling;    
                // 
            }

            if (this.nextElem) {
                this.nextElem = this.placeholder.nextElementSibling;                
            }

            if (this.prevElem) this.prevElem.style.border = '2px dashed red';
            if (this.nextElem) this.nextElem.style.border = '2px dashed green';
            
        // drag down
        } else if (this.nextElem && bottom >= this.getElementMiddleY(this.nextElem)) {
            this.checkBorders();

            if (this.nextElem) {
                this.nextElem.after(this.placeholder);
                this.nextElem = this.placeholder.nextElementSibling;
            }
            
            this.prevElem = this.placeholder.previousElementSibling;
            
            if (this.prevElem) this.prevElem.style.border = '2px dashed red';
            if (this.nextElem) this.nextElem.style.border = '2px dashed green';
        }

        this.placeholder.style.border = '1px solid yellow';
    }

    OnPointerUp = () => {
        this.element.removeEventListener('pointerdown', event => {
            this.onPointerDown(event);
        });
        document.removeEventListener('pointermove', this.onPointerMove);

        this.li.style.position = null;
        this.li.style.zIndex = null;
        this.li.style.width = null;
        this.li.style.height = null;
        this.li.style.top = null;
        this.li.style.left = null;

        this.shiftX = undefined;
        this.shiftY = undefined;

        this.placeholder.replaceWith(this.li);
        this.li.classList.remove('sortable-list__item_dragging');

        if (this.prevElem) this.prevElem.style.border = null;
        if (this.nextElem) this.nextElem.style.border = null;
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

        let result = '';
        this.elementList.map(item => {
            item.classList.add('sortable-list__item');
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

    getIntersectedElement(x, y) {
        const borderStyle = '1px solid red';
        const supposedElem = document.elementFromPoint(x, y).closest('.sortable-list__item');
        if (supposedElem) {
            supposedElem.style.border = borderStyle;
        }
    }
    
    getElementMiddleY(element) {
        const {top, bottom} = element.getBoundingClientRect();
        // console.error('middle', bottom - Math.abs(bottom - top));
        return bottom - (Math.abs(bottom - top) / 2);
    }

    checkBorders() {
        Array.from(this.li.parentElement.childNodes)
        .forEach((elem) => {
            if ((elem !== this.prevElem) || (elem !== this.nextElem)) {
                elem.style.border = null;
            }
        });
    }
}
