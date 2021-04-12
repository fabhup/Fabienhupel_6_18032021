
const urlImagesMedia = "./public/images/photographers/medias/";
const urlImagesMediaPhotographerSmall = urlImagesMedia + "small/" + getParameterByName('id') + '/';
const urlImagesMediaPhotographerLarge = urlImagesMedia + "large/" + getParameterByName('id') + '/';

/**
 * function that display or hide html elements depending on selected tag button 
 * 
 */
const Image = function({ title, image }) {
    this.title = title || "Titre inconnu";
    this.image = image || "";
    this.type = "image"

    this.createElement = function() {
        const elt = document.createElement("img");
        elt.classList.add("thumb-img");
        elt.setAttribute("src",(urlImagesMediaPhotographerSmall + this.image));
        elt.setAttribute("onerror",`this.src='${urlImagesMedia}image-not-found.jpg'`);
        return elt;
    };

    this.createElementInLightbox = function() {
        const elt = document.createElement("img");
        elt.classList.add("lightbox-imgfull__media");
        elt.setAttribute("alt", this.title);
        elt.setAttribute("aria-label",this.title);
        elt.setAttribute("tabindex","0");
        elt.setAttribute("src",(urlImagesMediaPhotographerLarge + this.image));
        elt.setAttribute("onerror",`this.src='${urlImagesMedia}image-not-found.jpg'`);  
        return elt;
    };
  };

  const Video = function({ title, video }) {
    this.title = title || "Titre inconnu";
    this.video = video || "";
    this.type = "video"

    this.createElement = function() {
        const elt = document.createElement("video");
        elt.classList.add("thumb-img");
        elt.setAttribute("src",(urlImagesMediaPhotographerSmall + this.video + '#t=0.1'));
        elt.setAttribute("alt",this.title);
        elt.setAttribute("onerror",`this.src='${urlImagesMedia}image-not-found.jpg'`);
        return elt;
    };

    this.createElementInLightbox = function() {
        const elt = document.createElement("video");
        elt.classList.add("lightbox-imgfull__media");
        elt.setAttribute("alt", this.title);
        elt.setAttribute("role", "video");
        elt.setAttribute("aria-label",this.title);
        elt.setAttribute("tabindex","0");
        elt.setAttribute("src",(urlImagesMediaPhotographerLarge + this.video + '#t=0.1'));
        elt.setAttribute("controls","controls");
        elt.setAttribute("onerror",`this.src='${urlImagesMedia}image-not-found.jpg'`);  
        return elt;
    };
  };

const Media = function(type, mediaData) {
    if (type == "image") {
        return new Image(mediaData)
    }
    else if (type == "video") {
        return new Video(mediaData)
    }
};