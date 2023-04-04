import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';
  _parentInit = `<form class="upload">
  <div style="display: block">
    <h3 class="upload__heading">Recipe data</h3>
    <div class="upload__column data">
      <label>Title</label>
      <input required name="title" type="text" placeholder="Recipe title" />
      <label>URL</label>
      <input required name="sourceUrl" type="text" placeholder="Recipe URL" />
      <label>Image URL</label>
      <input required name="image" type="text" placeholder="Image URL" />
      <label>Publisher</label>
      <input required name="publisher" type="text" placeholder="Publisher" />
      <label>Prep time</label>
      <input required name="cookingTime" type="number" placeholder="Time in minutes" />
      <label>Servings</label>
      <input required name="servings" type="number" placeholder="Number of servings" />
    </div>
  </div>

  <div style="display: block">
    <h3 class="upload__heading">Ingredients</h3>
    <div class="upload__column ingredients scrollbox">
      <label>Ingredient 1</label>
      <div class="ingredient-row">
        <input
          type="number"
          step="0.1"
          min="0.1"
          required
          name="ingredient-1-quantity"
          placeholder="Quantity"
        />
        <input
          type="text"
          name="ingredient-1-unit"
          placeholder="Unit"
        />
        <input
          type="text"
          name="ingredient-1-description"
          placeholder="Description"
        />
      </div>
      <label>Ingredient 2</label>
      <div class="ingredient-row">
        <input
          type="number"
          step="0.1"
          min="0.1"
          name="ingredient-2-quantity"
          placeholder="Quantity"
        />
        <input
          type="text"
          name="ingredient-2-unit"
          placeholder="Unit"
        />
        <input
          type="text"
          name="ingredient-2-description"
          placeholder="Description"
        />
      </div>
      <label>Ingredient 3</label>
      <div class="ingredient-row">
        <input
          type="number"
          step="0.1"
          min="0.1"
          name="ingredient-3-quantity"
          placeholder="Quantity"
        />
        <input
          type="text"
          name="ingredient-3-unit"
          placeholder="Unit"
        />
        <input
          type="text"
          name="ingredient-3-description"
          placeholder="Description"
        />
      </div>
      <label>Ingredient 4</label>
      <div class="ingredient-row">
        <input
          type="number"
          step="0.1"
          min="0.1"
          name="ingredient-4-quantity"
          placeholder="Quantity"
        />
        <input
          type="text"
          name="ingredient-4-unit"
          placeholder="Unit"
        />
        <input
          type="text"
          name="ingredient-4-description"
          placeholder="Description"
        />
      </div>
      <label>Ingredient 5</label>
      <div class="ingredient-row">
        <input
          type="number"
          step="0.1"
          min="0.1"
          name="ingredient-5-quantity"
          placeholder="Quantity"
        />
        <input
          type="text"
          name="ingredient-5-unit"
          placeholder="Unit"
        />
        <input
          type="text"
          name="ingredient-5-description"
          placeholder="Description"
        />
      </div>
      <label>Ingredient 6</label>
      <div class="ingredient-row">
        <input
          type="number"
          step="0.1"
          min="0.1"
          name="ingredient-6-quantity"
          placeholder="Quantity"
        />
        <input
          type="text"
          name="ingredient-6-unit"
          placeholder="Unit"
        />
        <input
          type="text"
          name="ingredient-6-description"
          placeholder="Description"
        />
      </div>
    </div>
  </div>
  <button class="btn upload__btn">
    <svg>
      <use href="src/img/icons.svg#icon-upload-cloud"></use>
    </svg>
    <span>Upload</span>
  </button>
  <button class="upload__add-row">+</button>
</form>`;

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnAddRow = document.querySelector('button[class*=add-row]');
  // _ingredientScrollBox = document.querySelector(
  //   'div.upload__column.ingredients.scrollbox'
  // );

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}

  _addHandlerCheckIngredientInputs(handler) {
    const inputs = document.querySelectorAll('input[name*=ingredient]');
    inputs.forEach(input => input.removeEventListener('input', null));

    inputs.forEach(input => {
      input.addEventListener('input', handler);
    });
  }

  _btnAddRowAwake(condition) {
    const btnAddRow = document.querySelector('button[class*=add-row]');
    btnAddRow.classList = `upload__add-row ${
      condition === true ? 'awake' : ''
    }`;
  }

  _addHandlerAddRow(handler) {
    const btnAddRow = document.querySelector('button[class*=add-row]');
    btnAddRow.addEventListener('click', function (e) {
      e.preventDefault();
      handler();
    });
  }

  _renderIngredientRow(parent) {
    const ingredientRows = document.querySelectorAll('input[name*=ingredient]');
    const lastRowNumber = ingredientRows.length / 3;

    parent.insertAdjacentHTML(
      'beforeend',
      `<label>Ingredient ${lastRowNumber + 1}</label>
      <div class="ingredient-row">
        <input
          type="number"
          step="0.1"
          min="0.1"
          name="ingredient-${lastRowNumber + 1}-quantity"
          placeholder="Quantity"
        />
        <input
          type="text"
          name="ingredient-${lastRowNumber + 1}-unit"
          placeholder="Unit"
        />
        <input
          type="text"
          name="ingredient-${lastRowNumber + 1}-description"
          placeholder="Description"
        />
      </div>`
    );

    const lastQntyField = document.querySelector(
      `input[name=ingredient-${lastRowNumber + 1}-quantity]`
    );

    lastQntyField.focus();
  }
}
export default new AddRecipeView();
