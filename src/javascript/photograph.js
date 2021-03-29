
// Variables declaration
const url = './src/data/database.json'
const formatSortingOptions = {
    "likes": "number",
    "date": "string",
    "title": "string"
  };

// DOM Elements variables
const photographerGallery = document.getElementById('photographer-gallery');
const dropdownOpened = document.getElementById("dropdown-opened");
const dropdownClosed = document.getElementById("dropdown-closed");
const dropdownOptions = document.querySelectorAll(".dropdown-option"); 
const dropdownLabel= document.getElementById("dropdown-label");

// Get current Id Photograph (to filter data on this id)
const filtersDataPhotograph = { 
    "id": (x => x == getParameterByName('id'))
};
const filtersDataMedia = { 
    "photographerId": (x => x == getParameterByName('id'))
};

/**
 * Function to Extract Data from an url of json file
 * @param {string} urlJSON 
 * @param {string} dataToExtract 
 */

const getData = (urlJSON, dataToExtract) => {
  return fetch(urlJSON)
    .then((response) => response.json())
    .catch((errorFetch) => console.log(`Erreur réseau avec l'url ${url}`, errorFetch))
    .then(jsonResponse => {
        return jsonResponse[dataToExtract]
    })
    .catch(errorGetMedia => console.log("Requête invalide", errorGetMedia))
}

/**
 * Filter data parameter on each filters parameters 
 * @param {object} data 
 * @param {object} filters -- ex {"id": 112}
 */
const filterData = (data, filters) => (data.filter(data => 
    Object.keys(filters).every(key => filters[key](data[key]))))

/**
 * Function to extract a parameter value in an url from the name of the parameter
 * 
 * @param {string} name 
 * @param {string} url 
 * @return {string}
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Function to create or update HTML elements depending on photgrapherData extracted
 * @param {object} photographerData 
 */
function createElementsOnPhotographData(photographerData) {
    const mainContentElement = document.getElementById('main-content');
    const headerPhotographer = document.getElementById('photographer-header');
    const divPhotographerProfile = document.getElementById('photographer-profile');
    const h2PhotographerName = document.getElementById('photographer-profile__name');
    const spanPhotographerLocation = document.getElementById('photographer-profile__location');
    const spanPhotographerTagline = document.getElementById('photographer-profile__tagline');
    const divTagsPhotographer = document.getElementById('photographer-tags');
    const urlImagesPhotgraphers= "./public/images/photographers/Photographers ID Photos/";;
    const mainDataPriceElement = document.getElementById('photographer-main-data__price');

    h2PhotographerName.textContent = photographerData.name;
    spanPhotographerLocation.textContent = photographerData.city + ', ' + photographerData.country;
    spanPhotographerTagline.textContent = photographerData.tagline;

    let ulTagsPhotographer = document.createElement("ul");
    divTagsPhotographer.appendChild(ulTagsPhotographer);

    for (tag in photographerData.tags) {
        let liTagPhotographer = document.createElement("li");
        liTagPhotographer.classList.add("photographer-tags-item");
        ulTagsPhotographer.appendChild(liTagPhotographer);

        let buttonTagPhotographer = document.createElement("button");
        buttonTagPhotographer.classList.add("btn-tag");
        buttonTagPhotographer.setAttribute("role","button");
        buttonTagPhotographer.classList.add("btn-tag--" + photographerData.tags[tag]);
        buttonTagPhotographer.textContent = "#" + photographerData.tags[tag];
        liTagPhotographer.appendChild(buttonTagPhotographer);
        
        let spanTagPhotographer = document.createElement("span");
        spanTagPhotographer.classList.add("sr-only");
        spanTagPhotographer.textContent = 'Tag ' + photographerData.tags[tag];
        liTagPhotographer.appendChild(spanTagPhotographer);
    }

    let imgPhotographer = document.createElement("img");
    imgPhotographer.setAttribute("src",(urlImagesPhotgraphers + photographerData.portrait));
    imgPhotographer.setAttribute("alt","");
    imgPhotographer.classList.add("user");
    headerPhotographer.insertBefore(imgPhotographer,headerPhotographer.children[0]);

    mainDataPriceElement.textContent = photographerData.price + "€ / jour";

    //Event on Tags Buttons
    const buttonsSelectTag = document.querySelectorAll('button[class~="btn-tag"]');
    buttonsSelectTag.forEach((button) => button.addEventListener("click", filterMediasOnSelectedTag))

}

/**
 * Function to create or update HTML elements depending on mediasData extracted
 * @param {object} mediasData 
 */
