import ITEMS from './items.js';


function updateTimer(time) {
    document.getElementById('timer').innerHTML = time
}


function getImage(url, keyword) {
    fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch the GIF');
      }
      return response.json(); // Parse the JSON response
    })
    .then((data) => {
      // Get the URL of the random GIF
      const gifUrl = data.data.images.original.url;
      console.log(`Random GIF URL: ${gifUrl}`);

      const imgElement = document.getElementById('random-gif');
      imgElement.src = gifUrl; // Set new source
      imgElement.alt = keyword; // Update the alt attribute based on the keyword
        imgElement.style.maxWidth = '100%';
    })
    .catch((error) => {
      console.error('Error fetching GIF:', error);
    });
}


function getGiphyUrl(keyword) {
    const YOUR_API_KEY = 'G4NnYrdSDoN5P03vwNyEinIn9AqUtOqE';

    return `https://api.giphy.com/v1/gifs/random?api_key=${YOUR_API_KEY}&tag=${keyword};`
}


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
        this.direction = 1; // 0 = w, 1 = n, 2 = e, 3 = s
        this.location = new Location()
    }

    spawn() {
        this.location.X = Math.random() * 1000;
        this.location.Y = Math.random() * 1000;
    }

    step() {
        if (this.direction === 0) {
            this.location.x -= 1;
        } else if (this.direction === 1) {
            this.location.y += 1;
        } else if (this.direction === 2) {
            this.location.x += 1;
        } else if (this.direction === 3) {
            this.location.y -= 1;
        }

        this.updatePosition()
    }

    updatePosition() {
        this.activeContext = this.grid[this.location.x][this.location.y]
        console.log({context: this.activeContext})
    }
}


const TIMERS = {}

class Timer {
    constructor(time) {
        this.total = time;
        this.remaining = time;
        this.elapsed = 0;
        this.handlers = {};
        this.timers = {};
        this.id = Math.random();
        this.baseInterval = 1000;

        // this.timers[this.discover.location.getId()] = setTimeout(callback, time)
    }

    start() {
        alert('timer started')
        const onInterval = this.handlers.onInterval.bind(this)
        const onEnd = this.handlers.onEnd.bind(this)

        this.register()

        this.timers.interval = setInterval(() => {
            this.elapsed += this.baseInterval
            this.remaining = this.total - this.elapsed
            onInterval(this.remaining, this)
        }, this.baseInterval)


        this.timers.end = setTimeout(() => {
            clearInterval(this.timers.interval)
            this.deregister()
            onEnd(this)
        }, this.total)
    }

    register() {
        TIMERS[this.id] = this;
    }

    deregister() {
        delete TIMERS[this.id];
    }

    onInterval(callback) {
        this.handlers.onInterval = callback;
        return this;
    }

    onEnd(callback) {
        this.handlers.onEnd = callback;
        return this;
    }
}


class ActionManager {
    constructor({stats, discover}) {
        this.stats = stats;
        this.discover = discover;
        this.timers = {}
        this.actions = [
            ['wander', this.wander.bind(this)],
            ['look', this.look.bind(this)],
            ['forage', this.forage.bind(this)],
        ]
    }

    getActionsMenu() {
        const actions = this.actions.map((val, index) => {
            const [keyName, keyAction] = val;
            return [index+1,  keyName]
        })

        return actions;
    }

    getActions() {
        const actions = {}

        this.actions.forEach((val, index) => {
            const [keyName, keyAction] = val;
            actions[index+1] = keyAction
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
        const tag = this.discover.activeContext.name
        const type = this.discover.activeContext.type
        const url = getGiphyUrl(tag)

        // getImage(url, tag);

        alert(`you can see ${type} here.`)
    }

    createTimer(time, callback) {
        const timer = new Timer(time)

        timer.onInterval(updateTimer)
        timer.onEnd(callback)
        timer.start()
    }

    forage() {
        const timeToForage = 10000;
        console.log('forage action', timeToForage)
        this.createTimer(timeToForage, ()=> {
            console.log('timer done')
            const tag = this.discover.activeContext.name
            const url = getGiphyUrl(tag)
            getImage(url, tag);
            alert(`you found ${tag}.`)
        })
    }
}

class Location {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    getId() {
        return `${this.y}-${this.x}`
    }
}

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
        this.discover.spawn()
        this.updateMenu()
        this.renderMenu()
        this.focusInput()
        this.waitForInput()
    }

    focusInput() {
        document.getElementById('input').focus()
    }

    processInput(input) {
        console.log('processInput', input)
        if (input) {
            this.actionManager.handle(input)
        }
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
    }

    renderMenu() {
        // render menu into div#menu
        console.log('render', this.state.menu)
        document.getElementById('menu').innerHTML = this.state.menu.map(item => `<li data-id="${item[0]}">${item[1]}</li>`).join('');
    }
}

// Example usage
const app = new App();

if (typeof window !== 'undefined') {
    window.app = app;
}

app.start();