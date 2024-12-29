import Timer from "./Timer.js";
import TimerUI from "./TimerUI.js";
import {getImage} from "./Image.js";
import UIManager from "./UIManager.js";
import Bus from "./Bus.js";

window.UIManager = UIManager;

export default class ActionManager {
    constructor({stats, discover}) {
        this.stats = stats;
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
        alert(`wandered into the ${this.discover.terrain}`)
    }

    look() {
        const type = this.discover.activeContext.type

        alert(`you can see ${type} here.`)
    }

    createTimer(action, time, callback) {
        const timer = new Timer(time)
        const timerUI = new TimerUI(action, timer)

        timer.on('interval', timerUI.update.bind(timerUI))
        timer.on('end', timerUI.hide.bind(timerUI))
        timer.on('end', callback)

        timerUI.update(timerUI.timer.total)

        timer.start()
    }

    forage() {
        const timeToForage = 3000;

        UIManager.hideActions();
        UIManager.hideInput();

        this.createTimer('foraging', timeToForage, () => {
            const tag = this.discover.activeContext.name


            alert(`you found ${tag}.`)

            getImage(tag, (image) => {
                UIManager.displayImage(image)
            });

            this.pushActionContext('edible')

            UIManager.showActions()
            UIManager.showInput()
        })
    }

    eat() {
        console.log('eat')
        this.popActionContext();
    }

    bag() {
        console.log('bag')
        this.popActionContext()
    }

    discard() {
        console.log('discard')
        this.popActionContext()
    }

}