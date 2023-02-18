import FilmContainerView from '../view/film-container-view.js';
import { render } from '../framework/render.js';
import { EventType, filter } from '../const.js';
import FilmPresenter from './film-presenter.js';
import { ActionType } from '../const.js';


export default class BoardPresenter {
  #filmContainer = new FilmContainerView();
  #mainContainer = null;
  #filmModel = null;
  #filterModel = null;
  // Сохранять презентеры, чтобы получать к ним доступы
  #filmPresenters = new Map();

  constructor({ mainContainer, filmModel, filterModel }) {
    this.#mainContainer = mainContainer;
    this.#filmModel = filmModel;
    this.#filterModel = filterModel;

    // отрисовываем контейнер для фильма
    render(this.#filmContainer, mainContainer);
    filmModel.addObserver(this.#handleEventModel);
    filterModel.addObserver(this.#handleEventModel);
  }

  init() {
    this.#renderMovies();
  }

  get movies() {
    // фильтрует и сортирует список фильмов для отображения
    const movies = this.#filmModel.movies;
    const currentFilter = this.#filterModel.filterType;
    // для передачи фильмов в функцию находящуюся в константе filter
    const filterFunction = filter[currentFilter];
    return filterFunction(movies);
  }

  // Обрабатываем события происходящие с фильмами, нужен для обзервера
  #handleEventModel = (event, movie) => {
    switch (event) {
      // происходит когда модель получила данные от сервера
      case EventType.INIT:
        this.#renderMovies();
        break;
      case EventType.PATCH:
        this.#filmPresenters.get(movie.id).init(movie);
        break;
      case EventType.MINOR:
        this.#clearMovies();
        this.#renderMovies();
        break;
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

  // функция для отрисовки списка фильмов
  #renderMovies() {
    this.movies.forEach((movie) => {
      const filmPresenter = new FilmPresenter({ filmContainer: this.#filmContainer.element, handleClickButton: this.#onDataChange });
      // методы можно вызвать только у экземпляра. movie.id - чтобы легко можно было вытащить из мапы по ключу
      this.#filmPresenters.set(movie.id, filmPresenter);
      filmPresenter.init(movie);
    });
  }

}
