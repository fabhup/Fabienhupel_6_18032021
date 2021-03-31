
/**
 * Function to Extract Data from an url of json file
 * @param {string} urlJSON 
 * @param {string} dataToExtract 
 */
const getData = (urlJSON, dataToExtract) => {
    return fetch(urlJSON)
      .then((response) => response.json())
      .catch((errorFetch) => console.log(`Erreur réseau avec l'url ${url}`, errorFetch))
      .then(jsonResponse => {
          return jsonResponse[dataToExtract]
      })
      .catch(errorGetMedia => console.log("Requête invalide", errorGetMedia))
  }
  
  /**
   * Filter data parameter on each filters parameters 
   * @param {object} data 
   * @param {object} filters -- ex {"id": 112}
   */
  const filterData = (data, filters) => (data.filter(data => 
      Object.keys(filters).every(key => filters[key](data[key]))))


/**
 * Function to extract a parameter value in an url from the name of the parameter
 * 
 * @param {string} name 
 * @param {string} url 
 * @return {string}
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}