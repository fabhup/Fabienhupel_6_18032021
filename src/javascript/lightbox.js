// DOM Elements variables
const mainContentElement = document.getElementById('main-content');
const mainHeaderElement = document.getElementsByClassName('header')[0];
const lightboxElement = document.getElementById("lightbox");
const firstChildLightboxContent = document.getElementById('lightbox-content').firstChild;

/**
 * Function to create Lightbox depending on mediasData extracted
 * @param {object} mediasData 
 */
function createLightbox(mediasData) {
  const urlImagesMedia = "./public/images/photographers/medias/";
  const urlImagesMediaPhotographerLarge = urlImagesMedia + "large/" + getParameterByName('id') + '/';
  const lightBoxContent = document.getElementById('lightbox-content');

  for (mediaIndex in mediasData) {
      
      const mediaData = mediasData[mediaIndex]
   
      let divMediaLightbox = document.createElement("div");
      divMediaLightbox.classList.add("lightbox-imgfull");
      divMediaLightbox.style.background = "url('../public/images/LoadSpinner.gif') no-repeat";
      divMediaLightbox.style.backgroundPosition = "center";

      if (mediaData.image) {
          let imgMediaLightbox = document.createElement("img");
          imgMediaLightbox.setAttribute("alt", mediaData.title);
          imgMediaLightbox.setAttribute("aria-label",mediaData.title);
          imgMediaLightbox.setAttribute("tabindex","0");
          imgMediaLightbox.classList.add("lightbox-imgfull__media");
          imgMediaLightbox.setAttribute("src",(urlImagesMediaPhotographerLarge + mediaData.image));
          imgMediaLightbox.setAttribute("onerror",`this.src='${urlImagesMedia}image-not-found.jpg'`);            
          divMediaLightbox.appendChild(imgMediaLightbox);
          imgMediaLightbox.style.opacity = 0;
          imgMediaLightbox.addEventListener("load", function() 
              { titleMediaLightbox.style.opacity = 1;
                imgMediaLightbox.style.opacity = 1;
                divMediaLightbox.style.background = "none";
              }
          );
      }
      else if (mediaData.video) {
          let videoMediaLightbox = document.createElement("video");
          videoMediaLightbox.setAttribute("alt", mediaData.title);
          videoMediaLightbox.setAttribute("role", "video");
          videoMediaLightbox.setAttribute("aria-label",mediaData.title);
          videoMediaLightbox.setAttribute("tabindex","0");
          videoMediaLightbox.classList.add("lightbox-imgfull__media");
          videoMediaLightbox.setAttribute("src",(urlImagesMediaPhotographerLarge + mediaData.video + '#t=0.1'));
          videoMediaLightbox.setAttribute("controls","controls");
          videoMediaLightbox.setAttribute("onerror",`this.src='${urlImagesMedia}image-not-found.jpg'`);
          videoMediaLightbox.setAttribute("onclick",'moveIndex(1);');
          divMediaLightbox.appendChild(videoMediaLightbox);
          videoMediaLightbox.style.opacity = 0;
          videoMediaLightbox.addEventListener("loadedmetadata", function() 
              { titleMediaLightbox.style.opacity = 1;
                videoMediaLightbox.style.opacity = 1;
                divMediaLightbox.style.background = "none";
              }
          );
      } 

      let titleMediaLightbox = document.createElement("span");
      titleMediaLightbox.textContent = mediaData.title;
      titleMediaLightbox.classList.add("lightbox-imgfull__title");
      divMediaLightbox.appendChild(titleMediaLightbox);
      titleMediaLightbox.style.opacity = 0; 
      lightBoxContent.insertBefore(divMediaLightbox, firstChildLightboxContent);
  }
  selectTagFromUrl();
}

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
    const imagesLightbox = document.getElementsByClassName("lightbox-imgfull");
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