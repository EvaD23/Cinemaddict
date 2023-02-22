import { render, remove, replace } from '../framework/render.js';
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
    const prevMovieComponent = this.#filmComponent;
    this.#filmComponent = new FilmView({ movie, handleClickButton: this.#handleClickButton });
    // для перерисовки карточки фильма с прошлой на новую или инциализация, если рендерится впервые
    if (!prevMovieComponent) {
      render(this.#filmComponent, this.#filmContainer);
      return;
    }
    replace(this.#filmComponent, prevMovieComponent);
    remove(prevMovieComponent);
  }

  // мотод для удаления одного фильма
  clearMovie() {
    remove(this.#filmComponent);
  }
}
