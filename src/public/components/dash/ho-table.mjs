import {
  APIGetRequest,
  APIPostRequest,
  APIPatchRequest,
  APIDeleteRequest,
} from '/modules/api.mjs';

const bid = localStorage.booth;

export default customElements.define(
  'ho-table',

  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const tid = this.getAttribute('table');

      const shadow = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = `
        * {
          box-sizing: border-box;
          font-family: var(--font-family);
        }
        :host > .wrapper {
          width: 100%;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border: solid 0.1rem rgb(210, 210, 210);
          border-radius: 0.75rem;
          background: white;
          cursor: pointer;
        }
        :host > .wrapper:hover {
          background: rgb(240,240,240);
        }
        :host > .wrapper > .title {
          font-size: 1.25rem;
          font-weight: 700;
        }
        :host > .wrapper > .control {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        :host > .wrapper > .control > .line {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          gap: 0.5rem;
        }
      `;
      shadow.appendChild(style);

      const wrapper = document.createElement('div');
      wrapper.classList.add('wrapper');
      shadow.appendChild(wrapper);

      const title = document.createElement('div');
      title.classList.add('title');
      title.addEventListener('dblclick', changeName);
      wrapper.appendChild(title);

      const control = document.createElement('div');
      control.classList.add('control');
      wrapper.appendChild(control);

      const line1 = document.createElement('slot');
      line1.classList.add('line');
      line1.name = 'line1';
      control.appendChild(line1);

      const line2 = document.createElement('slot');
      line2.classList.add('line');
      line2.name = 'line2';
      control.appendChild(line2);

      const button_qr = document.createElement('button');
      button_qr.slot = 'line2';
      button_qr.classList.add('qr');
      button_qr.setAttribute('small', '');
      button_qr.setAttribute('primary', '');
      button_qr.innerHTML = '입장 QR';
      button_qr.addEventListener('click', showQR);
      this.appendChild(button_qr);

      const button_orders = document.createElement('button');
      button_orders.slot = 'line2';
      button_orders.classList.add('orders');
      button_orders.setAttribute('small', '');
      button_orders.setAttribute('primary', '');
      button_orders.innerHTML = '주문 현황';
      button_orders.addEventListener('click', () => {
        window.location.href = `/dash/table/${tid}/order`;
      });
      this.appendChild(button_orders);

      const button_check = document.createElement('button');
      button_check.slot = 'line2';
      button_check.classList.add('check');
      button_check.setAttribute('small', '');
      button_check.setAttribute('primary', '');
      button_check.innerHTML = '결제';
      button_check.addEventListener('click', () => {
        window.location.href = `/dash/table/${tid}/check`;
      });
      this.appendChild(button_check);

      const button_changename = document.createElement('button');
      button_changename.slot = 'line1';
      button_changename.classList.add('check');
      button_changename.setAttribute('small', '');
      button_changename.innerHTML = '이름 변경';
      button_changename.addEventListener('click', changeName);
      this.appendChild(button_changename);

      const button_delete = document.createElement('button');
      button_delete.slot = 'line1';
      button_delete.classList.add('delete');
      button_delete.setAttribute('small', '');
      button_delete.innerHTML = '삭제';
      button_delete.addEventListener('click', deleteTable);
      this.appendChild(button_delete);

      APIGetRequest(`booth/${bid}/table/${tid}/`).then((table) => {
        console.log(table);
        title.innerHTML = table.table_name;
      });

      function changeName() {
        let name = prompt('테이블 이름', title.innerHTML);
        if (!name) {
          return;
        }

        APIPatchRequest(`booth/${bid}/table/${tid}/`, {
          id: tid * 1,
          table_name: name,
        })
          .then(() => {
            window.location.reload();
          })
          .catch(async (error) => {
            if (error.status === 400) {
              const json = await error.json();
              alert(`테이블 이름 변경 실패: ${json.table_name[0]}`);
            }
          });
      }

      function deleteTable() {
        if (!confirm(`정말 이 테이블을 삭제하시겠습니까?`)) {
          return;
        }
        APIDeleteRequest(`booth/${bid}/table/${tid}/`).then(() => {
          window.location.reload();
        });
      }

      function showQR() {
        APIPatchRequest(`auth/qrlink/`, {
          table_id: tid,
        }).then((url) => {
          const modal = document.createElement('ho-modal');
          modal.setAttribute('title', `${title.innerHTML} 입장 QR`);
          const qr = document.createElement('div');
          new QRCode(qr, {
            text: url,
            width: 1000,
            height: 1000,
          });
          const img = qr.querySelector('img');
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'contain';
          modal.appendChild(qr);
          document.body.appendChild(modal);
        });
      }
    }
  }
);
