document.querySelector('#button-menu').addEventListener('click', () => {
  const wrapper = document.querySelector('body > wrapper');

  if (wrapper.getAttribute('state') == 'open') {
    wrapper.setAttribute('state', 'close');
  } else {
    wrapper.setAttribute('state', 'open');
  }
});

for (const button of document.querySelectorAll(`aside > a[type='button']`)) {
  let href = button.href;
  href = href.replace(/https?:\/?\/?([^/]+)/, '');
  if (location.pathname.startsWith(href)) {
    button.setAttribute('selected', '');
  }
}
