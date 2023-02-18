import FilterView from '../view/filter-view.js';
import { remove, render, replace } from '../framework/render.js';
import { EventType } from '../const.js';

export default class FilterPresenter {
  #filterComponent = null;
  #filterContainer = null;
  #movieModel = null;
  #filterModel = null;

  constructor({ filterContainer, movieModel, filterModel }) {
    this.#filterContainer = filterContainer;
    this.#movieModel = movieModel;
    this.#filterModel = filterModel;
    this.#movieModel.addObserver(this.#handlerModelEvent);
    this.#filterModel.addObserver(this.#handlerModelEvent);
  }

  init(currentFilter) {
    const movies = this.#movieModel.movies;
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FilterView({ movies, handleClickFilter: this.#changeFilterType, currentFilter });
    if (!prevFilterComponent) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);

  }

  // функция которая реагирует на изменение модели
  #handlerModelEvent = (eventType) => {
    switch (eventType) {
      case EventType.INIT:
      case EventType.MINOR:
      case EventType.PATCH:
        this.init(this.#filterModel.filterType);
        break;
    }
  };

  // фукнция которая меняет тип фильтра опосредованно вызывает метод у filterModel
  #changeFilterType = (filterType, eventType) => {
    this.#filterModel.changeFilterType(filterType, eventType);
  };


}
