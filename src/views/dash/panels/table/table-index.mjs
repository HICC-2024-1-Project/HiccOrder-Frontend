// 테이블 추가
document.getElementById('add-table').addEventListener('click', function () {
  const tableManagement = document.querySelector('.table-management');
  const tableRows = tableManagement.querySelectorAll('.table-row');
  const nextTableNumber = tableRows.length + 1;

  const newRow = document.createElement('div');
  newRow.className = 'table-row';
  newRow.innerHTML = `
      <input type="text" value="테이블 ${nextTableNumber}" readonly>
  `;
  tableManagement.appendChild(newRow);
});

// 테이블 삭제
document.getElementById('delete-table').addEventListener('click', function () {
  const tableManagement = document.querySelector('.table-management');
  const tableRows = tableManagement.querySelectorAll('.table-row');
  if (tableRows.length < 2) {
    alert('최소 한 개의 테이블이 필요합니다.');
    return;
  } else tableManagement.removeChild(tableRows[tableRows.length - 1]);
});

// 데이터 저장하기
document.getElementById('save-table').addEventListener('click', function () {
  const tableData = [];
  document.querySelectorAll('.table-management .table-row').forEach((row) => {
    tableData.push(row.querySelector('input').value);
  });
  localStorage.setItem('tableData', JSON.stringify(tableData));
  alert('테이블 정보가 저장되었습니다.');
});

// 테이블 정보 불러오기
function loadTableData() {
  const tableData = JSON.parse(localStorage.getItem('tableData'));
  if (tableData) {
    const tableManagement = document.querySelector('.table-management');
    const tableRows = tableManagement.querySelectorAll('.table-row');

    for (let i = 0; i < 3; i++) {
      tableManagement.removeChild(tableRows[i]);
    }
    tableData.forEach((tableName, index) => {
      const newRow = document.createElement('div');
      newRow.className = 'table-row';
      newRow.innerHTML = `
              <input type="text" value="${tableName}" readonly>
          `;
      tableManagement.appendChild(newRow);
    });
  }
}

loadTableData();
