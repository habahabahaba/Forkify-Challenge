import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    fullResults: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;

    // Preloading full recipies (for sorting):
    state.search.fullResults = await Promise.all(
      state.search.results.map(async function (el) {
        const data = await AJAX(`${API_URL}${el.id}?key=${KEY}`);
        return data.data.recipe;
      })
    );

    // Adding numberOfIngredients properties (for sorting):
    state.search.fullResults.forEach(
      el => (el.numberOfIngredients = el.ingredients.length)
    );
    console.log(state.search.fullResults);
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const sortSearchResults = async function (property, direction) {
  // console.log(state.search.results);

  // Sorting full recipes:
  state.search.fullResults.sort(function (a, b) {
    if (+a[property] <= +b[property]) {
      return -direction;
    } else {
      return +direction;
    }
  });
  // console.log(state.search.fullResults);

  // Extracting id's from full recipes:
  const ids = state.search.fullResults.map(el => el.id);
  // console.log(ids);

  // Sorting results by id's:
  state.search.results.sort((a, b) => +ids.indexOf(a.id) - +ids.indexOf(b.id));
  // console.log(state.search.results);
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    let ingObj = {};
    const ingEntries = Object.entries(newRecipe).filter(
      entry => entry[0].startsWith('ingredient') && entry[1] !== ''
    );
    ingEntries.forEach(entry => {
      const ingNum = +entry[0].split('-')[1] - 1;
      const ingProp = entry[0].split('-')[2];

      if (!ingObj[ingNum]) ingObj[ingNum] = {};
      ingObj[ingNum][ingProp] = entry[1];
    });
    const ingredients = Object.values(ingObj);

    // Setting quantities to numbers:
    ingredients.forEach(obj => {
      const quantNum = +obj.quantity;
      obj.quantity = quantNum;
    });

    // console.log(ingredients);

    // Checking for empty fields:
    if (ingredients.some(obj => Object.keys(obj).length != 3))
      throw new Error(
        'Wrong ingredient fromat: some ingredient has at least one  field left empty!'
      );

    // Checking for quantity numbers:
    if (
      ingredients.some(
        obj =>
          obj.quantity === '' ||
          obj.quantity === null ||
          obj.quantity === undefined ||
          obj.quantity === NaN ||
          !obj.quantity
      )
    )
      throw new Error(
        'Wrong ingredient fromat: please enter quantity for all ingredients.'
      );

    // // Checking quantities for positivity (depricated: done in view):
    // if (
    //   ingredients.some(
    //     obj => !(typeof obj.quantity === 'number' && obj.quantity > 0)
    //   )
    // )
    //   throw new Error(
    //     'Wrong ingredient fromat: quantity must be a positive number!'
    //   );

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
