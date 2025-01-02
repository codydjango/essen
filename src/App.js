import {Discover} from "./Discover.js";
import ActionManager from "./ActionManager.js";

export class App {
    constructor() {
        this.discover = new Discover()

        this.actionManager = new ActionManager({
            discover: this.discover
        })
    }

    start() {
        this.updateMenu()
        this.waitForInput()
    }

    processInput(input) {
        if (input) {
            this.actionManager.handle(input)
        }
    }

    waitForInput() {
        const onInput = (event) => {
            const userInput = event.target.value;
            // Add your logic here to handle the user's input
            event.target.value = ''; // Clear input after processing
            this.processInput(userInput);
        }

        document.getElementById('input').addEventListener('keyup', onInput);
    }

    updateMenu() {
        UIManager.updateActions(this.actionManager.getActionsMenu());
        UIManager.showActions();
    }
}