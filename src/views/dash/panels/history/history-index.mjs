import { APIGetRequest, APIPatchRequest, APIDeleteRequest, APIPostRequest } from '/modules/api.mjs';

document.addEventListener("DOMContentLoaded", function () {
  loadOrders();

  async function loadOrders() {
    try {
      // 부스아이디: 로컬에서 가져옴
      const boothId = localStorage.booth;
      // 부스의 모든 주문목록 가져오기?
      const orderResponse = await APIGetRequest(`booth/${boothId}/order/`);
      // orders: 서버에서 받은 주문 데이터를 저장하는 배열
      const orders = orderResponse.data.content;
      const orderList = document.getElementById("order-list");
      
      // 각 주문별로 cell 만들기!!!!!!!!!!!!
      orders.forEach(order => {
        const orderCell = createOrderCell(order);
        orderList.appendChild(orderCell);
      });
    } 
    catch (error) {
      console.log(error);
    }
  }

  // 주문 객체로 새로운 div요소를 만들기..
  // 셀 만들기~!
  function createOrderCell(order) {
    const orderCell = document.createElement("div");
    orderCell.className = "order-cell";
    
    //테이블명
    const tableName = document.createElement("h2");
    tableName.textContent = `${order.table_name}`;
    
    // 주문시간
    const orderTime = document.createElement("p");
    orderTime.textContent = new Date(order.timestamp).toLocaleTimeString();
    
    // 메뉴 * 수량
    const orderDetails = document.createElement("p");
    orderDetails.textContent = `${order.menu_name} * ${order.quantity}`;
    
    const orderButtons = document.createElement("div");
    orderButtons.className = "order-buttons";
    
    // 주문취소
    const cancelButton = document.createElement("button");
    cancelButton.className = "cancel-button";
    cancelButton.textContent = "주문 취소";
    // 누르면 주문 취소
    cancelButton.addEventListener("click", () => cancelOrder(order, orderCell, cancelButton));
    
    // 주문확인
    const confirmButton = document.createElement("button");
    confirmButton.className = "confirm-button";
    confirmButton.textContent = "주문 확인";
    // 누르면 주문 확인 (처리완료)
    confirmButton.addEventListener("click", () => confirmOrder(order, confirmButton));
    
    orderCell.appendChild(tableName);
    orderCell.appendChild(orderTime);
    orderCell.appendChild(orderDetails);
    orderCell.appendChild(orderButtons);
    // 버튼
    orderButtons.appendChild(cancelButton);
    orderButtons.appendChild(confirmButton);
    
    return orderCell;
  }

  // 주문 취소하는 함수
  // DELETE
  async function cancelOrder(order, orderCell, button) {
    try {
      const boothId = localStorage.booth;
      const response = await APIDeleteRequest(`booth/${boothId}/order/${order.table_id}/${order.order_id}/`);
      
      if (response.status == 204) {
        button.textContent = "취소 완료";
        button.disabled = true;
        button.className = "cancelled";
        // 취소완료 배경색
        orderCell.style.backgroundColor = "#acacac";
      }
    } 
    catch (error) {
      console.log(error);
    }
  }

  // 주문 확인하는 함수
  // POST
  async function confirmOrder(order, button) {
    try {
      const boothId = localStorage.booth;
      const response = await APIPostRequest(`booth/${boothId}/order/${order.table_id}/${order.order_id}/`, {});
      
      if (response.status == 204) {
        button.textContent = "처리 완료";
        button.className = "complete";
        // 일단 처리완료 버튼으로 바뀐 상태일때는 배경색변화 없고
        // 처리완료 버튼을 누르면!! 완료됨. 배경색, 버튼색 변함
      }
    } 
    catch (error) {
      console.log(error);
    }
  }
});
