import AbstractView from '../framework/view/abstract-view.js';

export default class ButtonView extends AbstractView {
  #handleClick = null;

  constructor({ onClick }) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#handlerClick);
  }

  get template() {
    return '<button class="films-list__show-more">Show more</button>';
  }

  // метод для обработки клика
  #handlerClick = () => {
    this.#handleClick();
  };
}
