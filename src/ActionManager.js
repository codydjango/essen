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
        this.discover.step();
        UIManager.readout(`wandered further into the ${this.discover.terrain}.`)
    }

    look() {
        const categoryPlural = this.discover.activeContext.getPluralName()
        UIManager.readout(`you see ${categoryPlural}.`)
    }

    forage() {
        const timeToForage = 3000;

        UIManager.hideActions();
        UIManager.hideInput();

        createTimer(`foraging for ${this.discover.activeContext.getPluralName()}`, timeToForage, () => {
            const tag = this.discover.activeContext.name

            getImage(tag, (image) => {
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

        const item = this.discover.activeContext
        const {name, category, health} = item;
        const quality = item.getRandomQuality()

        StatsManager.consume(item)
        UIManager.readout(`you ate the ${quality} ${name} ${category}.`)
    }

    bag() {
        this.popActionContext()
        const item = this.discover.activeContext

        StatsManager.addToBag(item);
        UIManager.readout(`you put the ${item.getRandomQuality()} ${item.name} in your backpack.`)
    }

    discard() {
        this.popActionContext()
        const item = this.discover.activeContext

        UIManager.readout(`you throw the ${item.getRandomQuality()} ${item.name} away.`)
    }
}