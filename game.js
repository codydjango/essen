class App {
    // constructor
    constructor() {
        this.state = {
            menu: []
        }
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

    waitForInput() {
        

        //document.getElementById('input').addEventListener('change', )
    }

    renderMenu() {
        // render menu into div#menu
        document.getElementById('menu').innerHTML = this.state.menu.map(item => `<li data-id="${item[0]}">${item[1]}</li>`).join('');
    }
}

// Example usage
const app = new App();
app.start();