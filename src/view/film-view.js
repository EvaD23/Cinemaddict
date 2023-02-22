import { ActionType, EventType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
/*
{
  "id": "16",
  "comments": [
      "55798",
      "55799",
      "55800",
      "55801",
      "55802",
      "55803"
  ],
  "info": {
      "title": "Friends On The Storm",
      "poster": "images/posters/the-man-with-the-golden-arm.jpg",
      "director": "James Cameron",
      "writers": [
          "Robert Zemeckis",
          "Brad Bird",
          "Quentin Tarantino",
          "Takeshi Kitano"
      ],
      "actors": [
          "Morgan Freeman ",
          "Matt Damon",
          "Tom Hanks",
          "Edward Norton",
          "Robert De Niro",
          "Takeshi Kitano",
          "Brad Pitt",
          "Ralph Fiennes"
      ],
      "release": {
          "date": "2001-03-12T06:33:27.628Z",
          "releaseCountry": "China"
      },
      "duration": 158,
      "genre": [
          "Horror",
          "Family",
          "Action",
          "Comedy",
          "Sci-Fi"
      ],
      "description": "true masterpiece where love and death are closer to heroes than their family.",
      "alternativeTitle": "Guest Without The Wall",
      "totalRating": 6.2,
      "ageRating": 0
  },
  "userDetails": {
      "watchlist": false,
      "favorite": false,
      "watchingDate": "2023-02-02T16:32:41.100Z",
      "alreadyWatched": true
  }
}
*/

// функция добавляет форматирование для продолжительности фильма
function createDurationTemplate(minutes) {
  if (minutes < 60) {
    return `${minutes}M`;
  } else {
    const hours = Math.floor(minutes / 60);

    return `${hours}H ${minutes % 60}M`;
  }
}

function createDescriptionTempate(description) {
  if (description.length >= 140) {
    return `${description.slice(0, 138)}…`;
  }
  return description;
}

// TODO: добавить работу с кнопками
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

  constructor({ movie, handleClickButton }) {
    super();
    this.#movie = movie;
    this.#handleClickButton = handleClickButton;
    this.element.querySelectorAll('.film-card__controls-item').forEach((element) => {
      element.addEventListener('click', this.#handlerClickButton);
    });
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


}
