import tag from 'html-tag-js';
import tile from '../tile';

export default class WCPage extends HTMLElement {
  #leadBtn;
  #header;
  #on = {
    hide: [],
    show: [],
  };
  #append;
  handler;
  onhide;
  onconnect;
  ondisconnect;

  constructor() {
    super();
    const title = this.getAttribute('data-title');

    this.handler = new PageHandler(this);
    this.#append = super.append.bind(this);
    this.append = this.append.bind(this);
    this.hide = this.hide.bind(this);
    this.settitle = this.settitle.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);


    this.#leadBtn = tag('span', {
      className: 'icon arrow_back',
      onclick: () => this.hide.call(this),
      attr: {
        action: 'go-back',
      },
    });

    this.#header = tile({
      type: 'header',
      text: title || 'Page',
      lead: this.#leadBtn,
    });
  }

  append(...$els) {
    let $main = this.body;
    if (!$main) return;
    for (const $el of $els) {
      $main.append($el);
    }
  }

  appendOuter(...$els) {
    this.#append(...$els);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-title') {
      this.settitle = newValue;
    }
  }

  connectedCallback() {
    this.classList.remove('hide');
    if (typeof this.onconnect === 'function') this.onconnect();
    this.#on.show.forEach(cb => cb.call(this));
  }

  disconnectedCallback() {
    if (typeof this.ondisconnect === 'function') this.ondisconnect();
    this.#on.hide.forEach(cb => cb.call(this));
  }

  /**
   * Adds event listener to the page 
   * @param {'hide' | 'show'} event 
   * @param {function(this: WCPage):void} cb 
   */
  on(event, cb) {
    if (event in this.#on) {
      this.#on[event].push(cb);
    }
  }

  /**
   * Removes event listener from the page
   * @param {'hide' | 'show'} event
   * @param {function(this: WCPage):void} cb
   */
  off(event, cb) {
    if (event in this.#on) {
      this.#on[event] = this.#on[event].filter(fn => fn !== cb);
    }
  }

  /**
   * Sets the title of the page
   * @param {string} title 
   */
  settitle(title) {
    this.header.text = title;
  }

  hide() {
    this.classList.add('hide');
    if (typeof this.onhide === 'function') this.onhide();
    setTimeout(() => {
      this.remove();
      this.handler.remove();
    }, 150);
  }

  get body() {
    return this.get('.main') || this.get('main');
  }

  set body($el) {
    if (this.body) this.replaceChild($el, this.body);

    const headerAdjecent = this.header.nextElementSibling;
    if (headerAdjecent) {
      this.insertBefore($el, headerAdjecent);
      return;
    }

    this.appendChild($el);
  }

  get header() {
    return this.#header;
  }

  get innerHTML() {
    return this.body?.innerHTML;
  }

  set innerHTML(html) {
    if (this.body) this.body.innerHTML = html;
  }

  get textContent() {
    return this.body?.textContent;
  }

  set textContent(text) {
    if (this.body) this.body.textContent = text;
  }

  get lead() {
    return this.#leadBtn;
  }

  set lead($el) {
    this.header.replaceChild($el, this.#leadBtn);
    this.#leadBtn = $el;
  }

  get header() {
    return this.#header;
  }

  set header($el) {
    this.#header.replaceChild($el, this.#header);
    this.#header = $el;
  }

  initializeIfNotAlreadyInitialized() {
    if (!this.#header.isConnected) {
      this.#addHeaderOrAssignHeader();
    }
  }

  #addHeaderOrAssignHeader() {
    if (!this.classList.contains('primary')) {
      this.#append(this.#header);
      this.#append(tag('div', {
        className: 'main',
      }));
    } else {
      this.#header = this.get('header');
      if (this.#header) {
        this.#leadBtn = this.#header.firstChild;
      }
    }
  }
}

class PageHandler {
  $el;
  $replacement;
  onRemove;

  /**
   * 
   * @param {HTMLElement} $el 
   */
  constructor($el) {
    this.$el = $el;

    this.onhide = this.onhide.bind(this);
    this.onshow = this.onshow.bind(this);

    this.$replacement = tag('span', { className: 'page-replacement' });
    this.$replacement.handler = this;

    this.$el.on('hide', this.onhide);
    this.$el.on('show', this.onshow);
  }

  /**
   * Replace current element with a replacement element
   */
  replaceEl() {
    this.$el.off('hide', this.onhide);
    if (!this.$el.isConnected || this.$replacement.isConnected) return;
    this.$el.parentElement.replaceChild(this.$replacement, this.$el);
    this.$el.classList.add('no-transition');
  }

  /**
   * Restore current element from a replacement element
   */
  restoreEl() {
    if (this.$el.isConnected || !this.$replacement.isConnected) return;
    this.$el.off('hide', this.onhide);
    this.$replacement.parentElement.replaceChild(this.$el, this.$replacement);
    this.$el.on('hide', this.onhide);
  }

  onhide() {
    this.$el.off('hide', this.onhide);
    handlePagesForSmoothExprienceBack();
  }

  onshow() {
    this.$el.off('show', this.onshow);
    handlePagesForSmoothExprience();
  }

  remove() {
    this.$replacement.remove();
  }
}

/**
 * Remove invisible pages from DOM and add them to the stack
 */
function handlePagesForSmoothExprience() {
  const $pages = [...tag.getAll('wc-page')];
  for (let $page of $pages.slice(0, -1)) {
    $page.handler.replaceEl();
  }
}

function handlePagesForSmoothExprienceBack() {
  [
    ...tag.getAll('.page-replacement')
  ].pop()?.handler.restoreEl();
}