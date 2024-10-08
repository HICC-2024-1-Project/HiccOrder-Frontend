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
const image = document.querySelector('#menu-manage-image > img');

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
  const btn = button.image;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpeg, image/png, image/webp';

  input.addEventListener('change', async (event) => {
    const files = event.target.files;

    if (files.length < 1) {
      // 선택된 파일 없음
      return;
    }

    const file = files[0];
    const resized = await resizeImage(file);
    const resizedFile = dataURItoBlob(resized.src);

    btn.disabled = true;
    btn.innerHTML = '업로드 중...';

    const formData = new FormData();
    formData.append('file', resizedFile);

    fetch(`https://api.ho.ccc.vg/api/s3/booth/${bid}/menu/${mid}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
      body: formData,
    })
      .then((res) => {
        if (200 <= res.status && res.status <= 299) {
          window.location.reload();
        } else {
          res.json().then((data) => {
            alert(data.message);
            btn.disabled = false;
            btn.innerHTML = '이미지 업로드';
          });
        }
      })
      .catch((error) => {
        console.error(error);
        btn.disabled = false;
        btn.innerHTML = '이미지 업로드';
      });
  });

  input.click();

  function resizeImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          let s;
          if (img.width > img.height) {
            s = 500 / img.width;
          } else {
            s = 500 / img.height;
          }
          canvas.width = img.width * s;
          canvas.height = img.height * s;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const resizedDataURL = canvas.toDataURL('image/jpeg');
          const resized = new Image();
          resized.src = resizedDataURL;
          resolve(resized);
        };
      };
    });
  }

  // https://stackoverflow.com/questions/6850276/how-to-convert-dataurl-to-file-object-in-javascript
  function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
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
    image.src = menu.menu_image_url;
  }

  button.create.addEventListener('click', createMenu);
  button.update.addEventListener('click', updateMenu);
  button.delete.addEventListener('click', deleteMenu);
  button.image.addEventListener('click', postImage);
})();
