const incidentsViewDiv = document.getElementById('incidents-view');
const incidentIdentifier = document.getElementById('current-view-title');
const sortIncidentByStatus = document.getElementById('sort-report');
const overlayDiv = document.getElementById('overlay');
const imageAndVideoParentDiv = document.querySelector('.image-and-video-div');
const logoutButton = document.getElementById('log-out');

const incidentType = document.getElementById('incident-type');
const incidentTitle = document.getElementById('incident-title');
const incidentComment = document.getElementById('incident-comment');
const incidentLocation = document.getElementById('incident-location');
const incidentId = document.getElementById('incident-id');
const incidentStatus = document.getElementById('incident-status');
const incidentDate = document.getElementById('incident-date');
const closeDetailedIncidentDiv = document.getElementById('close-details');
const mapDiv = document.querySelector('.map-region');
const incidentImageDiv = document.getElementById('incident-img-div');
// const incidentImage = document.querySelectorAll('.incident-img');

const incidentModalCreateButton = document.getElementById('create-modal')
const createIncidentForm = document.getElementById('create-form-div');
const createIncidentFormCloseButton = document.getElementById('close-create-form');

const reportTypeInput = document.getElementById('report-type');
const titleInput = document.getElementById('create-incident-title');
const commentInput = document.getElementById('comments');
const locationInput = document.getElementById('location');
const fileUploadInput = document.getElementById('file-upload');
const previewImgDiv = document.querySelector('.preview-img');
const createIncidentBtn = document.getElementById('create-incident');

const notificationBox = document.getElementById('notification-div');
const notificationBoxCloser = document.getElementById('close-notification');
const notificationTextElement = notificationBox.querySelector('p');
const notificationTitle = notificationBox.querySelector('h3');

const deletePromptDiv = document.querySelector('.delete-prompt');
const cancelDeletePromptBtn = deletePromptDiv.querySelector('.cancel-btn');
const deleteReportBtn = deletePromptDiv.querySelector('.delete-btn');

const incidentDetailsModal = document.getElementById('detailed-incident');


let listOfAllIncidents = [];
let filteredList = [];

previewImgDiv.style.display = 'none';
createIncidentForm.style.display = 'none';

closeDetailedIncidentDiv.addEventListener('click', () => {
  incidentDetailsModal.style.display = 'none';
  overlayDiv.style.display = 'none';
});

createIncidentFormCloseButton.addEventListener('click', () => {
  createIncidentForm.style.display = 'none';
  incidentModalCreateButton.style.display = 'flex';
});

incidentModalCreateButton.addEventListener('click', () => {
  createIncidentForm.style.display = 'block';
  incidentModalCreateButton.style.display = 'none'
});

sortIncidentByStatus.addEventListener('change', () => {
  switch (sortIncidentByStatus.value) {
    case 'all':
      incidentIdentifier.innerText = 'All reported incidents';
      filteredList = listOfAllIncidents.reverse();
      updateView(filteredList);
      break;
    case 'draft':
      incidentIdentifier.innerText = 'All pending incidents';
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.status === 'draft');
      updateView(filteredList)
      break;
    case 'resolved':
      incidentIdentifier.innerText = 'All resolved incidents';
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.status === 'resolved');
      updateView(filteredList)
      break;
    case 'rejected':
      incidentIdentifier.innerText = 'All rejected incidents';
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.status === 'rejected');
      updateView(filteredList)
      break;
    case 'under-investigation':
      incidentIdentifier.innerText = 'All incidents under investigation';
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.status === 'under-investigation');
      updateView(filteredList)
      break;
    case 'red-flag':
      incidentIdentifier.innerText = 'All reported Red flag incidents';
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.type === 'red-flag');
      updateView(filteredList)
      break;
    case 'intervention':
      incidentIdentifier.innerText = 'All reported Intervention incidents';
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.type === 'intervention');
      updateView(filteredList)
      break;
    default:
      break;
  }
});

logoutButton.addEventListener('click', () => location.href = '../../../index.html');

function dateCreated(date) {
  const created = new Date(Number(date));
  return created;
}

