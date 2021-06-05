// url https://api.artic.edu/api/v1/artworks
// boiler image url https://www.artic.edu/iiif/2/${}/full/843,/0/default.jpg
// imageAPI comes from https://api.artic.edu/api/v1/artworks/${id grabbed from secondJsonRes}

// exhibits we want
// 3 Ink on Paper: Japanese Monochromatic Prints (2009)
// 18 America after the Fall: Painting in the 1930s
// 23 Aaron Siskind: Abstractions
// 25 Van Dyck, Rembrandt, and the Portrait Print
// 34 Kemang Wa Lehulere: In All My Wildest Dreams
// 31 Master Drawings Unveiled: 25 Years of Major Acquisitions



const galleryApp = {};

galleryApp.url = 'https://api.artic.edu/api/v1/exhibitions?';

// function to get exhibition api based on users choice
// users choice will determine index number
galleryApp.getExhibition = () => {
    const exLink = new URL(galleryApp.url);
    exLink.search = new URLSearchParams({
        "limit": 50
    })
    
    fetch(exLink)
    .then(firstResult => {
        return firstResult.json();
    })
    .then(firstJsonRes => {
        exAPI = firstJsonRes.data[3].api_link;
        galleryApp.getApi(exAPI)
    })
}
// takes gallery API link and produces individual image API based in based on incrementing index number
galleryApp.getApi = (exAPI) => {
    fetch(exAPI)
    .then(secondResult => {
        return secondResult.json();
    })
    .then(secondJsonRes => {
        console.log(secondJsonRes)
        const id = secondJsonRes.data.artwork_ids[0];
        const imageAPI = `https:api.artic.edu/api/v1/artworks/${id}`
        galleryApp.getImage(imageAPI);
    })
}
// takes selected image and produces the src for display
galleryApp.getImage = (imageAPI) => {
    fetch(imageAPI)
    .then(secondResult => {
        return secondResult.json();
    })
    .then(secondJsonRes => {
        console.log(secondJsonRes)
        const imageId = secondJsonRes.data.image_id;
        const displayImage = document.querySelector(".art")
        displayImage.src = `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`
    })
}

galleryApp.init = () => {
    galleryApp.getExhibition();
}

galleryApp.init();