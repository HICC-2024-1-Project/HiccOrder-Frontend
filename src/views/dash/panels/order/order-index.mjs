import { APIGetRequest, APIPostRequest } from '/modules/api.mjs';

/*
1. 모든 테이블 정보를 가져온다
GET booth/{boothid}/table/
2. 각 테이블마다 주문 정보를 가져와서 대충 로컬에 저장한다.
GET booth/{boothid}/order/{tableid}/
const orderHistory = [
    {
        "timestamp": "2024-01-17 22:07:20",
        "menu_id" : 1,
        "menu_name": "오뎅국",
        "price" : 5000,
        "quantity" : 1,
        "state": "조리중"
    },
    {
        "timestamp": "2024-01-17 22:07:20",
        "menu_id" : 1,
        "menu_name": "오뎅국",
        "price" : 5000,
        "quantity" : 1,
        "state": "조리중"
    },
]; 대충 이래된다 치고..
3. 버튼 누르면 상태 변경!
그리고 for문 해서 조리중을 먼저 배치하고
나머지 애들 넣으면 될듯
*/


const a = await APIGetRequest(`booth/${localStorage.booth}/table/`);
console.log(a);


// get 열심히 해서 이렇게 별개의 리스트를 만들자
const orders = [
  // 근데 timestamp에 따라서 정렬하고 싶은데,,, 일단 나중에 할까?
  {
    timestamp: "22:07:20",
    table_id : 1,
    menu_id : 1,
    menu_name: "오뎅국",
    price : 5000,
    quantity : 1,
    state: "조리중" // 조리중, 조리 완료, 취소, 
    // 결제 완료 -> 얘는 histoy에서!
  },
  {   
    timestamp: "22:08:20",
    table_id : 2,
    menu_id : 1,
    menu_name: "된장국",
    price : 5000,
    quantity : 5,
    state: "취소"
  },
  {   
    timestamp: "22:08:20",
    table_id : 2,
    menu_id : 1,
    menu_name: "ㅋㄴㅇㄴㅁ",
    price : 5000,
    quantity : 5,
    state: "조리중"
  },
];

console.log(orders);

const MAIN = {
  // 주문 현황 표시
  async displayOrder(orders) {
    document.querySelector('.part').innerHTML = '';
    
    let orderElement = '';

    // 상태가 조리중인경우
    for (const [orderID, order] of Object.entries(orders)) {  
      if (order.state === "조리중") {
        orderElement = this.getOrderElement(order, orderID);
        document.querySelector('.part').appendChild(orderElement);
        console.log(orderElement);

        // 조리 완료(여기서 post 하면 됨)
        orderElement.querySelector('#button-order-complete').addEventListener('click', (event) => {
          let target = event.target;
          const orderIndex = this.getOrderID(target);

          // post....
          console.log(orders[orderIndex]);
        });
        // 취소
        orderElement.querySelector('#button-order-cancel').addEventListener('click', (event) => {
          let target = event.target;
          const orderIndex = this.getMenuID(target);

          // post....
          console.log(orders[orderIndex]);
        });
      }
    }

    // 나머지놈들
    for (const [orderID, order] of Object.entries(orders)) { 
      if (order.state !== "조리중") {
        if(order.state === "취소") {
          orderElement = this.getOrderCancelElement(order)
        }
        else {
          orderElement = this.getOrderCompeleElement(order);
        }
      }
      document.querySelector('.part').appendChild(orderElement);
    }
  },

  getOrderElement(order, orderID) {
    const element = document.createElement('div');
    element.classList.add('order');
    element.setAttribute('order', orderID);
    let html = ``;
    html += `<div class="state">`;
    html += `  <div class="info">`;
    html += `    <div class="table">${order.table_id}</div>`;
    html += `    <div class="time">${order.timestamp}</div>`;
    html += `  </div>`;
    html += `  <div class="quantity">${order.menu_name} x ${order.quantity}개</div>`;
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
    const element = document.createElement('div');
    element.classList.add('order-completed');
    let html = ``;
    html += `<div class="state">`;
    html += `  <div class="info">`;
    html += `    <div class="table">${order.table_id}</div>`;
    html += `    <div class="time">${order.timestamp}</div>`;
    html += `  </div>`;
    html += `  <div class="quantity">${order.menu_name} x ${order.quantity}개</div>`;
    html += `    <div class="button">조리 완료</div>`;
    html += `  </div>`;
    html += `</div>`;    
    element.innerHTML = html;
    return element;
  },

  getOrderCancelElement(order) {
    const element = document.createElement('div');
    element.classList.add('order-cancel');
    let html = ``;
    html += `<div class="state">`;
    html += `  <div class="info">`;
    html += `    <div class="table">${order.table_id}</div>`;
    html += `    <div class="time">${order.timestamp}</div>`;
    html += `  </div>`;
    html += `  <div class="quantity">${order.menu_name} x ${order.quantity}개</div>`;
    html += `    <div class="button">취소 완료</div>`;
    html += `  </div>`;
    html += `</div>`;    
    element.innerHTML = html;
    return element;
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

async function init() {
  MAIN.displayOrder(orders);
}

init();