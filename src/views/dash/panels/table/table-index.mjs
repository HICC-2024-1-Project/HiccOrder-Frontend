import {
  APIGetRequest,
  APIPostRequest,
  APIDeleteRequest,
} from "/modules/api.mjs";

document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.querySelector(".add-btn");
  const saveButton = document.querySelector(".save-btn");
  const tableList = document.querySelector(".table-list");
  const tableNameInput = document.getElementById("table-name-input");

  let tableCount = 0;

  // 서버에서 테이블 목록을 불러오는 함수
  async function loadTableData() {
    try {
      const response = await APIGetRequest(
        `booth/${localStorage.booth}/table/`
      );
      const tableData = response.data;
      tableData.forEach((table) => {
        addTableToDOM(table.id, table.table_name);
      });
      tableCount = tableData.length; // 테이블 수 업데이트
    } catch (error) {
      console.log(error);
    }
  }

  // DOM에 테이블 항목을 추가하는 함수
  function addTableToDOM(id, name) {
    const tableItem = document.createElement("div");
    tableItem.className = "table-item";
    tableItem.dataset.id = id;
    tableItem.innerHTML = `
        <h3>${name}</h3>
        <button onclick="location.href = '/table/${id}/qr'">QR 생성</button>
        <button onclick="location.href = '/table/${id}/history'">주문 현황</button>
        <button onclick="location.href = '/table/${id}/payment'">결제</button>
        <button class="delete-btn">삭제</button>
    `;

    // 테이블 삭제
    // Delete
    tableItem
      .querySelector(".delete-btn")
      .addEventListener("click", async function () {
        try {
          await APIDeleteRequest("booth/${localStorage.booth}/table/${id}");
          tableItem.remove();
        } catch (error) {
          console.log(error);
        }
      });

    tableList.appendChild(tableItem);
  }

  // 테이블 추가 함수
  // POST
  addButton.addEventListener("click", async function () {
    const newTableName = tableNameInput.value.trim();
    if (newTableName == "") {
      alert("테이블 이름을 입력하세요");
      return;
    }
    try {
      const response = await APIPostRequest(
        "booth/${localStorage.booth}/table",
        {
          table_name: newTableName,
        }
      );
      // 테이블 추가 성공
      if (response.status == 204) {
        loadTableData();
        // 입력칸초기화
        tableNameInput.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  });

  loadTableData();
});

/* import { APIGetRequest } from '/modules/api.mjs';

// 모든 테이블 정보 불러오기
// 로컬에 저장된 booth, accessToken을 사용해서 서버에서 테이블 정보 불러오기
async function loadTableData() {
  const response = await APIGetRequest('booth/${localStorage.booth}/table/')
  .catch((error) => {
    console.log(error);
  })

  .then(response => {
    const tableData = response;
    const tableManagement = document.querySelector('.table-management');
    tableData.forEach((table) => {
      const row = document.createElement('div');
      row.className = 'table-row';
      rRow.dataset.id = table.id;
      row.innerHTML = `<input type="text" value="${table.table_name}" readonly>`;
      tableManagement.appendChild(row);
    });
  });
}

loadTableData();
*/
