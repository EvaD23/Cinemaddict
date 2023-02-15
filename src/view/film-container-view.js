import AbstractView from '../framework/view/abstract-view.js';

export default class FilmContainerView extends AbstractView {

  get template() {
    return '<div class="films-list__container"></div>';
  }

}
