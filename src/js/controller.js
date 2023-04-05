import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import messagesView from './views/messagesView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    // 0) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 1) Show spinner
    resultsView.renderSpinner();

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlSortResults = function (property, direction) {
  // resultsView.renderSpinner();

  console.log('sort button');
  model.sortSearchResults(property, direction);

  // 3) Render results
  resultsView.render(model.getSearchResultsPage());

  // 4) Render initial pagination buttons
  paginationView.render(model.state.search);
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    // addRecipeView.renderSpinner();
    messagesView.showWindow();
    messagesView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    messagesView.renderMessageProper(addRecipeView._message);

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close message window
    setTimeout(function () {
      messagesView.hideWindow();
    }, MODAL_CLOSE_SEC * 1000);

    // Reset upload form
    addRecipeView._reset();
    addRecipeView._addHandlerAddRow(controlAddRow);
    addRecipeView._addHandlerCheckIngredientInputs(
      controlCheckIngredientInputs
    );

    //Hide Upload window
    addRecipeView.toggleWindow();
  } catch (err) {
    console.error('💥', err);
    // messagesView.renderErrorProper(err.message);
    messagesView.showWindow();
    messagesView.renderError(err.message);
  }
};

const controlAddRow = function () {
  try {
    if (addRecipeView._btnAddRow.classList != 'upload__add-row awake') {
      throw new Error('Please fill all fields before adding a new ingredient.');
    }

    // console.log('add-row button WAS CLICKED!');
    // console.log(ingredientScrollBox);
    // console.log(lastRowNumber);

    const ingredientScrollBox = document.querySelector(
      'div.upload__column.ingredients.scrollbox'
    );

    addRecipeView._renderIngredientRow(ingredientScrollBox);
    addRecipeView._addHandlerCheckIngredientInputs(
      controlCheckIngredientInputs
    );
    const btnAddRow = document.querySelector('button[class*=add-row]');

    btnAddRow.classList = 'upload__add-row';
  } catch (err) {
    console.error('💥', err);
    messagesView.renderMessageProper(err.message);
  }
};

const controlCheckIngredientInputs = function () {
  const inputs = document.querySelectorAll('input[name*=ingredient]');

  let allFilled = true;

  inputs.forEach(input => {
    if (input.type === 'text' && input.value.trim() === '') {
      allFilled = false;
    } else if (
      input.type == 'number' &&
      (input.value === '' ||
        input.value === null ||
        input.value === undefined ||
        input.value === NaN ||
        !input.value)
    ) {
      allFilled = false;
    }
  });

  addRecipeView._btnAddRowAwake(allFilled);

  // if (allFilled) {
  //   console.log('All inputs are filled!');
  //   // Do something when all inputs are filled
  //   addRecipeView._btnAddRowAwake(true);
  // }

  // if (!allFilled) {
  //   console.log('Some inputs are not filled.');
  //   // Do something when some inputs are no longer filled
  //   addRecipeView._btnAddRowAwake(false);
  // }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  resultsView.addHandlerSort(controlSortResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  addRecipeView._addHandlerAddRow(controlAddRow);
  addRecipeView._addHandlerCheckIngredientInputs(controlCheckIngredientInputs);
};
init();

// console.log(addRecipeView._btnAddRow);
