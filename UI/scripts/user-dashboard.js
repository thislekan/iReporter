const logoutButton = document.getElementById('log-out');
const allEditButtons = document.querySelectorAll('.edit-btn');
const allDeleteButtons = document.querySelectorAll('.delete-btn');

logoutButton.addEventListener('click', () => location.href = '../../../index.html');

allEditButtons.forEach(element => {
  element.addEventListener('click', () => {
    location.href = '../../views/user/edit-incident.html';
  });
});

allDeleteButtons.forEach(element => {
  element.addEventListener('click', () => {
    location.href = '../../views/user/delete-incident.html';
  });
})
