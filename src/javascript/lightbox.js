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
  lightboxElement.focus  () ;
}
  
  // Close the LightBox Gallery
  function closeLightbox() {
    lightboxElement.style.display = "none";
    mainContentElement.setAttribute("aria-hidden","false");
    mainHeaderElement.setAttribute("aria-hidden","false");
  }
  
let mediaIndex = 0;
showMediaIndex(mediaIndex);

/**
 * Show the media with index n   
 * @param {number} n -- 1 for next index and -1 for previous index 
 */
function showMediaIndex(n) {
    mediaIndex = Number(n);
    const imagesLightbox = document.getElementsByClassName("lightbox-imgfull");
    let indexFirstImageLightbox = 0;
    let indexLastImageLightbox = 0;
    let cptImageLightbox = 0;
    // check for index of the first and last visible image
    for (let i = 0; i < imagesLightbox.length; i++) {  
      if (!imagesLightbox[i].classList.contains('hidden')) {
        cptImageLightbox++;
        if (cptImageLightbox==1) {indexFirstImageLightbox = i}
        indexLastImageLightbox = i
      }
    }
    if (n > imagesLightbox.length-1) {mediaIndex = indexFirstImageLightbox} // go to first image if n > imagesLightbox.length-1
    if (n < indexFirstImageLightbox) {mediaIndex = indexLastImageLightbox} // go to last image if n < indexFirstImageLightbox
    for (let i = 0; i < imagesLightbox.length; i++) {
        (i!=mediaIndex) ? imagesLightbox[i].style.display = "none" : imagesLightbox[i].style.display = "block";
    }
}

// Next/previous controls
/**
 * Move to the previous or next index 
 * @param {number} n --expected 1 for next index and -1 for previous index 
 */
function moveIndex(n) {
    const imagesLightbox = document.getElementsByClassName("lightbox-imgfull");
    if (n>0) { // if next index is hidden, move to the next visible index
      for (let i = mediaIndex + n; i < imagesLightbox.length; i++) {
        if (imagesLightbox[i].classList.contains('hidden')) {n+=1;}
        else { break;}
      }
    }
    else if (n<0) { // if previous index is hidden, move to the previous visible index
      for (let i = mediaIndex + n; i>0; i--) {
        if (imagesLightbox[i].classList.contains('hidden')) {n-=1;}
        else {break;}
      }
    }
    showMediaIndex(mediaIndex += n);
    imagesLightbox[mediaIndex].firstChild.focus(); //move focus to image active for quit button focus
}

// Lightbox Event Keyboard
lightboxElement.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") { // event for left arrow (previous media)
    event.preventDefault();
    moveIndex(-1);       
  }
  else if (event.key === "ArrowRight") { // event for right arrow (next media)
    event.preventDefault();
    moveIndex(1);          
  }
  else if (event.key === "Escape") {
    event.preventDefault();
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
        divMediaLightbox.style.background = "url('./public/images/LoadSpinner.gif') no-repeat";
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


//Events for move to previous or nexct media on swipe right and left 
lightboxElement.addEventListener('touchstart', handleTouchStart);        
lightboxElement.addEventListener('touchmove', handleTouchMoveX);

var xDown = null;                                                        

function handleTouchStart(evt) {                                         
    xDown = evt.originalEvent.touches[0].clientX;                                      
}                                               

function handleTouchMoveX(evt) {
    if ( ! xDown ) {
        return;
    }

    var xUp = evt.originalEvent.touches[0].clientX;                                    

    var xDiff = xDown - xUp;

    if ( xDiff > 0 ) {
            /* left swipe */ 
            moveIndex(1)
    } 
    else {
        /* right swipe */
        moveIndex(-1)
    }                        
    /* reset values */
    xDown = null;
}

export {openLightbox, showMediaIndex} 
