import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes were found for your query! Please try again ;)';
  _message = '';
  _sortPanel = document.querySelector('.sort-panel');

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }

  addHandlerSort(handler) {
    this._sortPanel.addEventListener('click', function (e) {
      // e.preventDefault();
      const btn = e.target.closest('.sort-btn');
      if (!btn) return;

      const property = btn.dataset.property;
      const direction = btn.dataset.direction;
      handler(property, direction);
    });
  }
}

export default new ResultsView();
