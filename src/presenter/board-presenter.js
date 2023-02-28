import FilmContainerView from '../view/film-container-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { EventType, filter, SortType, ActionType, sorter } from '../const.js';
import FilmPresenter from './film-presenter.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import ButtonView from '../view/button-view.js';
import FilmAmount from '../view/film-amount-view.js';
import RatingContainer from '../view/rating-container.js';
import PopupPresenter from './popup-presenter.js';


export default class BoardPresenter {
  #moviesContainer = new FilmContainerView();
  #mainContainer = null;
  #filmModel = null;
  #filterModel = null;
  #sortComponent = null;
  #sortType = SortType.DEFAULT;
  #emptyListComponent = null;
  #buttonComponent = null;
  #counterMovies = 5;
  #isShowButton = true;
  #filmAmountComponent = null;
  #footerContainer = null;
  #ratingBlockComponent = null;
  #commentedBlockComponent = null;
  #popupPresenter = null;
  #commentModel = null;
  // Сохранять презентеры в мапу, чтобы получать к ним быстрй доступы
  #filmPresenters = new Map();

  constructor({ mainContainer, filmModel, filterModel, footerContainer, commentModel }) {
    this.#mainContainer = mainContainer;
    this.#footerContainer = footerContainer;
    this.#filmModel = filmModel;
    this.#filterModel = filterModel;
    this.#commentModel = commentModel;
    this.#popupPresenter = new PopupPresenter({ handleClickButton: this.#onDataChange});

    // отрисовываем контейнер для фильма
    render(this.#moviesContainer, mainContainer);
    filmModel.addObserver(this.#handleEventModel);
    filterModel.addObserver(this.#handleEventModel);
  }

  init() {
    this.#renderBoard();
  }

  get movies() {
    // фильтрует и сортирует список фильмов для отображения
    const movies = this.#filmModel.movies;
    const currentFilter = this.#filterModel.filterType;
    // для передачи фильмов в функцию находящуюся в константе filter
    const filterFunction = filter[currentFilter];
    const filteredMovies = filterFunction(movies);
    // показывем кнопку если количество фильмов больше уже показанных отфильтрованых фильмов
    this.#isShowButton = this.#counterMovies < filteredMovies.length;
    const sortedMovies = filteredMovies;
    // применяем сортировку фильмов
    if (this.#sortType !== SortType.DEFAULT) {
      sortedMovies.sort(sorter[this.#sortType]);
    }
    return sortedMovies.slice(0, this.#counterMovies);
  }

  // Обрабатываем события происходящие с фильмами, нужен для обзервера
  #handleEventModel = (event, movie) => {
    switch (event) {
      // происходит когда модель получила данные от сервера
      case EventType.INIT:
        this.#clearBoard();
        this.#renderBoard();
        this.#renderFilmAmount();
        this.#renderRatingBlock();
        this.#renderTopCommentedBlock();
        break;
      // при изменении каточки фильма
      case EventType.PATCH:
        this.#filmPresenters.get(movie.id).init(movie);
        break;
      // при изменении порядка фильмов при фильтрации
      case EventType.MINOR:
        this.#clearBoard({ resetCounterMovies: false });
        this.#renderBoard();
        break;
      // при изменении порядка при фильтрации и сбросе фильтрации
      case EventType.MAJOR:
        this.#clearBoard({ resetSort: true });
        this.#renderBoard();
        break;
    }
  };

  // Метод обрабатывает действия во вьюхах
  #onDataChange = (actionType, updateType, update) => {
    switch (actionType) {
      case ActionType.UPDATE_MOVIE:
        this.#filmModel.updateMovie(update, updateType);
        break;
      case ActionType.DELETE_COMMENTS:
        this.#commentModel.deleteComment(update);
        break;
    }
  };

  // метод очистки  пршлого списка фильмов, для дальнейшей перерисовки. resetSort - для сброса фильтров
  #clearBoard({ resetSort = false, resetCounterMovies = true } = {}) {
    this.#filmPresenters.forEach((moviePresenter) => moviePresenter.clearMovie());
    this.#filmPresenters.clear();
    if (resetSort) {
      this.#sortType = SortType.DEFAULT;
    }
    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }
    if (this.#buttonComponent) {
      remove(this.#buttonComponent);
    }
    // сбрасывает счетчик при изменении фильтра или сортировки
    if (resetCounterMovies) {
      this.#counterMovies = 5;
    }

  }

  // для отрисовки списка фильмов
  #renderMovies() {
    this.movies.forEach((movie) => {
      // делаем замыкание и handleClickCard инициализируем popupPresenter, в каждый FilmPresenter будет сохраен свой фильм через инициализацию popupPresenter
      const filmPresenter = new FilmPresenter({
        filmContainer: this.#moviesContainer.filmContainer, handleClickButton: this.#onDataChange,
        handleClickCard: () => {
          this.#popupPresenter.init(movie);
          this.#commentModel.getCommentsByMovieId(movie.id)
            .then((comments) => {
              this.#popupPresenter.addComments(comments);
            });
        }
      });
      // методы можно вызвать только у экземпляра. movie.id - чтобы легко можно было вытащить из мапы по ключу
      this.#filmPresenters.set(movie.id, filmPresenter);
      filmPresenter.init(movie);
    });
  }

  // для отрисовки сортировки и передача handlesortMovies
  #renderSort() {
    this.#sortComponent = new SortView({
      onClickSorter: this.#handleSortMovies,
      currentSorter: this.#sortType,
    });
    render(this.#sortComponent, this.#moviesContainer.element, RenderPosition.BEFOREBEGIN);
  }

