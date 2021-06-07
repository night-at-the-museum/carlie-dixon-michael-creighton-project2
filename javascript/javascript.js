// url https://api.artic.edu/api/v1/artworks
// boiler image url https://www.artic.edu/iiif/2/${}/full/843,/0/default.jpg
// imageAPI comes from https://api.artic.edu/api/v1/artworks/${id grabbed from secondJsonRes}

// exhibits we want
// Ink on Paper: Japanese Monochromatic Prints (2009)
// 18 America after the Fall: Painting in the 1930s
// 23 Aaron Siskind: Abstractions
// 25 Van Dyck, Rembrandt, and the Portrait Print
// 34 Kemang Wa Lehulere: In All My Wildest Dreams
// 31 Master Drawings Unveiled: 25 Years of Major Acquisitions



const galleryApp = {};

galleryApp.url = 'https://api.artic.edu/api/v1/exhibitions?';
galleryApp.exList = [];
galleryApp.imageAPI = [];
galleryApp.counter
galleryApp.index

// event listeners (does it go in init? can it stay here?)
const choiceEl = document.querySelector('.choose')
choiceEl.addEventListener('click', function (e) {
    e.preventDefault ();
    // get value of option
    const select = document.getElementById('exhibition-choice');
    galleryApp.index = Number(select.value);
    galleryApp.createImgArray()
    });
    
galleryApp.createImgArray = () => {
    galleryApp.imageAPI = [];
    // console.log(galleryApp.exList)
    // use to the value to grab gallery from array
    for (i = 0; i < 5; i++) {
    const id = galleryApp.exList[galleryApp.index].artwork_ids[i]
    // create imageAPI link
    const imageAPI = `https:api.artic.edu/api/v1/artworks/${id}`
    galleryApp.imageAPI.push(imageAPI)
    }
    // call for img src (function)
    galleryApp.counter = 0
    galleryApp.getImage(galleryApp.imageAPI[0]);
};

const nextEl = document.querySelector('.next')
nextEl.addEventListener('click', function (e) {
    e.preventDefault ();
    if (galleryApp.counter > 4) {
        galleryApp.index += 1;
        galleryApp.createImgArray();
    }else {
    galleryApp.getImage(galleryApp.imageAPI[galleryApp.counter])
    };
})

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
        for(i = 0; i < firstJsonRes.data.length; i++){
            if (firstJsonRes.data[i].artwork_ids.length > 5){
                galleryApp.exList.push(firstJsonRes.data[i]);
            }
        }
        galleryApp.exOptions(galleryApp.exList);
    })
};

// function that will populate exhibition options
galleryApp.exOptions = (galleries) => {
    // loop through our array
    // create the variables we need
        // exhibit titles 
        // index numbers (connected to title)
        // firstJsonRes.data[i].api_link
    for (i = 0; i < galleries.length; i++) {
        const selectEl = document.querySelector('select')
        const optionEl = document.createElement('option');
        optionEl.innerHTML = galleries[i].title;
        optionEl.setAttribute('value', i);
        selectEl.appendChild(optionEl)
    };
    
}

// takes selected image and produces the src for display
galleryApp.getImage = (imageAPI) => {
    galleryApp.counter += 1;
    fetch(imageAPI)
    .then(secondResult => {
        return secondResult.json();
    })
    .then(secondJsonRes => {
        // console.log(secondJsonRes)
        const imageId = secondJsonRes.data.image_id;
        const displayImage = document.querySelector(".art")
        displayImage.src = `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`
    })
}

galleryApp.init = () => {
    galleryApp.getExhibition();
}

galleryApp.init();