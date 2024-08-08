import { APIGetRequest, APIPostRequest } from '/modules/api.mjs';

const tableInfo = await APIGetRequest(`booth/${localStorage.booth}/table/`);
const menuInfo = await APIGetRequest(`booth/${localStorage.booth}/menu/`);
const tables = await APIGetRequest(`booth/${localStorage.booth}/table/`);

var orders = [];
for (const table of tables) {
  const orderList = await APIGetRequest(`booth/${localStorage.booth}/order/${table.id}/`)
  .catch((error) => {
    console.log(error);
    return 0;
  });

  if(orderList) {
    for (const order of orderList) {
      orders.push(order);
    }
  }
}

/*
document.addEventListener('DOMContentLoaded', function () {
  const orderTableBody = document.querySelector('.order-table tbody');

  // (로컬)저장된 테이블 목록 로드
  const savedTables = JSON.parse(localStorage.getItem('tables')) || [];

  // 서버 or 로컬 저장소에서 저장된 주문 기록 데이터 가져오기

  // 주문기록을 테이블에 추가하는 함수 addOrderRecord
  function addOrderRecord(record) {
    // 새로운 tr 행 생성
    const row = document.createElement('tr');

    // 새로운 행 내부 요소HTML을
    // 주문 기록 데이터(메뉴, 테이블 번호, 주문시각, 수량, 결제여부, 결제수단)로 채움
    row.innerHTML = `   
            <td>${record.menu}</td>
            <td>${record.tableNumber}</td>
            <td>${record.orderTime}</td>
            <td>${record.quantity}</td>
            <td>${record.paid}</td>
            <td>${record.paymentMethod}</td>
        `;

    // 새로 만든 행을 추가
    orderTableBody.appendChild(row);
  }

  // 페이지 로드 시 저장된 주문 기록을 테이블에 추가
  orderRecords.forEach(addOrderRecord);

  // 사용자에서 주문을 했을 때 이걸
  // 관리자형(메뉴, 테이블번호, 수량, 결제여부, 결제수단)으로 변환하는 과정이 필요함

  // 현재 시간 기록하는 함수
  // const now = new Date();
  // const orderTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});
*/

const MAIN = {
  async displayHistory(orders) {
    document.querySelector('.history-table')
    .innerHTML = '<thead><tr><th>주문 시간</th><th>테이블 이름</th><th>메 뉴 명</th><th>개 수</th><th>가 격</th><th>결제 여부</th></tr></thead>';

    let html = '';
    const historyElement = document.createElement('tbody');
    for (const order of orders) {
      html = this.getHistoryElement(order);
      historyElement.innerHTML += html;
      document.querySelector('.history-table').appendChild(historyElement);
    }    
  },
  // 여기서 그만!!
  getHistoryElement(order) {
    const tableName = this.getTableName(order.table_id);
    const menuName = this.getMenuName(order.menu_id);
    const menuPrice = this.getMenuPrice(order.menu_id);

    console.log(typeof(menuPrice));
    console.log(typeof(order.quantity));
    const price = menuPrice * order.quantity;
    console.log(menuPrice);
    console.log(order.quantity);
    console.log(price);

    const element = document.createElement('tbody');
    let html = '';
    html += `<tr>`;
    html += `<td>${order.timestamp
      .split('T')[1]
      .substring(0, 8)}</td>`; // 주문시간
    html += `<td>${tableName}</td>`; // 테이블이름
    html += `<td>${menuName}</td>`; // 메뉴명
    html += `<td>${order.quantity}</td>`; // 개수
    html += `<td>${price.toLocaleString('ko-KR')}원</td>`; // 가격

    if (order.state === "결제 완료") html += `<td>o</td>`; // 결제 여부
    else html += `<td>x</td>`;
    html += `</tr>`;
    return html;
  },

  // 테이블 이름
  getTableName(index) {
    for (const table of tableInfo) {
      if(table.id === index) return table.table_name;
    }
    return 0;
  },
  
  // 메뉴 이름
  getMenuName(index) {
    for (const menu of menuInfo) {
      if(menu.id === index) return menu.menu_name;
    }
    return 0;
  },

  // 메뉴 가격
  getMenuPrice(index) {
    for (const menu of menuInfo) {
      if(menu.id === index) return menu.price;
    }
    return 0;
  },
}

async function init() {
  MAIN.displayHistory(orders);
}

init();