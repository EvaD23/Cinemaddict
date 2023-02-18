
const END_POINT = 'https://19.ecmascript.pages.academy/cinemaddict';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const EventType = {
  INIT: 'INIT',
  MINOR: 'MINOR',
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

export { END_POINT, Method, EventType, ActionType, FilterType, filter };
