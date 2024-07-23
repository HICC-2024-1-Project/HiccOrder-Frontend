import { APIPostRequest } from '/modules/api.mjs';

const message = document.querySelector('#auth-login-message');

document.querySelector('#button-auth-login').addEventListener('click', () => {
  login();
});

async function login() {
  APIPostRequest('auth/', {
    email: document.querySelector('#auth-login-id').value,
    password: document.querySelector('#auth-login-pw').value,
  })
    .then((data) => {
      console.log(data.user.email);

      localStorage.booth = document.querySelector('#auth-login-id').value;
      localStorage.accessToken = data.token.access;
      localStorage.refreshToken = data.token.refresh;

      window.setCookie('booth', data.user.email, 1000 * 60 * 60 * 24 * 365);

      //window.location.href = '/dash';
    })
    .catch(async (error) => {
      message.innerHTML = `${error.status} ${error.statusText}`;
    });
}
