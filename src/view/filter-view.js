import AbstractView from '../framework/view/abstract-view.js';
import { EventType, FilterType } from '../const.js';


function createFilterTemplate(countMovies, currentFilter) {
  const active = (filterType) => filterType === currentFilter ? 'main-navigation__item--active' : '';
  return `<nav class="main-navigation">
<a href="#all" class="main-navigation__item ${active(FilterType.ALL)}" data-filter="${FilterType.ALL}">All movies</a>
<a href="#watchlist" class="main-navigation__item  ${active(FilterType.WATCHLIST)}"  data-filter="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count" data-filter="${FilterType.WATCHLIST}">${countMovies.watchList}</span></a>
<a href="#history" class="main-navigation__item ${active(FilterType.WATCHED)}" data-filter="${FilterType.WATCHED}">History <span class="main-navigation__item-count"  data-filter="${FilterType.WATCHED}">${countMovies.alreadyWatched}</span></a>
<a href="#favorites" class="main-navigation__item ${active(FilterType.FAVORITE)}" data-filter="${FilterType.FAVORITE}">Favorites <span class="main-navigation__item-count" data-filter="${FilterType.FAVORITE}">${countMovies.favorite}</span></a>
</nav>`;
}


export default class FilterView extends AbstractView {
  #movies = null;
  #handleClickFilter = null;
  #currentFilter = null;

  constructor({ movies, handleClickFilter, currentFilter }) {
    super();
    this.#movies = movies;
    this.#handleClickFilter = handleClickFilter;
    this.#currentFilter = currentFilter;
    this.element.querySelectorAll('.main-navigation__item').forEach((element) => {
      element.addEventListener('click', this.#handlerClickFilter);
    });

  }

  get template() {
    return createFilterTemplate(this.#countMovies(), this.#currentFilter);
  }

  // функция счетчик фильмов в разных фильтрах
  #countMovies() {
    const moviesCount = {
      watchList: 0,
      alreadyWatched: 0,
      favorite: 0,
    };
    this.#movies.forEach((movie) => {
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

  #handlerClickFilter = (evt) => {
    evt.preventDefault();
    const filterType = evt.target.dataset.filter;
    // вызываем функцию которая изменяет данные в модели
    if (this.#currentFilter !== filterType) {
      this.#handleClickFilter(filterType, EventType.MINOR);
    }
  };

}


