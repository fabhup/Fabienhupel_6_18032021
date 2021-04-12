// DOM Elements variables
const dropdown = document.getElementById("dropdown-content");
const dropdownList = document.getElementById("dropdown-list");
const dropdownOptions = document.querySelectorAll(".dropdown-option"); 

// Variables declaration
const formatSortingOptions = {
  "likes": {format: "number", order: "desc"},
  "date": {format: "string", order: "desc"},
  "title": {format: "string", order: "asc"}
};

 /**
 * Function to sortHTMLElements according to the keySort choice, formatSort and orderSort
 * @param {string} keySort 
 * @param {string} formatSort -- ex : 'number', 'string'
 * @param {string} orderSort -- ex : 'asc', 'desc'
 */
function sortData(keySort, formatSort, orderSort='asc') {
  const photographerGallery = document.getElementById('photographer-gallery');
  const mediasElements = document.getElementsByClassName('thumb-imgfull');
  let mediasElementsArray = [];
  for (var i in mediasElements) {
      if (mediasElements[i].nodeType == 1) { 
          mediasElementsArray.push(mediasElements[i]);
      }
  }

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

  for (const el in mediasElementsArray) {
      photographerGallery.appendChild(mediasElementsArray[el]);
  }
}

//Function to change attributes when dropdown is closed
function closeDropdown() {
  if (dropdown.getAttribute("aria-expanded") == "true") {
    dropdown.setAttribute("aria-expanded", "false");
  }
} 

/**
 * Function for manage event on dropdown Element options
 * 
 * @param {element} element 
 */
function dropdownEvent(element) {
  //open dropdown if is not open
  if (dropdown.getAttribute("aria-expanded") == "false") {
    dropdown.setAttribute("aria-expanded", "true");
  }

  //if dropdown is already open select 
  else if (dropdown.getAttribute("aria-expanded") == "true") {

    dropdownOptions.forEach((elt) => { // set aria-selected false on all options element
      elt.setAttribute("aria-selected","false");
    })
    element.setAttribute("aria-selected","true"); // set aria-selected true on option element clicked

    const sortActive = element.getAttribute('data-value'); 
    sortData(sortActive,formatSortingOptions[sortActive].format,formatSortingOptions[sortActive].order,); // sortData on sortActive option according to formatSortingOptions 
    
    element.parentElement.insertBefore(element, element.parentElement.firstChild); // Move clicked element at first position of list for order navigation
    element.parentElement.setAttribute("aria-activedescendant",element.getAttribute("id")) // update aria-activedescendant 

    // dropdown.setAttribute("aria-expanded", "false"); 
    closeDropdown()
    
  }
}

//Click Event on dropdownOptions
dropdownOptions.forEach((element) => element.addEventListener("click", event => {
  event.stopPropagation();
  dropdownEvent(event.target);
  dropdownList.focus();
}));  

//Keyboards Events on dropdownOptions
dropdownOptions.forEach((element) => element.addEventListener("keypress", event => {
  event.preventDefault();
  if (event.keyCode == 32) { // event for space key 
    dropdownEvent(event.target);          
  }
}));
dropdownOptions.forEach((element) => element.addEventListener("keyup", event => {
  event.preventDefault();
  if (event.keyCode == 13 ) { // event for enter key
    dropdownEvent(event.target);     
  }
}));

//FocusOut Event on dropdown (to close it when focus is outside the dropdown)
dropdown.addEventListener("focusout",function(event) { 
  if (this.contains(event.relatedTarget)) {
    // don't react to this
    return;
  }
  closeDropdown()
});

//Click Event on dropdown (to open or close it)
dropdown.addEventListener("click",function() {
  if (dropdown.getAttribute("aria-expanded") == "false") {
    dropdown.setAttribute("aria-expanded", "true");
  }
  else if (dropdown.getAttribute("aria-expanded") == "true") {
    dropdown.setAttribute("aria-expanded", "false");
  }
  dropdownList.focus();
});