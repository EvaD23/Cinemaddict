import { render, remove } from '../framework/render.js';
import FilmView from '../view/film-view.js';

export default class FilmPresenter {
  #filmComponent = null;
  #filmContainer = null;
  #handleClickButton = null;


  constructor({ filmContainer, handleClickButton }) {
    this.#filmContainer = filmContainer;
    this.#handleClickButton = handleClickButton;
  }

  init(movie) {
    this.#filmComponent = new FilmView({ movie, handleClickButton: this.#handleClickButton });

    render(this.#filmComponent, this.#filmContainer);
  }

  //удаляем один фильм
  clearMovie() {
    remove(this.#filmComponent);
  }

}
