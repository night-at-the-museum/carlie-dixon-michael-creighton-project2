const galleryApp = {};

galleryApp.url = 'https://api.artic.edu/api/v1/exhibitions?';
galleryApp.exList = [];
galleryApp.imageAPI = [];
galleryApp.counter = 0;
galleryApp.index

// event listeners
galleryApp.chooseButton = () => {
const choiceEl = document.querySelector('.choose')
choiceEl.addEventListener('click', function (e) {
    e.preventDefault ();
    // get value of option
    const select = document.getElementById('exhibition-choice');
    galleryApp.index = Number(select.value);
    galleryApp.createImgArray();
    document.querySelector('.next').classList.remove('dont-show');
    galleryApp.nextButton();
    document.querySelector('.back').classList.remove('dont-show');
    galleryApp.backButton();
    document.querySelector('.blurb').classList.add('dont-show');
    document.querySelector('.museum').style.display = "initial";
    galleryApp.exTitle();
    });
};

galleryApp.aniListeners = () => {
    // listen for mouseover on vase
    const vaseEl = document.querySelector('.vase-cont');
    vaseEl.addEventListener('mouseover', function() {
        vaseEl.classList.toggle('roll');
    });

    // listen for mouseover on next button
    const dinoNextEl = document.querySelector('.next');
    const dinoHead = document.querySelector('.bite');
    dinoNextEl.addEventListener('mouseenter', function() {
        dinoHead.classList.add('bite-me'); 
    });
    dinoNextEl.addEventListener('mouseout', function() {
        dinoHead.classList.remove('bite-me');
    })
};

galleryApp.nextButton = () => {
    const nextEl = document.querySelector('.next')
    nextEl.addEventListener('click', function (e) {
        e.preventDefault ();
        galleryApp.counter += 1;
        if (galleryApp.counter > 4) {
            if (galleryApp.index + 1 === galleryApp.exList.length) {
                galleryApp.index = 0;
                galleryApp.counter = 0;
                galleryApp.exTitle();
            } else {
                galleryApp.index += 1;
                galleryApp.counter = 0;
                galleryApp.exTitle();
            }
            galleryApp.createImgArray();
        }else {
        galleryApp.getImage(galleryApp.imageAPI[galleryApp.counter]);
        };
    })
};

galleryApp.backButton = () => {
    const backEl = document.querySelector('.back')
    backEl.addEventListener('click', function (e) {
        e.preventDefault ();
        galleryApp.counter -= 1;
        if (galleryApp.counter <= 0) {
            if (galleryApp.index <= 0) {
                galleryApp.index = galleryApp.exList.length - 1;
                galleryApp.counter = 4;
                galleryApp.exTitle();
            } else {
                galleryApp.index -= 1;
                galleryApp.counter = 4;
                galleryApp.exTitle();
            }
            galleryApp.createImgArray();
        }else {
        galleryApp.getImage(galleryApp.imageAPI[galleryApp.counter]);
        };
    })
};

// function to create each image API in an exhibit
galleryApp.createImgArray = () => {
    galleryApp.imageAPI = [];
    // use to the value to grab gallery from array
    for (i = 0; i < 5; i++) {
    const id = galleryApp.exList[galleryApp.index].artwork_ids[i]
    // create imageAPI link
    const imageAPI = `https://api.artic.edu/api/v1/artworks/${id}`
    galleryApp.imageAPI.push(imageAPI)
    }
    // call for img src (function)
    galleryApp.getImage(galleryApp.imageAPI[galleryApp.counter]);
};


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
        galleryApp.chooseButton();
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
    fetch(imageAPI)
    .then(secondResult => {
        return secondResult.json();
    })
    .then(secondJsonRes => {
        const imageId = secondJsonRes.data.image_id;
        const displayImage = document.querySelector(".art");
        const textCont = document.querySelector(".art-text-cont")
        displayImage.src = `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
        displayImage.alt = `artwork titled: ${secondJsonRes.data.title}`;
        displayImage.classList.remove('dont-show');
        textCont.classList.remove('dont-show');
        galleryApp.artInfo(secondJsonRes.data.title, secondJsonRes.data.artist_title);
    })
}

// function to display exhibit title
galleryApp.exTitle = () => {
    const titleCont = document.querySelector('.ex-title-cont');
    titleCont.classList.remove('dont-show');
    const title = document.querySelector(".ex-title");
    title.textContent = galleryApp.exList[galleryApp.index].title;
};

// function to display art info
galleryApp.artInfo = (title, artist) => {
    const artTitle = document.querySelector('.art-text');
    const artistName = document.querySelector('.artist-text');
    artTitle.textContent = `Title: ${title}`;
    artistName.textContent = `Artist: ${artist}`;
}


galleryApp.init = () => {
    galleryApp.getExhibition();
    galleryApp.aniListeners();
}

galleryApp.init();


// url https://api.artic.edu/api/v1/artworks
// boiler image url https://www.artic.edu/iiif/2/${}/full/843,/0/default.jpg
// imageAPI comes from https://api.artic.edu/api/v1/artworks/${id grabbed from secondJsonRes}

// to get current exhibition title: galleryApp.exList[galleryApp.index].title
