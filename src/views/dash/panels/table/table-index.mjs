import {
  APIGetRequest,
  APIPostRequest,
  APIDeleteRequest,
} from '/modules/api.mjs';

document.addEventListener('DOMContentLoaded', function () {
  const addButton = document.querySelector('.add-btn');
  const saveButton = document.querySelector('.save-btn');
  const tableList = document.querySelector('.table-list');
  const tableNameInput = document.getElementById('table-name-input');

  console.log('DOMContentLoaded 이벤트 실행');
  console.log('addButton 요소:', addButton);
  console.log('saveButton 요소:', saveButton);
  console.log('tableList 요소:', tableList);
  console.log('tableNameInput 요소:', tableNameInput);

  let tableCount = 0;

  // 서버에서 테이블 목록을 불러오는 함수
  async function loadTableData() {
    try {
      console.log('GET 요청 전송: booth/' + localStorage.booth + '/table/');
      const response = await APIGetRequest(
        `booth/${localStorage.booth}/table/`
      );
      console.log('GET 응답 수신:', response);
      const tableData = response || [];

      tableList.innerHTML = '';

      tableData.forEach((table) => {
        addTableToDOM(table.id, table.table_name);
      });
      tableCount = tableData.length; // 테이블 수 업데이트
    } catch (error) {
      console.log('테이블 목록 불러오기 중 오류 발생:', error);
    }
  }

  // DOM에 테이블 항목을 추가하는 함수
  function addTableToDOM(id, name) {
    console.log(`DOM에 테이블 추가: ${id}, ${name}`);

    const tableItem = document.createElement('div');
    tableItem.style.border = 'solid 1px red';
    tableItem.className = 'table-item';
    tableItem.dataset.id = id || 'undefined';
    tableItem.innerHTML = `
        <h3>${name}</h3>
        <div class="menu">
          <button onclick="location.href = '/dash/table/${id}/qr'">QR 생성</button>
          <button onclick="location.href = '/dash/table/${id}/history'">주문 현황</button>
          <button onclick="location.href = '/dash/table/${id}/pay'">결제</button>
          <button class="delete-btn">삭제</button>
        </div>
    `;

    // 테이블 삭제
    // Delete
    tableItem
      .querySelector('.delete-btn')
      .addEventListener('click', async function () {
        APIDeleteRequest(`booth/${localStorage.booth}/table/${id}/`)
          .then(() => {
            tableItem.remove();
            console.log(`테이블 삭제 완료: ${id}`);
          })
          .catch((error) => {
            console.log('테이블 삭제 중 오류 발생', error);
          });
      });

    tableList.appendChild(tableItem);
  }

  // 테이블 추가 함수
  // POST
  addButton.addEventListener('click', async function () {
    console.log('추가하기 버튼 클릭');

    const newTableName = tableNameInput.value.trim(); // 문자 앞뒤 공백 제거 trim()
    if (newTableName == '') {
      alert('테이블 이름을 입력하세요');
      return;
    }

    APIPostRequest(`booth/${localStorage.booth}/table/`, {
      table_name: newTableName,
    })
      .then((response) => {
        console.log(`테이블 추가 성공 - ${newTableName}`, response);

        // 입력칸초기화
        tableNameInput.value = '';

        // 전체 테이블 목록 다시 가져오기
        // 오류
        loadTableData();
      })
      .catch((error) => {
        console.log('테이블 추가 중 오류 발생', error);
      });
  });

  loadTableData();
});

/* 콘솔창에 테스트하는 용도
import { APIGetRequest, APIPostRequest, APIDeleteRequest } from '/modules/api.mjs';

document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.querySelector(".add-btn");
    const tableNameInput = document.getElementById("table-name-input");

    // 콘솔 로그로 이벤트 리스너가 추가되는지 확인
    console.log("DOMContentLoaded 이벤트가 실행되었습니다.");
    console.log("addButton 요소:", addButton);

    addButton.addEventListener("click", async function () {
        console.log("추가하기 버튼이 클릭되었습니다.");
        
        const newTableName = tableNameInput.value.trim();
        if (newTableName === "") {
            alert("테이블 이름을 입력하세요");
            return;
        }

        try {
            console.log("API 요청 전송: ", newTableName);
            // 서버에 새로운 테이블 생성 요청을 보냄
            const response = await APIPostRequest(`booth/${localStorage.booth}/table/`, {
                table_name: newTableName,
            });

            console.log("API 응답 수신: ", response);

            // 요청이 성공하면 서버는 상태 코드 204를 반환함
            if (response.status === 204) {
                console.log("테이블 추가 성공");
                // 클라이언트 측에서 임의의 ID 생성
                const newTableId = `table-${Date.now()}`;
                console.log("생성된 테이블 ID: ", newTableId);
                // 새로운 테이블 정보를 사용하여 화면에 추가
                addTableToDOM(newTableId, newTableName);
                // 입력칸 초기화
                tableNameInput.value = "";
            } else {
                console.error(`테이블 추가 실패: ${response.status}`);
            }
        } catch (error) {
            console.error("테이블 추가 중 오류 발생:", error);
        }
    });
});

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

    // 테이블 삭제 버튼 이벤트 리스너
    tableItem.querySelector(".delete-btn").addEventListener("click", async function () {
        try {
            console.log(`테이블 삭제 요청 전송: ${id}`);
            await APIDeleteRequest(`booth/${localStorage.booth}/table/${id}`);
            tableItem.remove();
            console.log(`테이블 삭제 완료: ${id}`);
        } catch (error) {
            console.log(error);
        }
    });

    // 테이블 목록에 새로운 테이블 항목 추가
    console.log("새 테이블 항목 추가:", tableItem);
    document.querySelector(".table-list").appendChild(tableItem);
}

// 서버에서 테이블 목록을 불러오는 함수 (추가적인 함수)
async function loadTableData() {
    try {
        const response = await APIGetRequest(`booth/${localStorage.booth}/table/`);
        const tableData = response?.data || [];

        tableData.forEach((table) => {
            addTableToDOM(table.id, table.table_name);
        });
        tableCount = tableData.length; // 테이블 수 업데이트
    } catch (error) {
        console.log(error);
    }
}

document.addEventListener("DOMContentLoaded", loadTableData);
*/
