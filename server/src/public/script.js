// Function to retrieve an element by its ID using native JavaScript
const getById = (id) => {
  return document.getElementById(id);
};

// Retrieving DOM elements by their IDs
const password = getById("password");
const confirmPassword = getById("confirm-password");
const form = getById("form");
const container = getById("container");
const loader = getById("loader");
const button = getById("submit");
const error = getById("error");
const success = getById("success");

// Hiding error and success message elements initially
error.style.display = "none";
success.style.display = "none";
container.style.display = "none";

// Declaring variables to store token and userId
let token, userId;
// Regular expression for password validation
const passRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/;

// Event listener triggered when the DOM content is loaded
window.addEventListener("DOMContentLoaded", async () => {
  // Retrieving token and userId from URL parameters using Proxy
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
      return searchParams.get(prop);
    },
  });

  // Assigning token and userId from URL parameters
  token = params.token;
  userId = params.userId;

  // Fetching to verify the password reset token
  const res = await fetch("/auth/verify-pass-reset-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ token, userId }),
  });

  // Handling errors in token verification
  if (!res.ok) {
    const { error } = await res.json();
    loader.innerText = error;
    return;
  }

  // Hiding loader and displaying the container after successful token verification
  loader.style.display = "none";
  container.style.display = "block";
});

// Function to display error messages
const displayError = (errorMessage) => {
  success.style.display = "none";
  error.innerText = errorMessage;
  error.style.display = "block";
};

// Function to display success messages
const displaySuccess = (successMessage) => {
  error.style.display = "none";
  success.innerText = successMessage;
  success.style.display = "block";
};

// Function to handle form submission
const handleSubmit = async (evt) => {
  evt.preventDefault();

  // Validation checks for password and confirmation
  if (!password.value.trim()) {
    return displayError("Password is missing!");
  }

  if (!passRegex.test(password.value)) {
    return displayError(
      "Password is too simple, use alpha numeric with special characters!"
    );
  }

  if (password.value !== confirmPassword.value) {
    return displayError("Password do not match!");
  }

  // Disabling button and updating text during form submission
  button.disabled = true;
  button.innerText = "Please wait...";

  // Handling the submission to update the password
  const res = await fetch("/auth/update-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ token, userId, password: password.value }),
  });

  // Enabling button and resetting text after submission
  button.disabled = false;
  button.innerText = "Reset Password";

  // Handling errors in password update
  if (!res.ok) {
    const { error } = await res.json();
    return displayError(error);
  }

  // Displaying success message after successful password update
  displaySuccess("Your password has been updated!");

  // Resetting password and confirmPassword input fields
  password.value = "";
  confirmPassword.value = "";
};

// Event listener for form submission triggering handleSubmit function
form.addEventListener("submit", handleSubmit);
