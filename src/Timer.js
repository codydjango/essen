import Emitter from "./Emitter.js";

export default class Timer extends Emitter {
    constructor(time) {
        super();
        this.total = time;
        this.remaining = time;
        this.elapsed = 0;
        this.timers = {};
        this.id = Math.random();
        this.baseInterval = 1000;
    }

    start() {
        this.emit('start', this.remaining)

        this.timers.interval = setInterval(() => {
            this.elapsed += this.baseInterval
            this.remaining = this.total - this.elapsed
            this.emit('interval', this.remaining)
        }, this.baseInterval)

        this.timers.end = setTimeout(() => {
            clearInterval(this.timers.interval)
            this.emit('end')
        }, this.total)
    }
}
