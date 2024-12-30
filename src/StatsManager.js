import Bus from "./Bus.js";

class Stats {
    constructor() {
        this.vitality = 0;
        this.satiety = 0;
        this.toxins = 0;
        this.steps = 0;
    }
}

class StatsManager {
    constructor() {
        this.stats = new Stats();
        this.bag = [];
    }

    addToBag(item) {
        this.bag.push(item)
        Bus.emit('bag-updated', this.bag)
    }

    addStep() {
        this.stats.steps += 1;

        Bus.emit('stats-updated', this.stats)
    }

    consume(item) {
        const {vitality, satiety, toxins} = item

        if (vitality > 0) this.stats.vitality += vitality
        if (satiety > 0) this.stats.satiety += satiety
        if (toxins > 0) this.stats.toxins += toxins

        Bus.emit('stats-updated', this.stats)
    }
}

export default new StatsManager()