function updateView(params) {
  incidentsViewDiv.innerHTML = '';
  for (let i = 0; i < params.length; i++) {
    const element = params[i];
    const date = dateCreated(element.createdOn);

    const incident =
      `<div class='report-body-wrapper'>
    <div class='report-details'><div class='incident-intro'><span class='fa fa-check'></span><h4>ID: </h4></div><p>${element.id}</p></div>
    <div class='report-details'><div class="incident-intro"><span class="fa fa-check"></span><h4>Type: </h4></div><p>${(element.type === 'red-flag') ? element.type + '<span class="fa fa-flag"></span>' : element.type + "<span class='fa fa-stop-circle-o'></span>"}</p></div>
    <div class='report-details'><div class='incident-intro'><span class='fa fa-check'></span><h4>Date: </h4></div><p>${moment(date).format('MMMM Do YYYY, h:mm:ss a')}</p></div>
    <div class='report-details'><div class='incident-intro'><span class='fa fa-check'></span><h4>Status: </h4></div><p>${element.status}</p></div>
    <div class='report-details'><div class='incident-intro'><span class='fa fa-check'></span><h4>Location: </h4></div><p>${element.location}</p></div>
    <div class='bottom-div'><div class='btn-div'><button class='view-btn' onclick='showIncidentDetails("${i}")'>Details</button><button class='edit-btn' onclick='navigateToEditPage("${i}")'>Edit</button><button class='delete-btn' onclick="showDeleteIncidentDiv(${i})">Delete</button></div></div></div>`;

    incidentsViewDiv.innerHTML += incident;
  }
}

