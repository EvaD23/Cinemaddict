import { render, remove, replace } from '../framework/render.js';
import FilmView from '../view/film-view.js';

export default class FilmPresenter {
  #filmComponent = null;
  #filmContainer = null;
  #handleClickButton = null;
  #handleClickCard = null;


  constructor({ filmContainer, handleClickButton, handleClickCard }) {
    this.#filmContainer = filmContainer;
    this.#handleClickButton = handleClickButton;
    this.#handleClickCard = handleClickCard;
  }

  init(movie) {
    const prevMovieComponent = this.#filmComponent;
    this.#filmComponent = new FilmView({ movie, handleClickButton: this.#handleClickButton, handleClickCard: this.#handleClickCard });
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