  // условия для отрисовки сортировки,фильмов, кнопки и пустого листа
  #renderBoard() {
    if (this.movies.length > 0) {
      this.#renderSort();
      this.#renderMovies();
      this.#renderPopup();
      if (this.#isShowButton) {
        this.#renderButton();
      }
    } else {
      this.#renderEmptyList();
    }
  }

  #renderPopup() {
    if (this.#popupPresenter.isPopupOpen) {
      const movie = this.#filmModel.getMovieById(this.#popupPresenter.movieId);
      this.#popupPresenter.changeButtons(movie);
      
      this.#commentModel.getCommentsByMovieId(movie.id).then((comments) => {
        this.#popupPresenter.addComments(comments);
      });
    }
  }

  // для функционирования сортировки
  #handleSortMovies = (sortType) => {
    this.#sortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  // отрисовка пустого листа
  #renderEmptyList() {
    this.#emptyListComponent = new EmptyListView();
    render(this.#emptyListComponent, this.#mainContainer);
  }

  // отрисовка кнопки
  #renderButton() {
    this.#buttonComponent = new ButtonView({
      onClick: this.#handleShowMoreButton,
    });
    render(this.#buttonComponent, this.#moviesContainer.filmContainer, RenderPosition.AFTEREND);
  }

  // метод для функционирования кпоки 'Show more'
  #handleShowMoreButton = () => {
    this.#counterMovies += 5;
    this.#clearBoard({ resetCounterMovies: false });
    this.#renderBoard();
  };

  #renderFilmAmount() {
    this.#filmAmountComponent = new FilmAmount({
      movieAmount: this.#filmModel.movies.length,
    });
    render(this.#filmAmountComponent, this.#footerContainer);
  }

  #renderRatingBlock() {
    this.#ratingBlockComponent = new RatingContainer({ title: 'Top rated movies' });
    render(this.#ratingBlockComponent, this.#moviesContainer.element);
    const ratingMovies = this.#filmModel.movies.sort(sorter[SortType.RATING])
      .slice(0, 2);
    // добавляем презенторы для фильмов во вкладке Top rating
    ratingMovies.forEach((movie) => {
      const moviePresenter = new FilmPresenter({ filmContainer: this.#ratingBlockComponent.container, handleClickButton: this.#onDataChange });
      moviePresenter.init(movie);
    });
  }

  //TODO: Доделать случай обновления фильмов в блоке при добавления новых коментариев к фильму в попап
  #renderTopCommentedBlock() {
    this.#commentedBlockComponent = new RatingContainer({ title: 'Most commented' });
    render(this.#commentedBlockComponent, this.#moviesContainer.element);
    const commentedMovies = this.#filmModel.movies.sort(sorter[SortType.COMMENTED])
      .slice(0, 2);
    // добавляем презенторы для фильмов во вкладке Top rating
    commentedMovies.forEach((movie) => {
      const moviePresenter = new FilmPresenter({ filmContainer: this.#commentedBlockComponent.container, handleClickButton: this.#onDataChange });
      moviePresenter.init(movie);
    });
  }


}
