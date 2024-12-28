class UIManager {
    constructor() {
        this.imageContainer = document.getElementById('images');
        this.timers = document.getElementById('timers');
    }

    showImages() {
        this.imageContainer.style.display = 'block';
    }

    hideImages() {
        this.imageContainer.style.display = 'none';
    }

    displayImage(imageUrl) {
        this.imageContainer.innerHTML = '';

        const imgElement = document.createElement('img');

        imgElement.src = imageUrl;
        imgElement.style.maxWidth = '100%';

        this.imageContainer.appendChild(imgElement);

        this.showImages();
    }
}

export default new UIManager();