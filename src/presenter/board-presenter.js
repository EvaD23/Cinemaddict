import FilmContainerView from '../view/film-container-view.js';
import { render } from '../framework/render.js';
import { EventType } from '../const.js';
import FilmPresenter from './film-presenter.js';


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
    }
  };

  #renderMovies() {
    const movies = this.#filmModel.movies;
    movies.forEach((movie) => {
      const filmPresenter = new FilmPresenter({ filmContainer: this.#filmContainer.element });
      // методы можно вызвать только у экземпляра. movie.id - чтобы легко можно было вытащить из мапы по ключу
      this.#filmPresenters.set(movie.id, filmPresenter);
      filmPresenter.init(movie);
    });
  }

}
