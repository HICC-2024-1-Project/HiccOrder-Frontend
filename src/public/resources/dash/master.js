import {
  APIGetRequest,
  APIPostRequest,
  APIDeleteRequest,
} from '../../modules/api.mjs';

window.register = async () => {
  const data = await APIPostRequest('auth/sign/', {
    email: 'example@example.com',
    password: 'password',
  });
  console.log(data);
};

window.login = async () => {
  const data = await APIPostRequest('auth/', {
    email: 'example@example.com',
    password: 'password',
  });
  localStorage.accessToken = data.token.access;
  localStorage.refreshToken = data.token.refresh;
  console.log(data);
};

window.logout = async () => {
  delete localStorage.accessToken;
  delete localStorage.refreshToken;
  const data = await APIDeleteRequest('auth/');
  console.log(data);
};

window.booth = async () => {
  const data = await APIGetRequest('booth/example@example.com/');
  console.log(data);
};
