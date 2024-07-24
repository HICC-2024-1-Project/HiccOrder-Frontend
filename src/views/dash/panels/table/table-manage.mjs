// 테이블 관리 페이지

document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.querySelector(".add-btn"); // 추가하기
  const saveButton = document.querySelector(".save-btn"); // 저장하기
  const tableManagement = document.querySelector(".tableManagement");

  let tableCount = 0; // 초기 테이블 수 0으로 세팅

  // 기존 저장된 테이블 정보를 로드하는 함수
  function loadSavedTables() {
    const savedTables = JSON.parse(localStorage.getItem("tables")) || [];
    // const savedTables = JSON.parse(localStorage.getItem("tables")) || []; 이 코드 계속 갖다씀
    savedTables.forEach(function (table) {
      tableCount++;
      // 테이블 추가하는 경우
      const newTableEntry = document.createElement("div");
      newTableEntry.className = "table-entry";
      newTableEntry.innerHTML = `
        <span class="table-icon" style="background-color: ${table.color};"></span>
        <input type="text" value="${table.name}" />
        <button class="delete-btn">삭제</button>
      `;
      tableManagement.insertBefore(newTableEntry, addButton);

      newTableEntry
        .querySelector(".delete-btn")
        .addEventListener("click", function () {
          tableManagement.removeChild(newTableEntry);
          tableCount--;
          saveTables(); // 테이블 삭제 후 저장
        });
    });
  }

  // 테이블 정보를 저장하는 함수
  function saveTables() {
    const tableEntries = tableManagement.querySelectorAll(".table-entry input");
    const tables = [];
    tableEntries.forEach(function (entry) {
      if (entry.value) {
        tables.push({
          name: entry.value,
          color: entry.previousElementSibling.style.backgroundColor,
        });
      }
    });
    localStorage.setItem("tables", JSON.stringify(tables));
    console.log("저장된 테이블:", tables);
  }

  addButton.addEventListener("click", function () {
    tableCount++;
    const newTableEntry = document.createElement("div");
    newTableEntry.className = "table-entry";

    // 홀수/짝수 순서에 따라 아이콘 색상 변경
    const iconColor = tableCount % 2 === 0 ? "#000000" : "#ff643c";
    newTableEntry.innerHTML = `
      <span class="table-icon" style="background-color: ${iconColor};"></span>
      <input type="text" placeholder="입력하세요" />
      <button class="delete-btn">삭제</button>
    `;
    tableManagement.insertBefore(newTableEntry, addButton);

    newTableEntry
      .querySelector(".delete-btn")
      .addEventListener("click", function () {
        tableManagement.removeChild(newTableEntry);
        tableCount--; // 삭제 시 테이블 개수 감소
        saveTables(); // 테이블 삭제 후 저장
      });

    saveTables(); // 테이블 추가 후 저장
  });

  saveButton.addEventListener("click", function () {
    saveTables(); // "저장하기" 버튼을 눌렀을 때 테이블 정보를 저장
  });

  loadSavedTables(); // 페이지 로드 시 기존 저장된 테이블 정보를 불러옴
});
