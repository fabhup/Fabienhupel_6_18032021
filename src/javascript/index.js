
// Variables declaration
const tagsList = ['portrait','art','fashion','architecture','travel','sport','animals','events'];
const navElement = document.getElementsByClassName('header-navigation')[0];

/**
 * Function that creates a list of button Tags from listTags in the navElement 
 * @param {arrayOfString} listOfTags 
 */
function createTagsNav(listOfTags) {
    const navElement = document.getElementsByClassName('header-navigation')[0]

    let ulTags = document.createElement("ul");
    navElement.appendChild(ulTags);
        
    for (tag in listOfTags) {
        let liTag = document.createElement("li");
        liTag.classList.add("header-navigation-item");
        ulTags.appendChild(liTag);

        let buttonTag = document.createElement("button");
        buttonTag.setAttribute("role","button");
        buttonTag.setAttribute("aria-label",("filtre tag "+listOfTags[tag]));
        buttonTag.classList.add("btn-tag");
        buttonTag.classList.add("btn-tag--" + listOfTags[tag]);
        buttonTag.textContent = "#" + listOfTags[tag][0].toUpperCase() + listOfTags[tag].substring(1);
        liTag.appendChild(buttonTag);
    }
}

/**
 * Apply get method with Ajax on a callback function
 * 
 * @param {string} url 
 * @param {function} callback 
 */
function ajaxGet(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400) {
            callback(req.responseText);
        }
    });
    req.addEventListener("error", function() {
        console.error("Erreur réseau avec l'URL " + url);
        console.error("Statut: " + req.status + " " + req.statusText);
    });
    req.send(null);
}

/**
 * Get Photograpers Data from response ajax, create and add elements to html
 * @param {string} response  -- response of the ajax get method 
 */
function getPhotographers(response) {
    const database = JSON.parse(response);
    const mainContentElement = document.getElementById('main-content');
    const photographers = database.photographers;
    const urlImagesPhotgraphers= "./public/images/photographers/Photographers ID Photos/";

    for (const index in photographers) {
        const photographerData = photographers[index];

        let articlePhotographer = document.createElement("article");
        articlePhotographer.classList.add("thumb-photographer");
        mainContentElement.appendChild(articlePhotographer);

        let headerPhotographer = document.createElement("header");
        headerPhotographer.classList.add("thumb-photographer__header");
        articlePhotographer.appendChild(headerPhotographer);
        articlePhotographer.style.background = "url('../public/images/LoadSpinner.gif') no-repeat";
        articlePhotographer.style.backgroundPosition = "center";

        let linkPhotographer = document.createElement("a");
        linkPhotographer.setAttribute("href",`./photograph.html?id=${photographerData.id}`);
        linkPhotographer.setAttribute("aria-label",photographerData.name);
        headerPhotographer.appendChild(linkPhotographer);

        let imgPhotographer = document.createElement("img");
        imgPhotographer.setAttribute("src",(urlImagesPhotgraphers + photographerData.portrait));
        imgPhotographer.setAttribute("alt","");
        imgPhotographer.classList.add("user");
        linkPhotographer.appendChild(imgPhotographer);
        linkPhotographer.style.opacity = 0;
        imgPhotographer.addEventListener("load", function() 
        { namePhotographer.style.opacity = 1;   
          detailsPhotographer.style.opacity = 1;
          divTagsPhotographer.style.opacity = 1;
          linkPhotographer.style.opacity = 1;
          articlePhotographer.style.background = "none";
        });


        let namePhotographer = document.createElement("h2");
        linkPhotographer.appendChild(namePhotographer);
        namePhotographer.textContent = photographerData.name;
        namePhotographer.style.opacity = 0;
        
        let detailsPhotographer = document.createElement("div");
        detailsPhotographer.classList.add("photographer-profile");
        articlePhotographer.appendChild(detailsPhotographer);
        detailsPhotographer.style.opacity = 0;

        let locationPhotographer = document.createElement("span");
        locationPhotographer.classList.add("photographer-profile__location");
        locationPhotographer.textContent = photographerData.city + ', ' + photographerData.country;
        detailsPhotographer.appendChild(locationPhotographer);

        let taglinePhotographer = document.createElement("span");
        taglinePhotographer.classList.add("photographer-profile__tagline");
        taglinePhotographer.textContent = photographerData.tagline;
        detailsPhotographer.appendChild(taglinePhotographer);

        let pricePhotographer = document.createElement("span");
        pricePhotographer.classList.add("photographer-profile__price");
        pricePhotographer.textContent = photographerData.price + '€/jour';
        detailsPhotographer.appendChild(pricePhotographer);

        let divTagsPhotographer = document.createElement("div");
        divTagsPhotographer.classList.add("photographer-tags");
        articlePhotographer.appendChild(divTagsPhotographer);
        divTagsPhotographer.style.opacity = 0;

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
    }
}

/**
 * function that display or hide html elements depending on selected tag button 
 * 
 */
function filterSelectedTag() {
    const eltClasses = this.className.split(' ');
    const selectedTagNameClass = eltClasses.filter(x => x.startsWith('btn-tag--'))[0];
    const articlesPhotographer = document.querySelectorAll('article[class~="thumb-photographer"]');
    const buttonsTagsPressed = document.querySelectorAll('nav button[class~="btn-tag"][aria-pressed="true"]');

    if (this.getAttribute('aria-pressed')=="true") {
        articlesPhotographer.forEach((articleElement) => { 
            articleElement.classList.remove('hidden')
        })
    }
    else {
        this.setAttribute('aria-pressed',"true");
        articlesPhotographer.forEach((articleElement) => { 
            articleElement.classList.remove('hidden');
            if (!articleElement.querySelector(`button[class~="${selectedTagNameClass}"]`)) {
                articleElement.classList.add('hidden')
            }
        })
    }
    buttonsTagsPressed.forEach((buttonElement) => { 
        buttonElement.setAttribute('aria-pressed',"false");
    })
    this.blur(); // to make the focus disappear
}

//Create HTML content from Data
createTagsNav(tagsList);
ajaxGet('./src/data/database.json', getPhotographers);

//Event on Tags Buttons Nav
const buttonsSelectTag = document.querySelectorAll('nav button[class~="btn-tag"]');
buttonsSelectTag.forEach((button) => button.addEventListener("click", filterSelectedTag))
