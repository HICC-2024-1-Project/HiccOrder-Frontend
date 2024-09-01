export default customElements.define(
  'ho-menu',

  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const shadow = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = `
        * {
          box-sizing: border-box;
          font-family: var(--font-family);
        }
        :host > .wrapper {
          width: 100%;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          background: white;
          cursor: pointer;
        }
        :host:last-child > .wrapper {
          border-bottom: none;
        }
        :host > .wrapper > .image {
          width: 5rem;
          height: 5rem;
          border: solid 0.1rem rgb(210, 210, 210);
          border-radius: 0.25rem;
          background: rgb(240,240,240);
          overflow: hidden;
        }
        :host > .wrapper > .image > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        :host > .wrapper > .content {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        :host > .wrapper > .image ~ .content {
          width: calc(100% - 6rem);
        }
        :host > .wrapper > .content > .main {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;
        }
        :host > .wrapper > .content > .main > .info {
          width: 100%;
        }
        :host > .wrapper > .content > .main > .info > .title {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.25rem;
        }
        :host > .wrapper > .content > .main > .info > .title > .text {
          font-size: 1.25rem;
          font-weight: 700;
        }
        :host > .wrapper > .content > .main > .info > .desc {
          font-size: 0.75rem;
          font-weight: 400;
          line-height: 133%;
          color: var(--fgl);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        :host > .wrapper > .content > .main > .buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 5rem;
          height: 1.5rem;
          background: var(--th);
          box-shadow: var(--box-shadow);
          border-radius: 0.5rem;
          color: var(--bg);
        }
        :host > .wrapper > .content > .main > .buttons > * {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 2rem;
        }
        :host > .wrapper > .content > .main > .buttons > .count {
          width: 1rem;
          font-size: 0.9rem;
        }
        :host > .wrapper > .content > .main > .buttons > button {
          width: 2rem;
        }
        :host > .wrapper > .content > .main > .buttons > button > * {
          font-size: 1rem;
          color: var(--bg);
        }
        :host > .wrapper > .content > .main > .buttons > button[disabled] > * {
          color: var(--thl);
        }
        :host > .wrapper > .content > .price {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          text-align: right;
          font-weight: 700;
        }
      `;
      shadow.appendChild(style);

      const wrapper = document.createElement('div');
      wrapper.classList.add('wrapper');
      shadow.appendChild(wrapper);

      if (this.hasAttribute('image')) {
        const image = document.createElement('div');
        image.classList.add('image');
        const img = document.createElement('img');
        img.src = this.getAttribute('image');
        image.appendChild(img);
        wrapper.appendChild(image);
      }

      const content = document.createElement('div');
      content.classList.add('content');
      wrapper.appendChild(content);

      const main = document.createElement('div');
      main.classList.add('main');
      content.appendChild(main);

      const info = document.createElement('div');
      info.classList.add('info');
      main.appendChild(info);

      const title = document.createElement('div');
      title.classList.add('title');
      const titleText = document.createElement('span');
      titleText.classList.add('text');
      titleText.innerHTML = this.getAttribute('name');
      title.appendChild(titleText);
      info.appendChild(title);

      const desc = document.createElement('div');
      desc.classList.add('desc');
      desc.innerHTML = this.getAttribute('desc');
      info.appendChild(desc);

      const price = document.createElement('div');
      price.classList.add('price');
      let p = this.getAttribute('price') * 1;
      price.innerHTML = p.toLocaleString('ko-KR') + '원';
      content.appendChild(price);

      const buttons = document.createElement('div');
      buttons.classList.add('buttons');
      main.appendChild(buttons);
    }
  }
);
