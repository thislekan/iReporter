const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordInputCheck = document.getElementById('confirm-password');
const agreeToTermsInput = document.getElementById('terms-check');

const notificationBox = document.getElementById('notification-div');
const notificationBoxCloser = document.getElementById('close-notification');
const notificationTextElement = notificationBox.querySelector('p');

const signUpButton = document.getElementById('signup-btn');

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

  if (!lastName || !email || !password || !passwordCheck || !firstName) {
    notificationTextElement.innerText = 'All fields are required. Please fill them all.'
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
  const { lastName, firstName, email, password } = verifyRequiredFields();
  console.log(lastName, firstName, email, password)
  const options = {
    method: 'POST',
    body: JSON.stringify({ lastName, firstName, password, email }),
    headers: {
      'Content-Type': 'application/json',
    }
  }
  fetch(`${apiVersion}user/create`, options)
    .then(handleResponse)
    .then(res => console.log(res))
    .catch(err => console.log(err));
  // lastNameInput.value = '';
  // passwordInput.value = '';
  // passwordInputCheck.value = '';
  // firstNameInput.value = '';
  // emailInput.value = '';
});
