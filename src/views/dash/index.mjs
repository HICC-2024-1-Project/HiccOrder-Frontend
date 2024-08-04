import { APIGetRequest, APIDeleteRequest } from '/modules/api.mjs';

document.querySelector('#button-menu').addEventListener('click', () => {
  const wrapper = document.querySelector('body > wrapper');
  const button = document.querySelector('#button-menu');

  if (wrapper.getAttribute('state') == 'open') {
    wrapper.setAttribute('state', 'close');
    button.setAttribute('state', 'close');
  } else {
    wrapper.setAttribute('state', 'open');
    button.setAttribute('state', 'open');
  }
});

document.querySelector('#button-account').addEventListener('click', () => {
  const account = document.querySelector('header > .right > .account');

  if (account.getAttribute('state') == 'open') {
    account.setAttribute('state', 'close');
  } else {
    account.setAttribute('state', 'open');
  }
});

for (const button of document.querySelectorAll(`aside > a[type='button']`)) {
  let href = button.href;
  href = href.replace(/https?:\/?\/?([^/]+)/, '');
  if (location.pathname.startsWith(href)) {
    button.setAttribute('selected', '');
  }
}

function onResize() {
  const wrapper = document.querySelector('body > wrapper');
  const button = document.querySelector('#button-menu');

  if (window.matchMedia('screen and (max-width: 900px)').matches) {
    wrapper.setAttribute('state', 'close');
    button.setAttribute('state', 'close');
  } else {
    wrapper.setAttribute('state', 'open');
    button.setAttribute('state', 'open');
  }
}
window.addEventListener('resize', onResize);
onResize();

async function readBooth() {
  const data = await APIGetRequest(`booth/${localStorage.booth}/`).catch(
    (error) => {
      console.log(error);
    }
  );

  if (!data) {
    return;
  }

  const name = document.querySelector(`#button-account .name`);
  name.innerHTML = data.booth_name || localStorage.booth;
}
readBooth();

async function logout() {
  delete localStorage.accessToken;
  delete localStorage.refreshToken;
  delete localStorage.booth;

  window.setCookie('booth', '', -10000);

  await APIDeleteRequest('auth/');

  window.location.href = '/';
}

document.querySelector('#button-logout').addEventListener('click', () => {
  logout();
});
