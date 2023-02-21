import AbstractView from '../framework/view/abstract-view.js';

function getRangNames(countAlreadyWacth) {
  if (countAlreadyWacth <= 10) {
    return 'Novice';
  }
  else if (countAlreadyWacth <= 20) {
    return 'Fan';
  } else {
    return 'Movie Buff';
  }
}

function createRatingView(countAlreadyWacth) {
  return `<section class="header__profile profile">
  <p class="profile__rating">${getRangNames(countAlreadyWacth)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;
}

export default class RatingView extends AbstractView {
  #countAlreadyWacth = null;

  constructor({countAlreadyWacth}) {
    super();
    this.#countAlreadyWacth = countAlreadyWacth;
  }

  get template() {
    return createRatingView(this.#countAlreadyWacth);
  }


}
