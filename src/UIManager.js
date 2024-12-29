import Bus from './Bus.js';

class UIManager {
    constructor() {
        this.ui = {}
        this.ui.imageContainer = document.getElementById('images')
        this.ui.timers = document.getElementById('timers')
        this.ui.input = document.getElementById('input')
        this.ui.actions = document.getElementById('menu')
        this.ui.readout = document.getElementById('readout')

        Bus.on('actionsUpdated', this.updateActions.bind(this))
        Bus.on('readout', this.updateReadout.bind(this))

    }

    clearImages() {
        this.ui.imageContainer.innerHTML = '';
    }

    readout(message) {
        console.log({message})
        Bus.emit('readout', message)
    }

    showImages() {
        this.ui.imageContainer.style.display = 'block'
    }

    hideImages() {
        this.ui.imageContainer.style.display = 'none'
    }

    displayImage(imageUrl) {
        this.ui.imageContainer.innerHTML = ''

        const imgElement = document.createElement('img')

        imgElement.src = imageUrl
        imgElement.style.maxWidth = '100%'

        this.ui.imageContainer.appendChild(imgElement)

        this.showImages()
    }

    hideActions() {
        this.ui.actions.style.display = 'none'
    }

    updateActions(menu) {
        this.ui.actions.innerHTML = menu.map(item => `<li data-id="${item[0]}">${item[1]}</li>`).join('')
        this.clearImages()
    }

    updateReadout(message) {
        const el = document.createElement('li')
        el.innerText = message
        this.ui.readout.appendChild(el)
    }

    showActions() {
        this.ui.actions.style.display = 'block'
        this.focusInput()
    }

    hideInput() {
        this.ui.input.style.display = 'none'
    }

    showInput() {
        this.ui.input.style.display = 'block'
        this.focusInput()
    }

    focusInput() {
        this.ui.input.focus()
    }
}

export default new UIManager()