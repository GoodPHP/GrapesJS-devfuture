const Selector = require('./../model/Selector');
const inputProp = 'contentEditable';

module.exports = require('backbone').View.extend({
  template() {
    const pfx = this.pfx;
    const ppfx = this.ppfx;
    const label = this.model.get('label') || '';
    return `
      <span id="${pfx}checkbox" class="fa" data-tag-status></span>
      <span id="${pfx}tag-label" data-tag-name>${label}</span>
      <span id="${pfx}close" data-tag-remove>
        &Cross;
      </span>
    `;
  },

  events: {
    'click [data-tag-remove]': 'removeTag',
    'click [data-tag-status]': 'changeStatus',
    'dblclick [data-tag-name]': 'startEditTag',
    'focusout [data-tag-name]': 'endEditTag'
  },

  initialize(o) {
    const config = o.config || {};
    this.config = config;
    this.coll = o.coll || null;
    this.pfx = config.stylePrefix || '';
    this.ppfx = config.pStylePrefix || '';
    this.em = config.em;
    this.listenTo(this.model, 'change:active', this.updateStatus);
  },

  /**
   * Returns the element which containes the anme of the tag
   * @return {HTMLElement}
   */
  getInputEl() {
    if (!this.inputEl) {
      this.inputEl = this.el.querySelector('[data-tag-name]');
    }

    return this.inputEl;
  },

  /**
   * Start editing tag
   * @private
   */
  startEditTag() {
    const { em } = this;
    const inputEl = this.getInputEl();
    inputEl[inputProp] = true;
    inputEl.focus();
    em && em.setEditing(1);
  },

  /**
   * End editing tag. If the class typed already exists the
   * old one will be restored otherwise will be changed
   * @private
   */
  endEditTag() {
    const model = this.model;
    const inputEl = this.getInputEl();
    const label = inputEl.textContent;
    const name = Selector.escapeName(label);
    const em = this.em;
    const sm = em && em.get('SelectorManager');
    inputEl[inputProp] = false;
    em && em.setEditing(0);

    if (sm) {
      if (sm.get(name)) {
        inputEl.innerText = model.get('label');
      } else {
        model.set({ name, label });
      }
    }
  },

  /**
   * Update status of the tag
   * @private
   */
  changeStatus() {
    const { model } = this;
    model.set('active', !model.get('active'));
  },

  /**
   * Remove tag from the selected component
   * @param {Object} e
   * @private
   */
  removeTag() {
    const { em, model } = this;
    const sel = em && em.getSelected();
    if (!model.get('protected') && sel) sel.getSelectors().remove(model);
  },

  /**
   * Update status of the checkbox
   * @private
   */
  updateStatus() {
    const { model, $el } = this;
    const chkOn = 'fa-check-square-o';
    const chkOff = 'fa-square-o';
    const $chk = $el.find('[data-tag-status]');

    if (model.get('active')) {
      $chk.removeClass(chkOff).addClass(chkOn);
      $el.removeClass('opac50');
    } else {
      $chk.removeClass(chkOn).addClass(chkOff);
      $el.addClass('opac50');
    }
  },

  render() {
    const pfx = this.pfx;
    const ppfx = this.ppfx;
    this.$el.html(this.template());
    this.$el.attr('class', `${pfx}tag ${ppfx}three-bg`);
    this.updateStatus();
    return this;
  }
});
