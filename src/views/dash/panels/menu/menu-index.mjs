import { APIGetRequest, APIDeleteRequest } from '/modules/api.mjs';

const menus = await APIGetRequest(`booth/${localStorage.booth}/menu/`).catch(
  (error) => {
    console.log(error);
  }
);

localStorage.setItem('menuId', -1);

const MAIN = {
  async displayMenu(menus) {
    let categories = {};
    
    for (const [menuID, menu] of Object.entries(menus)) {
      if (!categories[menu.category]) {
        const categoryElement = this.getCategoryElement(menu);
        categories[menu.category] = categoryElement;
      }

      const menuElement = this.getMenuElement(menu);

      // 메뉴 수정
      menuElement.addEventListener('click', (event) => {
        let target = event.target;
        const menuIndex = this.getMenuID(target);
        localStorage.setItem('menuId', menuIndex);
        window.location.href = "/dash/menu/menu-manage";
      });

      // 메뉴 삭제
      menuElement.querySelector('#button-menu-delete').addEventListener('click', (event) => {
        event.stopPropagation(); // 이벤트 버블링 방지
        let target = event.target;
        const menuIndex = this.getMenuID(target);
        console.log(menuIndex);
        deleteMenu(menuIndex);
        //window.location.reload();
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
    element.setAttribute('menu', menu.id);
    let html = ``;
    html += `<div class="wrapper">`;
    if (menu.menu_img_url) {
      html += `  <div class="image">`;
      html += `    <img src="${menu.menu_img_url}" />`;
      html += `  </div>`;
    }
    else {
      html += `  <div class="imagePlace"></div>`;
    }
    html += `  <div class="content">`;
    html += `    <div class="main">`;
    html += `      <div class="info">`;
    html += `        <div class="title">`;
    html += `          <span class="text">${menu.menu_name}</span>`;
    html += `          <div class="set-right">`;
    html += `            <button id="button-menu-delete"> x </button>`;
    html += `          </div>`;
    html += `        </div>`;
    if (menu.description) {
      html += `      <div class="desc">${menu.description}</div>`;
    }
    html += `      </div>`;
    html += `    </div>`;
    html += `    <div class="price">`;
    html += `      <span class="single">${menu.price.toLocaleString(
      'ko-KR'
    )}원</span>`;
    html += `    </div>`;
    html += `  </div>`;
    html += `</div>`;
    element.innerHTML = html;
    return element;
  },

  getMenuID(target) {
    while (!target.classList.contains('menu')) {
      target = target.parentElement;
    }
    const menuID = target.getAttribute('menu');
    const index = Number(menuID);
    let menuIndex = 0;
    for (const menu in menus) {
      if(menus[menu].id === index) {
        console.log(menu);
        menuIndex = menu;
      }
    }
    console.log(menuIndex);

    return menuIndex;
  }
};

async function deleteMenu(menuIndex) {
  await APIDeleteRequest(`booth/${localStorage.booth}/menu/${menus[menuIndex].id}/`);
  window.location.reload();
}

async function init() {
  if(menus.length <= 0) return;
  MAIN.displayMenu(menus);
}

init();