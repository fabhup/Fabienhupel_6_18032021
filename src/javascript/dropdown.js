// DOM Elements variables
const dropdownOpened = document.getElementById("dropdown-opened");
const dropdownClosed = document.getElementById("dropdown-closed");
const dropdownOptions = document.querySelectorAll(".dropdown-option"); 
const dropdownLabel= document.getElementById("dropdown-label");

// Variables declaration
const formatSortingOptions = {
    "likes": "number",
    "date": "string",
    "title": "string"
  };

  /**
 * Function to sortHTMLElements according to the keySort choice, formatSort and orderSort
 * @param {string} keySort 
 * @param {string} formatSort -- ex : 'number', 'string'
 * @param {string} orderSort -- ex : 'asc', 'desc'
 */
function sortData(keySort, formatSort, orderSort='asc') {
    const mediasElements = document.getElementsByClassName('thumb-imgfull');
    let mediasElementsArray = [];
    for (var i in mediasElements) {
        if (mediasElements[i].nodeType == 1) { 
            mediasElementsArray.push(mediasElements[i]);
        }
    };
    mediasElementsArray.sort(function(a, b) {
      const aValue = a.getAttribute(`data-${keySort}`);
      const bValue = b.getAttribute(`data-${keySort}`);
      
      if (formatSort == 'number' && orderSort == 'asc') { 
        return aValue - bValue;
      }
      else if (formatSort == 'number') {
        return bValue - aValue; 
      }
      else if (formatSort != 'number' && orderSort =='asc') {
        if (aValue < bValue) {return -1}
        else if (aValue > bValue) {return 1}
        else {return 0}
      }
      else {
        if (aValue > bValue) {return -1}
        else if (aValue < bValue) {return 1} 
        else {return 0}
      }
    });

    for (el in mediasElementsArray) {
        photographerGallery.appendChild(mediasElementsArray[el]);
    };
  }


  //Events on dropdown elements

//Event to display or hide dropdownOpened element on click
dropdownOpened.addEventListener("click", function() {
    dropdownOpened.style.display = 'none';
    dropdownClosed.style.display = 'flex';
})

//Event to display or hide dropdownClosed element on click
dropdownClosed.addEventListener("click", function() {
    dropdownClosed.style.display = 'none';
    dropdownOpened.style.display = 'flex';
    console.log(document.querySelector('[class="dropdown-option selected"]'));
    document.querySelector('[class="dropdown-option selected"]').focus();
})

//Events to sort or hide dropdownClosed element on click
dropdownOptions.forEach((element) =>    
    element.addEventListener("click", function() {
        dropdownLabel.textContent = element.textContent;  // update textContent of dropdownLabel
        dropdownOptions.forEach((elt) => elt.classList.remove('selected')) // remove selected class of dropdownOptions elements
        element.classList.add('selected'); // add selected class on current element
        const sortActive = element.getAttribute('data-value');
        sortData(sortActive,formatSortingOptions[sortActive],"desc"); // sortData on sortActive option according to formatSortingOptions 
    })
);