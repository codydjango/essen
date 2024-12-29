import ITEMS from "./items.js"
import {categoryPlural} from "./items.js"
import {Location} from "./Location.js"
import Bus from "./Bus.js"
import UIManager from "./UIManager.js";

class Item {
    constructor(data) {
        Object.assign(this, data);
    }

    static loadCollection() {
        return ITEMS.map(item => new Item(item))
    }

    getPluralName() {
        const {category} = this;
        return categoryPlural[category]
    }

    getRandomQuality() {
        const {qualities} = this;
        return qualities[Math.floor(Math.random() * qualities.length)];
    }
}

const items = Item.loadCollection()

function randomItem() {
    return items[Math.floor(Math.random() * items.length)]
}


function createGrid() {
    // Create a 2D array 1000x1000 filled with random items
    return Array.from({length: 1000}, () =>
        Array.from({length: 1000}, () => {
           return randomItem()
        }));
}

export class Discover {
    constructor() {
        this.terrain = 'forest';
        this.grid = createGrid();
        this.direction = 1; // 0 = w, 1 = n, 2 = e, 3 = s
        this.location = new Location()
        this.spawn()
    }

    spawn() {
        this.location.X = Math.random() * 1000
        this.location.Y = Math.random() * 1000
        this.updatePosition()

        UIManager.readout(`you are in a ${this.terrain}.`)
    }

    step() {
        if (this.direction === 0) {
            this.location.x -= 1;
        } else if (this.direction === 1) {
            this.location.y += 1;
        } else if (this.direction === 2) {
            this.location.x += 1;
        } else if (this.direction === 3) {
            this.location.y -= 1;
        }

        this.updatePosition()
    }

    updatePosition() {
        this.activeContext = this.grid[this.location.x][this.location.y]
        Bus.emit('contextUpdated', this.activeContext)
    }
}