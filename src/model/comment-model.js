import { EventType } from '../const.js';
import Observable from '../framework/observable.js';


export default class CommentModel extends Observable {
  #comments = new Map();
  #api = null;

  constructor(api) {
    super();
    this.#api = api;

  }

  async getCommentsByMovieId(movieId) {
    if (this.#comments.has(movieId)) {
      return this.#comments.get(movieId);
    }
    try {
      const comments = await this.#api.getComments(movieId);
      const commentsClient = comments.map((comment) => this.#parseServerToClient(comment));
      this.#comments.set(movieId, commentsClient);
      return commentsClient;
    } catch (err) {
      console.log(err);
    }

  }

  async deleteComment({ movieId, commentId }) {
    try {
      await this.#api.deleteComment(commentId);
      const comments = this.#comments.get(movieId);
      const newComments = comments.filter((comment) => comment.id !== commentId);
      this.#comments.set(movieId, newComments);
      this._notify(EventType.MINOR, { movieId, commentId });
    } catch (err) {
      console.log(err);
    }
  }

  #parseServerToClient(comment) {
    return {
      ...comment,
      date: new Date(comment.date),
    };
  }
}

