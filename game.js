import ITEMS from './items.js';


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

class ActionManager {
    constructor({stats, discover}) {
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
        this.discover.step();
        alert(`wandered into the ${this.discover.terrain}`)
    }

    look() {
        const tag = this.discover.activeContext.name
        const url = getGiphyUrl(tag)

        getImage(url, tag);

        alert(`found ${tag}`)
    }

    smell() {
    }
}

class Location {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}

class App {
    constructor() {

        this.state = {
            menu: []
        }

        this.stats = new Stats()
        this.discover = new Discover()

        this.actions = new ActionManager({
            stats: this.stats,
            discover: this.discover
        })
    }

    updateMenu() {
        this.state.menu = [
            [1, 'wander'],
            [2, 'look'],
            [3, 'smell']]
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