import { APIGetRequest, APIPostRequest } from '/modules/api.mjs';

('use strict');

class Client {
  constructor(bid, tid) {
    if (!bid || !tid) {
      window.location.href = '/error-403';
      return;
    }
    this.bid = bid;
    this.tid = tid;
    this.booth = {
      booth_name: '테스트포차',
      bank: '한국은행',
      banker_name: '홍길동',
      account_number: '1234-1234',
      booth_image_url: '/images/bg.jpg',
    };
    this.table = {
      id: 1,
      table_name: '테이블 1',
    };
    this.menus = {};
    this.cart = {};
    this.history = [];

    const menus = [
      {
        menuId: 1,
        category: '추천 메뉴',
        menu_name: '닭꼬치 데리야끼맛',
        description: '무려 사진이 있는 메뉴',
        price: 4000,
        menu_img_url: 'images/닭꼬치 데리야끼맛.jpg',
      },
      {
        menuId: 222,
        category: '추천 메뉴',
        menu_name: '메뉴 이름',
        description: '아아아아awdwadaw아아아',
        price: 12000,
        menu_img_url: '',
      },
      {
        menuId: 2,
        category: '추천 메뉴',
        menu_name: '메뉴 이름',
        description: '아아아아아아아',
        price: 12000,
        menu_img_url: '',
      },
      {
        menuId: 3,
        category: '추천 메뉴',
        menu_name: '츄파춥스 딸기맛',
        description: '블랙카우맛',
        price: 2100000,
        menu_img_url: 'images/츄파춥스 딸기맛.jpg',
      },
      {
        menuId: 4,
        category: '추천 메뉴',
        menu_name: '딸기초코김치찌개',
        description: '꼭 먹으셈 두번 먹으셈',
        price: 27000,
        menu_img_url: 'images/딸기초코김치찌개.jpg',
      },
      {
        menuId: 5,
        category: '추천 메뉴',
        menu_name:
          '이름도완전길고내용도완전길어서페이지유아이를망가뜨릴지도모르는말도안되는테스트용메뉴이름',
        description:
          'Minecraft(Minecraft) 는 마르쿠스 "노치" 페르손에 의해 개발된 샌드박스형 게임으로서, 마이크로소프트 스튜디오 산하의 Mojang Studios에서 관리하고 있다. Minecraft는 Infiniminer 에서 영감을 받은 게임이다.',
        price: 30000,
        menu_img_url: '',
      },
      {
        menuId: 6,
        category: '추천 메뉴',
        menu_name: '벽돌',
        description: '먹으면 죽을듯',
        price: 294000,
        menu_img_url: '',
      },
      {
        menuId: 201,
        category: '추천 메뉴',
        menu_name: '콘치즈',
        description: '몰라',
        price: 12000,
        menu_img_url: '',
      },
      {
        menuId: 202,
        category: '추천 메뉴',
        menu_name: '모둠 나쵸',
        description: '치즈듬뿍 짱 맛있는 나쵸',
        price: 23000,
        menu_img_url: '',
      },
      {
        menuId: 911,
        category: '주류 · 음료',
        menu_name: '참이슬',
        description: '',
        price: 4000,
        menu_img_url: '',
      },
      {
        menuId: 912,
        category: '주류 · 음료',
        menu_name: '처음처럼',
        description: '',
        price: 4000,
        menu_img_url: '',
      },
      {
        menuId: 921,
        category: '주류 · 음료',
        menu_name: '카스',
        description: '',
        price: 5000,
        menu_img_url: '',
      },
      {
        menuId: 941,
        category: '주류 · 음료',
        menu_name: '콜라',
        description: '뚱캔 355ml',
        price: 2000,
        menu_img_url: '',
      },
      {
        menuId: 942,
        category: '주류 · 음료',
        menu_name: '사이다',
        description: '뚱캔 355ml',
        price: 2000,
        menu_img_url: '',
      },
    ];
    for (const menu of menus) {
      this.menus[menu.menuId] = menu;
    }

    this.init();
  }

  async init() {
    MAIN.init();
    PANEL_CART.init();
    PANEL_HISTORY.init();

    MAIN.displayBooth(this.booth, this.table);
    MAIN.displayMenu(this.booth, this.menus);
  }

  async getMenu() {}

  async postCart() {}

  async getHistory() {}

  destroy() {}

