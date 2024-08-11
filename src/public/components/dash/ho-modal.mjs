export default customElements.define(
  'ho-modal',

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
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100000000;
        }
        :host > .bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(10px);
        }
        :host > .fg {
          width: 30rem;
          padding: 3rem;
          border-radius: 3rem;
          background: white;
          z-index: 100000000;
          box-shadow: 0 0 3rem 0 rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        :host > .fg > .title {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }
        :host > .fg > .title > .text {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 2rem;
          width: calc(100% - 3rem);
        }
        :host > .fg > .title > .close {
          width: 1.5rem;
          height: 2rem;
          cursor: pointer;
        }
        :host > .fg > .title > .close > span {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          font-size: 2rem;
        }
        :host > .fg > .content {
          width: 100%;
        }
      `;
      shadow.appendChild(style);

      const bg = document.createElement('div');
      bg.classList.add('bg');
      bg.addEventListener('click', () => {
        this.remove();
      });
      shadow.appendChild(bg);

      const fg = document.createElement('div');
      fg.classList.add('fg');
      shadow.appendChild(fg);

      const title = document.createElement('div');
      title.classList.add('title');
      fg.appendChild(title);

      const text = document.createElement('div');
      text.classList.add('text');
      text.innerHTML = this.getAttribute('title');
      title.appendChild(text);

      const close = document.createElement('div');
      close.classList.add('close');
      close.innerHTML += `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />`;
      close.innerHTML += `<span class="material-symbols-outlined"> close </span>`;
      close.addEventListener('click', () => {
        this.remove();
      });
      title.appendChild(close);

      const content = document.createElement('slot');
      content.classList.add('content');
      fg.appendChild(content);
    }
  }
);

function modal(title, html) {
  const root = document.createElement('');
  const bg = document.createElement('div');
  bg.width = '100vw';
  bg.height = '100vh';
  const fg = document.createElement('div');
}
