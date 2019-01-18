const logoutButton = document.getElementById('log-out');
const incidentViewToggler = document.getElementById('incident-view');
const incidentTitleElement = document.getElementById('incident-title');
const incidentsViewDiv = document.querySelector('.list-of-reports');

const notificationBox = document.getElementById('notification-div');
const notificationBoxCloser = document.getElementById('close-notification');
const notificationTextElement = notificationBox.querySelector('p');
const notificationTitle = notificationBox.querySelector('h3');

const moreDetailsDiv = document.querySelector('.more-details-div');
const searchDiv = document.getElementById('filter-div');
const filterOptions = document.getElementById('filter-options');
const searchTermInput = document.getElementById('filter-value');
const filterListbtn = document.getElementById('filter-list-btn');
const cancelSearchBtn = document.getElementById('cancel-search-btn');

const mapDiv = document.querySelector('.map');
const detailsDivCloser = document.getElementById('close-details-div');
const detailsImageDiv = document.querySelector('.image-div');

let listOfAllIncidents = [];
let filteredList = []

incidentTitleElement.innerText = 'All recently created incidents';
searchDiv.style.display = 'none'
filterListbtn.style.display = 'none';
searchTermInput.style.display = 'none';
cancelSearchBtn.style.display = 'none';

notificationBoxCloser.addEventListener('click', () => {
  notificationBox.style.display = 'none';
});

detailsDivCloser.addEventListener('click', () => moreDetailsDiv.style.display = 'none');

function displayNotification() {
  notificationBox.style.display = 'flex';
}

function showFilterDiv() {
  searchDiv.style.display = 'flex';
}

function showSearchTermInput() {
  filterListbtn.style.display = 'initial';
  cancelSearchBtn.style.display = 'initial';
  searchTermInput.style.display = 'initial';
}

function toggleView() {
  switch (incidentViewToggler.value) {
    case 'all':
      incidentTitleElement.innerText = 'All recently created incidents';
      filteredList = listOfAllIncidents.reverse();
      if (searchDiv.style.display === 'none') showFilterDiv();
      updateView(filteredList);
      break
    case 'draft':
      incidentTitleElement.innerText = 'All pending incidents';
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.status === 'draft');
      if (searchDiv.style.display === 'none') showFilterDiv();
      updateView(filteredList)
      break;
    case 'resolved':
      incidentTitleElement.innerText = 'All resolved incidents';
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.status === 'resolved');
      if (searchDiv.style.display === 'none') showFilterDiv();
      updateView(filteredList)
      break;
    case 'rejected':
      incidentTitleElement.innerText = 'All rejected incidents';
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.status === 'rejected');
      if (searchDiv.style.display === 'none') showFilterDiv();
      updateView(filteredList)
      break;
    case 'under-investigation':
      incidentTitleElement.innerText = 'All incidents under investigation';
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.status === 'under-investigation');
      if (searchDiv.style.display === 'none') showFilterDiv();
      updateView(filteredList)
      break;
    case 'red-flag':
      incidentTitleElement.innerText = 'All red flags incidents';
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.type === 'red-flag');
      if (searchDiv.style.display === 'none') showFilterDiv();
      updateView(filteredList.reverse());
      break;
    case 'intervention':
      incidentTitleElement.innerText = 'All intervention incidents'
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.type === 'intervention');
      if (searchDiv.style.display === 'none') showFilterDiv();
      updateView(filteredList.reverse());
    default:
      break;
  }
}

function dateCreated(date) {
  const created = new Date(Number(date));
  return created;
}

