import {
  APIGetRequest,
  APIPostRequest,
  APIPatchRequest,
  APIDeleteRequest,
} from '/modules/api.mjs';

const bid = localStorage.booth;
const input = {
  category: document.querySelector('#input-menu-manage-category'),
  name: document.querySelector('#input-menu-manage-name'),
  price: document.querySelector('#input-menu-manage-price'),
  desc: document.querySelector('#input-menu-manage-desc'),
};
const button = {
  create: document.querySelector('#button-menu-manage-create'),
  update: document.querySelector('#button-menu-manage-update'),
  delete: document.querySelector('#button-menu-manage-delete'),
  imageUpload: document.querySelector('#button-menu-manage-upload-image'),
};

async function createMenu() {
  await APIPostRequest(`booth/${bid}/menu/`, {
    category: input.category.value,
    menu_name: input.name.value,
    price: input.price.value,
    description: input.desc.value,
  })
    .then(() => {
      window.location.href = '/dash/menu';
    })
    .catch((error) => {
      if (error.status == 400) {
        error.json().then((errorData) => {
          input.category.message = `<span style="color:red;">${
            errorData.category || ''
          }</span>`;
          input.name.message = `<span style="color:red;">${
            errorData.menu_name || ''
          }</span>`;
          input.price.message = `<span style="color:red;">${
            errorData.price || ''
          }</span>`;
          input.desc.message = `<span style="color:red;">${
            errorData.description || ''
          }</span>`;
        });
      }
    });
}

async function updateMenu() {
  await APIPatchRequest(`booth/${bid}/menu/${mid}/`, {
    category: input.category.value,
    menu_name: input.name.value,
    price: input.price.value,
    description: input.desc.value,
  })
    .then(() => {
      window.location.href = '/dash/menu';
    })
    .catch((error) => {
      if (error.status == 400) {
        error.json().then((errorData) => {
          input.category.message = `<span style="color:red;">${
            errorData.category || ''
          }</span>`;
          input.name.message = `<span style="color:red;">${
            errorData.menu_name || ''
          }</span>`;
          input.price.message = `<span style="color:red;">${
            errorData.price || ''
          }</span>`;
          input.desc.message = `<span style="color:red;">${
            errorData.description || ''
          }</span>`;
        });
      }
    });
}

async function deleteMenu() {
  await APIDeleteRequest(`booth/${bid}/menu/${mid}/`)
    .then(() => {
      window.location.href = '/dash/menu';
    })
    .catch((error) => {});
}

(async () => {
  if (!mid) {
    button.update.style.display = 'none';
    button.delete.style.display = 'none';
  } else {
    button.create.style.display = 'none';

    const menu = await APIGetRequest(`booth/${bid}/menu/${mid}/`).catch(
      (error) => {
        window.location.href = '/dash/menu';
      }
    );
    input.category.value = menu.category;
    input.name.value = menu.menu_name;
    input.price.value = menu.price;
    input.desc.value = menu.description;
  }

  button.create.addEventListener('click', createMenu);
  button.update.addEventListener('click', updateMenu);
  button.delete.addEventListener('click', deleteMenu);
})();
