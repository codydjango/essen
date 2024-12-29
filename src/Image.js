function getGiphyUrl(keyword) {
    const YOUR_API_KEY = 'G4NnYrdSDoN5P03vwNyEinIn9AqUtOqE';

    return `https://api.giphy.com/v1/gifs/random?api_key=${YOUR_API_KEY}&tag=${keyword};`
}

export function getImage(keyword, callback) {
    const url = getGiphyUrl(keyword)

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch the GIF');
            }
            return response.json(); // Parse the JSON response
        })
        .then((data) => {
            callback(data.data.images.original.url)
        })
        .catch((error) => {
          console.error('Error fetching GIF:', error);
        });
}
