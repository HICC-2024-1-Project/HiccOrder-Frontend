// localStorage에서 메뉴 데이터를 초기화하거나, 없으면 빈 배열로 설정
let menuData = JSON.parse(localStorage.getItem('menuData')) || [];

// 메뉴 사진 업로드 (미구현)

// 메뉴 추가
document.getElementById('add-menu').addEventListener('click', function () {
  const menuManagement = document.querySelector('.menu-management');

  const menuData = {
    // 이건 booth.js에서.. 구조체
    name: document.getElementById('manu-name').value,
    price: document.getElementById('manu-price').value,
  };

  // 메뉴 추가 누르면 팝업창 꺼지면서 뒤에 내가 추가한 메뉴가 또 떠야하잖아..
  const newRow = document.createElement('div');
  newRow.className = 'menu-row';
  newRow.innerHTML = `
        <div name="menuName">${menuData.name}</div>
        <div name="menuPrice">${menuData.price}</div>
        <button type="button" id="edit-menu">수정(미구현)</button>
        <button type="button" id="delete-menu">삭제</button>
    `;
  menuManagement.appendChild(newRow);
});
// 메뉴 추가 버튼으로 팝업창 닫기
var layerpopup = document.getElementById('layerpopup');
var add = document.getElementById('add-menu');
add.addEventListener('click', function () {
  layerpopup.checked = false;
});

// 데이터 저장하기 왜 안됨 ㅜㅜㅜㅜ
// 아... 위에서 메뉴 추가할때 menuData가 다른 값으로 바뀌니깐 null이 되는건가?
document.getElementById('save-menu').addEventListener('click', function () {
  // 얘는 tableManagement.js에서.. 구조체 배열
  const menusss = [];
  document.querySelectorAll('.menu-management .menu-row').forEach((row) => {
    console.log(row);
    const menuData = {
      name: row.querySelector(`[name="menuName"]`).innerHTML,
      price: row.querySelector(`[name="menuPrice"]`).innerHTML,
    };
    // menuData.name = row.querySelector('input[type="text"]').value,
    // menuData.price = row.querySelector('input[type="text"]')[1].value;
    menusss.push(menuData);
  });
  localStorage.setItem('menusss', JSON.stringify(menusss));
  alert('메뉴 정보가 저장되었습니다.');
});

// 데이터 불러오기 ok??? 아직 모름... 저장이 안되는데 뭐
function loadMenuData() {
  const menusss = JSON.parse(localStorage.getItem('menusss'));
  if (menusss) {
    const menuManagement = document.querySelector('.menu-management');
    menusss.forEach((menuData, index) => {
      const newRow = document.createElement('div');
      newRow.className = 'menu-row';
      newRow.innerHTML = `
                <input type="text" value="${menuData.name}" readonly>
                <input type="text" value="${menuData.price}" readonly>
                <button type="button">삭제</button>
            `;
      menuManagement.appendChild(newRow);
    });
  }
}

loadMenuData();

// 삭제
document
  .querySelector('.menu-management')
  .addEventListener('click', function (event) {
    if (
      event.target.tagName === 'BUTTON' &&
      event.target.textContent === '삭제'
    ) {
      event.target.parentElement.remove();
    }
  });
