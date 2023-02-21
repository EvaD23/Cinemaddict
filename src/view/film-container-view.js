import AbstractView from '../framework/view/abstract-view.js';

export default class FilmContainerView extends AbstractView {

  get template() {
    return `<section class="films">
    <section class="films-list"><div class="films-list__container"></div></section>
    </section>`;
  }

  get filmContainer() {
    return this.element.querySelector('.films-list__container');
  }
}
