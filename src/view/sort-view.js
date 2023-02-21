import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

function createSortView(currentSorter) {
  const active = (sortType) => sortType === currentSorter ? 'sort__button--active' : '';
  return `<ul class="sort">
<li><a href="#" class="sort__button ${active(SortType.DEFAULT)}" data-sorter="${SortType.DEFAULT}">Sort by default</a></li>
<li><a href="#" class="sort__button ${active(SortType.DATE)}" data-sorter="${SortType.DATE}">Sort by date</a></li>
<li><a href="#" class="sort__button ${active(SortType.RATING)}" data-sorter="${SortType.RATING}">Sort by rating</a></li>
</ul>`;
}


export default class SortView extends AbstractView {
  #handleClickSorter = null;
  #currentSorter = null;

  constructor({ onClickSorter, currentSorter }) {
    super();
    this.#handleClickSorter = onClickSorter;
    this.#currentSorter = currentSorter;
    this.element.querySelectorAll('.sort__button').forEach((element) => {
      element.addEventListener('click', this.#handlerClickSorter);
    });
  }


  get template() {
    return createSortView(this.#currentSorter);
  }

  #handlerClickSorter = (evt) => {
    evt.preventDefault();
    const sorterType = evt.target.dataset.sorter;
    if (this.#currentSorter !== sorterType) {
      this.#handleClickSorter(sorterType);
    }
  };
}
