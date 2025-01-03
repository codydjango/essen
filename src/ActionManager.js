import Timer from "./Timer.js";
import TimerUI from "./TimerUI.js";
import {getImage} from "./Image.js";
import UIManager from "./UIManager.js";
import StatsManager from "./StatsManager.js";
import Bus from "./Bus.js";

window.UIManager = UIManager;


function createTimer(action, time, callback) {
    const timer = new Timer(time)
    const timerUI = new TimerUI(action, timer)

    timer.on('interval', timerUI.update.bind(timerUI))
    timer.on('end', timerUI.hide.bind(timerUI))
    timer.on('end', callback)

    timerUI.update(timerUI.timer.total)

    timer.start()
}


export default class ActionManager {
    constructor({discover}) {
        this.discover = discover
        this._actions = {}

        this._actions.basic = [
            ['wander', this.wander.bind(this)],
            ['look', this.look.bind(this)],
            ['forage', this.forage.bind(this)],
        ]

        this._actions.edible = [
            ['eat', this.eat.bind(this)],
            ['bag', this.bag.bind(this)],
            ['discard', this.discard.bind(this)],
        ]

        this._actionContexts = []
        this.pushActionContext('basic')
    }

    getActionContext() {
        return this._actionContexts[this._actionContexts.length - 1]
    }

    pushActionContext(context) {
        this._actionContexts.push(this._actions[context])
        Bus.emit('actionsUpdated', this.getActionsMenu())
    }

    popActionContext() {
        this._actionContexts.pop()
        Bus.emit('actionsUpdated', this.getActionsMenu())
    }

    getActionsMenu() {
        return this.getActionContext().map((val, index) => {
            const [keyName, keyAction] = val;
            return [index + 1, keyName]
        })
    }

    getActions() {
        const actions = {}

        this.getActionContext().forEach((val, index) => {
            const [keyName, keyAction] = val;
            actions[index + 1] = keyAction
        })

        return actions;
    }

    handle(input) {
        const actions = this.getActions()
        const command = actions[input]

        if (command) {
            command()
        } else {
            alert(`invalid command: ${input}`)
        }
    }

    wander() {
        const site = this.discover.step();
        UIManager.readout(`wandered further into the ${site.terrain}.`)
    }

    look() {
        this.discover.site.look();

        if (this.discover.site.getLoot()) {
            const categoryPlural = this.discover.site.getLoot().getPluralName()
            UIManager.readout(`you see ${categoryPlural}.`)
        } else {
            UIManager.readout(`you don't see anything... at all.`)
        }
    }

    forage() {
        const timeToForage = 3000;

        const loot = this.discover.site.getLoot()

        if (!loot) return UIManager.readout(`nothing to forage!`)

        UIManager.hideActions();
        UIManager.hideInput();

        createTimer(`foraging for ${loot.getPluralName()}`, timeToForage, () => {
            this.discover.foraged = this.discover.site.popLoot();
            const tag = this.discover.foraged.name
            const searchName = this.discover.foraged.getSearchName()

            getImage(searchName, (image) => {
                if (!image) {} else {
                    UIManager.displayImage(image)
                }
            });

            this.pushActionContext('edible')

            UIManager.readout(`you foraged ${tag}!`)
            UIManager.showActions()
            UIManager.showInput()
        })
    }

    eat() {
        this.popActionContext();

        const loot   = this.discover.foraged
        const {name, category} = loot;
        const quality = loot.getRandomQuality()

        StatsManager.consume(loot)
        UIManager.readout(`you ate the ${quality} ${name} ${category}.`)
        this.discover.foraged = null;
    }

    bag() {
        this.popActionContext()
        const loot   = this.discover.foraged

        StatsManager.addToBag(loot);
        UIManager.readout(`you put the ${loot.getRandomQuality()} ${loot.name} in your bag.`)
        this.discover.foraged = null;
    }

    discard() {
        this.popActionContext()
        const loot   = this.discover.foraged

        UIManager.readout(`you threw away the ${loot.getRandomQuality()} ${loot.name}.`)
        this.discover.foraged = null;
    }
}