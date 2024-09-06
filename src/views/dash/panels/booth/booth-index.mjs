import {
  APIGetRequest,
  APIPatchRequest,
  APIDeleteRequest,
} from '/modules/api.mjs';

const bid = localStorage.booth;
const input = {
  email: document.querySelector('#input-booth-index-email'),
  name: document.querySelector('#input-booth-index-name'),
  desc: document.querySelector('#input-booth-index-desc'),
  bankName: document.querySelector('#input-booth-index-bank-name'),
  bankAccountNumber: document.querySelector(
    '#input-booth-index-bank-account-number'
  ),
  bankAccountOwner: document.querySelector(
    '#input-booth-index-bank-account-owner'
  ),
};
const image = document.querySelector('#booth-index-image > img');

async function readBooth() {
  const data = await APIGetRequest(`booth/${bid}/`).catch((error) => {
    console.log(error);
  });

  if (!data) {
    return;
  }

  input.email.value = data.email;
  input.name.value = data.booth_name;
  input.bankName.value = data.bank_name;
  input.bankAccountNumber.value = data.account_number;
  input.bankAccountOwner.value = data.banker_name;
  image.src = data.booth_image_url || '';
}

async function updateBooth() {
  await APIPatchRequest(`booth/${bid}/`, {
    booth_name: input.name.value,
    bank_name: input.bankName.value,
    account_number: input.bankAccountNumber.value,
    banker_name: input.bankAccountOwner.value,
  })
    .then(() => {
      window.location.reload();
    })
    .catch((error) => {
      if (error.status == 400) {
        error.json().then((errorData) => {
          console.log(errorData);
          input.name.message = `<span style="color:red;">${
            errorData.booth_name || ''
          }</span>`;
          input.bankName.message = `<span style="color:red;">${
            errorData.bank_name || ''
          }</span>`;
          input.bankAccountNumber.message = `<span style="color:red;">${
            errorData.account_number || ''
          }</span>`;
          input.bankAccountOwner.message = `<span style="color:red;">${
            errorData.banker_name || ''
          }</span>`;
        });
      }

      console.error(error);
    });
}

async function updateBoothImage() {}

async function deleteBooth() {
  if (
    !confirm(
      '정말로 계정을 삭제하시겠습니까? 계정 삭제 시 모든 부스 관련 정보가 즉시 제거되며 복구할 수 없습니다.'
    )
  ) {
    return;
  }

  if (
    prompt(
      `계정 삭제를 계속하려면 아래의 입력창에 '${window.bid}'를 입력하여 주십시오`
    ) !== window.bid
  ) {
    return;
  }

  await APIDeleteRequest(`auth/sign/`)
    .then(() => {
      alert('계정 삭제가 정상적으로 처리되었습니다.');

      window.location.href = '/';
    })
    .catch((error) => {
      error.json().then(console.log);
    });
}

const imageButton = document.querySelector('#button-booth-index-image-upload');

(async () => {
  readBooth();

  document
    .querySelector('#button-booth-index-update')
    .addEventListener('click', () => {
      updateBooth();
    });

  document
    .querySelector('#button-booth-index-delete')
    .addEventListener('click', () => {
      deleteBooth();
    });

  imageButton.addEventListener('click', () => {
    postImage();
  });
})();

async function postImage() {
  const btn = imageButton;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpeg, image/png, image/webp';

  input.addEventListener('change', (event) => {
    const files = event.target.files;

    if (files.length < 1) {
      // 선택된 파일 없음
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '업로드 중...';

    const formData = new FormData();
    formData.append('file', files[0]);

    fetch(`https://api.ho.ccc.vg/api/s3/booth/${bid}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
      body: formData,
    })
      .then((res) => {
        if (res.status >= 200) {
          window.location.reload();
        } else {
          res.text().then((data) => {
            console.error(data);
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
}
