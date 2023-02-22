import AbstractView from '../framework/view/abstract-view.js';

export default class FilmAmount extends AbstractView {
  #movieAmount = null;

  constructor({ movieAmount }) {
    super();
    this.#movieAmount = movieAmount;
  }

  get template() {
    return `<section class="footer__statistics">
    <p>${this.#movieAmount} movies inside</p></section >`;
  }
}
