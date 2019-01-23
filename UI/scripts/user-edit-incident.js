const editCommentButton = document.getElementById('edit-comment-btn');
const editLocationButton = document.getElementById('edit-location-btn');

const incidentId = document.getElementById('incident-id');
const incidentType = document.getElementById('incident-type');
const incidentComment = document.getElementById('incident-comment');
const incidentLocation = document.getElementById('incident-location');
const incidentStatus = document.getElementById('incident-status');
const incidentDate = document.getElementById('incident-date');
const incidentTitle = document.getElementById('incident-title');

const notificationBox = document.getElementById('notification-div');
const notificationBoxCloser = document.getElementById('close-notification');
const notificationTextElement = notificationBox.querySelector('p');
const notificationTitle = notificationBox.querySelector('h3');
const loader = document.getElementById('loader-div');
const logOutBtn = document.getElementById('log-out');

let reportType;

logOutBtn.addEventListener('click', () => location.href = '../../../index.html');

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

incidentComment.addEventListener('keyup', (e) => {
  const comment = e.target.value;
  if (comment.length < 150) {
    incidentComment.style.border = '1px solid rgba(29, 57, 74, 0.1)';
    editCommentButton.disabled = false;
  } else {
    incidentComment.style.border = '1px solid red';
    editCommentButton.disabled = true;
  }
});

editCommentButton.addEventListener('click', () => {
  if (editCommentButton.innerText === 'Post Comment') {
    updateComment();
  } else {
    editCommentButton.innerText = 'Post Comment';
    incidentComment.disabled = false;
  }
});

editLocationButton.addEventListener('click', () => {
  if (editLocationButton.innerText === 'Post Location') {
    updateLocation();
  } else {
    editLocationButton.innerText = 'Post Location';
    incidentLocation.disabled = false;
  }
});

function fillInValuesForReport(params) {
  const { type, id, location, status, comment, title, createdOn } = params.data;
  incidentComment.value = comment;
  // incidentId.innerText = id;
  incidentLocation.value = location;
  incidentType.innerHTML = `${(type === 'red-flag') ? type + '<span class="fa fa-flag"></span>' : type + "<span class='fa fa-stop-circle-o'></span>"}`;
  // incidentStatus.innerText = status;
  incidentDate.innerText = moment(Number(createdOn)).format('MMMM Do YYYY, h:mm:ss a');
  incidentTitle.innerText = title;
}

function updateLocation() {
  showLoader();
  const id = sessionStorage.getItem('incident');
  const location = incidentLocation.value.trim();
  const options = {
    method: 'PATCH',
    body: JSON.stringify({ location }),
    headers: {
      'Content-Type': 'application/json',
      'x-auth': sessionStorage.getItem('token')
    }
  }

  fetch(`${apiVersion}${reportType}/location/${id}`, options)
    .then(handleResponse)
    .then(res => {
      notificationTitle.innerText = 'Location successfully updated';
      displayNotification();
      incidentLocation.disabled = true;
      editLocationButton.innerText = 'Edit Location';
    })
    .catch(err => {
      notificationTitle.innerText = 'An error has occured';
      notificationTextElement.innerText = err.error.error;
      displayNotification();
    })
}

function updateComment() {
  showLoader();
  const id = sessionStorage.getItem('incident');
  const comment = incidentComment.value.trim();
  const options = {
    method: 'PATCH',
    body: JSON.stringify({ comment }),
    headers: {
      'Content-Type': 'application/json',
      'x-auth': sessionStorage.getItem('token')
    }
  }

  fetch(`${apiVersion}${reportType}/comment/${id}`, options)
    .then(handleResponse)
    .then(res => {
      notificationTitle.innerText = 'Comment successfully updated';
      displayNotification();
      incidentComment.disabled = true;
      editCommentButton.innerText = 'Edit Comment';
    })
    .catch(err => {
      notificationTitle.innerText = 'An error has occured';
      notificationTextElement.innerText = err.error.error;
      displayNotification();
    })
}

window.onload = () => {
  showLoader();
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
      reportType = res.data.type;
      fillInValuesForReport(res);
      loader.style.display = 'none';
    })
    .catch(err => {
      notificationTitle.innerText = 'An error has occured';
      notificationTextElement.innerText = err.error.error;
      displayNotification();
    })
}