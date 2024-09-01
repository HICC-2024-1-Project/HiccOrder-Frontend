import {
  APIGetRequest,
  APIPostRequest,
  APIPatchRequest,
  APIDeleteRequest,
} from '/modules/api.mjs';

const bid = localStorage.booth;
const tid = window.tid;

let booth = {};
let table = {};
let menus = {};
let orders = [];
let totalCount = 0;
let totalPrice = 0;

async function getBooth() {
  booth = await APIGetRequest(`booth/${bid}/`);
}

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
        if (o.menu_id == order.menu_id) {
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

(async () => {
  await getBooth();
  await getTable();
  await getMenus();
  await getOrders();

  document.querySelector(
    '#table-pay h3'
  ).innerHTML = `${table.table_name} 결제`;

  document.querySelector(
    '#table-pay > .display .info .count'
  ).innerHTML = `${totalCount.toLocaleString('ko-KR')}개 메뉴`;

  document.querySelector(
    '#table-pay > .display .info .price'
  ).innerHTML = `${totalPrice.toLocaleString('ko-KR')}원`;

  document.querySelector(
    '#table-pay > .display .bank'
  ).innerHTML = `${booth.bank_name} ${booth.account_number} ${booth.banker_name}`;

  let err = false;
  for (const order of orders) {
    if (!err && !['처리완료', '취소'].includes(order.state)) {
      err = true;
    }
  }

  const bn = booth.bank_name;
  const ac = booth.account_number;
  const tp = totalPrice;

  qrcode(
    `supertoss://send?amount=${tp}&bank=${bn}&accountNo=${ac}&origin=qr`,
    document.querySelector(`.qr.toss > .image`)
  );
  qrcode(`awdawd`, document.querySelector(`.qr.kakao > .image`));
  qrcode(`awdawd`, document.querySelector(`.qr.naver > .image`));

  document.querySelector('#button-table-pay').disabled = err;

  document.querySelector('#button-table-pay').addEventListener('click', () => {
    //window.location.href = `/dash/table/${tid}/pay`;
  });

  function qrcode(string, element) {
    string = encodeURI(string);
    const qr = document.createElement('div');
    new QRCode(qr, {
      text: string,
      width: 1000,
      height: 1000,
    });
    const img = qr.querySelector('img');
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    element.appendChild(img);
  }
})();
