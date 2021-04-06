// DOM Elements variables
const mainContentElement = document.getElementById('main-content');
const mainHeaderElement = document.getElementsByClassName('header')[0];
const lightboxElement = document.getElementById("lightbox");

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