function createElementsOnMediasData(mediasData) {
    const photographerGallery = document.getElementById('photographer-gallery');
    const urlImagesMedia = "./public/images/photographers/medias/";
    const urlImagesMediaPhotographerSmall = urlImagesMedia + "small/" + getParameterByName('id') + '/';
    const urlImagesMediaPhotographerLarge = urlImagesMedia + "large/" + getParameterByName('id') + '/';
    const mainDataTotalLikesElement = document.getElementById('photographer-main-data__likes');
    const lightBoxContent = document.getElementById('lightbox-content');
    
    function getTotalLikes() {
        let totalLikes = 0;
        const likesElements = document.querySelectorAll(".thumb-img__likes")
        likesElements.forEach((elt) => totalLikes += Number(elt.getAttribute('data-likes')))
        return totalLikes
    }

    for (mediaIndex in mediasData) {
        
        const mediaData = mediasData[mediaIndex]
     
        let divMedia = document.createElement("div");
        divMedia.classList.add("thumb-imgfull");
        divMedia.setAttribute("data-likes",mediaData.likes);
        divMedia.setAttribute("data-date",mediaData.date);
        divMedia.setAttribute("data-price",mediaData.price);
        divMedia.setAttribute("data-tags",mediaData.tags);
        divMedia.setAttribute("data-title",mediaData.title);
        photographerGallery.appendChild(divMedia);

        let divMediaLightbox = document.createElement("div");
        divMediaLightbox.classList.add("lightbox-imgfull");
        lightBoxContent.appendChild(divMediaLightbox);

        if (mediaData.image) {
            let imgMedia = document.createElement("img");
            imgMedia.setAttribute("src",(urlImagesMediaPhotographerSmall + mediaData.image));
            imgMedia.setAttribute("alt", mediaData.title);
            imgMedia.setAttribute("onerror",`this.src='${urlImagesMedia}image-not-found.jpg'`);
            imgMedia.setAttribute("onclick",`openLightbox(),showMediaIndex(${mediaIndex})`);
            imgMedia.classList.add("thumb-img");
            divMedia.appendChild(imgMedia);

            let imgMediaLightbox = document.createElement("img");
            imgMediaLightbox.setAttribute("alt", mediaData.title);
            imgMediaLightbox.setAttribute("src",(urlImagesMediaPhotographerLarge + mediaData.image));
            imgMediaLightbox.setAttribute("onerror",`this.src='${urlImagesMedia}image-not-found.jpg'`);
            divMediaLightbox.appendChild(imgMediaLightbox);
        }
        else if (mediaData.video) {
            let videoMedia = document.createElement("video");
            videoMedia.setAttribute("src",(urlImagesMediaPhotographerSmall + mediaData.video + '#t=0.1'));
            videoMedia.setAttribute("alt",mediaData.title);
            videoMedia.setAttribute("onerror",`this.src='${urlImagesMedia}image-not-found.jpg'`);
            videoMedia.setAttribute("onclick",`openLightbox(),showMediaIndex(${mediaIndex})`);
            videoMedia.classList.add("thumb-img");
            divMedia.appendChild(videoMedia);

            let videoMediaLightbox = document.createElement("video");
            videoMediaLightbox.setAttribute("alt", mediaData.title);
            videoMediaLightbox.setAttribute("src",(urlImagesMediaPhotographerLarge + mediaData.video + '#t=0.1'));
            videoMediaLightbox.setAttribute("controls","controls");
            videoMediaLightbox.setAttribute("onerror",`this.src='${urlImagesMedia}image-not-found.jpg'`);
            divMediaLightbox.appendChild(videoMediaLightbox);
        } 

        let priceMedia = document.createElement("span");
        priceMedia.textContent = mediaData.price + ' €';
        priceMedia.classList.add("thumb-img__price");
        divMedia.appendChild(priceMedia);

        let likesMedia = document.createElement("div");
        likesMedia.classList.add("thumb-img__likes");
        likesMedia.setAttribute("data-likes",mediaData.likes);
        divMedia.appendChild(likesMedia);

        let likesIcone = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        likesIcone.setAttribute("viewBox","-2 -2 25 25");
        likesIcone.classList.add("thumb-img__like-icone");
        likesIcone.innerHTML = '<path d="M9.5 18.35L8.23125 17.03C3.725 12.36 0.75 9.28 0.75 5.5C0.75 2.42 2.8675 0 5.5625 0C7.085 0 8.54625 0.81 9.5 2.09C10.4537 0.81 11.915 0 13.4375 0C16.1325 0 18.25 2.42 18.25 5.5C18.25 9.28 15.275 12.36 10.7688 17.04L9.5 18.35Z" fill="#911C1C"/>';
        likesMedia.appendChild(likesIcone);
        
        let titleMedia = document.createElement("span");
        titleMedia.textContent = mediaData.title;
        titleMedia.classList.add("thumb-img__title");
        divMedia.appendChild(titleMedia);

        let titleMediaLightbox = document.createElement("span");
        titleMediaLightbox.textContent = mediaData.title;
        titleMediaLightbox.classList.add("lightbox-imgfull__title");
        divMediaLightbox.appendChild(titleMediaLightbox);
    }
    
    mainDataTotalLikesElement.textContent = getTotalLikes()

    const likeIcones = document.querySelectorAll(".thumb-img__like-icone");
    likeIcones.forEach((element) => element.addEventListener("click", function() {
        if (element.classList.contains('liked')) {
            element.classList.remove('liked'); 
            element.parentElement.setAttribute("data-likes",Number(element.parentElement.getAttribute("data-likes")) - 1 )
            mainDataTotalLikesElement.textContent = getTotalLikes()
        }
        else {
            element.classList.add('liked'); 
            element.parentElement.setAttribute("data-likes",Number(element.parentElement.getAttribute("data-likes")) + 1 )
            mainDataTotalLikesElement.textContent = getTotalLikes()
        }  
    }));
}


