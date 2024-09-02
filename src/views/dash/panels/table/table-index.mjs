import { APIGetRequest, APIPostRequest } from '/modules/api.mjs';

const bid = localStorage.booth;
const button = {
  create: document.querySelector('#button-table-index-create'),
};

async function createTable(name) {
  APIPostRequest(`booth/${bid}/table/`, {
    table_name: name,
  })
    .then(() => {
      window.location.reload();
    })
    .cateh(async (error) => {
      if (error.status === 400) {
        const json = await error.json();
        alert(`테이블 생성 실패: ${json.table_name[0]}`);
      }
    });
}

async function displayTables() {
  const tables = await APIGetRequest(`booth/${bid}/table/`);

  if (tables.length <= 0) {
    return;
  }

  const content = document.querySelector('#table-index > .display > .content');
  content.innerHTML = '';
  content.style.height = 'unset';
  for (const table of tables) {
    const tableElement = document.createElement('ho-table');
    tableElement.setAttribute('table', table.id);
    content.appendChild(tableElement);
  }
}

(async () => {
  displayTables();

  button.create.addEventListener('click', () => {
    let name = prompt('테이블 이름을 입력해주세요');

    if (!name) {
      return;
    }

    createTable(name);
  });
})();
