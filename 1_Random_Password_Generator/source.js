const passwordCharacters = {
    upperCaseCharacters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowerCaseCharacters: "abcdefghijklmnopqrstuvwxyz",
    numbers: "1234567890",
    symbols: "(<@.$!*&%+-_>)"
}

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

const generatePasswordButton = document.getElementById("generatePasswordButton");
const passwordTextField = document.getElementById("passwordTextField");
const passwordLengthField = document.getElementById("passwordLengthField");
const noOfUpperCaseField = document.getElementById("noOfUpperCaseField");
const noOfLowerCaseField = document.getElementById("noOfLowerCaseField");
const noOfDigitsField = document.getElementById("noOfDigitsField");
const noOfSymbolsField = document.getElementById("noOfSymbolsField");
const copyPasswordButton = document.getElementById("copyPasswordButton");
const resetButton = document.getElementById("resetButton");
const lengthValue = document.getElementById("lengthValue");
const upperValue = document.getElementById("upperValue");
const lowerValue = document.getElementById("lowerValue");
const digitValue = document.getElementById("digitValue");
const symbolValue = document.getElementById("symbolValue");
const strengthText = document.getElementById("strengthText");
const strengthMeter = document.getElementById("strengthMeter");

function generatePassword(passwordLength = 8, upperCase = 0, lowerCase = 0, digits = 0, symbols = 0) {
    var password = "";

    var validationResult = validateInputs(passwordLength, upperCase, lowerCase, digits, symbols);
    if (!validationResult) {
        showAlert("error", "Error", "Password requirements does not match the length");
        return null;
    }

    var neededChars = passwordLength - upperCase - lowerCase - digits - symbols;
    var zeroCharFields = getNoOfZero([passwordLength, upperCase, lowerCase, digits, symbols]);
    if (neededChars != 0) {
        if (upperCase == 0) {
            [upperCase, neededChars, zeroCharFields] = generateNoOfChars(neededChars, zeroCharFields);
        }
        if (lowerCase == 0) {
            [lowerCase, neededChars, zeroCharFields] = generateNoOfChars(neededChars, zeroCharFields);
        }
        if (digits == 0) {
            [digits, neededChars, zeroCharFields] = generateNoOfChars(neededChars, zeroCharFields);
        }
        if (symbols == 0) {
            [symbols, neededChars, zeroCharFields] = generateNoOfChars(neededChars, zeroCharFields);
        }
        if (neededChars != 0) {
            do {
                upperCase += 1; neededChars -= 1;
                if (neededChars == 0) { break; }

                lowerCase += 1; neededChars -= 1;
                if (neededChars == 0) { break; }

                symbols += 1; neededChars -= 1;
                if (neededChars == 0) { break; }

                digits += 1; neededChars -= 1;
                if (neededChars == 0) { break; }

            } while (neededChars != 0);
        }
    }

    password = getRandomChars(upperCase, passwordCharacters.upperCaseCharacters, true) + getRandomChars(lowerCase, passwordCharacters.lowerCaseCharacters, true) + getRandomChars(symbols, passwordCharacters.symbols, true) + getRandomChars(digits, passwordCharacters.numbers, true);
    password = shuffleCharacters(password);
    console.log(password);
    updatePasswordStrength(password);
    return password;

}

function getRandomChars(length, characters, repeatCharacter) {
    var randomCharacters = "";
    var charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        let randomChar = characters.charAt(Math.floor(Math.random() * charactersLength));

        console.log(randomChar);
        if (repeatCharacter && randomCharacters.includes(randomChar)) {
            i -= 1;
        }
        else {
            randomCharacters += randomChar;
        }
    }
    console.log(randomCharacters);
    return randomCharacters;
}

function generateNoOfChars(neededChars, zeroCharFields) {
    let nChars = Math.floor(neededChars / zeroCharFields);
    neededChars -= nChars;
    zeroCharFields--;
    return [nChars, neededChars, zeroCharFields];
}

function getNoOfZero(arr) {
    count = 0;
    arr.forEach(element => {
        if (isZero(element)) {
            count++;
        }
    });
    return count;
}

function isZero(element) {
    return (element == 0) ? true : false;
}