function convertAddressToGeocode(location) {
  const locationCheck = location.split(' ');
  if (locationCheck.length <= 2 && !Number(locationCheck[0]) && !Number(locationCheck[1])) {
    const writtenLocation = encodeURI(location);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${writtenLocation}&key=AIzaSyAvH4cf6gnzajQnQJh5IjDR_WcejL9L6p0`;
    fetch(url)
      .then(handleResponse)
      .then(res => {
        console.log(res)
        const { lat, lng } = res.results[0].geometry.location;
        mapDiv.innerHTML = `<iframe width="100%" height="100%" frameborder="0" style="border:0; position:absolute;" src="https://www.google.com/maps/embed/v1/search?q=${lat}+${lng}&key=AIzaSyD7vyWaUCS6qMoPOcAhhO_TI1mbqAAWJlM" allowfullscreen></iframe>`;
      })
      .catch(err => {
        console.log(err);
        notificationTitle.innerText = err.status;
        notificationTextElement.innerText = err.error_message;
        displayNotification();
      });
  } else {
    mapDiv.innerHTML = `<iframe width="100%" height="100%" frameborder="0" style="border:0; position:absolute;" src="https://www.google.com/maps/embed/v1/search?q=${locationCheck[0]}+${locationCheck[1]}&key=AIzaSyD7vyWaUCS6qMoPOcAhhO_TI1mbqAAWJlM" allowfullscreen></iframe>`
  }
}

function showIncidentDetails(index) {
  const incident = filteredList[index];
  const { type, id, location, status, comment, title, createdOn } = incident;
  incidentComment.value = comment;
  incidentId.innerText = id;
  incidentLocation.innerText = location;
  incidentType.innerHTML = `${(type === 'red-flag') ? type + '<span class="fa fa-flag"></span>' : type + "<span class='fa fa-stop-circle-o'></span>"}`;
  incidentStatus.innerText = status;
  incidentDate.innerText = moment(Number(createdOn)).format('MMMM Do YYYY, h:mm:ss a');
  incidentTitle.innerText = title;
  if (incident.images && incident.images.length) {
    incident.images.forEach(element => {
      const imgTag = `<img src="${element}" alt='image'>`;
      incidentImageDiv.innerHTML += imgTag;
    });
  } else {
    imageAndVideoParentDiv.style.display = 'none';
  }

  incidentDetailsModal.style.display = 'flex';
  overlayDiv.style.display = 'flex';
  convertAddressToGeocode(location)
}

notificationBoxCloser.addEventListener('click', () => {
  notificationBox.style.display = 'none';
});

function displayNotification() {
  notificationBox.style.display = 'flex';
}

function navigateToEditPage(index) {
  const incident = filteredList[index];
  if (incident.status !== 'draft') {
    notificationTitle.innerText = 'An error occured';
    notificationTextElement.innerText = 'The report can not be edited.';
    return displayNotification();
  }
  sessionStorage.setItem('incident', incident.id);
  setTimeout(() => {
    location.href = '../user/edit-incident.html';
  }, 2000);
}

function showDeleteIncidentDiv(index) {
  const incident = filteredList[index];
  if (incident.status !== 'draft') {
    notificationTitle.innerText = 'An error occured';
    notificationTextElement.innerText = 'The report can not be deleted.';
    return displayNotification();
  }
  sessionStorage.setItem('incident', incident.id);
  sessionStorage.setItem('type', incident.type)
  deletePromptDiv.style.display = 'block';
}

cancelDeletePromptBtn.addEventListener('click', () => {
  deletePromptDiv.style.display = 'none';
});

function afterSuccessfulDelete(res) {
  sessionStorage.removeItem('incident')
  sessionStorage.removeItem('type');
  deletePromptDiv.style.display = 'none';
  notificationTitle.innerText = 'The report has been successfully deleted.';
  notificationTextElement.innerText = `The ${res.data.type} report with ID: ${res.data.id} has been deleted.`;
  displayNotification();
  setTimeout(() => {
    notificationBox.style.display = 'none';
    deletePromptDiv.style.display = 'none';
  }, 2000);
}

function deleteIncident(id, type) {
  const options = {
    method: 'DELETE',
    body: JSON.stringify({ type, id }),
    headers: {
      'Content-Type': 'application/json',
      'x-auth': sessionStorage.getItem('token')
    }
  }

  fetch(`${apiVersion}incident/delete`, options)
    .then(handleResponse)
    .then(res => afterSuccessfulDelete(res))
    .catch(err => {
      notificationTitle.innerText = 'An error has occured.';
      notificationTextElement.innerText = err.error.error;
      deletePromptDiv.style.display = 'none';
      displayNotification();
    })
}

deleteReportBtn.addEventListener('click', () => {
  const id = sessionStorage.getItem('incident');
  const type = sessionStorage.getItem('type');
  deleteIncident(id, type);
});

let imageArray = [];
let videoArray = [];

fileUploadInput.addEventListener('change', (event) => {
  const allFilesReference = [...event.target.files];
  const uploadedFiles = [...event.target.files];

  for (let i = 0; i < allFilesReference.length; i++) {
    const reader = new FileReader();
    const element = allFilesReference[i];
    reader.onload = () => {
      if (previewImgDiv.style.display === 'none') previewImgDiv.style.display = 'grid';

      imageArray = uploadedFiles.filter(file => file.type.includes('image'));
      videoArray = uploadedFiles.filter(file => file.type.includes('video'));
      const img = `<img src='${reader.result}' alt='image'>`;
      previewImgDiv.innerHTML += img;
    }
    reader.readAsDataURL(element);
  }
})

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
  locationInput.placeholder = 'Please enter the address here'
  locationInput.removeEventListener('focus', getLocation);
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

createIncidentBtn.addEventListener('click', () => {
  console.log('called')
  const { comment = '', reportType = '', location = '', title = '' } = incidentFormCheck();
  const incidentForm = new FormData();
  incidentForm.append('comment', comment);
  incidentForm.append('location', location);
  incidentForm.append('type', reportType);
  incidentForm.append('title', title);
  imageArray.forEach((image, index) => incidentForm.append(`images[${index}]`, image));
  videoArray.forEach((video, index) => incidentForm.append(`videos[${index}]`, video));
  const options = {
    method: 'POST',
    body: incidentForm,
    headers: {
      'x-auth': sessionStorage.getItem('token')
    }
  }

  fetch(`${apiVersion}incident/create`, options)
    .then(handleResponse)
    .then(res => {
      console.log(res);
      notificationTitle.innerText = 'Incident successfully reported';
      notificationTextElement.innerText = '';
      createIncidentForm.style.display = 'none';
      displayNotification();
      // if (arrayOfRecentlyCreatedIncidents.length === 4) arrayOfRecentlyCreatedIncidents.splice(3, 1);
      // arrayOfRecentlyCreatedIncidents.unshift(res.data);
      // console.log(arrayOfRecentlyCreatedIncidents);
    })
    .catch(err => {
      notificationTitle.innerText = 'An error occured';
      notificationTextElement.innerText = err.error.error;
      displayNotification();
    });
});

window.onload = () => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': sessionStorage.getItem('token')
    }
  }

  fetch(`${apiVersion}user/incidents`, options)
    .then(handleResponse)
    .then(res => {
      console.log(res);
      listOfAllIncidents = res.data;
      filteredList = listOfAllIncidents.reverse();
      updateView(filteredList);
    })
    .catch(err => console.log(err));
}