(async () => {
  let passwords = null;
  try {
    const module = await import("./passwords.js");
    console.log('password module loaded:', module);
    passwords = module.default;
  } catch (error) {
    console.error('Failed to import passwords:', error);
    passwords = {}
  }
})();

async function fetchWikiImages(plantName) {
    const baseUrl = "https://en.wikipedia.org/w/api.php";
    const corsProxy = "" //https://cors-anywhere.herokuapp.com/"; // Add CORS proxy if needed

    try {
        // Step 1: Search for the plant name
        const searchResponse = await fetch(`${corsProxy}${baseUrl}?action=query&list=search&srsearch=${encodeURIComponent(plantName)}&format=json&origin=*`);
        const searchData = await searchResponse.json();
        if (!searchData.query.search.length) {
            console.log("No pages found for this plant.");
            return [];
        }

        // Get the first page ID
        const pageId = searchData.query.search[0].pageid;

        // Step 2: Get images for the page
        const imagesResponse = await fetch(`${corsProxy}${baseUrl}?action=query&prop=images&pageids=${pageId}&format=json&origin=*`);
        const imagesData = await imagesResponse.json();
        const imageFiles = imagesData.query.pages[pageId].images || [];

        // Step 3: Get the URLs for each image
        const imageUrls = [];
        for (let image of imageFiles) {
            if (image.title.endsWith(".jpg") || image.title.endsWith(".png")) { // Filter for valid image types
                const fileName = image.title.replace("File:", "");
                const imageInfoResponse = await fetch(`${corsProxy}${baseUrl}?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&format=json&origin=*`);
                const imageInfoData = await imageInfoResponse.json();

                const pages = Object.values(imageInfoData.query.pages);
                if (pages[0].imageinfo) {
                    imageUrls.push(pages[0].imageinfo[0].url);
                }
            }
        }
        return imageUrls;
    } catch (error) {
        console.error("Error fetching plant images:", error);
        return []
    }
}

function getGiphyUrl(keyword) {
    const YOUR_API_KEY = passwords.giphy;

    return `https://api.giphy.com/v1/gifs/random?api_key=${YOUR_API_KEY}&tag=${keyword};`
}

function getGiphyImage(keyword, callback) {
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

function getWikiImage(keyword, callback) {
    // Example usage
    fetchWikiImages(keyword).then((urls) => {
        // Display or use the URLs
        urls.forEach((url) => console.log(url));
        if (urls && urls.length) {
            callback(urls[0])
        }
    });
}

export function getImage(keyword, callback) {
    console.log(`search for image: ${keyword}`)
    getWikiImage(keyword, callback)
}
