document
  .querySelector('#input-auth-terms-checkbox')
  .addEventListener('change', (event) => {
    document.querySelector('#button-auth-accept').disabled =
      !document.querySelector('#input-auth-terms-checkbox').checked;
  });

document
  .querySelector('#button-auth-accept')
  .addEventListener('click', (event) => {
    window.location.href = '/auth/register';
  });
