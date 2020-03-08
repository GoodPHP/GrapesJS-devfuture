import { isUndefined, isString } from 'underscore';
import { getModel } from 'utils/mixins';
import Backbone from 'backbone';
const ComponentView = require('dom_components/view/ComponentView');
const inputProp = 'contentEditable';
const $ = Backbone.$;
let ItemsView;

export default Backbone.View.extend({
  events: {
    'mousedown [data-toggle-move]': 'startSort',
    'touchstart [data-toggle-move]': 'startSort',
    'click [data-toggle-visible]': 'toggleVisibility',
    'click [data-toggle-select]': 'handleSelect',
    'mouseover [data-toggle-select]': 'handleHover',
    'click [data-toggle-open]': 'toggleOpening',
    'dblclick [data-name]': 'handleEdit',
    'focusout [data-name]': 'handleEditEnd'
  },

  template(model) {
    const { pfx, ppfx, config, clsNoEdit } = this;
    const { hidable } = config;
    const count = this.countChildren(model);
    const addClass = !count ? this.clsNoChild : '';
    const clsTitle = `${this.clsTitle} ${addClass}`;
    const clsTitleC = `${this.clsTitleC} ${ppfx}one-bg`;
    const clsCaret = `${this.clsCaret} fa fa-chevron-right`;
    const clsInput = `${this.inputNameCls} ${clsNoEdit} ${ppfx}no-app`;
    const level = this.level + 1;
    const gut = `${30 + level * 10}px`;
    const name = model.getName();
    const icon = model.getIcon();
    const clsBase = `${pfx}layer`;

    return `
      ${
        hidable
          ? `<i class="${pfx}layer-vis fa fa-eye ${
              this.isVisible() ? '' : 'fa-eye-slash'
            }" data-toggle-visible></i>`
          : ''
      }
      <div class="${clsTitleC}">
        <div class="${clsTitle}" style="padding-left: ${gut}" data-toggle-select>
          <div class="${pfx}layer-title-inn">
            <i class="${clsCaret}" data-toggle-open></i>
            ${icon ? `<span class="${clsBase}__icon">${icon}</span>` : ''}
            <span class="${clsInput}" data-name>${name}</span>
          </div>
        </div>
      </div>
      <div class="${this.clsCount}">${count || ''}</div>
      <div class="${this.clsMove}" data-toggle-move>
        <i class="fa fa-arrows"></i>
      </div>
      <div class="${this.clsChildren}"></div>`;
  },

  initialize(o = {}) {
    this.opt = o;
    this.level = o.level;
    this.config = o.config;
    this.em = o.config.em;
    this.ppfx = this.em.get('Config').stylePrefix;
    this.sorter = o.sorter || '';
    this.pfx = this.config.stylePrefix;
    const pfx = this.pfx;
    const ppfx = this.ppfx;
    const model = this.model;
    const components = model.get('components');
    const type = model.get('type') || 'default';
    model.set('open', false);
    this.listenTo(components, 'remove add reset', this.checkChildren);
    this.listenTo(model, 'change:status', this.updateStatus);
    this.listenTo(model, 'change:open', this.updateOpening);
    this.listenTo(model, 'change:style:display', this.updateVisibility);
    this.className = `${pfx}layer ${pfx}layer__t-${type} no-select ${ppfx}two-color`;
    this.inputNameCls = `${ppfx}layer-name`;
    this.clsTitleC = `${pfx}layer-title-c`;
    this.clsTitle = `${pfx}layer-title`;
    this.clsCaret = `${pfx}layer-caret`;
    this.clsCount = `${pfx}layer-count`;
    this.clsMove = `${pfx}layer-move`;
    this.clsChildren = `${pfx}layer-children`;
    this.clsNoChild = `${pfx}layer-no-chld`;
    this.clsEdit = `${this.inputNameCls}--edit`;
    this.clsNoEdit = `${this.inputNameCls}--no-edit`;
    this.$el.data('model', model);
    this.$el.data('collection', components);
    model.viewLayer = this;
  },

  getVisibilityEl() {
    if (!this.eyeEl) {
      this.eyeEl = this.$el.children(`.${this.pfx}layer-vis`);
    }

    return this.eyeEl;
  },

  updateVisibility() {
    const pfx = this.pfx;
    const model = this.model;
    const hClass = `${pfx}layer-hidden`;
    const hideIcon = 'fa-eye-slash';
    const hidden = model.getStyle().display == 'none';
    const method = hidden ? 'addClass' : 'removeClass';
    this.$el[method](hClass);
    this.getVisibilityEl()[method](hideIcon);
  },

  /**
   * Toggle visibility
   * @param	Event
   *
   * @return 	void
   * */
  toggleVisibility(e) {
    e && e.stopPropagation();
    const model = this.model;
    const style = model.getStyle();
    const hidden = style.display == 'none';

    if (hidden) {
      delete style.display;
    } else {
      style.display = 'none';
    }

    model.setStyle(style);
  },

  /**
   * Handle the edit of the component name
   */
  handleEdit(e) {
    e && e.stopPropagation();
    const { em, $el, clsNoEdit, clsEdit } = this;
    const inputEl = this.getInputName();
    inputEl[inputProp] = true;
    inputEl.focus();
    em && em.setEditing(1);
    $el
      .find(`.${this.inputNameCls}`)
      .removeClass(clsNoEdit)
      .addClass(clsEdit);
  },

  /**
   * Handle with the end of editing of the component name
   */
  handleEditEnd(e) {
    e && e.stopPropagation();
    const { em, $el, clsNoEdit, clsEdit } = this;
    const inputEl = this.getInputName();
    const name = inputEl.textContent;
    inputEl.scrollLeft = 0;
    inputEl[inputProp] = false;
    this.model.set({ name });
    em && em.setEditing(0);
    $el
      .find(`.${this.inputNameCls}`)
      .addClass(clsNoEdit)
      .removeClass(clsEdit);
  },

  /**
   * Get the input containing the name of the component
   * @return {HTMLElement}
   */
  getInputName() {
    if (!this.inputName) {
      this.inputName = this.el.querySelector(`.${this.inputNameCls}`);
    }
    return this.inputName;
  },

  /**
   * Update item opening
   *
   * @return void
   * */
  updateOpening() {
    var opened = this.opt.opened || {};
    var model = this.model;
    const chvDown = 'fa-chevron-down';

    if (model.get('open')) {
      this.$el.addClass('open');
      this.getCaret().addClass(chvDown);
      opened[model.cid] = model;
    } else {
      this.$el.removeClass('open');
      this.getCaret().removeClass(chvDown);
      delete opened[model.cid];
    }
  },

  /**
   * Toggle item opening
   * @param {Object}	e
   *
   * @return void
   * */
  toggleOpening(e) {
    e.stopPropagation();

    if (!this.model.get('components').length) return;

    this.model.set('open', !this.model.get('open'));
  },

  /**
   * Handle component selection
   */
  handleSelect(e) {
    e.stopPropagation();
    const { em, config } = this;

    if (em) {
      const model = this.model;
      em.setSelected(model, { fromLayers: 1 });
      const scroll = config.scrollCanvas;
      scroll && em.get('Canvas').scrollTo(model, scroll);
    }
  },

  /**
   * Handle component selection
   */
  handleHover(e) {
    e.stopPropagation();
    const { em, config, model } = this;
    em && config.showHover && em.setHovered(model, { fromLayers: 1 });
  },

  /**
   * Delegate to sorter
   * @param	Event
   * */
  startSort(e) {
    e.stopPropagation();
    const sorter = this.sorter;
    // Right or middel click
    if (e.button && e.button !== 0) return;
    sorter && sorter.startSort(e.target);
  },

  /**
   * Freeze item
   * @return	void
   * */
  freeze() {
    this.$el.addClass(this.pfx + 'opac50');
    this.model.set('open', 0);
  },

  /**
   * Unfreeze item
   * @return	void
   * */
  unfreeze() {
    this.$el.removeClass(this.pfx + 'opac50');
  },

  /**
   * Update item on status change
   * @param	Event
   * */
  updateStatus(e) {
    ComponentView.prototype.updateStatus.apply(this, [
      {
        avoidHover: !this.config.highlightHover
      }
    ]);
  },

  /**
   * Check if component is visible
   *
   * @return bool
   * */
  isVisible() {
    var css = this.model.get('style'),
      pr = css.display;
    if (pr && pr == 'none') return;
    return 1;
  },

  /**
   * Update item aspect after children changes
   *
   * @return void
   * */
  checkChildren() {
    const model = this.model;
    const count = this.countChildren(model);
    const pfx = this.pfx;
    const noChildCls = this.clsNoChild;
    const title = this.$el
      .children(`.${this.clsTitleC}`)
      .children(`.${this.clsTitle}`);

    if (!this.cnt) {
      this.cnt = this.$el.children(`.${this.clsCount}`);
    }

    if (count) {
      title.removeClass(noChildCls);
      this.cnt.html(count);
    } else {
      title.addClass(noChildCls);
      this.cnt.empty();
      model.set('open', 0);
    }
  },

  /**
   * Count children inside model
   * @param  {Object} model
   * @return {number}
   * @private
   */
  countChildren(model) {
    var count = 0;
    model.get('components').each(function(m) {
      var isCountable = this.opt.isCountable;
      var hide = this.config.hideTextnode;
      if (isCountable && !isCountable(m, hide)) return;
      count++;
    }, this);
    return count;
  },

  getCaret() {
    if (!this.caret || !this.caret.length) {
      const pfx = this.pfx;
      this.caret = this.$el
        .children(`.${this.clsTitleC}`)
        .find(`.${this.clsCaret}`);
    }

    return this.caret;
  },

  setRoot(el) {
    el = isString(el) ? this.em.getWrapper().find(el)[0] : el;
    const model = getModel(el, $);
    if (!model) return;
    this.stopListening();
    this.model = model;
    this.initialize(this.opt);
    this.render();
  },

  render() {
    const { model, config, pfx, ppfx, opt } = this;
    const { isCountable } = opt;
    const hidden = isCountable && !isCountable(model, config.hideTextnode);
    const vis = this.isVisible();
    const el = this.$el.empty();
    const level = this.level + 1;

    if (isUndefined(ItemsView)) {
      ItemsView = require('./ItemsView');
    }

    const children = new ItemsView({
      collection: model.get('components'),
      config: this.config,
      sorter: this.sorter,
      opened: this.opt.opened,
      parent: model,
      level
    }).render().$el;

    if (!this.config.showWrapper && level === 1) {
      el.append(children);
    } else {
      el.html(this.template(model));
      el.find(`.${this.clsChildren}`).append(children);
    }

    if (!model.get('draggable') || !this.config.sortable) {
      el.children(`.${this.clsMove}`).remove();
    }

    !vis && (this.className += ` ${pfx}hide`);
    hidden && (this.className += ` ${ppfx}hidden`);
    el.attr('class', this.className);
    this.updateOpening();
    this.updateStatus();
    this.updateVisibility();
    return this;
  }
});
