import Bus from './Bus.js';

class UIManager {
    constructor() {
        this.imageContainer = document.getElementById('images')
        this.timers = document.getElementById('timers')
        this.input = document.getElementById('input')
        this.actions = document.getElementById('menu')

        Bus.on('actionsUpdated', this.updateActions.bind(this))
    }

    clearImages() {
        this.imageContainer.innerHTML = '';
    }

    showImages() {
        this.imageContainer.style.display = 'block'
    }

    hideImages() {
        this.imageContainer.style.display = 'none'
    }

    displayImage(imageUrl) {
        this.imageContainer.innerHTML = ''

        const imgElement = document.createElement('img')

        imgElement.src = imageUrl
        imgElement.style.maxWidth = '100%'

        this.imageContainer.appendChild(imgElement)

        this.showImages()
    }

    hideActions() {
        this.actions.style.display = 'none'
    }

    updateActions(menu) {
        document.getElementById('menu').innerHTML = menu.map(item => `<li data-id="${item[0]}">${item[1]}</li>`).join('')
        this.clearImages()
    }

    showActions() {
        this.actions.style.display = 'block'
        this.focusInput()
    }

    hideInput() {
        this.input.style.display = 'none'
    }

    showInput() {
        this.input.style.display = 'block'
        this.focusInput()
    }

    focusInput() {
        this.input.focus()
    }
}

export default new UIManager()