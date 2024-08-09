// 주문내역 페이지
import {
  APIGetRequest,
  APIPostRequest,
  APIPatchRequest,
  APIDeleteRequest,
} from '/modules/api.mjs';

let menus = [];
let orders = [];

document.addEventListener('DOMContentLoaded', function () {
  update();

  return;

  const orderDetails = document.querySelector('.order-details');
  const addMenuButton = document.querySelector('.add-menu-btn');
  const totalPriceElement = document.getElementById('total-price');
  const tableNameElement = document.getElementById('table-name');

  // URL의 쿼리 문자열을 파싱하여 키-값 쌍으로 관리하는 객체URLSearchParams 생성
  // 현재 페이지의 URL에서 쿼리 문자열(window.location.search)을 가져와 이를 파싱하여 URLSearchParams 객체를 생성
  //const params = new URLSearchParams(window.location.search);
  //const tableId = params.get('table'); // table 이름 가져옴

  if (tableId !== null) {
    loadTableNameAndOrderData(tableId);

    addMenuButton.addEventListener('click', function () {
      getOrderElement();
    });

    document.querySelector('.save-btn').addEventListener('click', function () {
      saveOrderData(tableId);
    });
  }

  // 메뉴 추가하기

  // 총액 업데이트하기
  function updateTotalPrice() {
    let totalPrice = 0;

    document.querySelectorAll('.order-entry').forEach(function (entry) {
      const quantity =
        parseInt(entry.querySelector('.order-quantity').value, 10) || 0;
      const price =
        parseInt(entry.querySelector('.order-price').value, 10) || 0;
      totalPrice += quantity * price;
    });
    totalPriceElement.textContent = `${totalPrice.toLocaleString()}원`;
  }

  // 주문내역 로드
  async function loadTableNameAndOrderData(tableId) {
    try {
      const tableResponse = await APIGetRequest(
        `booth/${localStorage.booth}/table/${tableId}/`
      );
      const tableData = tableResponse;
      // 테이블 이름 로드
      tableNameElement.textContent = `${tableData.table_name} 주문 내역`;

      // 주문정보 가져오기
      const orderResponse = await APIGetRequest(
        `booth/${localStorage.booth}/order/${tableId}/`
      );

      const orders = document.querySelector('.orders > .table > .content');
      orderResponse.forEach((item) => {
        orders.appendChild(
          getOrderElement(item.menu_id, item.quantity, item.price)
        );
      });

      updateTotalPrice();
    } catch (error) {
      console.log(error);
    }
  }

  async function saveOrderData(tableId) {
    const orderEntries = [];
    document.querySelectorAll('.order-entry').forEach(function (entry) {
      const name = entry.querySelector('.order-name').value;
      const quantity = parseInt(
        entry.querySelector('.order-quantity').value,
        10
      );
      const price = parseInt(entry.querySelector('.order-price').value, 10);
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

function getOrderElement(index, order) {
  const orderElement = document.createElement('div');
  orderElement.classList.add('order');

  function getItemElement(name) {
    const item = document.createElement('div');
    item.classList.add('item');
    item.classList.add(name);
    return item;
  }

  const nameElement = getItemElement('name');
  nameElement.innerHTML = order.menu_name;
  orderElement.appendChild(nameElement);

  const quantityElement = getItemElement('quant');
  const quantityInput = document.createElement('input');
  quantityInput.type = 'number';
  quantityInput.value = order.quantity;
  quantityElement.appendChild(quantityInput);
  orderElement.appendChild(quantityElement);

  const priceElement = getItemElement('price');
  priceElement.innerHTML = order.price;
  orderElement.appendChild(priceElement);

  const sumElement = getItemElement('sum');
  sumElement.innerHTML = order.quantity * order.price;
  orderElement.appendChild(sumElement);

  const stateElement = getItemElement('state');
  stateElement.innerHTML = order.state;
  orderElement.appendChild(stateElement);

  const controlsElement = getItemElement('controls');
  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('small', '');
  deleteButton.innerHTML = '삭제';
  controlsElement.appendChild(deleteButton);
  orderElement.appendChild(controlsElement);

  quantityInput.addEventListener('change', (event) => {
    orders[index].quantity = quantityInput.value;
    sumElement.innerHTML = orders[index].quantity * order.price;
  });

  deleteButton.addEventListener('click', (event) => {
    APIDeleteOrder(order.order_id).then(() => {
      update();
    });
  });

  return orderElement;
}

async function APIUpdateMenus() {
  menus = await APIGetRequest(`booth/${localStorage.booth}/menu/`);
}

function getMenu(id) {
  for (const menu of menus) {
    if (menu.id === id) {
      return menu;
    }
  }
  return null;
}

async function APIUpdateOrders() {
  const data = await APIGetRequest(
    `booth/${localStorage.booth}/order/${window.tid}/`
  );

  orders = [];
  for (const order of data) {
    const menu = getMenu(order.menu_id);
    orders.push({
      order_id: order.order_id,
      menu_id: order.menu_id,
      menu_name: menu.menu_name,
      price: menu.price,
      quantity: order.quantity,
      timestamp: new Date(order.timestamp),
      state: order.state,
    });
  }
}

async function APIDeleteOrder(oid) {
  await APIDeleteRequest(
    `booth/${localStorage.booth}/order/${window.tid}/${oid}/`
  );
}

async function update() {
  await APIUpdateMenus();
  await APIUpdateOrders();

  const ordersElement = document.querySelector('.orders > .table > .content');
  ordersElement.innerHTML = [];
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    const orderElement = getOrderElement(i, order);
    ordersElement.appendChild(orderElement);
  }
}
