const radioDivs = document.querySelectorAll(".query-type");
const formGroups = document.querySelectorAll(".form-group");
const formElement = document.querySelector("form");
const toast = document.querySelector(".after-message-sent");
let formValid = true;

formElement.setAttribute("novalidate", "");

// Functions

const changeRadioBg = () => {
  radioDivs.forEach(radioDiv => {
    const radio = radioDiv.querySelector("input");
    if (radio.checked) {
      radioDiv.classList.add("radio-selected");
    } else {
      radioDiv.classList.remove("radio-selected");
    }
  });
};

const displayError = (formGroup, errorClass) => {
  const errorMessage = formGroup.querySelector(errorClass);
  if (errorMessage) {
    errorMessage.classList.remove("message");
  }
};

const removeError = (formGroup) => {
  const errorMessages = formGroup.querySelectorAll(".error");
  errorMessages.forEach(error => {
    error.classList.add("message");
  });
};

const validateGroup = formGroup => {
  const input = formGroup.querySelector("input, textarea");
  if (!input) return;
  
  const inputType = input.type || "text";

  switch (inputType) {
    case "radio":
      let checked = false;
      const radioInputs = formGroup.querySelectorAll("input");
      radioInputs.forEach(input => {
        if (input.checked) checked = true;
      });
      if (!checked) {
        displayError(formGroup, ".error");
        formValid = false;
      }
      break;
      
    case "checkbox":
      if (!input.checked) {
        displayError(formGroup, ".error");
        formValid = false;
      }
      break;
      
    case "text":
    case "textarea":
      if (input.value.trim() === "") {
        displayError(formGroup, ".error");
        formValid = false;
      }
      break;
      
    case "email":
      const emailInput = formGroup.querySelector("input[type='email']");
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      if (emailInput.value.trim() === "") {
        displayError(formGroup, ".error:not(.email)");
        formValid = false;
      } else if (!emailPattern.test(emailInput.value)) {
        displayError(formGroup, ".email.error");
        formValid = false;
      }
      break;

    default:
      break;
  }
};

const displayToast = () => {
  setTimeout(() => {
    toast.classList.remove("message");
  }, 10);
  setTimeout(() => {
    toast.classList.add("message");
  }, 4000);
};

// Event listeners

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('showAfter-message-sent') === 'true') {
    displayToast();
    localStorage.removeItem('showAfter-message-sent');
  }
});

radioDivs.forEach(radioDiv => {
  radioDiv.addEventListener("click", () => {
    const radioInput = radioDiv.querySelector("input");
    radioInput.checked = true;
    changeRadioBg();
    removeError(radioDiv.parentElement.parentElement);
  });
});

formElement.addEventListener("submit", event => {
  event.preventDefault();
  formValid = true;

  formGroups.forEach(formGroup => {
    validateGroup(formGroup);
  });

  if (formValid) {
    localStorage.setItem('showAfter-message-sent', 'true');
    formElement.submit();
  }
});

formGroups.forEach(formGroup => {
  const inputs = formGroup.querySelectorAll("input, textarea");
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      removeError(formGroup);
    });

    input.addEventListener("blur", () => {
      validateGroup(formGroup);
    });
  });
});

toast.addEventListener("click", () => {
  toast.classList.add("message");
});