import { APIGetRequest, APIPatchRequest, APIDeleteRequest } from '/modules/api.mjs';

let menus = 0;
let selCate = 0;

const MAIN = {
  async displayMenu(menus) {
    let categories = {};
    let radioButtons = {};
    
    for (const [menuID, menu] of Object.entries(menus)) {
      //if (!categories[menu.category]) {
      if ((!categories[menu.category]) && ((menu.category !== '삭제된 메뉴'))) {
        const categoryElement = this.getCategoryElement(menu);
        categories[menu.category] = categoryElement;
        
        
        radioButtons[menu.category] = ``;
        radioButtons[menu.category] += `<input type="radio" name="category" id="${menu.category}"`;  
        if (menu.category === selCate) radioButtons[menu.category] += `checked`;
        radioButtons[menu.category] += `><label for="${menu.category}">${menu.category}</label>`;
      }

      const menuElement = this.getMenuElement(menu);
      // 임시조치
      if (menu.category !== '삭제된 메뉴') {
        categories[menu.category]
          .querySelector('.content')
          .appendChild(menuElement);          
      }

      // 메뉴 수정
      menuElement.addEventListener('click', (event) => {
        let target = event.target;
        const mid = menus[this.getMenuID(target)].id;
        window.location.href = `/dash/menu/${mid}/manage`;
        /*
        const menuPopup = document.getElementById('menu-popup');
        menuPopup.style.display = 'flex';
        */
      });

      // 메뉴 삭제
      menuElement.querySelector('#button-menu-delete').addEventListener('click', (event) => {
        event.stopPropagation(); // 이벤트 버블링 방지
        let target = event.target;
        const menuIndex = this.getMenuID(target);
        deleteMenu(menuIndex);
      });
    }

    // 메뉴 나타내기~~
    document.querySelector('#menu').innerHTML = '';
    for (const category in categories) {
      if (category === selCate) document.querySelector('#menu').appendChild(categories[category]);
    }
    for (const category in categories) {
      if (category !== selCate) document.querySelector('#menu').appendChild(categories[category]);
    }

    // 위쪽 카테고리 버튼 추가!
    document.querySelector('#category-group').innerHTML = '';
    const rbElement = document.createElement('div');
    for (const radioButton in radioButtons) {
      rbElement.innerHTML += radioButtons[radioButton];
      document.querySelector('#category-group').appendChild(rbElement);
    }

    // 위쪽 카테고리 버튼 동작!
    const selCates = document.querySelectorAll('#category-group div input[type="radio"]');
    for (const cate of selCates) {
      //console.log(selCates);
      //console.log(cate);
      cate.addEventListener('click', () => {
        //console.log(cate.id);
        selCate = cate.id;
        init();
      });
    }


  },

  getCategoryElement(menu) {
    const element = document.createElement('div');
    element.classList.add('category');
    element.setAttribute('category', menu.category);
    // bbbb
    if (menu.category === selCate) {
      element.setAttribute('selected', true);
    }
    else element.setAttribute('selected', false);
    // bbbb    
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
        menuIndex = menu;
      }
    }
    return menuIndex;
  }
};

async function deleteMenu(menuIndex) {
  console.log(menus);
  await APIDeleteRequest(`booth/${localStorage.booth}/menu/${menus[menuIndex].id}/`)
  .then(() => {
    init();
    //window.location.reload();
  })
  .catch((error) => { // 에러나면 얘가 F12, COnsole 로그 창에 뭔 에러인지 보여줌
    if (error.status == 500) {
      console.log(menus[menuIndex]);
      bug(menuIndex);
      //window.location.reload();
      init();
    }
  });
  if(menus.length <= 1) window.location.reload();
}
// ㅜㅜㅜ 버그남
async function bug(menuIndex) {
  alert('이미 주문이 들어간 메뉴입니다.');
  const data = await APIPatchRequest(`booth/${localStorage.booth}/menu/${menus[menuIndex].id}/`, {
    category: '삭제된 메뉴',
    menu_name: menus[menuIndex].menu_name,
    price: menus[menuIndex].price,
    description: menus[menuIndex].description,
  })
}

async function init() {
  menus = await APIGetRequest(`booth/${localStorage.booth}/menu/`).catch(
    (error) => {
      console.log(error);
    }
  );
  if(menus.length <= 0) return;
  MAIN.displayMenu(menus);
}

init();