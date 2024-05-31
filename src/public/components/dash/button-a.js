class CustomButton extends HTMLAnchorElement {
  constructor() {
    super();
  }
}

customElements.define('button-a', CustomButton);

export default CustomButton;
