var predictedGender = null

document.addEventListener('DOMContentLoaded', function () {
    var clearRadioBtn = document.getElementById("clearRadioBtn");
    var radioGroup = document.querySelectorAll('input[name="genderChoice"]');
    radioGroup.forEach(function (radio) {
        radio.addEventListener('click', function () {
            clearRadioBtn.style.display = 'block';
        });
    });

    var nameInput = document.getElementById("nameInput");
    nameInput.addEventListener("input", function () {
        predictedGender = 'invalid';
    });

});

function validateNameInput() {
    var nameInput = document.getElementById("nameInput").value;
    var submitButton = document.getElementById("submitButton");

    if (nameInput.trim() !== "") {
        submitButton.removeAttribute("disabled");
    } else {
        submitButton.setAttribute("disabled", "disabled");
    }
}

async function submitForm() {
    var resultContainer = document.getElementById('resultContainer');
    var nameInput = document.getElementById("nameInput").value;
    var savedResult = localStorage.getItem(nameInput);

    resultContainer.innerHTML = ''
    document.getElementById("savedResult").style.display = "none";
    predictedGender = null

    try {
        const response = await fetch(`https://api.genderize.io/?name=${nameInput}`);
        const data = await response.json();
        if (data.error) {
            displayMessage(data.error, 'error');
        } else if (!data.gender) {
            displayMessage("Gender not found. Please try again.", 'error');
        } else {
            resultContainer.innerHTML = `<h3>${data.gender}</h3>
                                <h3>${data.probability}</h3>`;
            predictedGender = data.gender;
        }
    } catch (error) {
        displayMessage("An error occurred. Please try again.", 'error');
    }

    if (savedResult) {
        document.getElementById("savedResult").style.display = "inline-block";
        document.getElementById("savedAnswer").innerText = savedResult
        document.getElementById("clearButton").style.display = "inline-block";
    }
}


function saveResult() {
    var nameInput = document.getElementById("nameInput").value;

    var genderChoice = "";
    if (document.getElementById("male").checked) {
        genderChoice = "male";
    } else if (document.getElementById("female").checked) {
        genderChoice = "female";
    }

    if (nameInput && genderChoice) {
        localStorage.setItem(nameInput, genderChoice);
        displayMessage("Chosen Gender saved!", 'success');
    } else if (nameInput && predictedGender) {
        if (predictedGender === 'invalid') {
            displayMessage("In order to save prediction, submit the name!", 'error');

        } else {
            localStorage.setItem(nameInput, predictedGender);
            displayMessage("Predicted Gender Saved!", 'success');
        }
    } else {
        displayMessage("Name or gender is missing", 'error');
    }
}

function displayMessage(message, type) {
    var messageElement;

    if (type === "success") {
        messageElement = document.getElementById("successMessage");
    } else if (type === "error") {
        messageElement = document.getElementById("errorMessage");
    }
    messageElement.textContent = message;
    messageElement.style.opacity = 1;
    setTimeout(function () {
        messageElement.style.opacity = 0;
    }, 2000);
}

function clearSavedChoice() {
    var nameInput = document.getElementById("nameInput").value;
    localStorage.removeItem(nameInput);
    document.getElementById("clearButton").style.display = "none";
    document.getElementById("savedResult").style.display = "none";
    displayMessage('Saved choice cleared!', 'success');
}


function clearRadios() {
    var clearRadioBtn = document.getElementById("clearRadioBtn");

    var radioGroup = document.querySelectorAll('input[name="genderChoice"]');
    radioGroup.forEach(function (rb) {
        rb.checked = false;
    });
    clearRadioBtn.style.display = 'none';


}