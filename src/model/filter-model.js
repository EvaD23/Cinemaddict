import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

export default class FilterModel extends Observable {
  #filterType = FilterType.ALL;

  get filterType() {
    return this.#filterType;
  }

  // смена фильтра - фильтр и тип события принимаем снаружи в том месте где вызываем метод
  changeFilterType(filterType, eventType) {
    this.#filterType = filterType;
    // уведомляем слушателей о изменениях
    this._notify(eventType, filterType);
  }
}
