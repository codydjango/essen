export default class TimerUI {
    constructor(action, timer) {
        this.timer = timer;
        this.action = action;
        this.containerEl = document.getElementById('timers')
        this.el = document.createElement('div');
        this.containerEl.appendChild(this.el);

        this.containerEl.style.display = 'block';
    }

    update(time) {
        this.el.innerHTML = `${this.action}: ${time / 1000}`;
    }

    hide() {
        this.el.style.display = 'none';
    }

    show() {
        this.el.style.display = 'block';
    }
}