const apiVersion = 'https://ireporter-endpoint.herokuapp.com/api/v2/';

function handleResponse(res) {
  return res.json().then(data => {
    if (res.ok) {
      return data;
    } else {
      let error = Object.assign({}, res, {
        error: data
      });
      return Promise.reject(error);
    }
  });
}

function requestOptions(req, body, token) {
  const options = {
    method: req,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token,
    }
  }
}