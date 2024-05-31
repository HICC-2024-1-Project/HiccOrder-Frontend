class CustomButton extends HTMLElement {
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

  static observedAttributes = ['placeholder'];

  get placeholder() {
    return this.getAttribute('placeholder');
  }

  set placeholder(val) {
    if (val) {
      this.setAttribute('placeholder', '');
    } else {
      this.removeAttribute('placeholder');
    }
    this.shadowRoot.querySelector('input').placeholder = val;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attrChenged');
    switch (name) {
      case 'plh': {
        if (!this.shadowRoot) {
          return;
        }
        const input = this.shadowRoot.querySelector('input');
        input.placeholder = newValue;
        break;
      }
    }
  }
}

customElements.define('custom-button', CustomButton);

export default CustomButton;
