import { APIGetRequest, APIPostRequest } from '/modules/api.mjs';

const tableInfo = await APIGetRequest(`booth/${localStorage.booth}/table/`);
const menuInfo = await APIGetRequest(`booth/${localStorage.booth}/menu/`);
localStorage.setItem('orderKey', 'timestamp');
localStorage.setItem('orderSort', 'asc');

let totalSales = 0;

const MAIN = {
  async displayHistory(orders) {
    let html = '';
    html += `<thead>`;
    html += `  <tr>`;
    html += `    <th>`;
    html += `      <span class="text">주문 시간</span>`;
    if (localStorage.getItem('orderKey') === 'timestamp') {
      html += `      <span class="arrow">`;
      if (localStorage.getItem('orderSort') === 'asc') html += `keyboard_arrow_up</span>`;
      else html += `keyboard_arrow_down</span>`;
    }
    else html += `      <span class="arrowDisable">keyboard_arrow_down</span>`;
    html += `    </th>`;
    html += `    <th>`;
    html += `      <span class="text">테이블 이름</span>`;
    if (localStorage.getItem('orderKey') === 'table_id') {
      html += `      <span class="arrow">`;
      if (localStorage.getItem('orderSort') === 'asc') html += `keyboard_arrow_up</span>`;
      else html += `keyboard_arrow_down</span>`;
    }
    else html += `      <span class="arrowDisable">keyboard_arrow_down</span>`;
    html += `    </th>`;
    html += `    <th>`;
    html += `      <span class="text">메 뉴 명</span>`;
    if (localStorage.getItem('orderKey') === 'menu_id') {
      html += `      <span class="arrow">`;
      if (localStorage.getItem('orderSort') === 'asc') html += `keyboard_arrow_up</span>`;
      else html += `keyboard_arrow_down</span>`;
    }
    else html += `      <span class="arrowDisable">keyboard_arrow_down</span>`;
    html += `    </th>`;
    html += `    <th>`;
    html += `      <span class="text">개  수</span>`;
    if (localStorage.getItem('orderKey') === 'quantity') {
      html += `      <span class="arrow">`;
      if (localStorage.getItem('orderSort') === 'asc') html += `keyboard_arrow_up</span>`;
      else html += `keyboard_arrow_down</span>`;
    }
    else html += `      <span class="arrowDisable">keyboard_arrow_down</span>`;
    html += `    </th>`;
    html += `    <th>`;
    html += `      <span class="text">가  격</span>`;
    html += `      <span class="arrowDisable">keyboard_arrow_down</span>`;
    html += `    </th>`;
    html += `    <th>`;
    html += `      <span class="text">결제 여부</span>`;
    if (localStorage.getItem('orderKey') === 'state') {
      html += `      <span class="arrow">`;
      if (localStorage.getItem('orderSort') === 'asc') html += `keyboard_arrow_up</span>`;
      else html += `keyboard_arrow_down</span>`;
    }
    else html += `      <span class="arrowDisable">keyboard_arrow_down</span>`;
    html += `    </th>`;
    html += `  </tr>`;
    html += `</thead>`;
    document.querySelector('.history-table').innerHTML = html;

    html = '';
    const historyElement = document.createElement('tbody');
    for (const order of orders) {
      html = this.getHistoryElement(order);
      historyElement.innerHTML += html;
      document.querySelector('.history-table').appendChild(historyElement);
    }    

    const headers = document.querySelectorAll('.history-table th'); // 모든 th 선택
    for (const header of headers) {
      header.addEventListener('click', () => {
        const text = header.querySelector('.text').textContent.trim(); // 택스트 내용 가져오기

        if(text === '주문 시간') localStorage.setItem('orderKey', 'timestamp');
        else if(text === '테이블 이름') localStorage.setItem('orderKey', 'table_id');
        else if(text === '메 뉴 명') localStorage.setItem('orderKey', 'menu_id');
        else if(text === '개  수') localStorage.setItem('orderKey', 'quantity');
        else if(text === '가  격') alert('얘는 아직 미구현!');
        else localStorage.setItem('orderKey', 'state');

        if (localStorage.getItem('orderSort') === 'asc') localStorage.setItem('orderSort', 'desc');
        else localStorage.setItem('orderSort', 'asc');

        const sortedOrders = sortByKey(orders, localStorage.getItem('orderKey'), localStorage.getItem('orderSort'));
        this.displayHistory(sortedOrders);
      });
    }
  },
  
  getHistoryElement(order) {
    const tableName = this.getTableName(order.table_id);
    const menuName = this.getMenuName(order.menu_id);
    const menuPrice = this.getMenuPrice(order.menu_id);
    const price = menuPrice * order.quantity;

    let html = '';
    html += `<tr>`;
    html += `<td>${order.timestamp
      .split('T')[1]
      .substring(0, 8)}</td>`; // 주문시간
    html += `<td>${tableName}</td>`; // 테이블이름
    html += `<td>${menuName}</td>`; // 메뉴명
    html += `<td>${order.quantity}</td>`; // 개수
    html += `<td>${price.toLocaleString('ko-KR')}원</td>`; // 가격
    if (order.state === "결제 완료") { // 결제 여부
      html += `<td>o</td>`; 
      totalSales += price;
    }
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

function sortByKey(array, key, order) {
  return array.sort((a, b) => {
    let x = a[key];
    let y = b[key];
    if (typeof x === 'string') {
        x = x.toLowerCase();
        y = y.toLowerCase();
    }

    console.log(a);
    console.log(key);
    console.log(x);

    if (order === 'asc') {
        return x < y ? -1 : x > y ? 1 : 0;
    } 
    else 
    {
        return x > y ? -1 : x < y ? 1 : 0;
    }
  });
}

async function init() {
  const tables = await APIGetRequest(`booth/${localStorage.booth}/table/`);

  var orders = [];
  for (const table of tables) {
    const orderList = await APIGetRequest(`booth/${localStorage.booth}/order/${table.id}/`)
    .catch((error) => {
      console.log(error);
      return 0;
    });

    if(orderList) {
      for (const order of orderList) orders.push(order);
    }
  }
  orders = sortByKey(orders, 'timestamp', 'asc');

  MAIN.displayHistory(orders);

  document.querySelector('#header').innerHTML = `<h3>총 매출!!!: ${totalSales.toLocaleString('ko-KR')}원</h3>`;
}

init();

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