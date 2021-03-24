
var url = './src/data/database.json'
// const filters = { 
//     "id": (x => x == 243 | x == 930), 
//     "tags": (x => x.includes("portrait") ) 
// };

const getData = (dataToExtract) => {
  return fetch(url)
    .then((response) => response.json())
    .catch((errorFetch) => console.log(`Erreur réseau avec l'url ${url}`, errorFetch))
    .then(jsonResponse => {
        return jsonResponse[dataToExtract]
    })
    .catch(errorGetMedia => console.log("Requête invalide", errorGetMedia))
}

const filterData = (data, filters) => (data.filter(data => 
    Object.keys(filters).every(key => filters[key](data[key]))))

// Parse the URL parameter
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


const filtersDataPhotograph = { 
    "id": (x => x == getParameterByName('id'))
};

const filtersDataMedia = { 
    "photographerId": (x => x == getParameterByName('id'))
};

function createHeaderPhotograph(photographerData) {
    const mainContentElement = document.getElementById('main-content');
    const headerPhotographer = document.getElementById('photographer-header');
    const divPhotographerProfile = document.getElementById('photographer-profile');
    const h2PhotographerName = document.getElementById('photographer-profile__name');
    const spanPhotographerLocation = document.getElementById('photographer-profile__location');
    const spanPhotographerTagline = document.getElementById('photographer-profile__tagline');
    const divTagsPhotographer = document.getElementById('photographer-tags');
    const urlImagesPhotgraphers= "./public/images/photographers/Photographers ID Photos/";;

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
    headerPhotographer.appendChild(imgPhotographer);
}

function createGalleryPhotograph(mediasData) {
    const photographerGallery = document.getElementById('photographer-gallery');
    const urlImagesMedia = "./public/images/photographers/" + getParameterByName('id') + '/';

    for (media in mediasData) {
        const mediaData = mediasData[media]

        let divMedia = document.createElement("div");
        divMedia.classList.add("thumb-imgfull");
        divMedia.setAttribute("data-likes",mediaData.likes);
        divMedia.setAttribute("data-date",mediaData.date);
        divMedia.setAttribute("data-price",mediaData.price);
        divMedia.setAttribute("data-tags",mediaData.tags);
        divMedia.setAttribute("data-title",mediaData.image);
        photographerGallery.appendChild(divMedia);

        let imgMedia = document.createElement("img");
        imgMedia.setAttribute("src",(urlImagesMedia + mediaData.image));
        imgMedia.setAttribute("alt","");
        imgMedia.classList.add("thumb-img");
        divMedia.appendChild(imgMedia);

        let titleMedia = document.createElement("span");
        titleMedia.textContent = mediaData.image;
        divMedia.appendChild(titleMedia);

        let priceMedia = document.createElement("span");
        priceMedia.textContent = mediaData.price + ' €';
        divMedia.appendChild(priceMedia);

        let likesMedia = document.createElement("div");
        likesMedia.classList.add("likes");
        divMedia.appendChild(likesMedia);

        let likesCounter = document.createElement("span");
        likesCounter.textContent = mediaData.likes;
        likesMedia.appendChild(likesCounter);

        let likesIcone = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        likesIcone.setAttribute("viewBox","0 0 19 19");
        likesIcone.innerHTML = '<path d="M9.5 18.35L8.23125 17.03C3.725 12.36 0.75 9.28 0.75 5.5C0.75 2.42 2.8675 0 5.5625 0C7.085 0 8.54625 0.81 9.5 2.09C10.4537 0.81 11.915 0 13.4375 0C16.1325 0 18.25 2.42 18.25 5.5C18.25 9.28 15.275 12.36 10.7688 17.04L9.5 18.35Z" fill="#911C1C"/>';
        likesMedia.appendChild(likesIcone);
        }
}


// Give the parameter a variable name
function loadPhotographData() {
    getData('photographers')
    .then(extractData => filterData(extractData,filtersDataPhotograph)[0])
    .then(extractData => (createHeaderPhotograph(extractData)))
    getData('media')
    .then(extractData => filterData(extractData,filtersDataMedia))
    .then(extractData => (createGalleryPhotograph(extractData)))
}

loadPhotographData()


const photographerGallery = document.getElementById('photographer-gallery');

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
    console.log(mediasElementsArray);
    for (el in mediasElementsArray) {
        photographerGallery.appendChild(mediasElementsArray[el]);
    }
  }

  const formatSortFilters = {
    "likes": "number",
    "date": "string",
    "title": "string"
  }

//Event on Filters List
const dropdownOpened = document.getElementById("dropdown-opened");
const dropdownClosed = document.getElementById("dropdown-closed");
const dropdownOptions = document.querySelectorAll(".dropdown-option"); 
const dropdownLabel= document.getElementById("dropdown-label");



dropdownOpened.addEventListener("click", function() {
    dropdownOpened.style.display = 'none';
    dropdownClosed.style.display = 'flex';
})

dropdownClosed.addEventListener("click", function() {
    dropdownClosed.style.display = 'none';
    dropdownOpened.style.display = 'flex';
})

dropdownOptions.forEach((element) =>    
    element.addEventListener("click", function() {
        dropdownLabel.textContent = element.textContent;
        dropdownOptions.forEach((elt) => elt.classList.remove('selected'))
        element.classList.add('selected');
        const filter = element.getAttribute('data-value');
        console.log(formatSortFilters[filter])
        sortData(filter,formatSortFilters[filter],"desc");
    })
);



