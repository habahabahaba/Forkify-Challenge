import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _ingredientColumn = document.querySelector('div.upload.scrollbox');
  _ingredientInputs = document.querySelectorAll('input[name*=ingredient]');
  _btnAddRow = document.querySelector('button[class*=add-row]');
  _lastRowNumber = this._ingredientInputs.length / 3;

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

  _addRow() {
    'click'.preventDefault();
    // if (document.activeElement !== this._btnAddRow) return;
    console.log('add-row button WAS CLICKED!');
    console.log(this._ingredientColumn);
    console.log(this._lastRowNumber); // document
    //   .querySelector('div.upload__column.ingredients')
    //   .insertAdjacentHTML(
    //     'beforeend',
    //     `          <label>Ingredient ${this._lastRowNumber + 1}</label>
    //   <div class="ingredient-row">
    //     <input
    //       type="number"
    //       step="0.1"
    //       min="0.1"
    //       name="ingredient-${this._lastRowNumber + 1}-quantity"
    //       placeholder="Quantity"
    //       value="${this._lastRowNumber + 1}"
    //     />
    //     <input
    //       type="text"
    //       name="ingredient-${this._lastRowNumber + 1}-unit"
    //       placeholder="Unit"
    //       value="f"
    //     />
    //     <input
    //       type="text"
    //       name="ingredient-${this._lastRowNumber + 1}-description"
    //       placeholder="Description"
    //       value="fff"
    //     />
    //   </div>`
    //   );
  }

  _addHandlerCheckAllInputs() {
    function checkInputs() {
      const inputs = document.querySelectorAll('input[name*=ingredient]');
      let allFilled = true;

      inputs.forEach(input => {
        if (input.type === 'text' && input.value.trim() === '') {
          allFilled = false;
        } else if (input.type === 'number' && !input.validity.valid) {
          allFilled = false;
        }
      });

      if (allFilled) {
        console.log('All inputs are filled!');
        // Do something when all inputs are filled
      }
    }

    function checkInputStatus() {
      const inputs = document.querySelectorAll('input[name*=ingredient]');
      let allFilled = true;

      inputs.forEach(input => {
        if (input.type === 'text' && input.value.trim() === '') {
          allFilled = false;
        } else if (input.type === 'number' && !input.validity.valid) {
          allFilled = false;
        }
      });

      if (!allFilled) {
        console.log('Some inputs are no longer filled.');
        // Do something when some inputs are no longer filled
      }
    }

    // Attach an 'input' event listener to each input field
    const inputs = document.querySelectorAll('input[name*=ingredient]');
    inputs.forEach(input => {
      input.addEventListener('input', checkInputs);
    });

    // Attach a 'blur' event listener to each input field
    inputs.forEach(input => {
      input.addEventListener('blur', checkInputStatus);
    });
  }

  _addHandlerAddRow() {
    this._btnAddRow.addEventListener('click', function (e) {
      e.preventDefault();
      // if (document.activeElement !== this._btnAddRow) return;

      // this._addRow().bind(this)

      const ingredientScrollBox = document.querySelector(
        'div.upload__column.ingredients.scrollbox'
      );
      const ingredientRows = document.querySelectorAll(
        'input[name*=ingredient]'
      );
      const lastRowNumber = ingredientRows.length / 3;

      console.log('add-row button WAS CLICKED!');
      console.log(ingredientScrollBox);
      console.log(lastRowNumber);

      ingredientScrollBox.insertAdjacentHTML(
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
      // );
    });
  }
}

export default new AddRecipeView();
