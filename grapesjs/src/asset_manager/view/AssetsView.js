import Backbone from 'backbone';
var AssetView = require('./AssetView');
var AssetImageView = require('./AssetImageView');
var FileUploader = require('./FileUploader');

module.exports = Backbone.View.extend({
  events: {
    submit: 'handleSubmit'
  },

  template(view) {
    const pfx = view.pfx;
    const ppfx = view.ppfx;
    return `
    <div class="${pfx}assets-cont">
      <div class="${pfx}assets-header">
        <form class="${pfx}add-asset">
          <div class="${ppfx}field ${pfx}add-field">
            <input placeholder="${view.config.inputPlaceholder}"/>
          </div>
          <button class="${ppfx}btn-prim">${view.config.addBtnText}</button>
          <div style="clear:both"></div>
        </form>
      </div>
      <div class="${pfx}assets" data-el="assets"></div>
      <div style="clear:both"></div>
    </div>
    `;
  },

  initialize(o) {
    this.options = o;
    this.config = o.config;
    this.pfx = this.config.stylePrefix || '';
    this.ppfx = this.config.pStylePrefix || '';
    const coll = this.collection;
    this.listenTo(coll, 'reset', this.renderAssets);
    this.listenTo(coll, 'add', this.addToAsset);
    this.listenTo(coll, 'remove', this.removedAsset);
    this.listenTo(coll, 'deselectAll', this.deselectAll);
  },

  /**
   * Add new asset to the collection via string
   * @param {Event} e Event object
   * @return {this}
   * @private
   */
  handleSubmit(e) {
    e.preventDefault();
    const input = this.getAddInput();
    const url = input.value.trim();
    const handleAdd = this.config.handleAdd;

    if (!url) {
      return;
    }

    input.value = '';
    this.getAssetsEl().scrollTop = 0;

    if (handleAdd) {
      handleAdd.bind(this)(url);
    } else {
      this.options.globalCollection.add(url, { at: 0 });
    }
  },

  /**
   * Returns assets element
   * @return {HTMLElement}
   * @private
   */
  getAssetsEl() {
    //if(!this.assets) // Not able to cache as after the rerender it losses the ref
    return this.el.querySelector(`.${this.pfx}assets`);
  },

  /**
   * Returns input url element
   * @return {HTMLElement}
   * @private
   */
  getAddInput() {
    if (!this.inputUrl || !this.inputUrl.value)
      this.inputUrl = this.el.querySelector(`.${this.pfx}add-asset input`);
    return this.inputUrl;
  },

  /**
   * Triggered when an asset is removed
   * @param {Asset} model Removed asset
   * @private
   */
  removedAsset(model) {
    if (!this.collection.length) {
      this.toggleNoAssets();
    }
  },

  /**
   * Add asset to collection
   * @private
   * */
  addToAsset(model) {
    if (this.collection.length == 1) {
      this.toggleNoAssets(1);
    }
    this.addAsset(model);
  },

  /**
   * Add new asset to collection
   * @param Object Model
   * @param Object Fragment collection
   * @return Object Object created
   * @private
   * */
  addAsset(model, fragmentEl = null) {
    const fragment = fragmentEl;
    const collection = this.collection;
    const config = this.config;
    const rendered = new model.typeView({
      model,
      collection,
      config
    }).render().el;

    if (fragment) {
      fragment.appendChild(rendered);
    } else {
      const assetsEl = this.getAssetsEl();
      if (assetsEl) {
        assetsEl.insertBefore(rendered, assetsEl.firstChild);
      }
    }

    return rendered;
  },

  /**
   * Checks if to show noAssets
   * @param {Boolean} hide
   * @private
   */
  toggleNoAssets(hide) {
    const assetsEl = this.$el.find(`.${this.pfx}assets`);

    if (hide) {
      assetsEl.empty();
    } else {
      const noAssets = this.config.noAssets;
      noAssets && assetsEl.append(noAssets);
    }
  },

  /**
   * Deselect all assets
   * @private
   * */
  deselectAll() {
    const pfx = this.pfx;
    this.$el.find(`.${pfx}highlight`).removeClass(`${pfx}highlight`);
  },

  renderAssets() {
    const fragment = document.createDocumentFragment();
    const assets = this.$el.find(`.${this.pfx}assets`);
    assets.empty();
    this.toggleNoAssets(this.collection.length);
    this.collection.each(model => this.addAsset(model, fragment));
    assets.append(fragment);
  },

  render() {
    const fuRendered = this.options.fu.render().el;
    this.$el.empty();
    this.$el.append(fuRendered).append(this.template(this));
    this.el.className = `${this.ppfx}asset-manager`;
    this.renderAssets();
    this.rendered = 1;
    return this;
  }
});
