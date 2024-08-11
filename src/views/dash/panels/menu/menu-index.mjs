import { APIGetRequest } from '/modules/api.mjs';

const bid = localStorage.booth;

(async () => {
  const menus = await APIGetRequest(`booth/${bid}/menu/`);

  if (menus.length <= 0) {
    return;
  }

  let categories = [];
  for (const menu of menus) {
    if (!categories.includes(menu.category)) {
      categories.push(menu.category);
    }
  }

  categories.sort((a, b) => {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    }
    return 0;
  });

  const content = document.querySelector('#menu-index > .display > .content');
  content.innerHTML = '';

  for (const category of categories) {
    const menusElement = document.createElement('div');
    menusElement.classList.add('menus');
    const categoryElement = document.createElement('h3');
    categoryElement.classList.add('category');
    categoryElement.innerHTML = category;
    menusElement.appendChild(categoryElement);
    const listElement = document.createElement('div');
    listElement.classList.add('list');
    menusElement.appendChild(listElement);
    for (const menu of menus) {
      if (menu.category === category) {
        const menuElement = document.createElement('ho-menu');
        menuElement.setAttribute('name', menu.menu_name);
        menuElement.setAttribute('price', menu.price);
        menuElement.setAttribute('desc', menu.description);
        if (menu.menu_image_url) {
          menuElement.setAttribute('image', menu.menu_image_url);
        }
        menuElement.addEventListener('click', () => {
          window.location.href = `/dash/menu/${menu.id}/`;
        });
        listElement.appendChild(menuElement);
      }
    }
    content.appendChild(menusElement);
  }
})();
