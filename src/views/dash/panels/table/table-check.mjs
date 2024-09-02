import {
  APIGetRequest,
  APIPostRequest,
  APIPatchRequest,
  APIDeleteRequest,
} from '/modules/api.mjs';

const bid = localStorage.booth;
const tid = window.tid;

let table = {};
let menus = {};
let orders = [];
let totalCount = 0;
let totalPrice = 0;

async function getTable() {
  table = await APIGetRequest(`booth/${bid}/table/${tid}/`);
}

async function getMenus() {
  const data = await APIGetRequest(`booth/${bid}/menu/`);
  for (const menu of data) {
    menus[menu.id] = menu;
  }
}

async function getOrders() {
  const data = await APIGetRequest(`booth/${bid}/order/${tid}/`);
  for (const order of data) {
    if (order.state != '취소') {
      order.menu = menus[order.menu_id];
      let add = false;
      for (const o of orders) {
        if (o.menu_id == order.menu_id && o.state == order.state) {
          add = true;
          o.quantity += order.quantity;
          break;
        }
      }
      if (!add) {
        orders.push(order);
      }
      totalCount += order.quantity;
      totalPrice += order.quantity * order.menu.price;
    }
  }
  orders = orders.reverse();
}

function getOrderElement(order) {
  let states = ['주문완료', '조리시작', '조리완료', '처리완료'];
  let msgs = ['새주문', '조리중', '서빙필요'];
  let si = states.indexOf(order.state);
  let sm = msgs[si];
  if (order.state === '취소') {
    sm = '취소됨';
  }
  if (order.state == '처리완료') {
    sm = '처리됨';
  }

  const element = document.createElement('div');
  element.classList.add('set');
  let html = ``;
  html += `<div class="item state"><div class="tag ${order.state}">${sm}</div></div>`;
  html += `<div class="item left menu">${order.menu.menu_name}</div>`;
  html += `<div class="item right num count">${order.quantity.toLocaleString(
    'ko-KR'
  )}개</div>`;
  html += `<div class="item right num price">${order.menu.price.toLocaleString(
    'ko-KR'
  )}원</div>`;
  html += `<div class="item right num total">${(
    order.quantity * order.menu.price
  ).toLocaleString('ko-KR')}원</div>`;
  element.innerHTML = html;
  return element;
}

(async () => {
  await getTable();
  await getMenus();
  await getOrders();

  document.querySelector(
    '#table-check h3'
  ).innerHTML = `${table.table_name} 주문 내역 확인`;

  document.querySelector(
    '#table-check > .control .count'
  ).innerHTML = `${totalCount.toLocaleString('ko-KR')}개 메뉴`;

  document.querySelector(
    '#table-check > .control .price'
  ).innerHTML = `${totalPrice.toLocaleString('ko-KR')}원`;

  if (orders.length <= 0) {
    return;
  }

  const content = document.querySelector('#table-check .content');
  content.innerHTML = '';

  let err = false;
  for (const order of orders) {
    if (!err && !['처리완료', '취소'].includes(order.state)) {
      err = true;
    }
    content.appendChild(getOrderElement(order));
  }

  document.querySelector('#button-table-check').disabled = err;

  document
    .querySelector('#button-table-check')
    .addEventListener('click', () => {
      window.location.href = `/dash/table/${tid}/pay`;
    });
})();
