import Api from './api.js';
import { FilterType } from './const.js';
import FilmModel from './model/film-model.js';
import FilterModel from './model/filter-model.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';


const api = new Api();

const mainContainer = document.querySelector('.main');

const headerContainer = document.querySelector('.header');

const footerContainer = document.querySelector('.footer');

const filmModel = new FilmModel(api);
filmModel.init();

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({ filterContainer: mainContainer, movieModel: filmModel, filterModel, headerContainer });
filterPresenter.init(FilterType.ALL);

const boardPresenter = new BoardPresenter({ mainContainer, filmModel, filterModel, footerContainer });
boardPresenter.init();


