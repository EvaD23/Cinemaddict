import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import { createDurationTemplate } from '../utils.js';
import { ActionType, EventType } from '../const.js';

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

// {
//   "id": "42",
//   "author": "Ilya O'Reilly",
//   "comment": "a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.",
//   "date": "2019-05-11T16:12:32.554Z",
//   "emotion": "smile"
// }


function createCommentTemplate(comment) {
  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji" >
            <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
          </span>
          <div>
            <p class="film-details__comment-text">${comment.comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comment.author}</span>
              <span class="film-details__comment-day">${dayjs(comment.date).format('DD/MM/YYYY HH:mm')}</span>
              <button class="film-details__comment-delete" data-id='${comment.id}'>Delete</button>
            </p>
          </div>
        </li > `;
}


function createPopupTemplate(movie) {
  const genresName = movie.info.genre.reduce((acc, genre) => `${acc}<span class="film-details__genre">${genre}</span>`, '');
  return `<section class="film-details">
<div class="film-details__inner">
  <div class="film-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="${movie.info.poster}" alt="">

        <p class="film-details__age">${movie.info.ageRating}+</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${movie.info.title}</h3>
            <p class="film-details__title-original">Original: ${movie.info.alternativeTitle}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${movie.info.totalRating}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${movie.info.director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${movie.info.writers.join(', ')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${movie.info.actors.join(', ')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${dayjs(movie.info.release.date).format('DD MMM YYYY')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Duration</td>
            <td class="film-details__cell">${createDurationTemplate(movie.info.duration)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${movie.info.release.releaseCountry}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">${movie.info.genre.length > 1 ? 'Genres' : 'Genre'}</td>
            <td class="film-details__cell">
              ${genresName}
          </tr>
        </table>

        <p class="film-details__film-description">
        ${movie.info.description}
        </p>
      </div>
    </div>

    <section class="film-details__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${movie.userDetails.watchlist ? 'film-card__controls-item--active' : ''}" type="button" data-button="watchlist">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${movie.userDetails.alreadyWatched ? 'film-card__controls-item--active' : ''}" type="button" data-button="alreadyWatched">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${movie.userDetails.favorite ? 'film-card__controls-item--active' : ''}" type="button"  data-button="favorite">Mark as favorite</button>
    </section>
  </div>

  <div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${movie.comments.length}</span></h3>

      <ul class="film-details__comments-list">
      
      </ul>

      <form class="film-details__new-comment" action="" method="get">
        <div class="film-details__add-emoji-label"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </form>
    </section>
  </div>
</div>
</section>`;
}


export default class PopupView extends AbstractView {
  #movie = null;
  #handleDataChange = null;
  #handleCloseButton = null;
  #newComment = {};


  constructor({ movie, handleClickButton, handleCloseButton }) {
    super();
    this.#movie = movie;
    this.#handleDataChange = handleClickButton;
    this.#handleCloseButton = handleCloseButton;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#handlerCloseButton);
    this.element.querySelectorAll('.film-card__controls-item').forEach((element) => {
      element.addEventListener('click', this.#handlerClickButton);
    });
    this.element.querySelectorAll('.film-details__emoji-item').forEach((element) => {
      element.addEventListener('change', this.#handlerChooseEmoji);
    });
    const commentTextArea = this.element.querySelector('.film-details__comment-input');
    commentTextArea.addEventListener('change', (evt) => {
      this.#newComment.comment = evt.target.value;
    });
    commentTextArea.addEventListener('keydown', (evt) => {
      if (evt.metaKey && evt.key === 'Enter') {
        this.#sendComment();
      }
    });
  }

  get template() {
    return createPopupTemplate(this.#movie);
  }

  addComments(comments) {
    let templateComments = '';
    comments.forEach((comment) => {
      templateComments += createCommentTemplate(comment);
    });
    this.element.querySelector('.film-details__comments-count').innerText = comments.length;
    this.element.querySelector('.film-details__comments-list').innerHTML = templateComments;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((element) => element.addEventListener('click', this.#handlerDeleteComment));
  }

  // делаем кнопки аквтивными или деактивируем кнопки
  changeActiveButtons({ isActiveWatchlist = false, isActiveWatched = false, isActiveFavotire = false }) {
    this.element.querySelectorAll('.film-card__controls-item').forEach((button) => {
      switch (button.dataset.button) {
        case 'watchlist':
          this.#changeActiveButton(isActiveWatchlist, button);
          break;
        case 'alreadyWatched':
          this.#changeActiveButton(isActiveWatched, button);
          break;
        case 'favorite':
          this.#changeActiveButton(isActiveFavotire, button);
          break;
      }
    });
  }

  #changeActiveButton(isActive, button) {
    if (isActive) {
      button.classList.add('film-card__controls-item--active');
    } else {
      button.classList.remove('film-card__controls-item--active');
    }
  }

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
    this.#handleDataChange(ActionType.UPDATE_MOVIE, EventType.MINOR, newMovie);
  };

  #handlerDeleteComment = (evt) => {
    this.#handleDataChange(ActionType.DELETE_COMMENTS,
      EventType.MINOR,
      { movieId: this.#movie.id, commentId: evt.target.dataset.id });
  };


  #handlerCloseButton = () => {
    this.#handleCloseButton();
  };

  #handlerChooseEmoji = (evt) => {
    const emoji = evt.target.value;
    this.#newComment.emotion = emoji;
    this.element.querySelector('.film-details__add-emoji-label').innerHTML = `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji"></img>`;
  };

  #sendComment = () => {
    this.#handleDataChange(ActionType.CREATE_COMMENTS, EventType.MINOR,
      { movieId: this.#movie.id, comment: this.#newComment }
    );
  };
}