/**
 * Function to get photographers and media Datas and update html (on promises)
 */
function loadData() {
    getData(url,'photographers')
    .then(extractData => filterData(extractData,filtersDataPhotograph)[0])
    .then(extractData => (createElementsOnPhotographData(extractData)))

    getData(url,'media')
    .then(extractData => filterData(extractData,filtersDataMedia))
    .then(extractData => (createElementsOnMediasData(extractData)))
}

/**
 * Function to sortHTMLElements according to the keySort choice, formatSort and orderSort
 * @param {string} keySort 
 * @param {string} formatSort -- ex : 'number', 'string'
 * @param {string} orderSort -- ex : 'asc', 'desc'
 */
function sortData(keySort, formatSort, orderSort='asc') {
    const mediasElements = document.getElementsByClassName('thumb-imgfull');
    let mediasElementsArray = [];
    for (var i in mediasElements) {
        if (mediasElements[i].nodeType == 1) { 
            mediasElementsArray.push(mediasElements[i]);
        }
    };
    mediasElementsArray.sort(function(a, b) {
      const aValue = a.getAttribute(`data-${keySort}`);
      const bValue = b.getAttribute(`data-${keySort}`);
      
      if (formatSort == 'number' && orderSort == 'asc') { 
        return aValue - bValue;
      }
      else if (formatSort == 'number') {
        return bValue - aValue; 
      }
      else if (formatSort != 'number' && orderSort =='asc') {
        if (aValue < bValue) {return -1}
        else if (aValue > bValue) {return 1}
        else {return 0}
      }
      else {
        if (aValue > bValue) {return -1}
        else if (aValue < bValue) {return 1} 
        else {return 0}
      }
    });

    for (el in mediasElementsArray) {
        photographerGallery.appendChild(mediasElementsArray[el]);
    };
  }


//Load Photograph and Media Data 
loadData();

//Events on dropdown elements

//Event to display or hide dropdownOpened element on click
dropdownOpened.addEventListener("click", function() {
    dropdownOpened.style.display = 'none';
    dropdownClosed.style.display = 'flex';
})

//Event to display or hide dropdownClosed element on click
dropdownClosed.addEventListener("click", function() {
    dropdownClosed.style.display = 'none';
    dropdownOpened.style.display = 'flex';
})

//Events to sort or hide dropdownClosed element on click
dropdownOptions.forEach((element) =>    
    element.addEventListener("click", function() {
        dropdownLabel.textContent = element.textContent;  // update textContent of dropdownLabel
        dropdownOptions.forEach((elt) => elt.classList.remove('selected')) // remove selected class of dropdownOptions elements
        element.classList.add('selected'); // add selected class on current element
        const sortActive = element.getAttribute('data-value');
        sortData(sortActive,formatSortingOptions[sortActive],"desc"); // sortData on sortActive option according to formatSortingOptions 
    })
);


/**
 * function that display or hide html elements depending on selected tag button 
 * 
 */
function filterMediasOnSelectedTag() {
    const eltClasses = this.className.split(' ');
    const selectedTagName = eltClasses.filter(x => x.startsWith('btn-tag--'))[0].replace('btn-tag--','');
    const medias = document.querySelectorAll('.thumb-imgfull');
    const buttonsTagsPressed = document.querySelectorAll('button[class~="btn-tag"][aria-pressed="true"]');

    if (this.getAttribute('aria-pressed')=="true") {
        medias.forEach((media) => { 
            media.classList.remove('hidden')
        })
    }
    else {
        this.setAttribute('aria-pressed',"true");
        medias.forEach((media) => { 
            media.classList.remove('hidden');
            console.log(media.getAttribute('data-tags'));
            console.log(selectedTagName);
            if (media.getAttribute('data-tags') != selectedTagName) {
                media.classList.add('hidden')
            }
        })
    }
    buttonsTagsPressed.forEach((buttonElement) => { 
        buttonElement.setAttribute('aria-pressed',"false");
    })
    this.blur(); // to make the focus disappear
}


// Open the LightBox Gallery
function openLightbox() {
    document.getElementById("lightbox").style.display = "flex";
  }
  
  // Close the LightBox Gallery
  function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
  }
  
let mediaIndex = 0;
showMediaIndex(mediaIndex);

function showMediaIndex(n) {
    let i;
    mediaIndex = n;
    const imagesLightbox = document.getElementsByClassName("lightbox-imgfull");
    if (n > imagesLightbox.length-1) {mediaIndex = 0}
    if (n < 0) {mediaIndex = imagesLightbox.length-1}
    for (i = 0; i < imagesLightbox.length; i++) {
        (i!=mediaIndex) ? imagesLightbox[i].style.display = "none" : imagesLightbox[i].style.display = "block";
    }
}

// Next/previous controls
function moveIndex(n) {
    showMediaIndex(mediaIndex += n);
}