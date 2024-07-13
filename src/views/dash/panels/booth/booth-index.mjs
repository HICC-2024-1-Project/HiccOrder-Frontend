// 부스 사진 업로드 및 미리보기
const boothPhotoInput = document.getElementById('booth-photo-input');
const boothPhoto = document.getElementById('booth-photo');
const previewButton = document.getElementById('preview-button');

boothPhotoInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      boothPhoto.src = e.target.result;
      boothPhoto.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

previewButton.addEventListener('click', function () {
  if (boothPhotoInput.files.length === 0) {
    alert('먼저 사진을 업로드해주세요.');
    return;
  }
  const file = boothPhotoInput.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const previewWindow = window.open();
    previewWindow.document.write(
      '<img src="' + e.target.result + '" alt="부스 사진">'
    );
  };
  reader.readAsDataURL(file);
});

// 데이터 저장하기
document.getElementById('save-booth').addEventListener('click', function () {
  const boothData = {
    photo: boothPhoto.src,
    name: document.getElementById('booth-name').value,
    bank: document.getElementById('bank').value,
    accountName: document.getElementById('account-name').value,
    accountNumber: document.getElementById('account-number').value,
  };
  localStorage.setItem('boothData', JSON.stringify(boothData));
  alert('부스 정보가 저장되었습니다.');
});

// 부스 정보 불러오기 및 표시
function loadBoothData() {
  const boothData = JSON.parse(localStorage.getItem('boothData'));
  if (boothData) {
    if (boothPhoto.src.length != 0) {
      const boothPhoto = document.getElementById('booth-photo');
      boothPhoto.src = boothData.photo;
      boothPhoto.style.display = 'block';
    }

    const boothName = document.getElementById('booth-name');
    boothName.value = boothData.name;

    const bankSelect = document.getElementById('bank');
    bankSelect.value = boothData.bank;

    const accountName = document.getElementById('account-name');
    accountName.value = boothData.accountName;

    const accountNumber = document.getElementById('account-number');
    accountNumber.value = boothData.accountNumber;
  }
}

// 페이지 로드할 때 저장된 부스정보 로드
loadBoothData();
