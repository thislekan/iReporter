const firstNameInput = document.getElementById('first-lastName');
const lastNameInput = document.getElementById('last-lastName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordInputCheck = document.getElementById('confirm-password');
const agreeToTermsInput = document.getElementById('terms-check');

const notificationBox = document.getElementById('notification-div');
const notificationBoxCloser = document.getElementById('close-notification');
const notificationTextElement = notificationBox.querySelector('p');

const signUpButton = document.getElementById('signup-btn');
const apiVersion = 'https://ireporter-endpoint.herokuapp.com/api/v2/';

notificationBoxCloser.addEventListener('click', () => {
  notificationBox.style.display = 'none';
});

function displayNotification() {
  notificationBox.style.display = 'flex';
}

function verifyRequiredFields() {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const passwordCheck = passwordInputCheck.value.trim();

  if (!lastName || !email || !password || !passwordCheck || firstName) {
    notificationTextElement.innerText = 'All fields are required. Please fill them all.'
    displayNotification();
  } else {
    if (password.length <= 5 || passwordCheck.length <= 5) {
      notificationTextElement.innerText = 'Password needs to be at least 6 characters long.'
      displayNotification()
    } else {
      if (password !== passwordCheck) {
        notificationTextElement.innerText = 'Unmatching password. Password needs to match for signup to be complete.'
        displayNotification();
      }
      lastNameInput.value = '';
      passwordInput.value = '';
      passwordInputCheck.value = '';
      return { lastName, email, password }
    }
  }
}

signUpButton.addEventListener('click', () => {
  const { email = '', password = '', lastName = '' } = verifyRequiredFields();
  (email) ? sessionStorage.setItem('email', email) : '';
  (password) ? sessionStorage.setItem('password', password) : '';
  if (email && password && lastName) return location.href = '../views/login.html';
});
