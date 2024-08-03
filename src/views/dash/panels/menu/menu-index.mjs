// 메뉴 관리
document.getElementById('add-menu').addEventListener('click', function () {
  const menuManagement = document.querySelector('.menu-management');
  const newRow = document.createElement('div');
  newRow.className = 'table-row';
  newRow.innerHTML = `
      <input type="text" placeholder="메뉴 이름">
      <input type="text" placeholder="가격">
      <button type="button">삭제</button>
  `;
  menuManagement.insertBefore(newRow, document.getElementById('add-menu'));
});

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

// 데이터 저장하기
document.getElementById('save-menu').addEventListener('click', function () {
  const menuData = [];
  document.querySelectorAll('.menu-management .table-row').forEach((row) => {
    const menuName = row.querySelector('input[placeholder="메뉴 이름"]').value;
    const menuPrice = row.querySelector('input[placeholder="가격"]').value;
    menuData.push({ name: menuName, price: menuPrice });
  });
  localStorage.setItem('menuData', JSON.stringify(menuData));
  alert('메뉴 정보가 저장되었습니다.');
});
