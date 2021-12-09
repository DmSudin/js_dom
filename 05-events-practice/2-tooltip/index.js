class Tooltip {
    static instance = null;
    element;

    constructor() {
        if (Tooltip.instance) {
            return Tooltip.instance;
        }
        Tooltip.instance = this;
    }

    initialize() {
        this.initEventListeners();
    }

    render(tooltipText) {
        const block = document.createElement('div');
        block.classList.add('tooltip');
        block.innerHTML = tooltipText;
        document.body.appendChild(block);
        this.element = block;
    }

    initEventListeners() {
        document.addEventListener('pointerover', event => this.onPointerOver(event));
        document.addEventListener('pointerout', event => this.onPointerOut(event));
    }

    onPointerOver(event) {
        event.target.addEventListener('pointermove', this.onPointerMove);

        if (event.target.dataset.tooltip) {
            this.render(event.target.dataset.tooltip);
        }
    }

    onPointerOut(event) {
        if (event.target.dataset.tooltip) {
            if (this.element) {
                this.element.remove();
            }
        }
        document.removeEventListener('pointermove', this.onPointerMove);
    }

    onPointerMove = event => this.moveTooltip(event);

    moveTooltip(event) {

        const shift = 10;
        const left = `${shift + event.clientX}px`;
        const top = `${shift + event.clientY}px`;

        if (this.element) {
            this.element.style.left = left;
            this.element.style.top = top;
        }
    }

    destroy() {
        document.removeEventListener('pointerover', this.onPointerOver);
        document.removeEventListener('pointerout', this.onPointerOut);
        if (this.element) {
            this.element.remove();
        }
        this.element = null;
    }

}

export default Tooltip;
