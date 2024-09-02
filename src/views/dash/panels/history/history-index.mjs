import { APIGetRequest } from '/modules/api.mjs';

const bid = localStorage.booth;

const table = document.querySelector('#history-index .display > .content');

let orderKey = 'timestamp';
let orderSort = 'asc';

async function readOrders() {
  const processingOrders = await APIGetRequest(`booth/${bid}/order/`);
  const tables = await APIGetRequest(`booth/${bid}/table/`);
  const menus = await APIGetRequest(`booth/${bid}/menu/`);

  let orders = [];
  for (const order of processingOrders) {
    for (const table of tables) {
      if (table.id === order.table_id) {
        for (const key in table) {
          order[`table_${key.replace(/^table_/, '')}`] = table[key];
        }
      }
    }

    for (const menu of menus) {
      if (menu.id === order.menu_id) {
        for (const key in menu) {
          order[`menu_${key.replace(/^menu_/, '')}`] = menu[key];
        }
      }
    }

    order.timestamp = new Date(order.timestamp);

    order.price_total = order.quantity * order.menu_price;

    orders.push(order);
  }
  orders = sortByKey(orders, orderKey, orderSort);

  return orders;

  function sortByKey(array, key, order) {
    return array.sort((a, b) => {
      let x = a[key];
      let y = b[key];
      if (typeof x === 'string') {
        x = x.toLowerCase();
        y = y.toLowerCase();
      }
      if (order === 'asc') {
        return x < y ? -1 : x > y ? 1 : 0;
      } else {
        return x > y ? -1 : x < y ? 1 : 0;
      }
    });
  }
}

async function displayOrders(orders) {
  let totalSales = 0;
  table.innerHTML = '';

  const thead = document.querySelector('#history-index .display > .title');
  thead.innerHTML = '';
  function thElement(name, key, classes = []) {
    const th = document.createElement('div');
    th.classList.add('item');
    th.classList.add(key);
    th.classList.add(...classes);
    let html = '';
    html += '<div class="title">';
    html += name;
    html += `<span class="material-symbols-outlined" `;
    html += orderKey === key ? 'active' : '';
    html += `>`;
    html += `keyboard_arrow_`;
    html += orderSort === 'desc' ? 'up' : 'down';
    html += `</span>`;
    html += '</div>';
    th.innerHTML = html;
    th.addEventListener('click', async () => {
      if (orderKey === key) {
        if (orderSort === 'asc') {
          orderSort = 'desc';
        } else {
          orderSort = 'asc';
        }
      } else {
        orderKey = key;
        orderSort = 'asc';
      }
      displayOrders(await readOrders());
    });
    return th;
  }

  thead.appendChild(thElement('처리', 'state'));
  thead.appendChild(thElement('주문 시간', 'timestamp', ['left']));
  thead.appendChild(thElement('테이블', 'table_name', ['left']));
  thead.appendChild(thElement('메뉴', 'menu_name', ['left']));
  thead.appendChild(thElement('수량', 'quantity', ['right']));
  thead.appendChild(thElement('가격', 'menu_price', ['right']));

  //table.appendChild(thead);

  //let lastDay = orderSort == 'asc' ? 0 : Infinity;
  for (const order of orders) {
    table.appendChild(getOrderElement(order));
    /*const d = new Date(order.timestamp.toJSON().substring(0, 10));
    if (orderSort == 'asc') {
      if (d > lastDay) {
        lastDay = d;
        tbody.appendChild(getDayElement(order.timestamp));
      }
    }
    tbody.appendChild(getOrderElement(order));
    if (orderSort == 'desc') {
      if (d < lastDay) {
        lastDay = d;
        tbody.appendChild(getDayElement(order.timestamp));
      }
    }*/
    if (order.state === '결제 완료') {
      totalSales += order.price_total;
    }
  }

  document.querySelector(
    '#history-index-sales'
  ).innerHTML = `${totalSales.toLocaleString('ko-kr')}원`;
}

function getOrderElement(order) {
  const tr = document.createElement('div');
  tr.classList.add('set');
  let html = ``;
  html += `<div class="item state">`;
  if (!order.state) {
    html += `<div class="tag 결제완료">결제완료</div>`;
  } else {
    html += `<div class="tag ${order.state}">${order.state}</div>`;
  }
  html += `</div>`;
  html += `<div class="item left timestamp">${order.timestamp
    .toJSON()
    .substring(0, 19)
    .replace('T', ' ')}</div>`; // 주문시간
  html += `<div class="item left table_name">${order.table_name}</div>`; // 테이블이름
  html += `<div class="item left menu_name">${order.menu_name}</div>`; // 메뉴명
  html += `<div class="item right quantity">${order.quantity}개</div>`; // 개수
  html += `<div class="item right menu_price">${order.menu_price.toLocaleString(
    'ko-KR'
  )}원</div>`; // 가격
  tr.innerHTML = html;
  return tr;
}

function getDayElement(date) {
  const tr = document.createElement('tr');
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  let val = `${y}년 ${m}월 ${d}일`;
  let html = ``;
  html += `<td class="date"  colspan="6">${val}</td>`;
  tr.innerHTML = html;
  return tr;
}

(async () => {
  const orders = await readOrders();
  displayOrders(orders);
})();

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
