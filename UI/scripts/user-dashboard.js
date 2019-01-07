const logoutButton = document.getElementById('log-out');
const allEditButtons = document.querySelectorAll('.edit-btn');
const allDeleteButtons = document.querySelectorAll('.delete-btn');

const notificationBox = document.getElementById('notification-div');
const notificationBoxCloser = document.getElementById('close-notification');
const notificationTextElement = notificationBox.querySelector('p');
const notificationTitle = notificationBox.querySelector('h3');

const reportTypeInput = document.getElementById('report-type');
const titleInput = document.getElementById('incident-title');
const commentInput = document.getElementById('comments');
const locationInput = document.getElementById('location');
const fileUploadInput = document.getElementById('file-upload');
const createIncidentBtn = document.getElementById('create-incident');

let areaGeoCode;
const arrayOfRecentlyCreatedIncidents = [];

notificationBoxCloser.addEventListener('click', () => {
  notificationBox.style.display = 'none';
});

function displayNotification() {
  notificationBox.style.display = 'flex';
}

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
});

commentInput.addEventListener('keyup', (e) => {
  const comment = e.target.value;
  if (comment.length < 150) {
    commentInput.style.border = '1px solid rgba(29, 57, 74, 0.1)';
    createIncidentBtn.disabled = false;
  } else {
    commentInput.style.border = '1px solid red';
    createIncidentBtn.disabled = true;
  }
})

function checkReportType() {
  notificationTitle.innerText = 'An error occured';
  notificationTextElement.innerText = 'Report type not selected.';
  displayNotification();
}

function checkForTitle() {
  notificationTitle.innerText = 'An error occured';
  notificationTextElement.innerText = 'Title not provided';
  displayNotification();
}

function checkForComment() {
  notificationTitle.innerText = 'An error occured';
  notificationTextElement.innerText = 'Comment not provided.';
  displayNotification();
}

function checkForLocation() {
  notificationTitle.innerText = 'An error occured';
  notificationTextElement.innerText = 'Coordinates not provided.';
  displayNotification();
}

function getLocationSuccess(position) {
  const long = position.coords.longitude;
  const lat = position.coords.latitude;

  locationInput.value = `${lat} ${long}`;
}

function getLocationFailure() {
  notificationTitle.innerText = 'Geo location access denied.';
  notificationTextElement.innerText = 'You denied your device access to your location. Please enter the incident address manually.';
  locationInput.removeEventListener('focus', getLocation)
  return displayNotification();
}

function getLocation() {
  if (!navigator.geolocation) {
    notificationTitle.innerText = 'An error occured.';
    notificationTextElement.innerText = 'Geolocation is not supported by your browser. Please type in the address manually';
    return displayNotification();
  }

  const geoOptions = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 28000,
  }
  navigator.geolocation.getCurrentPosition(getLocationSuccess, getLocationFailure, geoOptions);
}

locationInput.addEventListener('focus', getLocation);

function incidentFormCheck() {
  const reportType = reportTypeInput.value.trim();
  const comment = commentInput.value.trim();
  const location = locationInput.value.trim();
  const title = titleInput.value.trim();

  if (!reportType) return checkReportType();
  if (!title) return checkForTitle();
  if (!comment) return checkForComment();
  if (!location) return checkForLocation();

  return { reportType, comment, location, title }
}

// function convertAddressToGeocode(location) {
//   const writtenLocation = encodeURI(location);
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${writtenLocation}&key=AIzaSyAvH4cf6gnzajQnQJh5IjDR_WcejL9L6p0`;
//   fetch(url)
//     .then(handleResponse)
//     .then(res => {
//       console.log(res)
//       areaGeoCode = res.results[0].geometry.location;
//     })
//     .catch(err => {
//       notificationTitle.innerText = err.status;
//       notificationTextElement.innerText = err.error_message;
//       displayNotification();
//     });
// }

createIncidentBtn.addEventListener('click', () => {
  console.log('called')
  const { comment = '', reportType = '', location = '', title = '' } = incidentFormCheck();
  // convertAddressToGeocode(location);
  const options = {
    method: 'POST',
    body: JSON.stringify({ location, comment, type: reportType, title }),
    headers: {
      'Content-Type': 'application/json',
      'x-auth': sessionStorage.getItem('token')
    }
  }

  fetch(`${apiVersion}incident/create`, options)
    .then(handleResponse)
    .then(res => {
      console.log(res);
      notificationTitle.innerText = 'Incident successfully reported';
      notificationTextElement.innerText = ''
      displayNotification();
      // if (arrayOfRecentlyCreatedIncidents.length === 4) arrayOfRecentlyCreatedIncidents.splice(3, 1);
      // arrayOfRecentlyCreatedIncidents.unshift(res.data);
      // console.log(arrayOfRecentlyCreatedIncidents);
    })
    .catch(err => {
      console.log(err);
    });
});