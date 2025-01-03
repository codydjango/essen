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

    getSearchName() {
        const {name, category} = this;
        if (name.toLowerCase().includes(category.toLowerCase())) return name

        if (category === 'berry') {
            return `${name} plant`
        } else {
            return `${name} ${category}`
        }
    }
}