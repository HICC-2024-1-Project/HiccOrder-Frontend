// orderHistory.js

document.addEventListener("DOMContentLoaded", function () {
    const orderList = document.querySelector(".order-list");
  
    // 저장된 테이블 목록을 로드하여 표시
    const savedTables = JSON.parse(localStorage.getItem("tables")) || [];
    savedTables.forEach(function (table, index) {
      const orderItem = document.createElement("div");
      orderItem.className = "order-item";
      orderItem.innerHTML = `
        <span class="order-icon" style="background-color: ${table.color};"></span>
        <span class="order-name">${table.name}</span>
      `;
      orderItem.addEventListener("click", function () {
        window.location.href = `orderDetails.html?table=${index}`;
      });
      orderList.appendChild(orderItem);
    });
  });
  
  // 테이블 상세 페이지 로드 시 실행
  document.addEventListener("DOMContentLoaded", function () {
    const orderDetails = document.querySelector(".order-details");
    const addMenuButton = document.querySelector(".add-menu-btn");
    const params = new URLSearchParams(window.location.search);
    const tableIndex = params.get("table");
  
    if (tableIndex !== null) {
      const savedTables = JSON.parse(localStorage.getItem("tables")) || [];
      const table = savedTables[tableIndex];
  
      // 메뉴 항목 추가 함수
      function addMenuEntry(name = "", quantity = "", price = "") {
        const orderEntry = document.createElement("div");
        orderEntry.className = "order-entry";
        orderEntry.innerHTML = `
          <input type="text" class="order-name" placeholder="메뉴명" value="${name}" />
          <input type="number" class="order-quantity" placeholder="수량" value="${quantity}" />
          <input type="number" class="order-price" placeholder="가격" value="${price}" />
          <button class="delete-btn">삭제</button>
        `;
        orderEntry.querySelector(".delete-btn").addEventListener("click", function () {
          orderEntry.remove();
        });
        orderDetails.appendChild(orderEntry);
      }
  
      // 기존 메뉴 항목 로드
      table.menu = table.menu || [];
      table.menu.forEach(function (menuItem) {
        addMenuEntry(menuItem.name, menuItem.quantity, menuItem.price);
      });
  
      // '메뉴 추가하기' 버튼 클릭 이벤트
      addMenuButton.addEventListener("click", function () {
        addMenuEntry();
      });
  
      // '뒤로가기' 버튼 클릭 이벤트
      document.querySelector(".back-btn").addEventListener("click", function () {
        window.history.back();
      });
  
      // '결제하기' 버튼 클릭 이벤트
      document.querySelector(".payment-btn").addEventListener("click", function () {
        window.location.href = "payment.html";
      });
  
      // '저장하기' 버튼 클릭 이벤트
      document.querySelector(".save-btn").addEventListener("click", function () {
        const menuItems = [];
        document.querySelectorAll(".order-entry").forEach(function (entry) {
          const name = entry.querySelector(".order-name").value;
          const quantity = entry.querySelector(".order-quantity").value;
          const price = entry.querySelector(".order-price").value;
          if (name && quantity && price) {
            menuItems.push({ name, quantity, price });
          }
        });
        savedTables[tableIndex].menu = menuItems;
        localStorage.setItem("tables", JSON.stringify(savedTables));
        alert("저장되었습니다.");
      });
    }
  });
  