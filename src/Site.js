import {Item} from "./Item.js";

const items = Item.loadCollection()


function randomItem () {
    return items[Math.floor(Math.random() * items.length)]
}

function generateNumberOfItems() {
    /**
     * Generate the number of items based on the described distribution.
     *
     * 50th percentile: ~3 items
     * 90th percentile: ~10 items
     * Below 40th percentile: ~1 item
     */
    const percentile = Math.random(); // Generate a random percentile between 0 and 1

    if (percentile < 0.4) {
        return 1;
    } else if (percentile < 0.9) {
        // Linearly interpolate between 1 and 10
        return Math.round(1 + (percentile - 0.4) * (9 / 0.5));
    } else {
        return 10;
    }
}

function seedSiteLoot() {
    const items = []
    const numberOfItems = generateNumberOfItems()

    for (let i = 0; i < numberOfItems; i++) {
        items.push(randomItem())
    }

    return items
}

export default class Site {
    constructor() {
        this.loot = seedSiteLoot();
        this.terrain = 'forest';
        this.lootIndex = 0;
    }

    getLoot() {
        if (this.lootIndex >= this.loot.length) return null;
        return this.loot[this.lootIndex]
    }

    popLoot() {
        if (this.lootIndex >= this.loot.length) return null;
        const loot = this.loot.splice(this.lootIndex, 1)[0]
        this.lootIndex = Math.floor(Math.random() * this.loot.length)
        return loot;
    }

    look() {
        this.lootIndex = Math.floor(Math.random() * this.loot.length)
    }
}
