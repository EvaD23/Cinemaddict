import FilterView from '../view/filter-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import RatingView from '../view/rating-view.js';

export default class FilterPresenter {
  #filterComponent = null;
  #filterContainer = null;
  #movieModel = null;
  #filterModel = null;
  #ratingComponent = null;
  #headerContainer = null;

  constructor({ filterContainer, movieModel, filterModel, headerContainer }) {
    this.#filterContainer = filterContainer;
    this.#headerContainer = headerContainer;
    this.#movieModel = movieModel;
    this.#filterModel = filterModel;
    this.#movieModel.addObserver(this.#handlerModelEvent);
    this.#filterModel.addObserver(this.#handlerModelEvent);
  }

  init(currentFilter) {
    this.#clearHeader();
    this.#renderHeader(currentFilter);
  }

  #renderHeader(currentFilter) {
    const movies = this.#movieModel.movies;
    const countMovies = this.#countMovies(movies);

    this.#filterComponent = new FilterView({ handleClickFilter: this.#changeFilterType, currentFilter, countMovies });
    render(this.#filterComponent, this.#filterContainer, RenderPosition.AFTERBEGIN);
    if (countMovies.alreadyWatched > 0) {
      this.#ratingComponent = new RatingView({ countAlreadyWacth: countMovies.alreadyWatched });
      render(this.#ratingComponent, this.#headerContainer);
    }
  }

  #clearHeader() {
    if (this.#filterComponent) {
      remove(this.#filterComponent);
    }
    if (this.#ratingComponent) {
      remove(this.#ratingComponent);
    }
  }

  // функция которая реагирует на изменение модели
  #handlerModelEvent = () => {
    this.init(this.#filterModel.filterType);
  };

  // фукнция которая меняет тип фильтра опосредованно вызывает метод у filterModel
  #changeFilterType = (filterType, eventType) => {
    this.#filterModel.changeFilterType(filterType, eventType);
  };

  // функция счетчик фильмов в разных фильтрах
  #countMovies(movies) {
    const moviesCount = {
      watchList: 0,
      alreadyWatched: 0,
      favorite: 0,
    };
    movies.forEach((movie) => {
      if (movie.userDetails.watchlist) {
        moviesCount.watchList++;
      }
      if (movie.userDetails.alreadyWatched) {
        moviesCount.alreadyWatched++;
      }
      if (movie.userDetails.favorite) {
        moviesCount.favorite++;
      }

    });
    return moviesCount;
  }

}

