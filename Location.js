export class Location {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    getId() {
        return `${this.y}-${this.x}`
    }
}