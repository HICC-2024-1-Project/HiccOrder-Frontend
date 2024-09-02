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
    order.menu = menus[order['menu_id']];
    orders.push(order);
    if (order.state != '취소') {
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
  html += `<div class="item control"></div>`;
  element.innerHTML = html;

  if (-1 < si) {
    //const prevState = states[Math.max(0, si - 1)];
    //addButton(prevState, prevState, si - 1 < 0);
    const nextState = states[Math.min(states.length - 1, si + 1)];
    addButton(nextState, nextState, si + 1 > states.length - 1);
  }
  if (order.state === '취소') {
    addButton('복원', '주문완료');
  } else {
    addButton('취소', '취소');
  }

  function addButton(message, state, disabled = false) {
    const button = document.createElement('button');
    button.classList.add('tag');
    button.classList.add(message);
    button.disabled = disabled;
    button.innerHTML = message;
    button.addEventListener('click', () => {
      changeOrderState(order.order_id, state);
    });
    element.querySelector('.control').appendChild(button);
  }
  return element;
}

function changeOrderState(oid, state) {
  return APIPatchRequest(`booth/${bid}/order/${tid}/${oid}/`, {
    state: state,
  })
    .then(() => {
      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
}

(async () => {
  await getTable();
  await getMenus();
  await getOrders();

  document.querySelector('#table-order h3').innerHTML = `${
    table.table_name
  } 주문 현황<span class="right">합계 ${totalCount.toLocaleString(
    'ko-KR'
  )}개 메뉴 / 총액 ${totalPrice.toLocaleString('ko-KR')}원</span>`;

  document
    .querySelector('#button-table-order-add')
    .addEventListener('click', () => {
      const modal = document.createElement('ho-modal');
      modal.setAttribute('title', '주문 추가');

      const mInput = document.createElement('ho-input-select');
      mInput.setAttribute('label', '메뉴');
      mInput.appendChild(getOption('메뉴 선택', '0', true, true));
      for (const mid in menus) {
        const menu = menus[mid];
        mInput.appendChild(
          getOption(menu.category + ' / ' + menu.menu_name, menu.id)
        );
      }
      modal.appendChild(mInput);

      const qInput = document.createElement('ho-input-string');
      qInput.setAttribute('label', '수량');
      qInput.setAttribute('type', 'number');
      qInput.setAttribute('value', 1);
      modal.appendChild(qInput);

      const button = document.createElement('button');
      button.innerHTML = '주문 추가';
      button.setAttribute('primary', '');
      button.addEventListener('click', () => {
        const orders = {
          content: [
            {
              menu_id: mInput.value,
              quantity: qInput.value,
            },
          ],
        };
        APIPostRequest(`booth/${bid}/order/${tid}/`, orders)
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            console.error(error);
          });
      });
      modal.appendChild(button);

      document.body.appendChild(modal);

      function getOption(key, value, disabled = false, selected = false) {
        const element = document.createElement('option');
        element.innerHTML = key;
        element.value = value;
        element.disabled = disabled;
        element.selected = selected;
        return element;
      }
    });

  if (orders.length <= 0) {
    return;
  }

  const content = document.querySelector('#table-order .content');
  content.innerHTML = '';

  for (const order of orders) {
    content.appendChild(getOrderElement(order));
  }
})();
