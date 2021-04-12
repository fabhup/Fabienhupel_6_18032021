// import {selectTagFromUrl} from './manage-data.js'
import {getData, filterData, getParameterByName} from './manage-data.js'
import {Media} from './media-factory.js'

// DOM Elements variables
const mainContentElement = document.getElementById('main-content');
const mainHeaderElement = document.getElementsByClassName('header')[0];
const lightboxElement = document.getElementById("lightbox");
const firstChildLightboxContent = document.getElementById('lightbox-content').firstChild;
const buttonNextLightbox = document.getElementById('icon-next');
const buttonPrevLightbox = document.getElementById('icon-prev');
const buttonCloseLightbox = document.getElementById('icon-close-lightbox');

const urlData = './src/data/database.json'
const filtersDataMedia = { 
  "photographerId": (x => x == getParameterByName('id'))
  // ,"tags": (x => x.includes(getParameterByName('tag')))
};

// Open the LightBox Gallery
function openLightbox() {
  lightboxElement.style.display = "flex";
  mainContentElement.setAttribute("aria-hidden","true");
  mainHeaderElement.setAttribute("aria-hidden","true");
  lightboxElement.focus() ;
}
  
  // Close the LightBox Gallery
  function closeLightbox() {
    lightboxElement.style.display = "none";
    mainContentElement.setAttribute("aria-hidden","false");
    mainHeaderElement.setAttribute("aria-hidden","false");
  }
  
let mediaIndex = 0;
showMediaIndex(mediaIndex);


function showMediaIndex(n) {
    mediaIndex = Number(n);
    const imagesLightbox = document.getElementsByClassName("lightbox-imgfull");
    let indexFirstImageLightbox = 0;
    let indexLastImageLightbox = 0;
    let cptImageLightbox = 0;
    for (let i = 0; i < imagesLightbox.length; i++) {
      if (!imagesLightbox[i].classList.contains('hidden')) {
        cptImageLightbox++;
        if (cptImageLightbox==1) {indexFirstImageLightbox = i}
        indexLastImageLightbox = i
      }
    }
    if (n > imagesLightbox.length-1) {mediaIndex = indexFirstImageLightbox}
    if (n < indexFirstImageLightbox) {mediaIndex = indexLastImageLightbox}
    for (let i = 0; i < imagesLightbox.length; i++) {
        (i!=mediaIndex) ? imagesLightbox[i].style.display = "none" : imagesLightbox[i].style.display = "block";
    }
}

// Next/previous controls
function moveIndex(n) {
    const imagesLightbox = document.getElementsByClassName("lightbox-imgfull");
    if (n>0) {
      for (let i = mediaIndex + n; i < imagesLightbox.length; i++) {
        if (imagesLightbox[i].classList.contains('hidden')) {
          n+=1;
        }
        else {
          break;
        }
      }
    }
    showMediaIndex(mediaIndex += n);
    imagesLightbox[mediaIndex].firstChild.focus(); //move focus to image active for quit button focus
}

// Lightbox Event Keyboard
lightboxElement.addEventListener("keydown", event => {
  event.preventDefault();
  if (event.key === "ArrowLeft") { // event for left arrow (previous media)
      moveIndex(-1);       
  }
  else if (event.key === "ArrowRight") { // event for right arrow (next media)
      moveIndex(1);          
  }
  else if (event.key === "Escape") {
      closeLightbox();
  }
});

buttonNextLightbox.addEventListener("click",function() {
  moveIndex(1)
});
buttonPrevLightbox.addEventListener("click",function() {
  moveIndex(-1)
});
buttonCloseLightbox.addEventListener("click",closeLightbox);

/**
   * Function to create Lightbox depending on mediasData extracted
   * @param {object} mediasData 
   */
  function createLightbox(mediasData) {
    const lightBoxContent = document.getElementById('lightbox-content');
  
    for (const mediaIndex in mediasData) {
        
        const mediaData = mediasData[mediaIndex]
     
        let divMediaLightbox = document.createElement("div");
        divMediaLightbox.classList.add("lightbox-imgfull");
        divMediaLightbox.style.background = "url('../public/images/LoadSpinner.gif') no-repeat";
        divMediaLightbox.style.backgroundPosition = "center";
        divMediaLightbox.setAttribute("data-likes",mediaData.likes);
        divMediaLightbox.setAttribute("data-date",mediaData.date);
        divMediaLightbox.setAttribute("data-price",mediaData.price);
        divMediaLightbox.setAttribute("data-tags",mediaData.tags);
        divMediaLightbox.setAttribute("data-title",mediaData.title);
        
        const mediaType = mediaData.video ? "video" : "image";
        const media = new Media(mediaType, mediaData);
        const mediaElt = media.createElementInLightbox();
        divMediaLightbox.appendChild(mediaElt);

        const mediaEventType = mediaData.video ? "loadedmetadata" : "load";
        mediaElt.style.opacity = 0;
        mediaElt.addEventListener(mediaEventType, function() { 
            titleMediaLightbox.style.opacity = 1;
            mediaElt.style.opacity = 1;
            divMediaLightbox.style.background = "none";
        });
  
        let titleMediaLightbox = document.createElement("span");
        titleMediaLightbox.textContent = mediaData.title;
        titleMediaLightbox.classList.add("lightbox-imgfull__title");
        divMediaLightbox.appendChild(titleMediaLightbox);
        titleMediaLightbox.style.opacity = 0; 
        lightBoxContent.insertBefore(divMediaLightbox, firstChildLightboxContent);
    }
  }

/**
 * Function to get photographers and media Datas and update html (on promises)
 */
function loadLightbox() {
  getData(urlData,'media')
  .then(extractData => filterData(extractData,filtersDataMedia))
  .then(extractData => (createLightbox(extractData)))
}

//Load Lightbox (after LoadData)
loadLightbox();

export {openLightbox, showMediaIndex} 
