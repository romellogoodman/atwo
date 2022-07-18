/**
 * Grabs the sketch state from the query params
 */

/**
 * Taken From: https://stackoverflow.com/questions/6539761/window-location-search-query-as-json
 */
export const qsObjectify = (search) => {
  var pairs = search.substring(1).split("&"),
    obj = {},
    pair,
    i;

  for (i in pairs) {
    if (pairs[i] === "") continue;

    pair = pairs[i].split("=");
    obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }

  return obj;
};

const state = qsObjectify(window.location.search);

if (state.width) {
  state.width = parseInt(state.width, 10);
}
if (state.height) {
  state.height = parseInt(state.height, 10);
}

console.log("state", state);

window.STATE = state;
