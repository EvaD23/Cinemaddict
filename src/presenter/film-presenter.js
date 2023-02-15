import { render } from '../framework/render.js';
import FilmView from '../view/film-view.js';

export default class FilmPresenter {
  #filmComponent = null;
  #filmContainer = null;
  #movie = null;


  constructor({ filmContainer }) {
    this.#filmContainer = filmContainer;
  }

  init(movie) {
    this.#filmComponent = new FilmView({ movie });

    render(this.#filmComponent, this.#filmContainer);
  }

}