  async call() {
    await (() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    })();
  }

  addMenuInCart(menu, count = 1) {
    if (!this.cart[menu.menuId]) {
      this.cart[menu.menuId] = 0;
    }

    this.cart[menu.menuId] += count;

    PANEL_CART.updateLabel(this.cart);
  }

  removeMenuInCart(menu, count = 1) {
    if (!this.cart[menu.menuId]) {
      return;
    }

    this.cart[menu.menuId] -= count;
    if (this.cart[menu.menuId] <= 0) {
      delete this.cart[menu.menuId];
    }

    PANEL_CART.updateLabel(this.cart);
  }

  async orderMenuInCart() {
    await (() => {
      return new Promise((resolve) => {
        const timestamp = Date.now();
        for (const item in CLIENT.cart) {
          const menu = CLIENT.menus[item];
          const order = {
            timestamp: timestamp,
            menu_id: item,
            menu_name: menu.menu_name,
            price: menu.price,
            quantity: CLIENT.cart[item],
            state: Math.random() > 0.5 ? '조리완료' : '조리중',
          };
          CLIENT.history.push(order);
        }
        CLIENT.cart = {};
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    })();
  }
}

const MAIN = {
  init() {
    document.addEventListener('scroll', (event) => {
      MAIN.scroll();
    });
    MAIN.scroll();

    document
      .querySelector('#button-lang')
      .addEventListener('click', async (event) => {
        alert('언어 바꾸는 기능은 아직 없음');
      });
  },

  displayBooth(booth, table) {
    // 부스 이름, 테이블 이름 설정
    document.querySelector('#nav .desc .booth').innerHTML = booth.booth_name;
    document.querySelector('#nav .desc .table').innerHTML = table.table_name;
    document.querySelector('#main .desc .booth').innerHTML = booth.booth_name;
    document.querySelector('#main .desc .table').innerHTML = table.table_name;

    // 부스 이미지 설정
    document.querySelector('#cover .image img').src = booth.booth_image_url;
  },

  displayMenu(booth, menus) {
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
        PANEL_MENU.open(menu, booth);

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
  },

  updateMenu() {},

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
  },

  getMenuElement(menu) {
    const element = document.createElement('div');
    element.classList.add('menu');
    element.setAttribute('menu', menu.menuId);
    let html = ``;
    html += `<div class="wrapper">`;
    if (menu.menu_img_url) {
      html += `  <div class="image">`;
      html += `    <img src="${menu.menu_img_url}" />`;
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
  },

  scrollOff() {
    document.body.style.overflow = 'hidden';
  },

  scrollOn() {
    document.body.style.overflow = 'auto';
  },

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
  },
};

const PANEL_MENU = {
  panel: document.querySelector('#panel-menu'),

  open(menu, booth) {
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
      CLIENT.addMenuInCart(menu, count);
      this.close();
    });

    this.panel.setAttribute('phase', 'open');
    MAIN.scrollOff();
  },

  close() {
    this.panel.setAttribute('phase', 'close');
    MAIN.scrollOn();
  },
};

const PANEL_CART = {
  panel: document.querySelector('#panel-cart'),
  orderProcessing: false,

  init() {
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
            this.order(CLIENT.menus, CLIENT.cart);
            break;
          }
          case 'order': {
            break;
          }
          default: {
            this.open(CLIENT.menus, CLIENT.cart);
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
  },

  open(menus, cart) {
    this.panel.querySelector('.fg-content > .cart > .list').innerHTML = '';
    for (let [menuID, count] of Object.entries(cart)) {
      const menu = JSON.parse(JSON.stringify(menus[menuID]));
      menu.control = true;
      const menuElement = MAIN.getMenuElement(menu);
      menuElement.querySelector('.buttons .count').innerHTML = count;
      menuElement.querySelector('.buttons .minus span').innerHTML =
        count > 1 ? 'remove' : 'delete';
      menuElement
        .querySelector('.buttons .minus')
        .addEventListener('click', () => {
          count--;
          CLIENT.removeMenuInCart(menu, 1);
          this.updateTotal(menus, cart);
          menuElement.querySelector('.buttons .count').innerHTML = count;
          menuElement.querySelector('.buttons .minus span').innerHTML =
            count > 1 ? 'remove' : 'delete';
          if (count <= 0) {
            menuElement.parentElement.removeChild(menuElement);
          }
          if (Object.keys(CLIENT.cart).length <= 0) {
            this.close();
          }
        });
      menuElement
        .querySelector('.buttons .plus')
        .addEventListener('click', () => {
          count++;
          CLIENT.addMenuInCart(menu, 1);
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

    MAIN.scrollOff();
  },

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
    await CLIENT.orderMenuInCart();
    this.orderProcessing = false;

    this.panel.querySelector(
      '.fg-content > .order > .message > .main'
    ).innerHTML = '주문이 완료되었습니다';
    this.panel.querySelector(
      '.fg-content > .order > .message > .sub'
    ).innerHTML = '이 창을 닫아 주세요';
    this.panel.querySelector('#button-panel-cart-left').disabled = false;

    this.updateLabel({});
  },

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

    this.updateLabel(CLIENT.cart);

    MAIN.scrollOn();
  },

  call() {
    this.lineMessage('직원을 호출하였습니다. 잠시만 기다려주세요.');

    CLIENT.call();

    this.panel.querySelector('#button-panel-cart-left').disabled = true;
    this.panel.querySelector('#button-panel-cart-right').disabled = true;
    setTimeout(() => {
      this.panel.querySelector('#button-panel-cart-left').disabled = false;
      this.updateLabel(CLIENT.cart);
    }, 1000);
  },

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
  },

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
  },

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
  },
};

const PANEL_HISTORY = {
  panel: document.querySelector('#panel-history'),

  init() {
    document
      .querySelector('#button-history')
      .addEventListener('click', async (event) => {
        this.open(CLIENT.history);
      });
  },

  open(history) {
    let totalCount = 0;
    let totalPrice = 0;

    const orders = {};
    for (const order of history) {
      if (!orders[order.timestamp]) {
        orders[order.timestamp] = [];
      }
      orders[order.timestamp].push({
        menuId: order.menu_id,
        menu_name: order.menu_name,
        description: '',
        price: order.price,
        count: order.quantity,
        state: order.state,
      });
      totalCount += order.quantity;
      totalPrice += order.price * order.quantity;
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
        const menuElement = MAIN.getMenuElement(menu);
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
    MAIN.scrollOff();
  },

  close() {
    this.panel.setAttribute('phase', 'close');
    MAIN.scrollOn();
  },
};

const bid = 'testbooth';
const tid = 'testTable';

window.CLIENT = new Client(bid, tid);
