import { APIPostRequest } from '/modules/api.mjs';

document.querySelector('#button-auth-login').addEventListener('click', login);

async function login() {
  const email = document.querySelector('#input-auth-login-email');
  const password = document.querySelector('#input-auth-login-password');

  email.message = '';
  password.message = '';

  if (!email.value) {
    email.message = '이메일을 입력해주세요.';
    email.focus();
    return;
  }

  if (!email.value.match(/[^@]+@[^.]\.[^.]/)) {
    email.message = '올바른 이메일을 입력해주세요.';
    email.focus();
    return;
  }

  if (!password.value) {
    password.message = '비밀번호를 입력해주세요.';
    password.focus();
    return;
  }

  APIPostRequest('auth/', {
    email: email.value,
    password: password.value,
  })
    .then((data) => {
      localStorage.booth = document.querySelector('#auth-login-id').value;
      localStorage.accessToken = data.token.access;
      localStorage.refreshToken = data.token.refresh;

      window.setCookie('booth', data.user.email, 1000 * 60 * 60 * 24 * 365);
    })
    .catch(async (error) => {
      if (error.status === 400) {
        password.message =
          '로그인에 실패하였습니다. 이메일 혹은 비밀번호를 확인하여 주십시오.';
        password.focus();
      }
      console.log(error);
    });
}
