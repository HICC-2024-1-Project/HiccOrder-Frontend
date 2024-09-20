'use strict';

import e from 'express';
import { APIGetRequest, APIPostRequest } from '/modules/api.mjs';

class Client {
  constructor(bid, tid) {
    if (!bid || !tid) {
      window.location.href = '/error/403';
      return;
    }
    this.bid = bid;
    this.tid = tid;
    this.wsc = new WSClient();

    this.main = new Main(this);
    this.menu = new MenuPanel(this, 'panel-menu');
    this.cart = new CartPanel(this, 'panel-cart');
    this.history = new HistoryPanel(this, 'panel-history');

    this.booth = {};
    this.table = {};
    this.menus = {};
    this.ordersCart = {};
    this.ordersHistory = [];

    this.init();
  }

  async init() {
    await Promise.all([this.getBooth(), this.getTable(), this.getMenus()]);

    setInterval(() => {
      this.getBooth();
    }, 5000);

    this.main.displayBooth();
    this.main.displayMenus();

    this.wsc.on('open', () => {
      console.log('open');
      this.wsc.send('auth', {
        temporary_user_id: getCookie('temporary_user_id'),
      });
    });
    this.wsc.on('message', (event) => {
      console.log(event.data);
    });
    this.wsc.on('close', () => {
      console.log('close');
    });
    this.wsc.open(`wss://api.ho.ccc.vg/user/${this.bid}/${this.tid}/`);
  }

  async getBooth() {
    this.booth = await APIGetRequest(`booth/${this.bid}/`).catch((error) => {
      if (!this.booth?.booth_name) {
        window.location.href = '/error/403';
      } else {
        window.location.href = '/done';
      }
    });
  }

  async getTable() {
    this.table = await APIGetRequest(`booth/${this.bid}/table/${this.tid}/`);
  }

  async getMenus() {
    const menus = await APIGetRequest(`booth/${this.bid}/menu/`);
    for (const menu of menus) {
      this.menus[menu.id] = menu;
    }
  }

  async getOrders() {
    this.ordersHistory = await APIGetRequest(`booth/order/`);
  }

  addOrder(menu, count = 1) {
    if (!this.ordersCart[menu.id]) {
      this.ordersCart[menu.id] = 0;
    }
    this.ordersCart[menu.id] += count;
    this.cart.updateLabel(this.ordersCart);
  }

  removeOrder(menu, count = 1) {
    if (!this.ordersCart[menu.id]) {
      return;
    }
    this.ordersCart[menu.id] -= count;
    if (this.ordersCart[menu.id] <= 0) {
      delete this.ordersCart[menu.id];
    }
    this.cart.updateLabel(this.ordersCart);
  }

