import apiEnv from '../static/api.env.mjs';

async function request(method = 'GET', path = '', contentType, data = {}) {
  const url = apiEnv.baseUri + '/api/' + path;
  const options = {
    method: method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };
  options.headers = {
    'Content-Type': contentType,
  };
  if (localStorage.accessToken) {
    options.headers.Authorization = `Bearer ${localStorage.accessToken}`;
  }
  if (!['GET', 'HEAD'].includes(method) && data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(url, options);
  if (200 <= res.status && res.status <= 299) {
    if (options.headers['Content-Type'] === 'text/plain') {
      return res.text();
    } else if (options.headers['Content-Type'] === 'application/json') {
      return res.json();
    } else {
      return res.blob();
    }
  } else if (res.status === 403) {
    return new Promise(async (resolve, reject) => {
      try {
        const json = await res.json();
        if (
          options.headers.Authorization &&
          json.messages[0].message === 'Token is invalid or expired'
        ) {
          request('POST', 'auth/refresh/', 'application/json', {
            refresh: localStorage.refreshToken,
          })
            .then((data) => {
              localStorage.accessToken = data.access;
              resolve(request(method, path, contentType, data));
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject(res);
        }
      } catch (error) {
        reject(error);
      }
    });
  } else {
    throw res;
  }
}

async function APIGetRequest(path) {
  return request('GET', path, 'application/json');
}

async function APIPostRequest(path, data) {
  return request('POST', path, 'application/json', data);
}

async function APIPatchRequest(path, data) {
  return request('PATCH', path, 'application/json', data);
}

async function APIDeleteRequest(path, data) {
  return request('DELETE', path, 'application/json', data);
}

export { APIGetRequest, APIPostRequest, APIPatchRequest, APIDeleteRequest };

export default request;