function validateInputs(passwordLength, upperCase, lowerCase, digits, symbols) {
    let total = upperCase + lowerCase + digits + symbols;
    console.log(total);
    if (passwordLength >= total) {
        return true;
    }
    else {
        return false;
    }
}

function shuffleCharacters(password) {
    var passwordArray = password.split("");

    for (let i = 0; i < password.length; i++) {
        let j = Math.floor(Math.random() * (i + 1));
        [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }

    return passwordArray.join("");
}

function copyToClipboard(text) {
    if (!text) return false;

    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();

    try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        return successful;
    } catch (err) {
        document.body.removeChild(textarea);
        return false;
    }
}

function showAlert(action, title, message) {
    if (action === "error") {
        toastr.error(title, message);
    }
    else if (action == "success") {
        toastr.success(title, message);
    }
}

function resetSettings() {
    passwordLengthField.value = 8;
    noOfUpperCaseField.value = 2;
    noOfLowerCaseField.value = 2;
    noOfDigitsField.value = 2;
    noOfSymbolsField.value = 2;

    lengthValue.textContent = 8;
    upperValue.textContent = 2;
    lowerValue.textContent = 2;
    digitValue.textContent = 2;
    symbolValue.textContent = 2;

    passwordTextField.value = "";
    updatePasswordStrength("");
}

function updatePasswordStrength(password) {
    if (!password) {
        strengthText.textContent = "None";
        strengthMeter.style.width = "0%";
        strengthMeter.style.background = "#ddd";
        return;
    }

    let strength = 0;

    // Length factor
    if (password.length >= 12) strength += 2;
    else if (password.length >= 8) strength += 1;

    // Character variety
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);

    const varietyCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSymbols].filter(Boolean).length;
    strength += varietyCount;

    // Common patterns (negative points)
    if (/(.)\1{2,}/.test(password)) strength -= 1; // Repeated characters
    if (/123|abc|qwerty|asdf/.test(password.toLowerCase())) strength -= 2; // Common patterns

    // Calculate percentage and set color
    let percentage = Math.min(100, Math.max(0, (strength / 6) * 100));

    let color;
    if (percentage < 40) {
        color = "#e74c3c";
        strengthText.textContent = "Weak";
    } else if (percentage < 70) {
        color = "#f39c12";
        strengthText.textContent = "Medium";
    } else if (percentage < 90) {
        color = "#3498db";
        strengthText.textContent = "Strong";
    } else {
        color = "#2ecc71";
        strengthText.textContent = "Very Strong";
    }

    strengthMeter.style.width = percentage + "%";
    strengthMeter.style.background = color;
}

document.addEventListener("DOMContentLoaded", () => {

    generatePasswordButton.addEventListener("click", () => {
        let lengthData = Number(passwordLengthField.value);
        let upperCaseData = Number(noOfUpperCaseField.value);
        let lowerCaseData = Number(noOfLowerCaseField.value);
        let digitsData = Number(noOfDigitsField.value);
        let symbolsData = Number(noOfSymbolsField.value);

        let password = generatePassword(lengthData, upperCaseData, lowerCaseData, digitsData, symbolsData);
        passwordTextField.value = password;
    });

    copyPasswordButton.addEventListener("click", () => {
        if (passwordTextField.value) {
            if (copyToClipboard(passwordTextField.value)) {
                showAlert("success", "Success", "Password copied to clipboard!");
            }
            else {
                showAlert("error", "Error", "Failed to copy password");
            }
        }
        else {
            showAlert("error", "Error", "No password to copy");
        }
    });

    resetButton.addEventListener("click", () => {
        resetSettings();
        showAlert("success", "Reset", "Settings have been reset to default");
    });

    passwordLengthField.addEventListener("change", () => {
        let val = passwordLengthField.value;
        lengthValue.textContent = val;
    })

    noOfUpperCaseField.addEventListener("change", () => {
        let val = noOfUpperCaseField.value;
        upperValue.textContent = val;
    })

    noOfLowerCaseField.addEventListener("change", () => {
        let val = noOfLowerCaseField.value;
        lowerValue.textContent = val;
    })

    noOfDigitsField.addEventListener("change", () => {
        let val = noOfDigitsField.value;
        digitValue.textContent = val;
    })

    noOfSymbolsField.addEventListener("change", () => {
        let val = noOfSymbolsField.value;
        symbolValue.textContent = val;
    })



});
