export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {
      btn: document.querySelector(selector),
      label: document.querySelector('.label'),
    };
    return refs;
  }

  enable() {
    this.refs.btn.disabled = false;
    this.refs.label.textContent = 'Load more';
  }

  disable() {
    this.refs.btn.disabled = true;
    this.refs.label.textContent = 'Loading...';
  }

  show() {
    this.refs.btn.classList.remove('is-hidden');
  }

  hide() {
    this.refs.btn.classList.add('is-hidden');
  }
}
