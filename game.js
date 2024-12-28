import ActionManager from "./ActionManager.js";
import {Stats} from "./Stats.js";
import {Discover} from "./Discover.js";


class App {
    constructor() {
        this.state = {
            menu: []
        }

        this.stats = new Stats()
        this.discover = new Discover()

        this.actionManager = new ActionManager({
            stats: this.stats,
            discover: this.discover
        })
    }

    updateMenu() {
        this.state.menu = this.actionManager.getActionsMenu()
    }

    start() {
        console.log('Game started!')
        this.updateMenu()
        this.renderMenu()
        this.focusInput()
        this.waitForInput()
    }

    focusInput() {
        document.getElementById('input').focus()
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

    renderMenu() {
        // render menu into div#menu
        document.getElementById('menu').innerHTML = this.state.menu.map(item => `<li data-id="${item[0]}">${item[1]}</li>`).join('');
    }
}

const app = new App();

if (typeof window !== 'undefined') {
    window.app = app;
}

app.start();