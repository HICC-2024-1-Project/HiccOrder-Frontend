'use strict';

/**
 * modules/notification.mjs
 *
 * 오른쪽에서 나오는 작고 귀여운 알림 메시지
 *
 * @author Wany <sung@wanyne.com> (https://wanyne.com)
 */

import Animate from './animate.mjs';

/**
 * Right-side notification message
 */
class Notification {
  static list = [];
  #theme = {
    background: 'black',
    foreground: 'white',
    font: 'var(--sans-serif)',
  };

  /**
   * Create new notification
   *
   * @param {string} content
   * @param {string | "success" | "warn" | "error"} type
   * @param {object} options
   * @param {number} options.timeout
   * @param {object} options.style CSS style
   */
  constructor(content, type, options = {}) {
    options.timeout = options.timeout ? options.timeout : 10000;

    this.container = this.#getContainer();

    this.element = document.createElement('div');
    this.element.classList.add('notification');
    type ? this.element.setAttribute('type', type) : null;

    const message = document.createElement('div');
    message.classList.add('message');
    message.innerHTML = content;

    const close = document.createElement('div');
    close.classList.add('close');
    const closebtn = document.createElement('div');
    closebtn.classList.add('btn');
    closebtn.innerHTML = '<span class="material-symbols-outlined">close</span>';
    closebtn.addEventListener('click', () => {
      this.close();
    });
    close.appendChild(closebtn);

    this.element.appendChild(message);
    this.element.appendChild(close);

    if (options.style) {
      for (const key in options.style) {
        element.style[key] = options.style[key];
      }
    }
    this.container.appendChild(this.element);

    Notification.list.push(this);

    this.open(options.timeout);
  }

  #getContainer() {
    let container = document.querySelector('#notifications');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notifications';
      const style = document.createElement('style');
      style.innerText = this.#style();
      container.appendChild(style);
      document.body.appendChild(container);
    }
    return container;
  }

  #style() {
    return `
    #notifications {
      position: fixed;
      display: block;
      z-index: 500000000;
      top: 4rem;
      right: 1rem;
      width: calc(min((100vw - 4rem), 36rem));
      height: calc(100vh - 12rem);
      transition: top 0.2s ease-out, right 0.2s ease-out, max-width 0.2s ease-out;
      pointer-events: none;
      --notification-bg: ${this.#theme.background};
      --notification-fg: ${this.#theme.foreground};
      --notification-font: ${this.#theme.font};
      --bg: var(--notification-bg);
      --fg: var(--notification-fg);
    }
    #notifications .notification {
      box-sizing: border-box;
      position: relative;
      display: block;
      right: -900px;
      width: max-content;
      max-width: calc(100% - 4rem);
      padding: 0.75rem 3rem 0.75rem 1rem;
      margin-bottom: 1rem;
      margin-right: 0px;
      margin-left: auto;
      border-radius: 0.75rem;
      border: solid 0.1rem;
      transition: /*right 0.35s cubic-bezier(0, 0, 0.3, 1.3),*/ opacity 0.2s ease-out, transform 0.2s ease-out,
        max-width 0s ease-out;
      text-align: left;
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
      pointer-events: all;
    }
    #notifications .notification.show {
      right: 0px;
    }
    #notifications .notification.hide {
      opacity: 0;
      transform: scale(0);
    }
    #notifications .notification > .message {
      position: relative;
      display: inline;
      word-break: break-all;
      font-family: var(--notification-font);
      font-weight: 500;
      font-size: 1rem;
      line-height: 100%;
    }
    #notifications .notification > .close {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0px;
      right: 0.5rem;
      width: 2rem;
      height: 100%;
    }
    #notifications .notification > .close > .btn {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 100%;
      background: rgb(60, 60, 60);
      cursor: pointer;
    }
    #notifications .notification > .close > .btn > span {
      font-weight: 500;
      font-size: 1rem;
    }
    #notifications .notification {
      background: black;
      color: white;
      border-color: rgb(80, 80, 80);
    }
    #notifications .notification[type="warn"],
    #notifications .notification[type="yellow"] {
      background: rgb(255, 187, 0);
      color: black;
      border-color: rgb(228, 167, 0);
    }
    #notifications .notification[type="warn"] > .close > .btn,
    #notifications .notification[type="yellow"] > .close > .btn {
      background: rgb(228, 167, 0);
    }
    #notifications .notification[type="error"],
    #notifications .notification[type="red"] {
      background: rgb(255, 59, 48);
      color: white;
      border-color: rgb(209, 39, 30);
    }
    #notifications .notification[type="error"] > .close > .btn,
    #notifications .notification[type="red"] > .close > .btn {
      background: rgb(209, 39, 30);
    }
    #notifications .notification[type="success"],
    #notifications .notification[type="green"] {
      background: rgb(52, 199, 89);
      color: white;
      border-color: rgb(40, 179, 74);
    }
    #notifications .notification[type="success"] > .close > .btn,
    #notifications .notification[type="green"] > .close > .btn {
      background: rgb(40, 179, 74);
    }
    #notifications .notification[type="rainbow"] {
      background: linear-gradient(
        to right,
        rgba(255, 0, 0, 1),
        rgba(255, 154, 0, 1),
        rgba(208, 222, 33, 1),
        rgba(79, 220, 74, 1),
        rgba(63, 218, 216, 1),
        rgba(47, 201, 226, 1),
        rgba(28, 127, 238, 1),
        rgba(95, 21, 242, 1),
        rgba(186, 12, 248, 1),
        rgba(251, 7, 217, 1),
        rgba(255, 0, 0, 1),
        rgba(255, 154, 0, 1),
        rgba(208, 222, 33, 1),
        rgba(79, 220, 74, 1),
        rgba(63, 218, 216, 1),
        rgba(47, 201, 226, 1),
        rgba(28, 127, 238, 1),
        rgba(95, 21, 242, 1),
        rgba(186, 12, 248, 1),
        rgba(251, 7, 217, 1),
        rgba(255, 0, 0, 1)
      );
      background-size: 200% 100%;
      color: white;
      animation-name: rainbow;
      animation-duration: 1s;
      animation-timing-function: linear;
      animation-direction: normal;
      animation-iteration-count: infinite;
    }
    @media (max-width: 600px) {
      #notifications {
        top: 4rem;
        right: 1rem;
        max-width: calc(min((100vw - 2rem), 36rem));
        height: calc(100vh - 8rem);
      }
    }`;
  }

  open(timeout) {
    setTimeout(() => {
      //notification.classList.add('show');
      new Animate(this.element).spring(0.35, 5).to({ right: '0px' }, 1000);
    }, 100);
    this.closeTimeout = setTimeout(() => {
      this.close();
    }, timeout);
  }

  close() {
    clearTimeout(this.closeTimeout);
    this.element.classList.add('hide');
    new Animate(this.element).easeout().to({ right: '-900px' }, 200);
    setTimeout(() => {
      this.container.removeChild(this.element);
      Notification.list.splice(Notification.list.indexOf(this), 1);
      if (Notification.list.length == 0) {
        document.body.removeChild(this.container);
      }
    }, 350);
  }
}

export default Notification;

window.noty = (...args) => {
  new Notification(...args);
};
