import FilmContainerView from '../view/film-container-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { EventType, filter, SortType, ActionType, sorter } from '../const.js';
import FilmPresenter from './film-presenter.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import ButtonView from '../view/button-view.js';


export default class BoardPresenter {
  #moviesContainer = new FilmContainerView();
  #mainContainer = null;
  #filmModel = null;
  #filterModel = null;
  #sortComponent = null;
  #sortType = SortType.DEFAULT;
  #emptyListComponent = null;
  #buttonComponent = null;
  #counterMovies = 5;
  #isShowButton = true;
  // Сохранять презентеры, чтобы получать к ним доступы
  #filmPresenters = new Map();

  constructor({ mainContainer, filmModel, filterModel }) {
    this.#mainContainer = mainContainer;
    this.#filmModel = filmModel;
    this.#filterModel = filterModel;

    // отрисовываем контейнер для фильма
    render(this.#moviesContainer, mainContainer);
    filmModel.addObserver(this.#handleEventModel);
    filterModel.addObserver(this.#handleEventModel);
  }

  init() {
    this.#renderBoard();
  }

  get movies() {
    // фильтрует и сортирует список фильмов для отображения
    const movies = this.#filmModel.movies;
    const currentFilter = this.#filterModel.filterType;
    // для передачи фильмов в функцию находящуюся в константе filter
    const filterFunction = filter[currentFilter];
    const filteredMovies = filterFunction(movies);
    this.#isShowButton = this.#counterMovies < filteredMovies.length;
    const sortedMovies = filteredMovies;
    if (this.#sortType !== SortType.DEFAULT) {
      sortedMovies.sort(sorter[this.#sortType]);
    }
    return sortedMovies.slice(0, this.#counterMovies);
  }

  // Обрабатываем события происходящие с фильмами, нужен для обзервера
  #handleEventModel = (event, movie) => {
    switch (event) {
      // происходит когда модель получила данные от сервера
      case EventType.INIT:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case EventType.PATCH:
        this.#filmPresenters.get(movie.id).init(movie);
        break;
      case EventType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case EventType.MAJOR:
        this.#clearBoard({ resetSort: true });
        this.#renderBoard();
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

  // метод очистки списка фильмов, resetSort - для сброса фильтров
  //FIXME: исправить очистку кнопки после добавления в избранное
  #clearBoard({ resetSort = false, resetCounterMovies = true } = {}) {
    this.#filmPresenters.forEach((moviePresenter) => moviePresenter.clearMovie());
    this.#filmPresenters.clear();
    if (resetSort) {
      this.#sortType = SortType.DEFAULT;
    }
    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }
    if (this.#buttonComponent) {
      remove(this.#buttonComponent);
    }
    // сбрасывает счетчик при изменении фильтра или сортировки
    if (resetCounterMovies) {
      this.#counterMovies = 5;
    }

  }

  // функция для отрисовки списка фильмов
  #renderMovies() {
    this.movies.forEach((movie) => {
      const filmPresenter = new FilmPresenter({ filmContainer: this.#moviesContainer.filmContainer, handleClickButton: this.#onDataChange });
      // методы можно вызвать только у экземпляра. movie.id - чтобы легко можно было вытащить из мапы по ключу
      this.#filmPresenters.set(movie.id, filmPresenter);
      filmPresenter.init(movie);
    });
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onClickSorter: this.#handleSortMovies,
      currentSorter: this.#sortType,
    });
    render(this.#sortComponent, this.#moviesContainer.element, RenderPosition.BEFOREBEGIN);
  }

  #renderBoard() {
    if (this.movies.length > 0) {
      this.#renderSort();
      this.#renderMovies();
      if (this.#isShowButton) {
        this.#renderButton();
      }
    } else {
      this.#renderEmptyList();
    }
  }

  #handleSortMovies = (sortType) => {
    this.#sortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderEmptyList() {
    this.#emptyListComponent = new EmptyListView();
    render(this.#emptyListComponent, this.#mainContainer);
  }

  #renderButton() {
    this.#buttonComponent = new ButtonView({
      onClick: this.#handleShowMoreButton,
    });
    render(this.#buttonComponent, this.#moviesContainer.filmContainer, RenderPosition.AFTEREND);
  }

  #handleShowMoreButton = () => {
    this.#counterMovies += 5;
    this.#clearBoard({ resetCounterMovies: false });
    this.#renderBoard();
  };

}