  async postOrders() {
    return new Promise((resolve, reject) => {
      const orders = { content: [] };
      for (const mid in this.ordersCart) {
        orders.content.push({
          menu_id: mid,
          quantity: this.ordersCart[mid],
        });
      }
      APIPostRequest(`booth/order/`, orders)
        .then(() => {
          this.ordersCart = {};
          setTimeout(() => {
            resolve();
          }, 2000);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }

  async postOrdersCall() {
    this.wsc.send('staffCall', {
      table_id: this.tid,
    });
  }

  destroy() {}

  scrollOff() {
    document.body.style.overflow = 'hidden';
  }

  scrollOn() {
    document.body.style.overflow = 'auto';
  }
}

class Main {
  constructor(client) {
    this.client = client;
  }

  addEventListener() {
    document.addEventListener('scroll', (event) => {
      this.scroll();
    });
    this.scroll();

    document
      .querySelector('#button-lang')
      .addEventListener('click', async (event) => {
        alert('언어 바꾸는 기능은 아직 없음');
      });
  }

  displayBooth() {
    const booth = this.client.booth;
    const table = this.client.table;

    // 부스 이름, 테이블 이름 설정
    document.querySelector('#nav .desc .booth').innerHTML = booth.booth_name;
    document.querySelector('#nav .desc .table').innerHTML = table.table_name;
    document.querySelector('#main .desc .booth').innerHTML = booth.booth_name;
    document.querySelector('#main .desc .table').innerHTML = table.table_name;

    // 부스 이미지 설정
    if (booth.booth_image_url) {
      document.querySelector('#cover .image img').src = booth.booth_image_url;
    }
  }

  displayMenus() {
    const menus = this.client.menus;

    let categories = {};

    for (const [menuID, menu] of Object.entries(menus)) {
      if (!categories[menu.category]) {
        const categoryElement = this.getCategoryElement(menu);
        categories[menu.category] = categoryElement;
      }

      const menuElement = this.getMenuElement(menu);
      menuElement.addEventListener('click', (event) => {
        let target = event.target;
        while (!target.classList.contains('menu')) {
          target = target.parentElement;
        }

        const menuID = target.getAttribute('menu');
        const menu = menus[menuID];
        this.client.menu.open(menu);

        target.style.background = 'rgba(255, 100, 60, 0.5)';
        setTimeout(() => {
          target.style.background = 'rgba(255, 100, 60, 0)';
          target.style.transition = 'background 0.4s ease-out';
        }, 100);
        setTimeout(() => {
          target.style.background = null;
          target.style.transition = null;
        }, 500);
      });

      categories[menu.category]
        .querySelector('.content')
        .appendChild(menuElement);
    }

    document.querySelector('#menu').innerHTML = '';
    for (const category in categories) {
      document.querySelector('#menu').appendChild(categories[category]);
    }
  }

  getCategoryElement(menu) {
    const element = document.createElement('div');
    element.classList.add('category');
    element.setAttribute('category', menu.category);
    let html = ``;
    html += `<div class="title">${menu.category}</div>`;
    html += `<div class="content">`;
    html += `</div>`;
    element.innerHTML = html;
    return element;
  }

  getMenuElement(menu) {
    const element = document.createElement('div');
    element.classList.add('menu');
    element.setAttribute('menu', menu.id);
    let html = ``;
    html += `<div class="wrapper">`;
    if (menu.menu_image_url) {
      html += `  <div class="image">`;
      html += `    <img src="${menu.menu_image_url}" />`;
      html += `  </div>`;
    }
    html += `  <div class="content">`;
    html += `    <div class="main">`;
    html += `      <div class="info">`;
    html += `        <div class="title">`;
    html += `          <span class="text">${menu.menu_name}</span>`;
    html += `        </div>`;
    if (menu.description) {
      html += `      <div class="desc">${menu.description}</div>`;
    }
    html += `      </div>`;
    if (menu.control) {
      html += `      <div class="buttons">`;
      html += `        <button class="minus"><span class="material-symbols-outlined"> remove </span></button>`;
      html += `        <div class="count">0</div>`;
      html += `        <button class="plus"><span class="material-symbols-outlined"> add </span></button>`;
      html += `      </div>`;
    }
    if (menu.state) {
      html += `      <div class="states">`;
      html += `        <div class="state" state="${menu.state}">`;
      html += `          ${menu.state}`;
      html += `        </div>`;
      html += `      </div>`;
    }
    html += `    </div>`;
    html += `    <div class="price">`;
    html += `      <span class="single">${menu.price.toLocaleString(
      'ko-KR'
    )}원</span>`;
    if (menu.count) {
      html += `      <span class="x">×</span>`;
      html += `      <span class="count">${menu.count}개</span>`;
      html += `      <span class="e">=</span>`;
      html += `      <span class="total">${(
        menu.price * menu.count
      ).toLocaleString('ko-KR')}원</span>`;
    }
    html += `    </div>`;
    html += `  </div>`;
    html += `</div>`;
    element.innerHTML = html;
    return element;
  }

  scroll() {
    const h = document.querySelector('header');
    const s = scrollY;
    const ht = h.offsetTop - Math.rem(3);

    let p2 = Math.min(100, Math.max(0, (s / ht) * 100));

    const nav = document.querySelector('nav');
    const shadow = document.querySelector('#cover > .shadow');

    shadow.style.background = `rgba(0,0,0,${p2 / 200})`;
    shadow.style.webkitBackdropFilter = `blur(${p2 / 10}px)`;
    shadow.style.backdropFilter = `blur(${p2 / 10}px)`;

    nav.setAttribute('phase', s < ht ? 'up' : 'down');
  }
}

class ClientPanel {
  constructor(client, panel) {
    this.panel = document.querySelector(`#${panel}`);
    this.client = client;
    this.addEventListener();
  }

  addEventListener() {}
}

class MenuPanel extends ClientPanel {
  open(menu) {
    let html = ``;
    html += `<div class="top">`;
    html += `  <button id="button-panel-menu-close">`;
    html += `    <span class="material-symbols-outlined"> arrow_back </span>`;
    html += `  </button>`;
    html += `  <div class="title">메뉴 담기</div>`;
    html += `</div>`;
    html += `<div class="main">`;
    html += `<div class="topmargin"></div>`;
    if (menu.menu_img_url) {
      html += `<div class="image">`;
      html += `  <img src="${menu.menu_img_url}" />`;
      html += `</div>`;
    }
    html += `<div class="title">${menu.menu_name}</div>`;
    html += `<div class="desc">${menu.description}</div>`;
    html += `<div class="options">`;
    html += `  <div class="option">`;
    html += `    <div class="price">${menu.price.toLocaleString(
      'ko-KR'
    )}원</div>`;
    html += `    <div class="control">`;
    html += `      <div class="buttons hide">`;
    html += `        <button class="minus"><span class="material-symbols-outlined"> remove </span></button>`;
    html += `        <div class="count">1</div>`;
    html += `        <button class="plus"><span class="material-symbols-outlined"> add </span></button>`;
    html += `      </div>`;
    html += `    </div>`;
    html += `  </div>`;
    html += `</div>`;
    html += `</div>`;
    html += `<div class="bottom">`;
    html += `  <button id="button-panel-menu-add">메뉴 담기</button>`;
    html += `</div>`;

    this.panel.innerHTML = html;

    this.panel.querySelector('.top button').addEventListener('click', () => {
      this.close();
    });

    let count = 1;
    this.panel.querySelector('.buttons .minus').disabled = count <= 1;
    this.panel
      .querySelector('.buttons .minus')
      .addEventListener('click', () => {
        count--;
        this.panel.querySelector('.buttons .count').innerHTML = count;
        this.panel.querySelector('.buttons .minus').disabled = count <= 1;
      });
    this.panel.querySelector('.buttons .plus').addEventListener('click', () => {
      count++;
      this.panel.querySelector('.buttons .count').innerHTML = count;
      this.panel.querySelector('.buttons .minus').disabled = count <= 1;
    });

    this.panel.querySelector('.bottom button').addEventListener('click', () => {
      this.client.addOrder(menu, count);
      this.close();
    });

    this.panel.setAttribute('phase', 'open');
    this.client.scrollOff();
  }

  close() {
    this.panel.setAttribute('phase', 'close');
    this.client.scrollOn();
  }
}

class CartPanel extends ClientPanel {
  orderProcessing = false;

  addEventListener() {
    this.panel
      .querySelector('#button-panel-cart-left')
      .addEventListener('click', () => {
        const phase = this.panel.getAttribute('phase');
        switch (phase) {
          case 'cart': {
            break;
          }
          case 'order': {
            this.close();
            break;
          }
          default: {
            this.call();
            break;
          }
        }
      });
    this.panel
      .querySelector('#button-panel-cart-right')
      .addEventListener('click', () => {
        const phase = this.panel.getAttribute('phase');
        switch (phase) {
          case 'cart': {
            this.order();
            break;
          }
          case 'order': {
            break;
          }
          default: {
            this.open();
            break;
          }
        }
      });
    this.panel
      .querySelector('#button-panel-cart-close')
      .addEventListener('click', () => {
        this.close();
      });
    this.panel
      .querySelector('#button-panel-cart-cart-close')
      .addEventListener('click', () => {
        this.close();
      });
    this.panel
      .querySelector('#button-panel-cart-order-close')
      .addEventListener('click', () => {
        this.close();
      });
  }

  open() {
    const menus = this.client.menus;
    const cart = this.client.ordersCart;
    this.panel.querySelector('.fg-content > .cart > .list').innerHTML = '';
    for (let [menuID, count] of Object.entries(cart)) {
      const menu = JSON.parse(JSON.stringify(menus[menuID]));
      menu.control = true;
      const menuElement = this.client.main.getMenuElement(menu);
      menuElement.querySelector('.buttons .count').innerHTML = count;
      menuElement.querySelector('.buttons .minus span').innerHTML =
        count > 1 ? 'remove' : 'delete';
      menuElement
        .querySelector('.buttons .minus')
        .addEventListener('click', () => {
          count--;
          this.client.removeOrder(menu, 1);
          this.updateTotal(menus, cart);
          menuElement.querySelector('.buttons .count').innerHTML = count;
          menuElement.querySelector('.buttons .minus span').innerHTML =
            count > 1 ? 'remove' : 'delete';
          if (count <= 0) {
            menuElement.parentElement.removeChild(menuElement);
          }
          if (Object.keys(this.client.ordersCart).length <= 0) {
            this.close();
          }
        });
      menuElement
        .querySelector('.buttons .plus')
        .addEventListener('click', () => {
          count++;
          this.client.addOrder(menu, 1);
          this.updateTotal(menus, cart);
          menuElement.querySelector('.buttons .count').innerHTML = count;
          menuElement.querySelector('.buttons .minus span').innerHTML =
            count > 1 ? 'remove' : 'delete';
        });

      this.panel
        .querySelector('.fg-content > .cart > .list')
        .appendChild(menuElement);
    }
    this.updateTotal(menus, cart);

    this.panel.setAttribute('phase', 'cart');
    this.panel.querySelector('#button-panel-cart-right .text').innerText =
      '담은 메뉴 주문하기';
    this.panel.querySelector('#button-panel-cart-left').disabled = true;
    this.panel.querySelector('#button-panel-cart-right').disabled = true;
    setTimeout(() => {
      this.panel.querySelector('#button-panel-cart-right').disabled = false;
    }, 1000);

    this.updateLabel({});

    this.client.scrollOff();
  }

  async order() {
    this.panel.querySelector(
      '.fg-content > .order > .message > .main'
    ).innerHTML = '주문 처리 중...';
    this.panel.querySelector(
      '.fg-content > .order > .message > .sub'
    ).innerHTML = '잠시만 기다려주세요';
    this.panel.querySelector('#button-panel-cart-left .text').innerText =
      '닫기';
    this.panel.querySelector('#button-panel-cart-left').disabled = true;

    this.panel.setAttribute('phase', 'order');

    this.orderProcessing = true;
    await this.client.postOrders();
    this.orderProcessing = false;

    this.panel.querySelector(
      '.fg-content > .order > .message > .main'
    ).innerHTML = '주문이 완료되었습니다';
    this.panel.querySelector(
      '.fg-content > .order > .message > .sub'
    ).innerHTML = '이 창을 닫아 주세요';
    this.panel.querySelector('#button-panel-cart-left').disabled = false;

    this.updateLabel({});

    setTimeout(() => {
      this.close();
    }, 5000);
  }

  close() {
    if (this.orderProcessing) {
      return;
    }

    this.panel.setAttribute('phase', 'close');
    this.panel.querySelector('#button-panel-cart-left .text').innerText =
      '직원 호출';
    this.panel.querySelector('#button-panel-cart-right .text').innerText =
      '담은 메뉴 보기';
    this.panel.querySelector('#button-panel-cart-left').disabled = false;
    this.panel.querySelector('#button-panel-cart-right').disabled = false;

    this.updateLabel(this.client.ordersCart);

    this.client.scrollOn();
  }

  call() {
    this.lineMessage('직원을 호출하였습니다. 잠시만 기다려주세요.');

    this.client.postOrdersCall();

    this.panel.querySelector('#button-panel-cart-left').disabled = true;
    this.panel.querySelector('#button-panel-cart-right').disabled = true;
    setTimeout(() => {
      this.panel.querySelector('#button-panel-cart-left').disabled = false;
      this.updateLabel(this.client.ordersCart);
    }, 1000);
  }

  updateLabel(cart) {
    let total = 0;
    for (const menu in cart) {
      total += cart[menu];
    }

    const countElement = this.panel.querySelector(
      '#button-panel-cart-right > .count'
    );
    countElement.innerHTML = `메뉴 ${total}개 담음`;

    if (this.panel.getAttribute('phase') == 'close') {
      if (total <= 0) {
        countElement.setAttribute('phase', 'hide');
        this.panel.querySelector('#button-panel-cart-right').disabled = true;
      } else {
        countElement.setAttribute('phase', 'show');
        this.panel.querySelector('#button-panel-cart-right').disabled = false;
      }
    } else {
      countElement.setAttribute('phase', 'hide');
    }
  }

  updateTotal(menus, cart) {
    let total = 0;
    let price = 0;
    for (const menu in cart) {
      total += cart[menu];
      price += menus[menu]?.price * cart[menu];
    }

    const countElement = this.panel.querySelector(
      '#button-panel-cart-right > .count'
    );
    countElement.innerHTML = `메뉴 ${total}개 담음`;
    this.panel.querySelector(
      '.fg-content .total > .count'
    ).innerHTML = `메뉴 ${total}개 담음`;
    this.panel.querySelector(
      '.fg-content .total > .price'
    ).innerHTML = `${price.toLocaleString('ko-KR')}원`;
  }

  lineMessage(content) {
    const messages = this.panel.querySelector('.fg-message');
    const message = document.createElement('div');
    message.setAttribute('phase', 'hide');
    message.setAttribute('linemessage', '');
    message.classList.add('message');
    message.innerHTML = content;
    messages.appendChild(message);
    setTimeout(() => {
      message.setAttribute('phase', 'show');
    }, 1);
    setTimeout(() => {
      message.setAttribute('phase', 'hide');
    }, 5000);
    setTimeout(() => {
      messages.removeChild(message);
    }, 5500);
  }
}

class HistoryPanel extends ClientPanel {
  addEventListener() {
    document
      .querySelector('#button-history')
      .addEventListener('click', async (event) => {
        await this.client.getOrders();
        this.open();
      });
  }

  open() {
    const data = this.client.ordersHistory;

    let totalCount = 0;
    let totalPrice = 0;

    const orders = {};
    for (const order of data) {
      const menu = CLIENT.menus[order.menu_id];
      if (!orders[order.timestamp]) {
        orders[order.timestamp] = [];
      }
      orders[order.timestamp].push({
        menuId: order.menu_id,
        menu_name: menu.menu_name,
        description: '',
        price: menu.price,
        count: order.quantity,
        state: order.state,
      });
      totalCount += order.quantity;
      totalPrice += menu.price * order.quantity;
    }

    let html = ``;
    html += `<div class="top">`;
    html += `  <button id="button-panel-menu-close">`;
    html += `    <span class="material-symbols-outlined"> arrow_back </span>`;
    html += `  </button>`;
    html += `  <div class="title">주문 기록</div>`;
    html += `</div>`;
    html += `<div class="main">`;
    html += `  <div class="topmargin"></div>`;
    html += `  <div class="history"></div>`;
    html += `  <div class="total">`;
    html += `    <div class="count">${totalCount.toLocaleString(
      'ko-KR'
    )}개 메뉴 주문함</div>`;
    html += `    <div class="price">합계 ${totalPrice.toLocaleString(
      'ko-KR'
    )}원</div>`;
    html += `  </div>`;
    html += `</div>`;
    html += `<div class="bottom">`;
    html += `  <button id="button-panel-menu-close2">닫기</button>`;
    html += `</div>`;

    this.panel.innerHTML = html;

    let i = 1;
    for (const timestamp in orders) {
      const order = document.createElement('div');
      order.classList.add('order');
      let html = ``;
      html += `<div class="title">주문 #${i}</div>`;
      html += `<div class="content"></div>`;
      order.innerHTML = html;
      for (const menu of orders[timestamp]) {
        const menuElement = this.client.main.getMenuElement(menu);
        order.querySelector('.content').appendChild(menuElement);
      }
      this.panel.querySelector('.history').appendChild(order);
      i++;
    }

    this.panel.querySelector('.top button').addEventListener('click', () => {
      this.close();
    });
    this.panel.querySelector('.bottom button').addEventListener('click', () => {
      this.close();
    });

    this.panel.setAttribute('phase', 'open');
    this.client.scrollOff();
  }

  close() {
    this.panel.setAttribute('phase', 'close');
    this.client.scrollOn();
  }
}

class WSClient {
  #listeners = {};

  constructor() {
    this.status = 'closed';
    this.socket = null;

    setInterval(() => {
      if (this.status == 'closed') {
        if (this.url) {
          this.open(this.url);
        }
      }
    }, 2000);
  }

  open(url) {
    this.url = url;
    this.status = 'connecting';

    this.socket = new WebSocket(url);

    this.socket.addEventListener('open', (event) => {
      this.status = 'open';
      this.emit('open', event);
    });

    this.socket.addEventListener('message', (event) => {
      this.emit('message', event);

      const json = JSON.parse(event.data);
      this.emit(json.event, json.data);
    });

    this.socket.addEventListener('close', (event) => {
      this.status = 'closed';
      this.emit('close', event);
    });

    this.socket.addEventListener('error', (event) => {
      console.error(event);
      this.emit('error', event);
    });
  }

  send(event, data) {
    if (this.socket && this.socket.readyState == 1) {
      this.socket.send(
        JSON.stringify({
          event: event,
          data: data,
        })
      );
    }
  }

  close() {
    if (this.socket != null) {
      this.socket.close();
    }
  }

  on(event, listener) {
    if (!this.#listeners[event]) {
      this.#listeners[event] = [];
    }
    this.#listeners[event].push(listener);
  }

  emit(event, ...args) {
    if (!this.#listeners[event]) {
      return;
    }
    for (const listener of this.#listeners[event]) {
      listener(...args);
    }
  }
}

window.CLIENT = new Client(bid, tid);
