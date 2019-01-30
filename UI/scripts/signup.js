/* eslint-disable */
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordInputCheck = document.getElementById('confirm-password');
const agreeToTermsInput = document.getElementById('terms-check');

const notificationBox = document.getElementById('notification-div');
const notificationBoxCloser = document.getElementById('close-notification');
const notificationTextElement = notificationBox.querySelector('p');
const notificationTitle = notificationBox.querySelector('h5');

const signUpButton = document.getElementById('signup-btn');
const loader = document.getElementById('loader-div');

notificationBoxCloser.addEventListener('click', () => {
  notificationBox.style.display = 'none';
});

function showLoader() {
  loader.style.display = 'flex';
}

function displayNotification() {
  if (loader.style.display === 'flex') loader.style.display = 'none';
  notificationBox.style.display = 'flex';
}

function emptyInputFields() {
  lastNameInput.value = '';
  passwordInput.value = '';
  passwordInputCheck.value = '';
  firstNameInput.value = '';
  emailInput.value = '';
}

function verifyRequiredFields() {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const passwordCheck = passwordInputCheck.value.trim();

  if (!lastName || !email || !password || !passwordCheck || !firstName) {
    notificationTextElement.innerText = 'All fields are required. Please fill them all.'
    return displayNotification();
  }
  if (!/^.+@.+\..+$/.test(email)) {
    notificationTextElement.innerText = 'The email is invalid. Please enter a valid email';
    return displayNotification();
  }
  if (password.length <= 5 || passwordCheck.length <= 5) {
    notificationTextElement.innerText = 'Password needs to be at least 6 characters long.'
    return displayNotification()
  }
  if (password !== passwordCheck) {
    notificationTextElement.innerText = 'Unmatching password. Password needs to match for signup to be complete.'
    return displayNotification();
  }
  return { lastName, firstName, email, password }
}

signUpButton.addEventListener('click', () => {
  showLoader()
  const { lastName, firstName, email, password } = verifyRequiredFields();
  const options = {
    method: 'POST',
    body: JSON.stringify({ lastName, firstName, password, email }),
    headers: {
      'Content-Type': 'application/json',
    }
  }
  fetch(`${apiVersion}user/create`, options)
    .then(handleResponse)
    .then(res => {
      const { user, token } = res.data;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('firstName', `${user.firstName}`);
      emptyInputFields();
      setTimeout(() => {
        loader.style.display = 'none';
        location.href = '../views/user/user-dashboard.html';
      }, 2000);
    })
    .catch(err => {
      const endpointError = err.error;
      notificationTitle.innerText = 'An error has occured.';
      notificationTextElement.innerText = endpointError.error;
      return displayNotification();
    });
});
