// 주문내역 페이지
import { APIGetRequest, APIPostRequest } from '/modules/api.mjs';

document.addEventListener("DOMContentLoaded", function () {
  const orderDetails = document.querySelector(".order-details");
  const addMenuButton = document.querySelector(".add-menu-btn");
  const totalPriceElement = doxument.getElementById("total-price");
  const tableNameElement = document.getElementById("table-name");

  // URL의 쿼리 문자열을 파싱하여 키-값 쌍으로 관리하는 객체URLSearchParams 생성
  // 현재 페이지의 URL에서 쿼리 문자열(window.location.search)을 가져와 이를 파싱하여 URLSearchParams 객체를 생성
  const params = new URLSearchParams(window.location.search);
  const tableId = params.get("table"); // table 이름 가져옴

  if (tableId !== null) {
    loadTableName(tableId); // 테이블 이름
    loadOrderData(tableId); // 주문 내역

    addMenuButton.addEventListener("click", function () {
      addMenuEntry();
    });

    document.querySelector(".save-btn").addEventListener("click", function () {
      saveOrderData(tableId);
    });
  }

  // 메뉴 추가하기
  function addMenuEntry(name = "", quantity = 1, price = 0) {
    const row = document.createElement("tr");
    row.className = "order-entry";
    row.innerHTML = `
      <td><input type="text" class="order-name" value="${name}" /></td>
      <td>
        <input type="number" class="order-quantity" value="${quantity}" min="1" />
        <button class="delete-btn">삭제</button>
      </td>
      <td><input type="number" class="order-price" value="${price}" min="0" /></td>
    `;

    row.querySelector(".delete-btn").addEventListener("click", function () {
      row.remove();
      updateTotalPrice();
    });

    row
      .querySelector(".order-quantity")
      .addEventListener("input", updateTotalPrice);
    row
      .querySelector(".order-price")
      .addEventListener("input", updateTotalPrice);

    orderList.appendChild(row);

    updateTotalPrice();
  }

  // 총액 업데이트하기
  function updateTotalPrice() {
    let totalPrice = 0;

    document.querySelectorAll(".order-entry").forEach(function (entry) {
      const quantity =
        parseInt(entry.querySelector(".order-quantity").value, 10) || 0;
      const price =
        parseInt(entry.querySelector(".order-price").value, 10) || 0;
      totalPrice += quantity * price;
    });
    totalPriceElement.textContent = `${totalPrice.toLocaleString()}원`;
  }

  // 주문내역 로드
  async function loadTableNameAndOrderData(tableId) {
    try {
      const tableResponse = await APIGetRequest(
        `booth/${localStorage.booth}/table/${tableId}`
      );
      const tableData = tableResponse.data;
      // 테이블 이름 로드
      tableNameElement.textContent = `${tableData.table_name} 주문 내역`;

      // 주문정보 가져오기
      const orderResponse = await APIGetRequest(
        `booth/${localStorage.booth}/order/${tableId}`
      );
      const orderData = orderResponse.data;
      orderData.forEach((item) => {
        addMenuEntry(item.menu_name, item.quantity, item.price);
      });

      updateTotalPrice();
    } catch (error) {
      console.log(error);
    }
  }

  async function saveOrderData(tableId) {
    const orderEntries = [];
    document.querySelectorAll(".order-entry").forEach(function (entry) {
      const name = entry.querySelector(".order-name").value;
      const quantity = parseInt(
        entry.querySelector(".order-quantity").value,
        10
      );
      const price = parseInt(entry.querySelector(".order-price").value, 10);
      if (name && quantity && price) {
        orderEntries.push({ menu_name: name, quantity, price });
      }
    });

    try {
      await APIPostRequest(`booth/${localStorage.booth}/order/${tableId}`, {
        content: orderEntries,
      });
    } catch (error) {
      console.log(error);
    }
  }
});
