/* global PhotoPreviewView: true Backbone: true VideoPreviewView: true */
'use strict';

(function() {
  /**
   * Список констант кодов нажатых клавиш для обработки
   * клавиатурных событий.
   * @enum {number}
   */
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  /**
   * Нормировка значения value в заданном диапозоне между min и max
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * @param {PhotosCollection} collection
   * @constructor
   */
  var Gallery = function(collection) {
    this.collection = collection;
    this._currentIndexPhoto = 0;
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._element = document.querySelector('.gallery-overlay');
  };

  /**
   * Показывает галерею
   */
  Gallery.prototype.show = function() {
    this._element.classList.remove('invisible');
    document.querySelector('.gallery-overlay-close').addEventListener('click', this._onCloseClick);
    document.addEventListener('keydown', this._onDocumentKeyDown);

    this._showCurrentPhoto();
  };

  /**
   * Скрывает галерею
   */
  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');
    document.querySelector('.gallery-overlay-close').removeEventListener('click', this._onCloseClick);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    this._destroyCurrentPhoto();
  };

  /**
   * Устанавливает индекс текущей фотографии используя clamp
   * @param {number} photoIndex
   */
  Gallery.prototype.setCurrentPhoto = function(photoIndex) {
    this._currentIndexPhoto = clamp(photoIndex, 0, this.collection.length - 1);
  };

  /**
   * Показывает текущую фотографию
   * @private
   */
  Gallery.prototype._showCurrentPhoto = function() {
    this._destroyCurrentPhoto();
    if (this.collection.at(this._currentIndexPhoto).get('preview')) {
      this._photoPreviewView = new VideoPreviewView({
        model: this.collection.at(this._currentIndexPhoto),
        el: document.querySelector('.gallery-overlay-preview')
      });
    } else {
      this._photoPreviewView = new PhotoPreviewView({
        model: this.collection.at(this._currentIndexPhoto),
        el: document.querySelector('.gallery-overlay-preview')
      });
    }
    this._photoPreviewView.render();
  };

  /**
   * Уничтожает вьюху текущей фотографии
   * @private
   */
  Gallery.prototype._destroyCurrentPhoto = function() {
    if (this._photoPreviewView) {
      this._photoPreviewView.destroy();
      this._photoPreviewView = null;
    }
  };

  /**
   * Обработка нажатий на клавиатуре (ESC, LEFT, RIGHT)
   * @param {Event} evt
   * @private
   */
  Gallery.prototype._onDocumentKeyDown = function(evt) {
    switch (evt.keyCode) {
      case Key.ESC:
        this.hide();
        break;
      case Key.LEFT:
        this.setCurrentPhoto(this._currentIndexPhoto - 1);
        this._showCurrentPhoto();
        break;
      case Key.RIGHT:
        this.setCurrentPhoto(this._currentIndexPhoto + 1);
        this._showCurrentPhoto();
        break;
      default: break;
    }
  };

  /**
   * Обработка нажатия на "крест" в галерее
   * @param {Event} evt
   * @private
   */
  Gallery.prototype._onCloseClick = function(evt) {
    evt.preventDefault();
    this.hide();
  };

  window.Gallery = Gallery;
})();
