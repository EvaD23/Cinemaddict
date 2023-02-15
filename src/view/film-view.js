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

// TODO: добавить работу с кнопками

function createFilmTempate(movie) {
  return `   
<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${movie.info.title}</h3>
    <p class="film-card__rating">${movie.info.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${movie.info.release.date.getFullYear()}</span>
<span class="film-card__duration">${movie.info.duration /* TODO: добавить форматировние*/}</span>
      <span class="film-card__genre">${movie.info.genre /* TODO: добавить форматировние*/}</span>
    </p>
    <img src="${movie.info.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${movie.info.description /* TODO: добавить форматировние*/}</p>
    <span class="film-card__comments">${movie.comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
  </div>
</article>`;
}

export default class FilmView extends AbstractView {
  #movie = null;

  constructor({ movie }) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createFilmTempate(this.#movie);
  }
}
