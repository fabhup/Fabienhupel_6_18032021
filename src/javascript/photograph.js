
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


const filtersData = { 
    "id": (x => x == getParameterByName('id'))
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

// Give the parameter a variable name
function loadPhotographData() {
    getData('photographers')
    .then(extractData => filterData(extractData,filtersData)[0])
    .then(extractData => (createHeaderPhotograph(extractData)))
}

loadPhotographData()