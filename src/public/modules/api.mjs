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
    try {
      if (options.headers['Content-Type'] === 'text/plain') {
        return await res.text();
      } else if (options.headers['Content-Type'] === 'application/json') {
        return await res.json();
      } else {
        return await res.blob();
      }
    } catch (error) {
      return null;
    }
  } else if (res.status === 403) {
    return new Promise(async (resolve, reject) => {
      try {
        const json = await res.json();
        if (
          options.headers.Authorization &&
          json.messages[0].message === 'Token is invalid or expired'
        ) {
          refreshToken()
            .then(() => {
              resolve(request(method, path, contentType, data));
            })
            .catch(() => {
              delete localStorage.accessToken;
              delete localStorage.refreshToken;
              delete localStorage.booth;
              window.setCookie('booth', '', -10000);

              window.location.href = '/';
            });
        } else {
          reject(res);
        }
      } catch (error) {
        reject(error);
      }
    });
  } else if (res.status >= 500) {
    const serverError = await res.blob();
    console.error(serverError);
    throw res;
  } else {
    throw res;
  }
}

async function refreshToken() {
  return new Promise((resolve, reject) => {
    fetch(apiEnv.baseUri + '/api/auth/refresh/', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        refresh: localStorage.refreshToken,
      }),
    })
      .then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();
          localStorage.accessToken = data.token.access;
          resolve();
        } else {
          reject();
        }
      })
      .catch(reject);
  });
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
