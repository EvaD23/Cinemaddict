import { remove, render, replace } from '../framework/render';
import PopupView from '../view/popup-view.js';

export default class PopupPresenter {
  #popupComponent = null;
  #handleClickButton = null;
  #movie = null;
  #isPopupOpen = false;

  constructor({ handleClickButton }) {
    this.#handleClickButton = handleClickButton;
  }

  init(movie) {
    this.#isPopupOpen = true;
    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView({
      movie, handleClickButton: this.#handleClickButton,
      handleCloseButton: this.#handleCloseButton,
    });
    this.#movie = movie;
    if (prevPopupComponent) {
      replace(this.#popupComponent, prevPopupComponent);
      remove(prevPopupComponent);
      return;
    }
    render(this.#popupComponent, document.body);
  }

  get movieId() {
    return this.#movie.id;
  }

  get isPopupOpen() {
    return this.#isPopupOpen;
  }

  changeButtons(movie) {
    this.#popupComponent.changeActiveButtons({
      isActiveWatchlist: movie.userDetails.watchlist,
      isActiveWatched: movie.userDetails.alreadyWatched,
      isActiveFavotire: movie.userDetails.favorite
    });
  }

  addComments(commments) {
    this.#popupComponent.addComments(commments);
  }

  #handleCloseButton = () => {
    remove(this.#popupComponent);
    this.#popupComponent = null;
    this.#isPopupOpen = false;
  };
}
