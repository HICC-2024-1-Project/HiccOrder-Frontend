import { APIPostRequest, APIPatchRequest } from '/modules/api.mjs';

const button = document.querySelector('#button-auth-reset');

button.addEventListener('click', reset);

const button2 = document.querySelector('#button-auth-code');

button2.addEventListener('click', verify);

async function verify() {
  const email = document.querySelector('#input-auth-reset-email');
  const code = document.querySelector('#input-auth-reset-code');
  const password = document.querySelector('#input-auth-reset-password');
  const retype = document.querySelector('#input-auth-reset-password-retype');

  email.message = '';

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

  APIPostRequest('auth/password/', {
    email: email.value,
  })
    .then((data) => {
      code.disabled = false;
      password.disabled = false;
      retype.disabled = false;
      button.disabled = false;
      code.focus();
    })
    .catch(async (error) => {
      code.disabled = false;
      password.disabled = false;
      retype.disabled = false;
      button.disabled = false;
      code.focus();
      console.log(error);
    });
}

async function reset() {
  const email = document.querySelector('#input-auth-reset-email');
  const code = document.querySelector('#input-auth-reset-code');
  const password = document.querySelector('#input-auth-reset-password');
  const retype = document.querySelector('#input-auth-reset-password-retype');

  email.message = '';
  code.message = '';
  password.message = '';
  retype.message = '';

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

  if (!code.value) {
    code.message = '계정 인증 코드를 입력해주세요.';
    code.focus();
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

  APIPatchRequest('auth/password/verify/', {
    email: email.value,
    code: code.value,
    password: password.value,
  })
    .then((data) => {
      console.log(data);
    })
    .catch(async (error) => {
      if (error.status === 400) {
        email.message = '이미 사용 중인 이메일입니다.';
        email.focus();
      }
      console.log(error);
    });
}
