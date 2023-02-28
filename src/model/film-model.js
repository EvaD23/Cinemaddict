import Observable from '../framework/observable.js';
import { EventType } from '../const.js';


export default class FilmModel extends Observable {
  #api = null;
  #movies = new Map();

  constructor(api, commentModel) {
    super();
    this.#api = api;
    commentModel.addObserver(this.#handleChangeComments);
  }

  // получаем данные от сервера
  async init() {
    const serverMovies = await this.#api.getMovies();
    serverMovies.forEach((movie) => {
      const clientMovie = this.#parseServerToClient(movie);
      // при записи в мапу нужно указывать ключ и значение
      this.#movies.set(clientMovie.id, clientMovie);
    });
    this._notify(EventType.INIT);
  }

  // Возвращаем все фильмы из модели, чтобы с ними работать
  get movies() {
    // values - возвращает из мапы значения в виде массива
    const movies = [];
    this.#movies.forEach((movie) => {
      movies.push(movie);
    });
    return movies;
  }

  getMovieById(id) {
    return this.#movies.get(id);
  }

  //Добавляет обновление данных в модели делает отправку на сервер
  async updateMovie(movie, eventType) {
    try {
      const serverMovie = await this.#api.updateMovie(this.#parseClientToServer(movie));
      const newMovie = this.#parseServerToClient(serverMovie);
      this.#movies.set(newMovie.id, newMovie);
      this._notify(eventType, newMovie);


    }
    catch (err) {
      console.log(err); //TODO: добавить обработку ошибок
    }
  }

  // Метод преобразует ключи в объекте для передачи с клиента на сервер
  #parseClientToServer(movie) {
    const release = {
      ...movie.info.release,
      'release_country': movie.info.release.releaseCountry,
      date: movie.info.release.date.toISOString(),
    };
    delete release.releaseCountry;

    const info = {
      ...movie.info,
      'alternative_title': movie.info.alternativeTitle,
      'total_rating': movie.info.totalRating,
      'age_rating': movie.info.ageRating,
      release: release,
    };
    delete info.alternativeTitle;
    delete info.totalRating;
    delete info.ageRating;

    const userDetails = {
      ...movie.userDetails,
      'already_watched': movie.userDetails.alreadyWatched,
      'watching_date': movie.userDetails.watchingDate.toISOString(),
    };
    delete userDetails.alreadyWatched;
    delete userDetails.watchingDate;

    const adaptedMovie = {
      ...movie,
      'film_info': info,
      'user_details': userDetails,
    };
    delete adaptedMovie.info;
    delete adaptedMovie.userDetails;

    return adaptedMovie;
  }

  // Метод преобразует ключи в объекте от сервер для клиента
  #parseServerToClient(movie) {
    const release = {
      ...movie.film_info.release,
      releaseCountry: movie.film_info.release.release_country,
      date: new Date(movie.film_info.release.date),
    };
    delete release.release_country;

    const info = {
      ...movie.film_info,
      alternativeTitle: movie.film_info.alternative_title,
      totalRating: movie.film_info.total_rating,
      ageRating: movie.film_info.age_rating,
      release: release,
    };
    delete info.alternative_title;
    delete info.total_rating;
    delete info.age_rating;

    const userDetails = {
      ...movie.user_details,
      watchingDate: new Date(movie.user_details.watching_date),
      alreadyWatched: movie.user_details.already_watched,
    };
    delete userDetails.watching_date;
    delete userDetails.already_watched;

    const adaptedMovie = {
      ...movie,
      info: info,
      userDetails: userDetails,
    };
    delete adaptedMovie.film_info;
    delete adaptedMovie.user_details;

    return adaptedMovie;
  }

  #handleChangeComments = (eventType, { movieId, commentId }) => {
    const movie = this.#movies.get(movieId);
    movie.comments = movie.comments.filter((comment) => comment !== commentId);
    this.#movies.set(movieId, movie);
    this._notify(eventType, movie);
  };

}
