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
  image: document.querySelector('#button-menu-manage-image'),
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

async function postImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpeg, image/png, image/webp';

  input.addEventListener('change', (event) => {
    const files = event.target.files;

    if (files.length < 1) {
      // 선택된 파일 없음
      return;
    }

    const formData = new FormData();
    formData.append('image', files[0]);

    fetch('/profiles/@me/image', {
      method: 'PATCH',
      headers: {}, // 비워 놓아야 함
      body: formData,
    })
      .then((res) => {
        // 이미지 업로드 완료
        alert('업로드 성공');
        //window.location.reload();
      })
      .catch((error) => {
        // 오류
      });
  });

  input.click();
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
  button.image.addEventListener('click', postImage);
})();
