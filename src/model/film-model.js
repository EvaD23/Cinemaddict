import Observable from '../framework/observable.js';
import { EventType} from '../const.js';


export default class FilmModel extends Observable {
  #api = null;
  #movies = [];

  constructor(api) {
    super();
    this.#api = api;
  }

  // получаем данные от сервера
  async init() {
    const serverMovies = await this.#api.getMovies();
    this.#movies = serverMovies.map((movie) => this.#parseServerToClient(movie));
    this._notify(EventType.INIT);
  }

  // Возвращаем все фильмы из модели, чтобы с ними работать
  get movies() {
    return this.#movies;
  }

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

}
