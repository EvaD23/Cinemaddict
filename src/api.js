import ApiService from './framework/api-service.js';
import { END_POINT, Method } from './const.js';
import randomstring from 'randomstring';

const token = `Basic ${randomstring.generate()}`;

// класс для отправки запросов на сервер
export default class Api extends ApiService {
  constructor() {
    super(END_POINT, token);
  }

  getMovies() {
    return this._load({ url: 'movies' }).then(ApiService.parseResponse);
  }

  updateMovie(movie) {
    return this._load({
      url: `movie/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(movie),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    }).then(ApiService.parseResponse);
  }

  getComments(filmId) {
    return this._load({ url: `comments/${filmId}` }).then(ApiService.parseResponse);
  }

  createComment(comment, filmId) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      // если мы отправляем JSON, нужно прописать Headers, чтобы сервер понял что делать с телеом
      headers: new Headers({ 'Content-Type': 'aplication/json' }),
    }).then(ApiService.parseResponse);
  }

  deletePoint(comment) {
    return this._load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });
  }

}

