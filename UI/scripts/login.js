/* eslint-disable */
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const notificationBox = document.getElementById('notification-div');
const notificationBoxCloser = document.getElementById('close-notification');
const notificationTextElement = notificationBox.querySelector('p');
const notificationTitle = notificationBox.querySelector('h5');

const loginButton = document.getElementById('login-btn');
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

function verifyRequiredFields() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    notificationTitle.innerText = 'An error has occured';
    notificationTextElement.innerText = 'All fields are required. Please fill them all.'
    return displayNotification();
  }

  if (!/^.+@.+\..+$/.test(email)) {
    notificationTitle.innerText = 'An error has occured';
    notificationTextElement.innerText = 'The email is invalid. Please enter a valid email';
    return displayNotification();
  }

  if (password.length <= 5) {
    notificationTitle.innerText = 'An error has occured';
    notificationTextElement.innerText = 'Password needs to be at least 6 characters long.'
    return displayNotification()
  }
  return { email, password }
}

loginButton.addEventListener('click', () => {
  showLoader();
  const { email = '', password = '' } = verifyRequiredFields();
  const options = {
    method: 'POST',
    body: JSON.stringify({ password, email }),
    headers: {
      'Content-Type': 'application/json',
    }
  }

  fetch(`${apiVersion}user/login`, options)
    .then(handleResponse)
    .then(res => {
      const { user, token } = res.data;
      sessionStorage.setItem('userId', user.id);
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('firstName', user.firstName);
      emailInput.value = '';
      passwordInput.value = '';
      setTimeout(() => {
        loader.style.display = 'none';
        if (user.isAdmin) return location.href = '../views/admin/admin-dashboard.html';
        location.href = '../views/user/view-reports.html'
      }, 2500);
    })
    .catch(err => {
      const endpointError = err.error;
      notificationTitle.innerText = 'An error has occured.';
      notificationTextElement.innerText = endpointError.error;
      return displayNotification();
    })
});
