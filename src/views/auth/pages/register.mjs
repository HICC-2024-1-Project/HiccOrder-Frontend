import { APIPostRequest } from '/modules/api.mjs';

const button = document.querySelector('#button-auth-register');
button.addEventListener('click', register);

async function register() {
  const email = document.querySelector('#input-auth-register-email');
  const password = document.querySelector('#input-auth-register-password');
  const retype = document.querySelector('#input-auth-register-password-retype');

  email.message = '';
  password.message = '';
  retype.message = '';

  if (!email.value) {
    email.message = '이메일을 입력해주세요.';
    email.focus();
    return;
  }

  if (!email.value.match(/[^@]+@[^.]+\.[^.]+/)) {
    email.message = '올바른 이메일을 입력해주세요.';
    email.focus();
    return;
  }

  if (!password.value) {
    password.message = '비밀번호를 입력해주세요.';
    password.focus();
    return;
  }

  if (!retype.value) {
    retype.message = '비밀번호를 다시 한 번 입력해주세요.';
    retype.focus();
    return;
  }

  if (password.value !== retype.value) {
    retype.message =
      '입력한 비밀번호와 재입력한 비밀번호가 서로 다릅니다. 비밀번호를 확인해주세요.';
    retype.focus();
    return;
  }

  button.disabled = true;
  APIPostRequest('auth/sign/', {
    email: email.value,
    password: password.value,
  })
    .then((data) => {
      localStorage.booth = data.user.email;
      localStorage.accessToken = data.token.access;
      localStorage.refreshToken = data.token.refresh;

      window.setCookie('booth', data.user.email, 1000 * 60 * 60 * 24 * 365);

      window.location.href = '/booth';
    })
    .catch(async (error) => {
      button.disabled = false;
      if (error.status === 400) {
        email.message = '이미 사용 중인 이메일입니다.';
        email.focus();
      }
      console.log(error);
    });
}