function convertAddressToGeocode(location) {
  const locationCheck = location.split(' ');
  if (locationCheck.length <= 2 && !Number(locationCheck[0]) && !Number(locationCheck[1])) {
    const writtenLocation = encodeURI(location);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${writtenLocation}&key=AIzaSyAvH4cf6gnzajQnQJh5IjDR_WcejL9L6p0`;
    fetch(url)
      .then(handleResponse)
      .then(res => {
        const { lat, lng } = res.results[0].geometry.location;
        mapDiv.innerHTML = `<iframe width="100%" height="100%" frameborder="0" style="border:0; position:absolute;" src="https://www.google.com/maps/embed/v1/search?q=${lat}+${lng}&key=AIzaSyD7vyWaUCS6qMoPOcAhhO_TI1mbqAAWJlM" allowfullscreen></iframe>`;
      })
      .catch(err => {
        notificationTitle.innerText = err.status;
        notificationTextElement.innerText = err.error_message;
        displayNotification();
      });
  } else {
    mapDiv.innerHTML = `<iframe width="100%" height="100%" frameborder="0" style="border:0; position:absolute;" src="https://www.google.com/maps/embed/v1/search?q=${locationCheck[0]}+${locationCheck[1]}&key=AIzaSyD7vyWaUCS6qMoPOcAhhO_TI1mbqAAWJlM" allowfullscreen></iframe>`
  }
}

function navigateToEditPage(index) {
  const incident = filteredList[index];
  sessionStorage.setItem('incident', incident.id);
  setTimeout(() => {
    location.href = '../../views/admin/admin-edit.html';
  }, 2000);
}

function insertImages(params) {
  for (let i = 0; i < params.length; i++) {
    const element = params[i];
    const img = `<img class='more-details-img' src='${element}'>`;
    detailsImageDiv.innerHTML += img;
  }
}

function expandIncident(index) {
  let incident;
  if (incidentTitleElement.innerText === 'Displaying search result') {
    incident = searchResult[index];
    convertAddressToGeocode(incident.location);
    if (incident.images && incident.images.length) {
      insertImages(incident.images);
    }
    moreDetailsDiv.style.display = 'block';
  } else {
    incident = filteredList[index];
    convertAddressToGeocode(incident.location);
    if (incident.images && incident.images.length) {
      insertImages(incident.images);
    }
    moreDetailsDiv.style.display = 'block';
  }
}

function updateView(params) {
  incidentsViewDiv.innerHTML = '';
  for (let i = 0; i < params.length; i++) {
    const element = params[i];
    const date = dateCreated(element.createdOn);

    const incident = `<div class='report-body-wrapper'><div class='report-details'><h4>ID: </h4><p>${element.id}</p></div><div class='report-details'><h4>Type: </h4><p>${(element.type === 'red-flag') ? element.type + '<span class="fa fa-flag"></span>' : element.type + "<span class='fa fa-stop-circle-o'></span>"}</p></div><div class='report-details'><h4>Date: </h4><p>${moment(date).format('MMMM Do YYYY, h:mm:ss a')}</p></div><div class='report-details'><h4>Status: </h4><p>${element.status}</p></div><div class='report-details'><h4>Location: </h4><p>${element.location}</p></div><div class='btn-div'><button class='details-btn' onclick='expandIncident("${i}")'>More Details</button><button class='edit-btn' onclick='navigateToEditPage("${i}")'>Edit Incident</button></div></div>`;

    incidentsViewDiv.innerHTML += incident;
  }
}

let searchCriteria;
let prevFilteredListTitle;
let searchResult;

incidentViewToggler.addEventListener('change', toggleView);
filterOptions.addEventListener('change', (e) => {
  if (e.target.value) {
    searchTermInput.value = '';
    showSearchTermInput();
    return searchCriteria = e.target.value;
  }
});

function cancelSearch(params) {
  incidentTitleElement.innerText = params;
  updateView(filteredList);
  searchDiv.style.display = 'none';
}

filterListbtn.addEventListener('click', () => {
  const searchValue = searchTermInput.value;
  if (!searchCriteria || !searchValue) {
    notificationTitle.innerText = 'An error has occured';
    notificationTextElement.innerText = 'You have not provided the search term/value';
    displayNotification();
  } else {
    searchResult = filteredList.filter(element => element[searchCriteria].toLowerCase().includes(searchValue));
    if (searchResult.length) {
      prevFilteredListTitle = incidentTitleElement.innerText;
      incidentTitleElement.innerText = 'Displaying search result';
      updateView(searchResult);
    } else {
      incidentTitleElement.innerText = 'No result found';
      updateView(filteredList);
    }
  }
});

cancelSearchBtn.addEventListener('click', () => cancelSearch(prevFilteredListTitle));

window.onload = () => {
  fetch(`${apiVersion}incidents`)
    .then(handleResponse)
    .then(res => {
      listOfAllIncidents = res.data.incidents;
      filteredList = listOfAllIncidents.reverse();
      updateView(filteredList);
    })
    .catch(err => {
      notificationTitle.innerText = 'An error has occured';
      notificationTextElement.innerText = err.error.error;
      return displayNotification()
    });
}
