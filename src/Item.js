import ITEMS, {categoryPlural} from "./items.js";

export class Item {
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