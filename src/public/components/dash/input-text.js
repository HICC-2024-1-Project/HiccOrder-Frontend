export default customElements.define(
  'h-input-text',

  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const shadow = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = `
        :host {
          display: block;
          width: 500px;
          height: 200px;
          background: red;
        }
      `;
      shadow.appendChild(style);

      const input = document.createElement('input');
      input.type = 'text';

      const button = document.createElement('button');

      const updateButton = () => {
        button.innerHTML = input.value || 'No value';
      };
      input.addEventListener('keydown', updateButton);
      input.addEventListener('keyup', updateButton);
      updateButton();

      button.addEventListener('click', () => {
        alert(input.value);
      });

      shadow.appendChild(input);
      shadow.appendChild(button);
    }

    disconnectedCallback() {}

    adoptedCallback() {}

    static observedAttributes = ['value', 'label', 'message', 'placeholder'];

    get value() {
      return this.getAttribute('value');
    }

    set value(val) {
      if (val) {
        this.setAttribute('value', val);
      } else {
        this.removeAttribute('value');
      }
      this.shadowRoot.querySelector('input').value = val || '';
    }

    get placeholder() {
      return this.getAttribute('placeholder');
    }

    set placeholder(val) {
      if (this.getAttribute('placeholder') != val) {
        this.setAttribute('placeholder', val);
      } else {
        this.removeAttribute('placeholder');
      }
      this.shadowRoot.querySelector('input').placeholder = val || '';
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (this[name]) {
        this[name] = newValue;
      }
    }
  }
);
