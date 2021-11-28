export default class NotificationMessage {
    static activeNotification;

    element;
    timerId;

    constructor(text, {
        duration = 2000,
        type = 'success',
    } = {}) {
        this.text = text;
        this.duration = duration;
        this.durationInSeconds = (this.duration / 1000) + 's';
        this.type = type;

        this.render();
    }

    get template() {
        return `
        <div class="notification ${this.type}" style="--value:${this.durationInSeconds}">
            <div class="timer"></div>
            <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">${this.text}</div>
            </div>
        </div>
        `;
    }

    render() {
        const element = document.createElement('div');
        element.innerHTML = this.template;
        this.element = element.firstElementChild;
    }

    show(parentElement = document.body) {
        if (NotificationMessage.activeNotification) {
            NotificationMessage.activeNotification.remove();
        }
        parentElement.append(this.element);

        setTimeout(() => {
            this.remove();

        }, this.duration);

        NotificationMessage.activeNotification = this;
    }

    remove() {

        if (this.element) {
            this.element.remove();
        }

        this.element = null;
    }

    destroy() {
        this.remove();
        NotificationMessage.activeNotification = null;

    }

    createDOMSructure() {
        const element = document.createElement('div');
        element.classList.add('notification');
        if (this.type) element.classList.add(this.type);
        element.style = '--value:20s';
        element.innerHTML = `
        <div class="timer"></div>
        <div class="inner-wrapper"></div>
        `;


        const innerWrapper = element.querySelector('.inner-wrapper');

        const timer = element.querySelector('.timer');
        NotificationMessage.timerElement = timer;

        const header = document.createElement('div');
        header.classList.add('notification-header');
        header.innerText = this.type;
        NotificationMessage.headerElement = header;

        const body = document.createElement('div');
        body.classList.add('notification-body');
        body.innerText = this.text;
        NotificationMessage.bodyElement = body;

        innerWrapper.appendChild(header);
        innerWrapper.appendChild(body);




        return element;
    }
}

// const duration = 3000;
// const notificationMessage = new NotificationMessage('message', {
//     duration
// });
// document.body.append(notificationMessage.element);
// notificationMessage.destroy();