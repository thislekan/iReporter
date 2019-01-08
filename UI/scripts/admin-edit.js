const incidentType = document.getElementById('incident-type');
const incidentTitle = document.getElementById('incident-title');
const incidentComment = document.getElementById('incident-comment');
const incidentLocation = document.getElementById('incident-location');
const incidentId = document.getElementById('incident-id');
const incidentStatus = document.getElementById('incident-status');
const incidentDate = document.getElementById('incident-date');

const notificationBox = document.getElementById('notification-div');
const notificationBoxCloser = document.getElementById('close-notification');
const notificationTextElement = notificationBox.querySelector('p');
const notificationTitle = notificationBox.querySelector('h3');

const editIncidentBtn = document.getElementById('edit-btn');

notificationBoxCloser.addEventListener('click', () => {
  notificationBox.style.display = 'none';
});

function displayNotification() {
  notificationBox.style.display = 'flex';
}

function updateIncidentStatus() {
  const status = incidentStatus.value.trim();
  const id = sessionStorage.getItem('incident');
  const options = {
    method: 'PATCH',
    body: JSON.stringify({ status, id }),
    headers: {
      'Content-Type': 'application/json',
      'x-auth': sessionStorage.getItem('token')
    }
  }

  fetch(`${apiVersion}update/status`, options)
    .then(handleResponse)
    .then(res => {
      console.log(res);
      notificationTitle.innerText = 'Report successfully updated';
      displayNotification();
      incidentStatus.disabled = true;
      editIncidentBtn.innerText = 'Edit Status';
    })
    .catch(err => {
      notificationTitle.innerText = 'An erroroccured';
      notificationTextElement.innerText = err.error.error;
      displayNotification();
    })
}

editIncidentBtn.addEventListener('click', (e) => {
  if (e.target.innerText === 'Post Status') {
    updateIncidentStatus();
  } else {
    incidentStatus.disabled = false;
    e.target.innerText = 'Post Status'
  }
});

function updateView(params) {
  const { title, status, comment, location, type, createdOn, id } = params;
  incidentComment.value = comment;
  incidentTitle.innerText = title;
  incidentDate.innerText = moment(Number(createdOn)).format('MMMM Do YYYY, h:mm:ss a');
  incidentLocation.innerText = location;
  incidentStatus.value = status;
  incidentType.innerText = type;
  incidentId.innerText = id;
}

window.onload = () => {
  const id = sessionStorage.getItem('incident');
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': sessionStorage.getItem('token')
    }
  }

  fetch(`${apiVersion}incident/${id}`, options)
    .then(handleResponse)
    .then(res => {
      console.log(res);
      updateView(res.data);
    })
    .catch(err => {
      notificationTitle.innerText = 'An erroroccured';
      notificationTextElement.innerText = err.error.error;
      displayNotification();
    });
}