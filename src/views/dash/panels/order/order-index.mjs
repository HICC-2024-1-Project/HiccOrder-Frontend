import { APIGetRequest, APIPostRequest } from '/modules/api.mjs';

const tableInfo = await APIGetRequest(`booth/${localStorage.booth}/table/`);
const menuInfo = await APIGetRequest(`booth/${localStorage.booth}/menu/`);
const tables = await APIGetRequest(`booth/${localStorage.booth}/table/`);

console.log(typeof(tableInfo[2].id));
console.log(menuInfo);

/*
console.log(tables); // 모든 테이블
//console.log(tables[0]);
//console.log(tables[1]);
//console.log(tables[2]);
//console.log(tables[2].id);
//await APIDeleteRequest(`booth/${localStorage.booth}/table/171/`);

// 1번 테이블에 메뉴 주문
const index = Number(tables[0].id);
const index2 = Number(tables[1].id);
const t1 = await APIGetRequest(`booth/${localStorage.booth}/table/${index}/`);
const menu1 = await APIGetRequest(`booth/${localStorage.booth}/menu/50/`);
console.log(t1);
const a12 = await APIPostRequest(`booth/${localStorage.booth}/order/${index}/`, {
	"content":[
		{
			"menu_id" : 86,
			"menu_name": "ㄴㅁㅇ",
			"quantity" : 10,
		},
	],
});

const t1_order = await APIGetRequest(`booth/${localStorage.booth}/order/${index}/`);
const t2_order = await APIGetRequest(`booth/${localStorage.booth}/order/${index2}/`);
*/
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

const MAIN = {
  // 주문 현황 표시
  async displayOrder(orders) {
    document.querySelector('.part').innerHTML = '';
    
    let orderElement = '';

    // 상태가 조리중인경우
    for (const [orderID, order] of Object.entries(orders)) {  

      console.log(order.table_id);
      console.log(tableInfo.table_name);
      
      if (order.state === "주문완료") {
        orderElement = this.getOrderElement(order, orderID);
        document.querySelector('.part').appendChild(orderElement);
        console.log(orderElement);

        // 조리 완료(여기서 post 하면 됨)
        orderElement.querySelector('#button-order-complete').addEventListener('click', (event) => {
          let target = event.target;
          const orderIndex = this.getOrderID(target);

          // post....
          console.log(orders[orderIndex]);
          zzz(orders[orderIndex]);
        });
        // 취소
        orderElement.querySelector('#button-order-cancel').addEventListener('click', (event) => {
          let target = event.target;
          const orderIndex = this.getOrderID(target);

          // post....
          console.log(orders[orderIndex]);
          zzz(orders[orderIndex]);
        });
      }
    }

    // 나머지놈들
    for (const [orderID, order] of Object.entries(orders)) { 
      if (order.state !== "주문완료") {
        if(order.state === "취소") orderElement = this.getOrderCancelElement(order)
        else orderElement = this.getOrderCompeleElement(order);
      }

      document.querySelector('.part').appendChild(orderElement);
    }
  },

  getOrderElement(order, orderID) {
    const tableName = this.getTableName(order.table_id);
    const menuName = this.getMenuName(order.menu_id);
    console.log(order);
    const element = document.createElement('div');
    element.classList.add('order');
    element.setAttribute('order', orderID);
    let html = ``;
    html += `<div class="state">`;
    html += `  <div class="info">`;
    html += `    <div class="table">${tableName}</div>`;
    html += `    <div class="time">${order.timestamp.split('T')[1].substring(0, 8)}</div>`;
    html += `  </div>`;
    html += `  <div class="quantity">${menuName} x ${order.quantity}개</div>`;
    html += `    <div class="button">`;
    html += `    <div class="set-left">`;
    html += `      <button id="button-order-cancel">주문 취소</button>`;
    html += `    </div>`;
    html += `    <div class="set-right">`;
    html += `      <button id="button-order-complete">조리 완료</button>`;
    html += `    </div>`;
    html += `  </div>`;
    html += `</div>`;    
    element.innerHTML = html;
    return element;
  },

  getOrderCompeleElement(order) {
    const tableName = this.getTableName(order.table_id);
    const menuName = this.getMenuName(order.menu_id);

    const element = document.createElement('div');
    element.classList.add('order-completed');
    let html = ``;
    html += `<div class="state">`;
    html += `  <div class="info">`;
    html += `    <div class="table">${tableName}</div>`;
    html += `    <div class="time">${order.timestamp.split('T')[1].substring(0, 8)}</div>`;
    html += `  </div>`;
    html += `  <div class="quantity">${menuName} x ${order.quantity}개</div>`;
    html += `    <div class="button">조리 완료</div>`;
    html += `  </div>`;
    html += `</div>`;    
    element.innerHTML = html;
    return element;
  },

  getOrderCancelElement(order) {
    const tableName = this.getTableName(order.table_id);
    const menuName = this.getMenuName(order.menu_id);

    const element = document.createElement('div');
    element.classList.add('order-cancel');
    let html = ``;
    html += `<div class="state">`;
    html += `  <div class="info">`;
    html += `    <div class="table">${tableName}</div>`;
    html += `    <div class="time">${order.timestamp.split('T')[1].substring(0, 8)}</div>`;
    html += `  </div>`;
    html += `  <div class="quantity">${menuName} x ${order.quantity}개</div>`;
    html += `    <div class="button">취소 완료</div>`;
    html += `  </div>`;
    html += `</div>`;    
    element.innerHTML = html;
    return element;
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

  // 상태변경할 때 쓰임
  getOrderID(target) {
    while (!target.classList.contains('order')) {
      target = target.parentElement;
    }
    const orderID = target.getAttribute('order');
    const orderIndex = Number(orderID);
    return orderIndex;
  }
};

async function zzz(a) {
  console.log(a);
  console.log(a.table_id);
  console.log(a.order_id);
  const orderID = Number(a.order_id);
  alert("아직 값 변경이 안됩니다!!")
  /*
  await APIPostRequest(`booth/${localStorage.booth}/order/${a.table_id}/${orderID}/`, {
    state: "취소",
  });
  */
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
  orders = sortByKey(orders, 'timestamp', 'asc');
  MAIN.displayOrder(orders);
}

init();