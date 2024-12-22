import ITEMS from './items.js';

function createGrid() {
    // Create a 2D array 1000x1000 filled with random items
    const grid = Array.from({ length: 1000 }, () =>
        Array.from({ length: 1000 }, () => ITEMS[Math.floor(Math.random() * ITEMS.length)]));

    // Log a portion of the grid to verify
    console.log(grid.slice(0, 10)); // Show the first 10 rows (for testing)
    return grid;
}


class Stats {
    constructor() {
        this.steps = 0;
    }
}

class Discover {
    constructor() {
        this.terrain = 'forest';
        this.grid = createGrid();
    }
}

class ActionManager {
    constructor(stats, discover) {
        this.stats = stats;
        this.discover = discover;
    }

    handle(input) {

        const dct = {
            1: 'wander',
            2: 'look',
            3: 'smell'
        }

        const cmd = dct[input]

        switch (cmd) {
            case 'wander':
                this.wander();
                break;
            case 'look':
                this.look();
                break;
            case 'smell':
                this.smell();
                break;
        }
    }

    wander() {
        this.stats.steps += 1;
        alert(`wandered into the ${this.discover.terrain}`)
    }

    look() {

    }

    smell() {
    }
}

class App {
    // constructor
    constructor() {

        this.state = {
            menu: []
        }
        this.stats = new Stats()
        this.discover = new Discover()
        this.actions = new ActionManager(this.stats, this.discover)
    }

    updateMenu() {
        this.state.menu = [
            [1, 'wander'],
            [2, 'look'],
            [3, 'smell']]
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
        this.actions.handle(input)
    }



    waitForInput() {



        const onInput = (event) => {
            const userInput = event.target.value;
            console.log('User entered:', userInput);
            // Add your logic here to handle the user's input
            event.target.value = ''; // Clear input after processing
            this.processInput(userInput);
        }

        document.getElementById('input').addEventListener('keyup', onInput);


        //document.getElementById('input').addEventListener('change', )
    }

    renderMenu() {
        // render menu into div#menu
        document.getElementById('menu').innerHTML = this.state.menu.map(item => `<li data-id="${item[0]}">${item[1]}</li>`).join('');
    }
}

// Example usage
const app = new App();

if (typeof window !== 'undefined') {
    window.app = app;
}

app.start();