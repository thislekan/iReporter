const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const notificationBox = document.getElementById('notification-div');
const notificationBoxCloser = document.getElementById('close-notification');
const notificationTextElement = notificationBox.querySelector('p');

const loginButton = document.getElementById('login-btn');

notificationBoxCloser.addEventListener('click', () => {
  notificationBox.style.display = 'none';
});

function displayNotification() {
  notificationBox.style.display = 'flex';
}

function verifyRequiredFields() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    notificationTextElement.innerText = 'All fields are required. Please fill them all.'
    displayNotification();
  } else if (email === 'admin' && password === 'admin') {
    return { email, password };
  } else {
    if (password.length <= 5) {
      notificationTextElement.innerText = 'Password needs to be at least 6 characters long.'
      displayNotification()
    } else {
      emailInput.value = '';
      passwordInput.value = '';
      return { email, password }
    }
  }
}

loginButton.addEventListener('click', () => {
  const emailInMemory = sessionStorage.getItem('email');
  const passwordInMemory = sessionStorage.getItem('password');
  const { email = '', password = '' } = verifyRequiredFields();
  if (email === emailInMemory || password === passwordInMemory) {
    return location.href = '../views/user/user-dashboard.html';
  } else if (email === 'admin' && password === 'admin') {
    return location.href = '../views/admin/admin-dashboard.html';
    // setTimeout(() => {
    //   location.href = '../views/admin/admin-dashboard.html';
    // }, 1000);
  } else {
    displayNotification();
    notificationTextElement.innerText = 'User not found. Please sign up.'
  }
});
