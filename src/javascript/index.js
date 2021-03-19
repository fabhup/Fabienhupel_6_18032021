
let database = {};

function ajaxGet(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        }
    });
    req.addEventListener("error", function() {
        displayLink(listeLiens);
        console.error("Erreur réseau avec l'URL " + url);
        console.error("Statut: " + req.status + " " + req.statusText);
        console.error("Les liens n'ont pas pu être récupérés sur le serveur distant. Affichage des liens par défaut.");
    });
    req.send(null);
}

function getPhotographers(response) {
    database = JSON.parse(response);
    console.log(database);
    const mainContentElement = document.getElementById('main-content');
    // const database = JSON.parse(dataText); 
    // const media = database.media;
    const photographers = database.photographers;
    const urlImagesPhotgraphers= "./public/images/photographers/Photographers ID Photos/";

    for (const index in photographers) {
        const photographerData = photographers[index];

        let articlePhotographer = document.createElement("article");
        articlePhotographer.classList.add("thumb-photographer");
        // articlePhotographer.classList.add("hidden");
        mainContentElement.appendChild(articlePhotographer);

        let headerPhotographer = document.createElement("header");
        headerPhotographer.classList.add("thumb-photographer__header");
        articlePhotographer.appendChild(headerPhotographer);

        let linkPhotographer = document.createElement("a");
        linkPhotographer.setAttribute("href","thumb-photographer__header");
        linkPhotographer.setAttribute("aria-label",photographerData.name);
        headerPhotographer.appendChild(linkPhotographer);

        let imgPhotographer = document.createElement("img");
        imgPhotographer.setAttribute("src",(urlImagesPhotgraphers + photographerData.portrait));
        imgPhotographer.setAttribute("alt","");
        imgPhotographer.setAttribute("width","200");
        imgPhotographer.setAttribute("height","200");
        imgPhotographer.classList.add("user");
        linkPhotographer.appendChild(imgPhotographer);

        let namePhotographer = document.createElement("h2");
        linkPhotographer.appendChild(namePhotographer);
        namePhotographer.textContent = photographerData.name;
        
        let detailsPhotographer = document.createElement("div");
        detailsPhotographer.classList.add("photographer-profile");
        articlePhotographer.appendChild(detailsPhotographer);

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

function displayAllArticles() {
    const articlesHidden = document.querySelectorAll('article[class~="hidden"]');
    console.log(articlesHidden);
    for(article in articlesHidden) {
        articlesHidden[article].classList.remove("hidden")
    }    
}

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
    // const articlesWithSelectedTag = document.querySelectorAll(`article button[class~="${selectedTagNameClass}"]`).closest('article');
    // const articlesWithoutSelectedTag = document.querySelectorAll(`article button:not(.${selectedTagNameClass})`);
    // console.log(articlesWithoutSelectedTag);
}

const buttonsSelectTag = document.querySelectorAll('nav button[class~="btn-tag"]');
buttonsSelectTag.forEach((button) => button.addEventListener("click", filterSelectedTag))
//  {
//     const eltClasses = this.className.split(' ');
//     const selectedTagName = eltClasses.filter(x => x.startsWith('btn-tag--'))[0].replace('btn-tag--','');
//     console.log(selectedTagName);
//     // const articlesWithSelectedTag = document.querySelectorAll(`article button[class~="btn-tag"]`);
// }
// ));



// test.addEventListener('click',displayAllArticles);


// function updateSelectedPhotographersByTag() {
    
//     const hiddenArticlesPhotographers = document.getElementsByClassName('main-content');
//     const urlImagesPhotgraphers= "/public/images/photographers/Photographers ID Photos/";

//     for (const index in photographers) {
//         const photographerData = photographers[index];

//         let articlePhotographer = document.createElement("article");
//         articlePhotographer.classList.add("thumb-photographer");
//         mainContentElement.appendChild(articlePhotographer);

//         let headerPhotographer = document.createElement("header");
//         headerPhotographer.classList.add("thumb-photographer__header");
//         articlePhotographer.appendChild(headerPhotographer);

//         let linkPhotographer = document.createElement("a");
//         linkPhotographer.setAttribute("href","thumb-photographer__header");
//         linkPhotographer.setAttribute("aria-label",photographerData.name);
//         headerPhotographer.appendChild(linkPhotographer);

//         let imgPhotographer = document.createElement("img");
//         imgPhotographer.setAttribute("src",(urlImagesPhotgraphers + photographerData.portrait));
//         imgPhotographer.setAttribute("alt","");
//         imgPhotographer.setAttribute("width","200");
//         imgPhotographer.setAttribute("height","200");
//         imgPhotographer.classList.add("user");
//         linkPhotographer.appendChild(imgPhotographer);

//         let namePhotographer = document.createElement("h2");
//         linkPhotographer.appendChild(namePhotographer);
//         namePhotographer.textContent = photographerData.name;
        
//         let detailsPhotographer = document.createElement("div");
//         detailsPhotographer.classList.add("photographer-profile");
//         articlePhotographer.appendChild(detailsPhotographer);

//         let locationPhotographer = document.createElement("span");
//         locationPhotographer.classList.add("photographer-profile__location");
//         locationPhotographer.textContent = photographerData.city + ', ' + photographerData.country;
//         detailsPhotographer.appendChild(locationPhotographer);

//         let taglinePhotographer = document.createElement("span");
//         taglinePhotographer.classList.add("photographer-profile__tagline");
//         taglinePhotographer.textContent = photographerData.tagline;
//         detailsPhotographer.appendChild(taglinePhotographer);

//         let pricePhotographer = document.createElement("span");
//         pricePhotographer.classList.add("photographer-profile__price");
//         pricePhotographer.textContent = photographerData.price + '€/jour';
//         detailsPhotographer.appendChild(pricePhotographer);

//         let divTagsPhotographer = document.createElement("div");
//         divTagsPhotographer.classList.add("photographer-tags");
//         articlePhotographer.appendChild(divTagsPhotographer);

//         let ulTagsPhotographer = document.createElement("ul");
//         divTagsPhotographer.appendChild(ulTagsPhotographer);
//         for (tag in photographerData.tags) {
//             let liTagPhotographer = document.createElement("li");
//             liTagPhotographer.classList.add("photographer-tags-item");
//             ulTagsPhotographer.appendChild(liTagPhotographer);

//             let buttonTagPhotographer = document.createElement("button");
//             buttonTagPhotographer.classList.add("btn-tag");
//             buttonTagPhotographer.classList.add("btn-tag--" + photographerData.tags[tag]);
//             buttonTagPhotographer.textContent = "#" + photographerData.tags[tag];
//             liTagPhotographer.appendChild(buttonTagPhotographer);
            
//             let spanTagPhotographer = document.createElement("span");
//             spanTagPhotographer.classList.add("sr-only");
//             spanTagPhotographer.textContent = 'Tag ' + photographerData.tags[tag];
//             liTagPhotographer.appendChild(spanTagPhotographer);
//         }
//     }
// }

ajaxGet('./src/data/database.json', getPhotographers);

// import data from ../data/database.js 
// var dataText = readTextFile('file:////src/data/database.json');

