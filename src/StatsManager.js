import Bus from "./Bus.js";

class StatsManager {
    constructor() {
        this.steps = 0;
        this.health = 0;
        this.hunger = 0;
        this.toxins = 0;
        this.bag = [];
    }

    addToBag(item) {
        this.bag.push(item)
        Bus.emit('item-added-to-bag')
    }
}

export default new StatsManager()