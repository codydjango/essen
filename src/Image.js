import PASSWORDS from "./passwords.js";

function getGiphyUrl(keyword) {
    const YOUR_API_KEY = PASSWORDS.giphy;

    return `https://api.giphy.com/v1/gifs/random?api_key=${YOUR_API_KEY}&tag=${keyword};`
}

export function getImage(keyword, callback) {
    const url = getGiphyUrl(keyword)

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                console.log('error response')
                throw new Error('Failed to fetch the GIF');
            }
            return response.json(); // Parse the JSON response
        })
        .then((data) => {
            console.log('image data', data);
            callback(data.data.images.original.url)
        })
        .catch((error) => {
          console.error('Error fetching GIF:', error);
          callback(null)
        });
}
