import { APIPostRequest } from '/modules/api.mjs';

const button = document.querySelector('#button-auth-login');
button.addEventListener('click', login);

async function login() {
  const email = document.querySelector('#input-auth-login-email');
  const password = document.querySelector('#input-auth-login-password');

  email.message = '';
  password.message = '';

  if (!email.value) {
    email.message = `<span style="color:red;">${'이메일을 입력해주세요.'}</span>`;
    email.focus();
    return;
  }

  if (!email.value.match(/[^@]+@[^.]+\.[^.]+/)) {
    email.message = `<span style="color:red;">${'올바른 이메일을 입력해주세요.'}</span>`;
    email.focus();
    return;
  }

  if (!password.value) {
    password.message = `<span style="color:red;">${'비밀번호를 입력해주세요.'}</span>`;
    password.focus();
    return;
  }

  button.disabled = true;
  APIPostRequest('auth/', {
    email: email.value,
    password: password.value,
  })
    .then((data) => {
      localStorage.booth = data.user.email;
      localStorage.accessToken = data.token.access;
      localStorage.refreshToken = data.token.refresh;

      window.setCookie('booth', data.user.email, 1000 * 60 * 60 * 24 * 365);

      window.location.href = '/dash';
    })
    .catch(async (error) => {
      button.disabled = false;
      if (error.status === 400) {
        password.focus();
        noty(`로그인 실패. 이메일 혹은 비밀번호를 확인하여 주십시오.`, 'error');
      } else if (error.status >= 500) {
        noty(`서버 오류.`, 'error');
        console.log(error);
      }
    });
}
