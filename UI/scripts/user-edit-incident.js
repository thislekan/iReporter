const editCommentButton = document.getElementById('edit-comment-btn');
const editLocationButton = document.getElementById('edit-location-btn');

editCommentButton.addEventListener('click', () => {
  if (editCommentButton.innerText === 'Post Comment') {
    editCommentButton.innerText = 'Edit Comment';
  } else {
    editCommentButton.innerText = 'Post Comment';
  }
});

editLocationButton.addEventListener('click', () => {
  if (editLocationButton.innerText === 'Post Location') {
    editLocationButton.innerText = 'Edit Location';
  } else {
    editLocationButton.innerText = 'Post Location';
  }
})