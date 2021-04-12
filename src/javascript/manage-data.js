/**
 * Function to Extract Data from an url of json file
 * @param {string} urlJSON 
 * @param {string} dataToExtract 
 */
const getData = (urlJSON, dataToExtract) => {
    return fetch(urlJSON)
      .then((response) => response.json())
    //   .catch((errorFetch) => console.log(`Erreur réseau avec l'url ${url}`, errorFetch))
      .then(jsonResponse => {
          return jsonResponse[dataToExtract]
      })
    //   .catch(errorGetMedia => console.log("Requête invalide", errorGetMedia))
  }

/**
 * Function to extract a parameter value in an url from the name of the parameter
 * 
 * @param {string} name 
 * @param {string} url 
 * @return {string}
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
        name = name.replace(/[[]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Filter data parameter on each filters parameters 
 * @param {object} data 
 * @param {object} filters -- ex {"id": 112}
 */
const filterData = (data, filters) => (data.filter(data => 
    Object.keys(filters).every(key => filters[key](data[key]))))

/**
 * function that display or hide html elements depending on selected tag button 
 * 
 */
function filterMediasOnSelectedTag() {
    const eltClasses = this.className.split(' ');
    const selectedTagName = eltClasses.filter(x => x.startsWith('btn-tag--'))[0].replace('btn-tag--','');
    const medias = document.querySelectorAll('.thumb-imgfull, .lightbox-imgfull');
    const buttonsTagsPressed = document.querySelectorAll('button[class~="btn-tag"][aria-pressed="true"]');
    const url = new URL(window.location.href);
    
    if (this.getAttribute('aria-pressed')=="true") {
        medias.forEach((media) => { 
            media.classList.remove('hidden')
        })
        url.searchParams.delete('tag'); //update url : delete tag parameter
    }
    else {
        this.setAttribute('aria-pressed',"true");
        medias.forEach((media) => { 
            media.classList.remove('hidden');
            if (media.getAttribute('data-tags') != selectedTagName) {
                media.classList.add('hidden')
            }
        })
        url.searchParams.set('tag', selectedTagName); //update url with new tag parameter
    }
    buttonsTagsPressed.forEach((buttonElement) => { 
        buttonElement.setAttribute('aria-pressed',"false");
    })
    this.blur(); // to make the focus disappear
    window.history.replaceState(null, null, url); // or pushState
}

/**
 * Function to apply filter on tag if its in url parameter
 */
function selectTagFromUrl() {
    try {
        const searchTagId = "btn-tag--" + getParameterByName('tag');
        const selectedTagButtonElement = document.getElementById(searchTagId);
        selectedTagButtonElement.click();
    }
    catch {   //nothing to do if no tag detected in url
    }
  }

  export {getData, getParameterByName, filterData, filterMediasOnSelectedTag, selectTagFromUrl};


