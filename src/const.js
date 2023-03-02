import dayjs from 'dayjs';

const END_POINT = 'https://19.ecmascript.pages.academy/cinemaddict';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SortType = {
  DEFAULT: 'DEFAULT',
  DATE: 'DATE',
  RATING: 'RATING',
  COMMENTED: 'COMMENTED',
};

const EventType = {
  INIT: 'INIT',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  PATCH: 'PATCH',
};

const FilterType = {
  ALL: 'ALL',
  WATCHLIST: 'WATCHLIST',
  WATCHED: 'WATCHED',
  FAVORITE: 'FAVORITE',
};

const ActionType = {
  UPDATE_MOVIE: 'UPDATE_MOVIE',
  DELETE_COMMENTS: 'DELETE_COMMENTS',
  CREATE_COMMENTS: 'CREATE_COMMENTS',
};

// // function filter(arr, pred) {
// //   const newArr = [];

// //   for (const el of arr) {
// //     if (pred(el)) {
// //       newArr.push(el);
// //     }
// //   }

//   return newArr;
// } TODO: записать в github


const filter = {
  // скобки нужны для оборачивания в констату , а потом использования как ключ
  [FilterType.ALL]: (movies) => [...movies],
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [FilterType.WATCHED]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [FilterType.FAVORITE]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
};

const sorter = {
  [SortType.DATE]: (movieA, movieB) => dayjs(movieA.info.release.date).diff(movieB.info.release.date),
  [SortType.RATING]: (movieA, movieB) => movieB.info.totalRating - movieA.info.totalRating,
  [SortType.COMMENTED]: (movieA, movieB) => movieB.comments.length - movieA.comments.length,
};

export { END_POINT, Method, EventType, ActionType, FilterType, filter, sorter, SortType };
