import Api from './api.js';
import FilmModel from './model/film-model.js';
import BoardPresenter from './presenter/board-presenter.js';


const api = new Api();

const mainContainer = document.querySelector('.main');

const filmModel = new FilmModel(api);
filmModel.init();

const boardPresenter = new BoardPresenter({ mainContainer, filmModel });
boardPresenter.init();

