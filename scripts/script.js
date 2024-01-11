const API_URL = "https://api.genderize.io/?name=";

// Event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeForm);

// Function to initialize the form and set up event listeners
function initializeForm() {
  const formValues = { name: "", gender: undefined };

  const elements = {
    nameInput: document.querySelector("#name"),
    form: document.querySelector("#form"),
    saveButton: document.querySelector("#save"),
    genderTxt: document.querySelector("#gender-txt"),
    genderVal: document.querySelector("#gender-val"),
    saved: document.querySelector("#saved-answer"),
    clearButton: document.querySelector("#clear"),
    error: document.querySelector("#error"),
  };

  // Event listener to update the name when input changes
  elements.nameInput.addEventListener("input", updateName);

  // Event listener to update the gender when radio button changes
  elements.form.addEventListener("change", updateGender);

  // Event listener for form submission
  elements.form.addEventListener("submit", handleFormSubmission);

  // Event listener for saving form data to localStorage
  elements.saveButton.addEventListener("click", saveFormData);

  // Event listener for clearing saved data from localStorage
  elements.clearButton.addEventListener("click", clearSavedData);

  // Function to update the name in formValues
  function updateName(event) {
    formValues.name = event.target.value.trim();
  }

  // Function to update the gender in formValues
  function updateGender() {
    formValues.gender = document.querySelector('input[name="gender"]:checked')?.value;
  }

  // Function to handle form submission
  function handleFormSubmission(event) {
    event.preventDefault();
    const lastName = formValues.name;
    displayError("");

    if (!formValues.name) {
      displayError("Please enter a name.");
      return;
    }

    if (!formValues.name.match(/^[a-zA-Z]{1,254}$/)) {
      displayError("Name must only contain letters and be less than 255 characters.");
      return;
    }

    elements.genderTxt.textContent = "Loading...";
    elements.genderVal.textContent = "Loading...";

    fetchGender(formValues.name, lastName);
  }

  // Function to save form data to localStorage
  function saveFormData() {
    if (formValues.gender && formValues.name) {
      localStorage.setItem(formValues.name, formValues.gender);
      elements.saved.textContent = `Saved: ${formValues.gender}`;
      displayError("");
    } else {
      displayError("Please complete the form to save.");
    }
  }

  // Function to clear saved data from localStorage
  function clearSavedData() {
    const lastName = formValues.name;
    if (localStorage.getItem(lastName)) {
      localStorage.removeItem(lastName);
      elements.saved.textContent = "Cleared";
      displayError("");
    }
  }

  // Function to fetch gender data from the API
  function fetchGender(name, lastName) {
    fetch(`${API_URL}${name}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (data.name === null) throw new Error("Name not available");
        if (data.probability === 0) displayError(`The name ${name} is not available!`);

        elements.genderTxt.textContent = data.gender || "Not available";
        elements.genderVal.textContent = (data.probability * 100).toFixed(2) + "%" || "0%";
        elements.saved.textContent = localStorage.getItem(lastName) || "No data";
      })
      .catch((error) => {
        displayError(`Error: ${error.message}`);
        elements.genderTxt.textContent = "Gender";
        elements.genderVal.textContent = "Probability";
      });
  }

  // Function to display error messages
  function displayError(message) {
    elements.error.textContent = message;
    elements.error.style.display = message ? "block" : "none";
  }
}

