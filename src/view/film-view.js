import { ActionType, EventType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { createDurationTemplate } from '../utils.js';

function createDescriptionTempate(description) {
  if (description.length >= 140) {
    return `${description.slice(0, 138)}…`;
  }
  return description;
}

function createFilmTempate(movie) {
  return `   
<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${movie.info.title}</h3>
    <p class="film-card__rating">${movie.info.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${movie.info.release.date.getFullYear()}</span>
<span class="film-card__duration">${createDurationTemplate(movie.info.duration)}</span>
      <span class="film-card__genre">${movie.info.genre[0]}</span>
    </p>
    <img src="${movie.info.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${createDescriptionTempate(movie.info.description)}</p>
    <span class="film-card__comments">${movie.comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${movie.userDetails.watchlist ? 'film-card__controls-item--active' : ''}" type="button" data-button="watchlist">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${movie.userDetails.alreadyWatched ? 'film-card__controls-item--active' : ''}" type="button" data-button="alreadyWatched">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${movie.userDetails.favorite ? 'film-card__controls-item--active' : ''}" type="button"  data-button="favorite">Mark as favorite</button>
  </div>
</article>`;
}

export default class FilmView extends AbstractView {
  #movie = null;
  #handleClickButton = null;
  #handleClickCard = null;

  constructor({ movie, handleClickButton, handleClickCard }) {
    super();
    this.#movie = movie;
    this.#handleClickButton = handleClickButton;
    this.#handleClickCard = handleClickCard;
    this.element.querySelectorAll('.film-card__controls-item').forEach((element) => {
      element.addEventListener('click', this.#handlerClickButton);
    });
    this.element.querySelector('.film-card__link').addEventListener('click', this.#handlerClickCard);
  }

  get template() {
    return createFilmTempate(this.#movie);
  }

  // метод обработчик для панели добавить/убрать из фильтров
  #handlerClickButton = (evt) => {
    const newMovie = { ...this.#movie };
    switch (evt.target.dataset.button) {
      case 'watchlist':
        newMovie.userDetails.watchlist = !newMovie.userDetails.watchlist;
        break;
      case 'alreadyWatched':
        newMovie.userDetails.alreadyWatched = !newMovie.userDetails.alreadyWatched;
        break;
      case 'favorite':
        newMovie.userDetails.favorite = !newMovie.userDetails.favorite;
        break;
    }
    // вызов функции обработчика действия вьюхи
    this.#handleClickButton(ActionType.UPDATE_MOVIE, EventType.MINOR, newMovie);
  };

  #handlerClickCard = (evt) => {
    evt.preventDefault();
    this.#handleClickCard();
  };

}
