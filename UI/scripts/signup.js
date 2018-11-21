const nameInput = document.getElementById('name');
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
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const passwordCheck = passwordInputCheck.value.trim();

  if (!name || !email || !password || !passwordCheck) {
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
      nameInput.value = '';
      passwordInput.value = '';
      passwordInputCheck.value = '';
      return { name, email, password }
    }
  }
  // console.log(name, email)
}

signUpButton.addEventListener('click', () => {
  // console.log(nameInput);
  const { email = '', password = '', name = '' } = verifyRequiredFields();
  (email) ? sessionStorage.setItem('email', email) : '';
  (password) ? sessionStorage.setItem('password', password) : '';
  if (email && password && name) return location.href = '../views/login.html';
});

// AIzaSyD7vyWaUCS6qMoPOcAhhO_TI1mbqAAWJlM