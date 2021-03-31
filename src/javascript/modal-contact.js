
// DOM Elements variables

const modalContact = document.getElementById('modal-contact');
const modalContactForm = document.getElementById('modal-contact__form');
const modalContactContent = document.getElementById('modal-contact__content');
const modalContactCloseMessage = document.getElementById('modal-contact__message');
const btnOpenModalContact = document.getElementById('btn-contact');

// Input Elements
const firstnameInput = document.getElementById("firstname");
const lastnameInput = document.getElementById("lastname");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

// Messages Elements
const errorFirstnameLength = "Veuillez entrer 2 caractères ou plus pour le champ du prénom.";
const errorLastnameLength = "Veuillez entrer 2 caractères ou plus pour le champ du nom.";
const errorEmailFormat = "Veuillez saisir un email valide.";
const errorMessageLength = "Veuillez entrer un message de 10 caractères minimum.";

// Regex Formats
const emailRegexFormat = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

// Classes Validation Objects
  let arrayInputValidationInstances = [];
  
  /**
   * class InputValidation : class to create objects for validate value of an inputElement  
   * */
  class InputValidation {
    /**
     * @param {element} inputElement [input element of the DOM]
     * @param {function} validationTest [function applied for the input validation (must return a boolean]
     * @param {string} errorMessage [string message to display if validationTest is false]
     */
    constructor(inputElement, validationTest, errorMessage) {
      this.inputElement = inputElement;
      this.validationTest = validationTest;
      this.errorMessage = errorMessage;
      arrayInputValidationInstances.push(this);
    }
  }

// Functions for data validation
/**
 * function isValidLength() : function to check if the length of a string is between minLength and maxLength
 *
 * @param {string} string
 * @param {number} minLength
 * @param {number} maxLength
 * @return {boolean}
 */
function isValidLength(string, minLength, maxLength) {
    return string.length >= minLength && string.length <= maxLength;
  }
  
  /**
   * function isValidRegex() : function to check if a string respects a regex format
   *
   * @param {string} string
   * @param {string} regexFormat
   * @return {boolean}
   */
  function isValidRegex(string, regexFormat) {
    return regexFormat.test(string);
  }

  /**
 * function addErrorMessageInput() : function to add an Error Message after an input Element
 *
 * @param {element} inputElement
 * @param {string} errorMessage
 */
function addErrorMessageInput(inputElement, errorMessage) { 
    const errorMessageElement = document.createElement("span");
    errorMessageElement.textContent = errorMessage;
    errorMessageElement.classList.add("input-error");
    inputElement.parentNode.insertBefore(errorMessageElement, inputElement.nextSibling);
}
  
/**
 * function removeErrorMessageInput() : function to remove an Error Message after an input Element
 *
 * @param {element} inputElement
 */
function removeErrorMessageInput(inputElement) {
if (inputElement.nextSiblingElement.classList.contains("input-error")) {
    inputElement.nextSiblingElement.remove();
}
}

/**
 * function removeElements() : function to remove all elementsin an array
 */
const removeElements = (elms) => elms.forEach(el => el.remove());

// Functions to Launch or Close Modal Contact
function openModalContact() {
    modalContact.style.display = "flex";
    modalContactContent.style.display = "block";
    removeElements(document.querySelectorAll(".input-error"));
    modalContactForm.reset();
}
function closeModalContact() {
    modalContact.style.display = "none";
    modalContactCloseMessage.style.display = "none";
    modalContactContent.style.display = "none";
}

// Event on submit of the modal contact form (submit event)
modalContactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // declaration and initialization of variables 
  arrayInputValidationInstances = [];
  let isValidForm = true;
  
  // creation of InputValidation objects
  let FirstnameValidation = new InputValidation(
    firstnameInput,
    isValidLength(firstnameInput.value, 2, 99),
    errorFirstnameLength
  );

  let LastnameValidation = new InputValidation(
    lastnameInput,
    isValidLength(lastnameInput.value, 2, 99),
    errorLastnameLength
  );

  let EmailValidation = new InputValidation(
    emailInput,
    isValidRegex(emailInput.value, emailRegexFormat),
    errorEmailFormat
  );

  let MessageValidation = new InputValidation(
    messageInput,
    isValidLength(messageInput.value, 10, 300),
    errorMessageLength
  );

    /* loop to test each validationTest
    - if the validationTest is true : the function removeErrorMessageInput() is applied on the inputElement 
    - if the validationTest is false : the function addErrorMessageInput() is applied on the inputElement
    - if at least one validation is false : isValidForm is false
  */   
  removeElements(document.querySelectorAll(".input-error"));

  for (let InputValidationInstance of arrayInputValidationInstances) {
      if (!InputValidationInstance.validationTest) {
        addErrorMessageInput(
          InputValidationInstance.inputElement,
          InputValidationInstance.errorMessage
        );
        isValidForm = false;
      }
  }
  // if isValidForm is true : the function displayConfirmMessageModal() is applied  
  if (isValidForm) {
    const inputs = document.getElementsByClassName("form-input");
    for(var i = 0; i < inputs.length; i++) {
        console.log(inputs[i].labels[0].textContent + " : " + inputs[i].value)
    };
    modalContactCloseMessage.style.display = "flex";
    modalContactContent.style.display = "none";
  }

})