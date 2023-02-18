import FilmContainerView from '../view/film-container-view.js';
import { render } from '../framework/render.js';
import { EventType } from '../const.js';
import FilmPresenter from './film-presenter.js';
import { ActionType } from '../const.js';


export default class BoardPresenter {
  #filmContainer = new FilmContainerView();
  #mainContainer = null;
  #filmModel = null;
  // Сохранять презентеры, чтобы получать к ним доступы
  #filmPresenters = new Map();

  constructor({ mainContainer, filmModel }) {
    this.#mainContainer = mainContainer;
    this.#filmModel = filmModel;

    // отрисовываем контейнер для фильма
    render(this.#filmContainer, mainContainer);
    filmModel.addObserver(this.#handleEventModel);
  }

  init() {
    this.#renderMovies();
  }

  // Обрабатываем события происходящие с фильмами, нужен для обзервера
  #handleEventModel = (event) => {
    switch (event) {
      case EventType.INIT:
        this.#renderMovies();
        break;
      case EventType.MINOR:
        this.#clearMovies();
        this.#renderMovies();
    }
  };

  // Метод обрабатывает действия во вьюхах
  #onDataChange = (actionType, updateType, update) => {
    switch (actionType) {
      case ActionType.UPDATE_MOVIE:
        this.#filmModel.updateMovie(update, updateType);
        break;
    }
  };

  // метод очистки списка фильмов
  #clearMovies() {
    this.#filmPresenters.forEach((moviePresenter) => moviePresenter.clearMovie());
    this.#filmPresenters.clear();
  }

  #renderMovies() {
    const movies = this.#filmModel.movies;
    movies.forEach((movie) => {
      const filmPresenter = new FilmPresenter({ filmContainer: this.#filmContainer.element, handleClickButton: this.#onDataChange });
      // методы можно вызвать только у экземпляра. movie.id - чтобы легко можно было вытащить из мапы по ключу
      this.#filmPresenters.set(movie.id, filmPresenter);
      filmPresenter.init(movie);
    });
  }

}
