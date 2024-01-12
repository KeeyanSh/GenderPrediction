// Variable to store the prediction which is fetched
var predictedGender = null;

// Event listener when the document is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Get required elements
    var clearRadioBtn = document.getElementById("clearRadioBtn");
    var radioGroup = document.querySelectorAll('input[name="genderChoice"]');
    var nameInput = document.getElementById("nameInput");

    // Add click event listener to each radio button
    radioGroup.forEach(function (radio) {
        radio.addEventListener('click', function () {
            // after a radio button is chosen, the clear button must be displayed
            clearRadioBtn.style.display = 'block';
        });
    });

    // add event listener for name input being changed
    nameInput.addEventListener("input", function () {
        // if the name input is altered and submission is not made yet,
        // the previous prediction result must not be accessible to be saved on mistake
        predictedGender = 'invalid';
    });
});

// Function to validate name input for enabling/disabling submit button
function validateNameInput() {
    // Get required elements
    var nameInput = document.getElementById("nameInput").value.toLowerCase();
    var submitButton = document.getElementById("submitButton");

    // the name input must not be empty
    // other validations are mentioned in html code
    if (nameInput.trim() !== "") {
        submitButton.removeAttribute("disabled");
    } else {
        submitButton.setAttribute("disabled", "disabled");
    }
}

// Async function to submit the form and fetch prediction result
async function submitForm() {
    // Get required elements
    // prediction result container
    var resultContainer = document.getElementById('resultContainer');
    var nameInput = document.getElementById("nameInput").value.toLowerCase();
    // saved result for the input
    var savedResult = localStorage.getItem(nameInput);

    // Clear previous results and reset predictedGender for now
    resultContainer.innerHTML = '';
    document.getElementById("savedResult").style.display = "none";
    predictedGender = null;

    try {
        // Fetch prediction result from API
        const response = await fetch(`https://api.genderize.io/?name=${nameInput}`);
        const data = await response.json();

        // Check for errors in the response
        if (data.error) {
            displayMessage(data.error, 'error');
        }
        // check if any gender is specified
        else if (!data.gender) {
            displayMessage("Gender not found. Please try again.", 'error');
        } else {
            // Display prediction result
            resultContainer.innerHTML = `<h3>${data.gender}</h3>
                                <h3>${data.probability}</h3>`;

            // assign the predicted gender to predictedGender
            // predictedGender can be used to save the predicted result
            predictedGender = data.gender;
        }
    } catch (error) {
        displayMessage("An error occurred. Please try again.", 'error');
    }

    // Display previously saved result if available
    if (savedResult) {
        // display the block
        document.getElementById("savedResult").style.display = "inline-block";
        // display the saved gender
        document.getElementById("savedAnswer").innerText = savedResult;
        // display the clear button for saved redult
        document.getElementById("clearButton").style.display = "inline-block";
    }
}

// Function to save the result based on user input or prediction
function saveResult() {
    var nameInput = document.getElementById("nameInput").value.toLowerCase();

    // Get the selected gender choice from radio buttons
    var genderChoice = "";
    if (document.getElementById("male").checked) {
        genderChoice = "male";
    } else if (document.getElementById("female").checked) {
        genderChoice = "female";
    }

    // Save the result based on user input or prediction
    // if there is an input and a radio btn is chosen, we can save the choice
    if (nameInput && genderChoice) {
        localStorage.setItem(nameInput, genderChoice);
        displayMessage("Chosen Gender saved!", 'success');
    }
    // if there is an input and no radio btn is chosen, and a prediction is made, we can save the prediction
    else if (nameInput && predictedGender) {
        // if predictedGender is equal to 'invalid',
        // it means that the input is altered and the prediction does not belong to it
        if (predictedGender === 'invalid') {
            displayMessage("In order to save prediction, submit the name!", 'error');
        }
        // otherwise, we can save the prediction
        else {
            localStorage.setItem(nameInput, predictedGender);
            displayMessage("Predicted Gender Saved!", 'success');
        }
    }
    // If any of the above conditions are not met, we display an error
    else {
        displayMessage("Name or gender is missing", 'error');
    }
}

// Function to display messages with success/error styling
function displayMessage(message, type) {
    var messageElement;
    // the 'type' parameter specifies the color of the message
    // we have different containers for each type
    if (type === "success") {
        messageElement = document.getElementById("successMessage");
    } else if (type === "error") {
        messageElement = document.getElementById("errorMessage");
    }

    // Set message content and opacity
    // show and hide will be done with the transition specified in styles file
    messageElement.textContent = message;
    messageElement.style.opacity = 1;

    // Hide the message after a delay
    setTimeout(function () {
        messageElement.style.opacity = 0;
    }, 2000);
}

// Function to clear the saved choice for a name
function clearSavedChoice() {
    var nameInput = document.getElementById("nameInput").value.toLowerCase();
    // removing the data from local storage
    localStorage.removeItem(nameInput);
    // hiding the container and clear button that are related to saved results
    document.getElementById("clearButton").style.display = "none";
    document.getElementById("savedResult").style.display = "none";
    // display a message
    displayMessage('Saved choice cleared!', 'success');
}

// Function to clear the selected radio
function clearRadios() {
    var clearRadioBtn = document.getElementById("clearRadioBtn");

    // Get all radio buttons in the group and uncheck them
    var radioGroup = document.querySelectorAll('input[name="genderChoice"]');
    radioGroup.forEach(function (rb) {
        rb.checked = false;
    });

    // Hide the clear radio button as there is not any chosen radio buttons anymore
    clearRadioBtn.style.display = 'none';
}
