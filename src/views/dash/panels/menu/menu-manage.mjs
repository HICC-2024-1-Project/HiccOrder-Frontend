import { APIGetRequest, APIPostRequest, APIPatchRequest } from '/modules/api.mjs';


const menus = await APIGetRequest(`booth/${localStorage.booth}/menu/`).catch(
  (error) => {
    console.log(error);
  }
);

async function init() {
  const input = {
    menuCate: document.querySelector('#input-menu-category'),
    menuName: document.querySelector('#input-menu-name'),
    menuPrice: document.querySelector('#input-menu-price'),
    menuDescr: document.querySelector('#input-menu-descr'),
  };
  
  // 넘어온 데이터가 있으면 수정하기임!!!
  if(localStorage.getItem('menuId') !== '-1') {
    const menuData = await APIGetRequest(`booth/${localStorage.booth}/menu/${menus[localStorage.getItem('menuId')].id}/`);

    input.menuCate.value = menuData.category;
    input.menuName.value = menuData.menu_name;
    input.menuPrice.value = menuData.price;
    input.menuDescr.value = menuData.description;
  }

  document.getElementById('arrow').addEventListener('click', function () {
    //history.back();
    window.location.href = "/dash/menu";
  });
  
  async function updateBooth() {
    if(localStorage.getItem('menuId') !== '-1') {
      const data = await APIPatchRequest(`booth/${localStorage.booth}/menu/${menus[localStorage.getItem('menuId')].id}/`, {
        category: input.menuCate.value,
        menu_name: input.menuName.value,
        price: input.menuPrice.value,
        description: input.menuDescr.value,
      })
      .then(() => {
        window.location.href = "/dash/menu";
        alert('메뉴 정보가 저장되었습니다.');
      })
      .catch((error) => { // 에러나면 얘가 F12, COnsole 로그 창에 뭔 에러인지 보여줌
        alert('입력을 완료하여 주십시오.');
        if (error.status == 400) {
          error.json().then((errorData) => {
            input.menuCate.message = `<span style="color:red;">${errorData.category || ''}</span>`;
            input.menuName.message = `<span style="color:red;">${errorData.menu_name || ''}</span>`;
            input.menuPrice.message = `<span style="color:red;">${errorData.price || ''}</span>`;
            input.menuDescr.message = `<span style="color:red;">${errorData.description || ''}</span>`;
          })
        }
      });
    }
    else { // 추가하기
      const data = await APIPatchRequest(`booth/${localStorage.booth}/menu/`, {  
        category: input.menuCate.value,
        menu_name: input.menuName.value,
        price: input.menuPrice.value,
        description: input.menuDescr.value,
      })
      .then(() => {
        window.location.href = "/dash/menu";
        alert('메뉴 정보가 저장되었습니다.');
      })
      .catch((error) => { // 에러나면 얘가 F12, COnsole 로그 창에 뭔 에러인지 보여줌
        alert('입력을 완료하여 주십시오.');
        if (error.status == 400) {
          error.json().then((errorData) => {
            input.menuCate.message = `<span style="color:red;">${errorData.category || ''}</span>`;
            input.menuName.message = `<span style="color:red;">${errorData.menu_name || ''}</span>`;
            input.menuPrice.message = `<span style="color:red;">${errorData.price || ''}</span>`;
            input.menuDescr.message = `<span style="color:red;">${errorData.description || ''}</span>`;
          })
        }
      });
    }
  }
  
  document.getElementById('button-menu-index-update').addEventListener('click', function () {
    updateBooth();
  });
}

init();
