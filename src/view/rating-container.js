import AbstractView from '../framework/view/abstract-view.js';

export default class RatingContainer extends AbstractView {
  #title = null;


  constructor({ title }) {
    super();
    this.#title = title;
  }

  get template() {
    return `<section class="films-list films-list--extra">
<h2 class="films-list__title">${this.#title}</h2> 
<div class="films-list__container"></div>
 </section>`;
  }

  // для того чтобы положить в bord- presentor во внутренний див
  get container() {
    return this.element.querySelector('.films-list__container');
  }
}
