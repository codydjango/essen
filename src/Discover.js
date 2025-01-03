import {Location} from "./Location.js"
import Bus from "./Bus.js"
import UIManager from "./UIManager.js";
import StatsManager from "./StatsManager.js";
import Site from "./Site.js";


function createGrid() {
    // Create a 2D array 1000x1000 filled with random items
    return Array.from({length: 1000}, () =>
        Array.from({length: 1000}, () => {
           return new Site()
        }));
}

export class Discover {
    constructor() {
        this.grid = createGrid();
        this.direction = 1; // 0 = w, 1 = n, 2 = e, 3 = s
        this.location = new Location()
        this.spawn()
    }

    spawn() {
        this.location.X = Math.random() * 1000
        this.location.Y = Math.random() * 1000
        this.updatePosition()

        UIManager.readout(`you are in a ${this.site.terrain}.`)
    }

    step() {
        if (this.direction === 0) {
            this.location.x -= 1
        } else if (this.direction === 1) {
            this.location.y += 1
        } else if (this.direction === 2) {
            this.location.x += 1
        } else if (this.direction === 3) {
            this.location.y -= 1
        }

        StatsManager.addStep()
        this.updatePosition()
        return this.site
    }

    updatePosition() {
        this.site = this.grid[this.location.x][this.location.y]

        Bus.emit('siteUpdated', this.site)
    }
}