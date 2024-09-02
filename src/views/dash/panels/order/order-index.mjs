import {
  APIGetRequest,
  APIPatchRequest,
  APIDeleteRequest,
  APIPostRequest,
} from '/modules/api.mjs';

const bid = localStorage.booth;

function getOrderElement(order) {
  const element = document.createElement('div');
  element.classList.add('order');
  element.setAttribute('state', order.state);

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

  let html = ``;
  html += `<div class="info">`;
  html += `<div class="table">`;
  html += `  <div class="name"><a href="/dash/table/${order.table.id}/order">${order.table.table_name}</a></div>`;
  html += `  <div class="message">${sm ? sm : ''}</div>`;
  html += `</div>`;
  html += `<div class="menu">`;
  html += `  <div class="name">${order.menu.menu_name}</div>`;
  html += `  <div class="count">${order.quantity}<span class="light">개</span></div>`;
  html += `</div>`;
  html += `</div>`;
  html += `<div class="control"></div>`;
  element.innerHTML = html;

  if (order.state === '취소') {
    //addButton('취소됨', '취소', true);
  } else if (order.state !== '처리완료') {
    addButton('취소', '취소');
  }
  if (-1 < si && si < 3) {
    const nextState = states[Math.min(states.length - 1, si + 1)];
    addButton(nextState, nextState, si + 1 > states.length - 1);
  }

  function addButton(message, state, disabled = false) {
    const button = document.createElement('button');
    button.setAttribute('state', state);
    button.setAttribute('small', '');
    button.disabled = disabled;
    button.innerHTML = message;
    button.addEventListener('click', () => {
      changeOrderState(order.table_id, order.order_id, state);
    });
    element.querySelector('.control').appendChild(button);
  }

  return element;
}

function changeOrderState(tid, oid, state) {
  return APIPatchRequest(`booth/${bid}/order/${tid}/${oid}/`, {
    state: state,
  })
    .then(() => {
      display();
    })
    .catch((error) => {
      console.error(error);
    });
}

async function display() {
  const tables = await APIGetRequest(`booth/${localStorage.booth}/table/`);
  const menus = await APIGetRequest(`booth/${localStorage.booth}/menu/`);

  const orders = [];
  for (const table of tables) {
    const tableOrders = await APIGetRequest(
      `booth/${localStorage.booth}/order/${table.id}/`
    );

    for (const order of tableOrders) {
      order.menu = (() => {
        for (const menu of menus) {
          if (menu.id == order.menu_id) {
            return menu;
          }
        }
      })();
      order.table = (() => {
        for (const table of tables) {
          if (tables.id == order.tables_id) {
            return table;
          }
        }
      })();
      order.timestamp = new Date(order.timestamp);
      orders.push(order);
    }
  }

  orders.sort((a, b) => {
    let states = ['주문완료', '조리시작', '조리완료', '처리완료', '취소'];
    let sia = states.indexOf(a.state);
    let sib = states.indexOf(b.state);
    let ta = a.timestamp;
    let tb = b.timestamp;

    if (sia > sib) {
      return 1;
    } else if (sia < sib) {
      return -1;
    } else {
      if (ta > tb) {
        return 1;
      } else if (ta < tb) {
        return -1;
      } else {
        return 0;
      }
    }
  });

  const index = document.querySelector('#order-index');
  index.innerHTML = '';
  for (const order of orders) {
    index.appendChild(getOrderElement(order));
  }
}

display();
