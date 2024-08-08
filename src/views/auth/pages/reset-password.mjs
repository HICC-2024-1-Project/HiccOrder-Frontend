import { APIPostRequest, APIPatchRequest } from '/modules/api.mjs';

const button = document.querySelector('#button-auth-reset');

button.addEventListener('click', updatePassword);

const button2 = document.querySelector('#button-auth-code');

button2.addEventListener('click', createVerifyCode);

async function createVerifyCode() {
  const email = document.querySelector('#input-auth-reset-email');
  const code = document.querySelector('#input-auth-reset-code');
  const password = document.querySelector('#input-auth-reset-password');
  const retype = document.querySelector('#input-auth-reset-password-retype');

  email.message = '';

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

  APIPostRequest('auth/password/', {
    email: email.value,
  })
    .then((data) => {
      code.disabled = false;
      password.disabled = false;
      retype.disabled = false;
      button.disabled = false;
      code.focus();

      noty(
        '입력하신 이메일로 계정 인증 코드를 발송하였습니다. <br> 이메일 확인 후 인증 코드를 입력하여 주십시오.'
      );
    })
    .catch(async (error) => {
      if (error.status === 404) {
        password.focus();
        noty(`입력한 이메일에 해당하는 계정을 찾을 수 없습니다.`, 'error');
      } else if (error.status >= 500) {
        noty(`서버 오류.`, 'error');
        console.log(error);
      }
    });
}

async function updatePassword() {
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

  if (!email.value.match(/[^@]+@[^.]+\.[^.]+/)) {
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

  APIPostRequest('auth/password/verify/', {
    email: email.value,
    verify_number: code.value,
    password: password.value,
  })
    .then((data) => {
      alert('비밀번호가 변경되었습니다. 다시 로그인하십시오.');
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
