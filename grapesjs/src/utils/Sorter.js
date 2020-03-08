import Backbone from 'backbone';
import { isString, isFunction, isArray, result, each } from 'underscore';
import {
  on,
  off,
  matches,
  getElement,
  getPointerEvent,
  isTextNode,
  getModel
} from 'utils/mixins';
const $ = Backbone.$;

module.exports = Backbone.View.extend({
  initialize(opt) {
    this.opt = opt || {};
    _.bindAll(
      this,
      'startSort',
      'onMove',
      'endMove',
      'rollback',
      'udpateOffset',
      'moveDragHelper'
    );
    var o = opt || {};
    this.elT = 0;
    this.elL = 0;
    this.borderOffset = o.borderOffset || 10;

    var el = o.container;
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    this.$el = $(this.el);

    this.containerSel = o.containerSel || 'div';
    this.itemSel = o.itemSel || 'div';
    this.draggable = o.draggable || true;
    this.nested = o.nested || 0;
    this.pfx = o.pfx || '';
    this.ppfx = o.ppfx || '';
    this.freezeClass = o.freezeClass || this.pfx + 'freezed';
    this.onStart = o.onStart || '';
    this.onEndMove = o.onEndMove || '';
    this.direction = o.direction || 'v'; // v (vertical), h (horizontal), a (auto)
    this.onMoveClb = o.onMove || '';
    this.relative = o.relative || 0;
    this.ignoreViewChildren = o.ignoreViewChildren || 0;
    this.ignoreModels = o.ignoreModels || 0;
    this.plh = o.placer || '';
    // Frame offset
    this.wmargin = o.wmargin || 0;
    this.offTop = o.offsetTop || 0;
    this.offLeft = o.offsetLeft || 0;
    this.document = o.document || document;
    this.$document = $(this.document);
    this.dropContent = null;
    this.em = o.em || '';
    this.dragHelper = null;
    this.canvasRelative = o.canvasRelative || 0;
    this.selectOnEnd = !o.avoidSelectOnEnd;
    this.scale = o.scale;
    this.activeTextModel = null;

    if (this.em && this.em.on) {
      this.em.on('change:canvasOffset', this.udpateOffset);
      this.udpateOffset();
    }
  },

  getScale() {
    return result(this, scale) || 1;
  },

  getContainerEl() {
    if (!this.el) {
      var el = this.opt.container;
      this.el = typeof el === 'string' ? document.querySelector(el) : el;
      this.$el = $(this.el);
    }
    return this.el;
  },

  getDocuments() {
    const em = this.em;
    const canvasDoc = em && em.get('Canvas').getBody().ownerDocument;
    const docs = [document];
    canvasDoc && docs.push(canvasDoc);
    return docs;
  },

  /**
   * Triggered when the offset of the editro is changed
   */
  udpateOffset() {
    const offset = this.em.get('canvasOffset') || {};
    this.offTop = offset.top;
    this.offLeft = offset.left;
  },

  /**
   * Set content to drop
   * @param {String|Object} content
   */
  setDropContent(content) {
    this.dropModel = null;
    this.dropContent = content;
  },

  updateTextViewCursorPosition(e) {
    const Canvas = this.em.get('Canvas');
    const targetDoc = Canvas.getDocument();
    let range = null;

    if (targetDoc.caretRangeFromPoint) {
      // Chrome
      const poiner = getPointerEvent(e);
      range = targetDoc.caretRangeFromPoint(poiner.clientX, poiner.clientY);
    } else if (e.rangeParent) {
      // Firefox
      range = targetDoc.createRange();
      range.setStart(e.rangeParent, e.rangeOffset);
    }

    const sel = Canvas.getWindow().getSelection();
    Canvas.getFrameEl().focus();
    sel.removeAllRanges();
    range && sel.addRange(range);
  },

  setContentEditable(model, mode) {
    if (model) {
      const el = model.getEl();
      if (el.contentEditable != mode) el.contentEditable = mode;
    }
  },

  /**
   * Toggle cursor while sorting
   * @param {Boolean} active
   */
  toggleSortCursor(active) {
    var em = this.em;
    var body = document.body;
    var pfx = this.ppfx || this.pfx;
    var sortCls = pfx + 'grabbing';
    var emBody = em ? em.get('Canvas').getBody() : '';

    // Avoid updating body className as it causes a huge repaint
    // Noticeable with "fast" drag of blocks
    if (active) {
      em && em.get('Canvas').startAutoscroll();
      //body.className += ' ' + sortCls;
      //if (em) emBody.className += ' ' + sortCls;
    } else {
      em && em.get('Canvas').stopAutoscroll();
      //body.className = body.className.replace(sortCls, '').trim();
      //if(em) emBody.className = emBody.className.replace(sortCls, '').trim();
    }
  },

  /**
   * Set drag helper
   * @param {HTMLElement} el
   * @param {Event} event
   */
  setDragHelper(el, event) {
    const ev = event || '';
    const clonedEl = el.cloneNode(1);
    const rect = el.getBoundingClientRect();
    const computed = getComputedStyle(el);
    let style = '';

    for (var i = 0; i < computed.length; i++) {
      const prop = computed[i];
      style += `${prop}:${computed.getPropertyValue(prop)};`;
    }

    document.body.appendChild(clonedEl);
    clonedEl.className += ` ${this.pfx}bdrag`;
    clonedEl.setAttribute('style', style);
    this.dragHelper = clonedEl;
    clonedEl.style.width = `${rect.width}px`;
    clonedEl.style.height = `${rect.height}px`;
    ev && this.moveDragHelper(ev);

    // Listen mouse move events
    if (this.em) {
      $(this.em.get('Canvas').getBody().ownerDocument)
        .off('mousemove', this.moveDragHelper)
        .on('mousemove', this.moveDragHelper);
    }
    $(document)
      .off('mousemove', this.moveDragHelper)
      .on('mousemove', this.moveDragHelper);
  },

  /**
   * Update the position of the helper
   * @param  {Event} e
   */
  moveDragHelper(e) {
    const doc = e.target.ownerDocument;

    if (!this.dragHelper || !doc) {
      return;
    }

    let posY = e.pageY;
    let posX = e.pageX;
    let addTop = 0;
    let addLeft = 0;
    const window = doc.defaultView || doc.parentWindow;
    const frame = window.frameElement;
    const dragHelperStyle = this.dragHelper.style;

    // If frame is present that means mouse has moved over the editor's canvas,
    // which is rendered inside the iframe and the mouse move event comes from
    // the iframe, not the parent window. Mouse position relative to the frame's
    // parent window needs to account for the frame's position relative to the
    // parent window.
    if (frame) {
      const frameRect = frame.getBoundingClientRect();
      addTop = frameRect.top + document.documentElement.scrollTop;
      addLeft = frameRect.left + document.documentElement.scrollLeft;
      posY = e.clientY;
      posX = e.clientX;
    }

    dragHelperStyle.top = posY + addTop + 'px';
    dragHelperStyle.left = posX + addLeft + 'px';
  },

  /**
   * Returns true if the element matches with selector
   * @param {Element} el
   * @param {String} selector
   * @return {Boolean}
   */
  matches(el, selector, useBody) {
    return matches.call(el, selector);
  },

  /**
   * Closest parent
   * @param {Element} el
   * @param {String} selector
   * @return {Element|null}
   */
  closest(el, selector) {
    if (!el) return;
    var elem = el.parentNode;
    while (elem && elem.nodeType === 1) {
      if (this.matches(elem, selector)) return elem;
      elem = elem.parentNode;
    }
    return null;
  },

  /**
   * Get the offset of the element
   * @param  {HTMLElement} el
   * @return {Object}
   */
  offset(el) {
    var rect = el.getBoundingClientRect();
    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    };
  },

  /**
   * Create placeholder
   * @return {HTMLElement}
   */
  createPlaceholder() {
    var pfx = this.pfx;
    var el = document.createElement('div');
    var ins = document.createElement('div');
    el.className = pfx + 'placeholder';
    el.style.display = 'none';
    el.style['pointer-events'] = 'none';
    ins.className = pfx + 'placeholder-int';
    el.appendChild(ins);
    return el;
  },

  /**
   * Picking component to move
   * @param {HTMLElement} src
   * */
  startSort(src) {
    const em = this.em;
    const itemSel = this.itemSel;
    const contSel = this.containerSel;
    const container = this.getContainerEl();
    const docs = this.getDocuments();
    const onStart = this.onStart;
    let srcModel;
    let plh = this.plh;
    this.dropModel = null;
    this.moved = 0;

    // Check if the start element is a valid one, if not get the
    // closest valid one
    if (src && !this.matches(src, `${itemSel}, ${contSel}`)) {
      src = this.closest(src, itemSel);
    }

    this.eV = src;

    // Create placeholder if not yet exists
    if (!plh) {
      plh = this.createPlaceholder();
      container.appendChild(plh);
      this.plh = plh;
    }

    if (src) {
      srcModel = this.getSourceModel(src);
      srcModel && srcModel.set && srcModel.set('status', 'freezed');
    }

    on(container, 'mousemove dragover', this.onMove);
    on(docs, 'mouseup dragend touchend', this.endMove);
    on(docs, 'keydown', this.rollback);
    onStart && onStart();

    // Avoid strange effects on dragging
    em && em.clearSelection();
    this.toggleSortCursor(1);

    em && em.trigger('sorter:drag:start', src, srcModel);
  },

  /**
   * Get the model from HTMLElement target
   * @return {Model|null}
   */
  getTargetModel(el) {
    let elem = el || this.target;
    return $(elem).data('model');
  },

  /**
   * Get the model of the current source element (element to drag)
   * @return {Model}
   */
  getSourceModel(source, { target, avoidChildren = 1 } = {}) {
    const { em, eV } = this;
    const src = source || eV;
    let { dropModel, dropContent } = this;
    const isTextable = src =>
      src &&
      target &&
      src.opt &&
      src.opt.avoidChildren &&
      this.isTextableActive(src, target);

    if (dropContent && em) {
      if (isTextable(dropModel)) {
        dropModel = null;
      }

      if (!dropModel) {
        const comps = em.get('DomComponents').getComponents();
        const opts = {
          avoidChildren,
          avoidStore: 1,
          avoidUpdateStyle: 1
        };
        const tempModel = comps.add(dropContent, { ...opts, temporary: 1 });
        dropModel = comps.remove(tempModel, opts);
        dropModel = dropModel instanceof Array ? dropModel[0] : dropModel;
        this.dropModel = dropModel;

        if (isTextable(dropModel)) {
          return this.getSourceModel(src, { target, avoidChildren: 0 });
        }
      }

      return dropModel;
    }

    return src && $(src).data('model');
  },

  /**
   * Highlight target
   * @param  {Model|null} model
   */
  selectTargetModel(model) {
    if (model instanceof Backbone.Collection) {
      return;
    }

    var prevModel = this.targetModel;
    if (prevModel) {
      prevModel.set('status', '');
    }

    if (model && model.set) {
      model.set('status', 'selected-parent');
      this.targetModel = model;
    }
  },

  /**
   * During move
   * @param {Event} e
   * */
  onMove(e) {
    const ev = e;
    const { em, onMoveClb, plh } = this;
    this.moved = 1;

    // Turn placeholder visibile
    var dsp = plh.style.display;
    if (!dsp || dsp === 'none') plh.style.display = 'block';

    // Cache all necessary positions
    var eO = this.offset(this.el);
    this.elT = this.wmargin ? Math.abs(eO.top) : eO.top;
    this.elL = this.wmargin ? Math.abs(eO.left) : eO.left;
    var rY = e.pageY - this.elT + this.el.scrollTop;
    var rX = e.pageX - this.elL + this.el.scrollLeft;

    if (this.canvasRelative && em) {
      var mousePos = em.get('Canvas').getMouseRelativeCanvas(e);
      rX = mousePos.x;
      rY = mousePos.y;
    }

    this.rX = rX;
    this.rY = rY;
    this.eventMove = e;

    //var targetNew = this.getTargetFromEl(e.target);
    const sourceModel = this.getSourceModel();
    const dims = this.dimsFromTarget(e.target, rX, rY);
    const target = this.target;
    const targetModel = this.getTargetModel(target);
    this.selectTargetModel(targetModel);
    if (!targetModel) plh.style.display = 'none';

    this.lastDims = dims;
    const pos = this.findPosition(dims, rX, rY);

    if (this.isTextableActive(sourceModel, targetModel)) {
      this.activeTextModel = targetModel;
      this.setContentEditable(targetModel, true);

      plh.style.display = 'none';
      this.lastPos = pos;
      this.updateTextViewCursorPosition(ev);
    } else {
      this.disableTextable();
      this.activeTextModel = null;

      // If there is a significant changes with the pointer
      if (
        !this.lastPos ||
        (this.lastPos.index != pos.index || this.lastPos.method != pos.method)
      ) {
        this.movePlaceholder(this.plh, dims, pos, this.prevTargetDim);
        if (!this.$plh) this.$plh = $(this.plh);

        // With canvasRelative the offset is calculated automatically for
        // each element
        if (!this.canvasRelative) {
          if (this.offTop) this.$plh.css('top', '+=' + this.offTop + 'px');
          if (this.offLeft) this.$plh.css('left', '+=' + this.offLeft + 'px');
        }

        this.lastPos = pos;
      }
    }

    isFunction(onMoveClb) && onMoveClb(e);

    em &&
      em.trigger('sorter:drag', {
        target,
        targetModel,
        sourceModel,
        dims,
        pos,
        x: rX,
        y: rY
      });
  },

  isTextableActive(src, trg) {
    return src && src.get && src.get('textable') && trg && trg.is('text');
  },

  disableTextable() {
    const { activeTextModel } = this;
    activeTextModel && activeTextModel.getView().disableEditing();
  },

  /**
   * Returns true if the elements is in flow, so is not in flow where
   * for example the component is with float:left
   * @param  {HTMLElement} el
   * @param  {HTMLElement} parent
   * @return {Boolean}
   * @private
   * */
  isInFlow(el, parent) {
    if (!el) return false;

    parent = parent || document.body;
    var ch = -1,
      h;
    var elem = el;
    h = elem.offsetHeight;
    if (/*h < ch || */ !this.styleInFlow(elem, parent)) return false;
    else return true;
  },

  /**
   * Check if el has style to be in flow
   * @param  {HTMLElement} el
   * @param  {HTMLElement} parent
   * @return {Boolean}
   * @private
   */
  styleInFlow(el, parent) {
    if (isTextNode(el)) return;
    const style = el.style || {};
    const $el = $(el);
    const $parent = parent && $(parent);

    if (style.overflow && style.overflow !== 'visible') return;
    if ($el.css('float') !== 'none') return;
    if (
      $parent &&
      $parent.css('display') == 'flex' &&
      $parent.css('flex-direction') !== 'column'
    )
      return;
    switch (style.position) {
      case 'static':
      case 'relative':
      case '':
        break;
      default:
        return;
    }
    switch (el.tagName) {
      case 'TR':
      case 'TBODY':
      case 'THEAD':
      case 'TFOOT':
        return true;
    }
    switch ($el.css('display')) {
      case 'block':
      case 'list-item':
      case 'table':
      case 'flex':
        return true;
    }
    return;
  },

  /**
   * Check if the target is valid with the actual source
   * @param  {HTMLElement} trg
   * @return {Boolean}
   */
  validTarget(trg, src) {
    const trgModel = this.getTargetModel(trg);
    const srcModel = this.getSourceModel(src, { target: trgModel });
    src = srcModel && srcModel.view && srcModel.view.el;
    trg = trgModel && trgModel.view && trgModel.view.el;
    let result = {
      valid: true,
      src,
      srcModel,
      trg,
      trgModel
    };

    if (!src || !trg) {
      result.valid = false;
      return result;
    }

    // check if the source is draggable in target
    let draggable = srcModel.get('draggable');
    draggable = draggable instanceof Array ? draggable.join(', ') : draggable;
    result.dragInfo = draggable;
    draggable = isString(draggable) ? this.matches(trg, draggable) : draggable;
    result.draggable = draggable;

    // Check if the target could accept the source
    let droppable = trgModel.get('droppable');
    droppable = droppable instanceof Backbone.Collection ? 1 : droppable;
    droppable = droppable instanceof Array ? droppable.join(', ') : droppable;
    result.dropInfo = droppable;
    droppable = isString(droppable) ? this.matches(src, droppable) : droppable;
    droppable =
      draggable && this.isTextableActive(srcModel, trgModel) ? 1 : droppable;
    result.droppable = droppable;

    if (!droppable || !draggable) {
      result.valid = false;
    }

    return result;
  },

  /**
   * Get dimensions of nodes relative to the coordinates
   * @param  {HTMLElement} target
   * @param {number} rX Relative X position
   * @param {number} rY Relative Y position
   * @return {Array<Array>}
   */
  dimsFromTarget(target, rX, rY) {
    const em = this.em;
    var dims = [];

    if (!target) {
      return dims;
    }

    // Select the first valuable target
    if (!this.matches(target, `${this.itemSel}, ${this.containerSel}`)) {
      target = this.closest(target, this.itemSel);
    }

    // If draggable is an array the target will be one of those
    if (this.draggable instanceof Array) {
      target = this.closest(target, this.draggable.join(','));
    }

    if (!target) {
      return dims;
    }

    // Check if the target is different from the previous one
    if (this.prevTarget && this.prevTarget != target) {
      this.prevTarget = null;
    }

    // New target found
    if (!this.prevTarget) {
      this.targetP = this.closest(target, this.containerSel);

      // Check if the source is valid with the target
      let validResult = this.validTarget(target);
      em && em.trigger('sorter:drag:validation', validResult);

      if (!validResult.valid && this.targetP) {
        return this.dimsFromTarget(this.targetP, rX, rY);
      }

      this.prevTarget = target;
      this.prevTargetDim = this.getDim(target);
      this.cacheDimsP = this.getChildrenDim(this.targetP);
      this.cacheDims = this.getChildrenDim(target);
    }

    // If the target is the previous one will return the cached dims
    if (this.prevTarget == target) dims = this.cacheDims;

    // Target when I will drop element to sort
    this.target = this.prevTarget;

    // Generally, on any new target the poiner enters inside its area and
    // triggers nearBorders(), so have to take care of this
    if (
      this.nearBorders(this.prevTargetDim, rX, rY) ||
      (!this.nested && !this.cacheDims.length)
    ) {
      const targetParent = this.targetP;

      if (targetParent && this.validTarget(targetParent).valid) {
        dims = this.cacheDimsP;
        this.target = targetParent;
      }
    }

    this.lastPos = null;
    return dims;
  },

  /**
   * Get valid target from element
   * This method should replace dimsFromTarget()
   * @param  {HTMLElement} el
   * @return {HTMLElement}
   */
  getTargetFromEl(el) {
    let target = el;
    let targetParent;
    let targetPrev = this.targetPrev;
    const em = this.em;
    const containerSel = this.containerSel;
    const itemSel = this.itemSel;

    // Select the first valuable target
    if (!this.matches(target, `${itemSel}, ${containerSel}`)) {
      target = this.closest(target, itemSel);
    }

    // If draggable is an array the target will be one of those
    // TODO check if this options is used somewhere
    if (this.draggable instanceof Array) {
      target = this.closest(target, this.draggable.join(','));
    }

    // Check if the target is different from the previous one
    if (targetPrev && targetPrev != target) {
      this.targetPrev = '';
    }

    // New target found
    if (!this.targetPrev) {
      targetParent = this.closest(target, containerSel);

      // If the current target is not valid (src/trg reasons) try with
      // the parent one (if exists)
      const validResult = this.validTarget(target);
      em && em.trigger('sorter:drag:validation', validResult);

      if (!validResult.valid && targetParent) {
        return this.getTargetFromEl(targetParent);
      }

      this.targetPrev = target;
    }

    // Generally, on any new target the poiner enters inside its area and
    // triggers nearBorders(), so have to take care of this
    if (this.nearElBorders(target)) {
      targetParent = this.closest(target, containerSel);

      if (targetParent && this.validTarget(targetParent).valid) {
        target = targetParent;
      }
    }

    return target;
  },

  /**
   * Check if the current pointer is neare to element borders
   * @return {Boolen}
   */
  nearElBorders(el) {
    const off = 10;
    const rect = el.getBoundingClientRect();
    const body = el.ownerDocument.body;
    const { x, y } = this.getCurrentPos();
    const top = rect.top + body.scrollTop;
    const left = rect.left + body.scrollLeft;
    const width = rect.width;
    const height = rect.height;

    if (
      y < top + off || // near top edge
      y > top + height - off || // near bottom edge
      x < left + off || // near left edge
      x > left + width - off // near right edge
    ) {
      return 1;
    }
  },

  getCurrentPos() {
    const ev = this.eventMove;
    const x = ev.pageX || 0;
    const y = ev.pageY || 0;
    return { x, y };
  },

  /**
   * Returns dimensions and positions about the element
   * @param {HTMLElement} el
   * @return {Array<number>}
   */
  getDim(el) {
    const { em, canvasRelative } = this;
    var top, left, height, width;

    if (canvasRelative && em) {
      const canvas = em.get('Canvas');
      const pos = canvas.getElementPos(el);
      const elOffsets = canvas.getElementOffsets(el);
      top = pos.top - elOffsets.marginTop;
      left = pos.left - elOffsets.marginLeft;
      height = pos.height + elOffsets.marginTop + elOffsets.marginBottom;
      width = pos.width + elOffsets.marginLeft + elOffsets.marginRight;
    } else {
      var o = this.offset(el);
      top = this.relative
        ? el.offsetTop
        : o.top - (this.wmargin ? -1 : 1) * this.elT;
      left = this.relative
        ? el.offsetLeft
        : o.left - (this.wmargin ? -1 : 1) * this.elL;
      height = el.offsetHeight;
      width = el.offsetWidth;
    }

    return [top, left, height, width];
  },

  /**
   * Get children dimensions
   * @param {HTMLELement} el Element root
   * @retun {Array}
   * */
  getChildrenDim(trg) {
    const dims = [];
    if (!trg) return dims;

    // Get children based on getChildrenContainer
    const trgModel = this.getTargetModel(trg);
    if (trgModel && trgModel.view && !this.ignoreViewChildren) {
      trg = trgModel.view.getChildrenContainer();
    }

    each(trg.children, (el, i) => {
      const model = getModel(el, $);
      const elIndex = model && model.index ? model.index() : i;

      if (!isTextNode(el) && !this.matches(el, this.itemSel)) {
        return;
      }

      const dim = this.getDim(el);
      let dir = this.direction;

      if (dir == 'v') dir = true;
      else if (dir == 'h') dir = false;
      else dir = this.isInFlow(el, trg);

      dim.push(dir, el, elIndex);
      dims.push(dim);
    });

    return dims;
  },

  /**
   * Check if the coordinates are near to the borders
   * @param {Array<number>} dim
   * @param {number} rX Relative X position
   * @param {number} rY Relative Y position
   * @return {Boolean}
   * */
  nearBorders(dim, rX, rY) {
    var result = 0;
    var off = this.borderOffset;
    var x = rX || 0;
    var y = rY || 0;
    var t = dim[0];
    var l = dim[1];
    var h = dim[2];
    var w = dim[3];
    if (t + off > y || y > t + h - off || l + off > x || x > l + w - off)
      result = 1;

    return !!result;
  },

  /**
   * Find the position based on passed dimensions and coordinates
   * @param {Array<Array>} dims Dimensions of nodes to parse
   * @param {number} posX X coordindate
   * @param {number} posY Y coordindate
   * @retun {Object}
   * */
  findPosition(dims, posX, posY) {
    var result = { index: 0, indexEl: 0, method: 'before' };
    var leftLimit = 0,
      xLimit = 0,
      dimRight = 0,
      yLimit = 0,
      xCenter = 0,
      yCenter = 0,
      dimDown = 0,
      dim = 0;
    // Each dim is: Top, Left, Height, Width
    for (var i = 0, len = dims.length; i < len; i++) {
      dim = dims[i];
      // Right position of the element. Left + Width
      dimRight = dim[1] + dim[3];
      // Bottom position of the element. Top + Height
      dimDown = dim[0] + dim[2];
      // X center position of the element. Left + (Width / 2)
      xCenter = dim[1] + dim[3] / 2;
      // Y center position of the element. Top + (Height / 2)
      yCenter = dim[0] + dim[2] / 2;
      // Skip if over the limits
      if (
        (xLimit && dim[1] > xLimit) ||
        (yLimit && yCenter >= yLimit) || // >= avoid issue with clearfixes
        (leftLimit && dimRight < leftLimit)
      )
        continue;
      result.index = i;
      result.indexEl = dim[6];
      // If it's not in flow (like 'float' element)
      if (!dim[4]) {
        if (posY < dimDown) yLimit = dimDown;
        //If x lefter than center
        if (posX < xCenter) {
          xLimit = xCenter;
          result.method = 'before';
        } else {
          leftLimit = xCenter;
          result.method = 'after';
        }
      } else {
        // If y upper than center
        if (posY < yCenter) {
          result.method = 'before';
          break;
        } else result.method = 'after'; // After last element
      }
    }
    return result;
  },

  /**
   * Updates the position of the placeholder
   * @param {HTMLElement} phl
   * @param {Array<Array>} dims
   * @param {Object} pos Position object
   * @param {Array<number>} trgDim target dimensions
   * */
  movePlaceholder(plh, dims, pos, trgDim) {
    var marg = 0,
      t = 0,
      l = 0,
      w = 0,
      h = 0,
      un = 'px',
      margI = 5,
      brdCol = '#62c462',
      brd = 3,
      method = pos.method;
    var elDim = dims[pos.index];
    plh.style.borderColor = 'transparent ' + brdCol;
    plh.style.borderWidth = brd + un + ' ' + (brd + 2) + un;
    plh.style.margin = '-' + brd + 'px 0 0';
    if (elDim) {
      // If it's not in flow (like 'float' element)
      if (!elDim[4]) {
        w = 'auto';
        h = elDim[2] - marg * 2 + un;
        t = elDim[0] + marg;
        l = method == 'before' ? elDim[1] - marg : elDim[1] + elDim[3] - marg;
        plh.style.borderColor = brdCol + ' transparent';
        plh.style.borderWidth = brd + 2 + un + ' ' + brd + un;
        plh.style.margin = '0 0 0 -' + brd + 'px';
      } else {
        w = elDim[3] + un;
        h = 'auto';
        t = method == 'before' ? elDim[0] - marg : elDim[0] + elDim[2] - marg;
        l = elDim[1];
      }
    } else {
      if (!this.nested) {
        plh.style.display = 'none';
        return;
      }
      if (trgDim) {
        t = trgDim[0] + margI;
        l = trgDim[1] + margI;
        w = parseInt(trgDim[3]) - margI * 2 + un;
        h = 'auto';
      }
    }
    plh.style.top = t + un;
    plh.style.left = l + un;
    if (w) plh.style.width = w;
    if (h) plh.style.height = h;
  },

  /**
   * Leave item
   * @param event
   *
   * @return void
   * */
  endMove(e) {
    const moved = [null];
    const docs = this.getDocuments();
    const container = this.getContainerEl();
    const onEndMove = this.onEndMove;
    const { target, lastPos } = this;
    off(container, 'mousemove dragover', this.onMove);
    off(docs, 'mouseup dragend touchend', this.endMove);
    off(docs, 'keydown', this.rollback);
    this.plh.style.display = 'none';
    let src = this.eV;

    if (src && this.selectOnEnd) {
      var srcModel = this.getSourceModel();
      if (srcModel && srcModel.set) {
        srcModel.set('status', '');
        srcModel.set('status', 'selected');
      }
    }

    if (this.moved) {
      const toMove = this.toMove;
      const toMoveArr = isArray(toMove) ? toMove : toMove ? [toMove] : [src];
      toMoveArr.forEach(model => {
        moved.push(this.move(target, model, lastPos));
      });
    }

    if (this.plh) this.plh.style.display = 'none';
    var dragHelper = this.dragHelper;

    if (dragHelper) {
      dragHelper.parentNode.removeChild(dragHelper);
      this.dragHelper = null;
    }

    this.disableTextable();
    this.selectTargetModel();
    this.toggleSortCursor();

    this.toMove = null;
    isFunction(onEndMove) && moved.forEach(m => onEndMove(m, this));
  },

  /**
   * Move component to new position
   * @param {HTMLElement} dst Destination target
   * @param {HTMLElement} src Element to move
   * @param {Object} pos Object with position coordinates
   * */
  move(dst, src, pos) {
    const { em, activeTextModel, dropContent } = this;
    const srcEl = getElement(src);
    em && em.trigger('component:dragEnd:before', dst, srcEl, pos); // @depricated
    var warns = [];
    var index = pos.indexEl;
    var modelToDrop, modelTemp, created;
    var validResult = this.validTarget(dst, srcEl);
    var targetCollection = $(dst).data('collection');
    var model = validResult.srcModel;
    var droppable = validResult.droppable;
    var draggable = validResult.draggable;
    var dropInfo = validResult.dropInfo;
    var dragInfo = validResult.dragInfo;
    const { trgModel } = validResult;
    droppable = trgModel instanceof Backbone.Collection ? 1 : droppable;
    const isTextableActive = this.isTextableActive(model, trgModel);

    if (targetCollection && droppable && draggable) {
      index = pos.method === 'after' ? index + 1 : index;
      var opts = { at: index, noIncrement: 1 };

      if (!dropContent) {
        // Putting `avoidStore` here will make the UndoManager behave wrong
        opts.temporary = 1;
        modelTemp = targetCollection.add({}, { ...opts });

        if (model.collection) {
          modelToDrop = model.collection.remove(model, { temporary: 1 });
        }
      } else {
        modelToDrop = dropContent;
        opts.silent = false;
        opts.avoidUpdateStyle = 1;
      }

      if (isTextableActive) {
        const viewActive = activeTextModel.getView();
        activeTextModel.trigger('active');
        const { activeRte } = viewActive;
        const modelEl = model.getEl();
        delete model.opt.temporary;
        model.getView().render();
        modelEl.setAttribute('data-gjs-textable', 'true');
        const { outerHTML } = modelEl;
        activeRte.insertHTML && activeRte.insertHTML(outerHTML);
      } else {
        created = targetCollection.add(modelToDrop, opts);
      }

      if (!dropContent) {
        targetCollection.remove(modelTemp);
      } else {
        this.dropContent = null;
      }

      // This will cause to recalculate children dimensions
      this.prevTarget = null;
    } else {
      if (!targetCollection) {
        warns.push('Target collection not found');
      }

      if (!droppable) {
        warns.push(`Target is not droppable, accepts [${dropInfo}]`);
      }

      if (!draggable) {
        warns.push(`Component not draggable, acceptable by [${dragInfo}]`);
      }

      console.warn('Invalid target position: ' + warns.join(', '));
    }

    em && em.trigger('component:dragEnd', targetCollection, modelToDrop, warns); // @depricated
    em &&
      em.trigger('sorter:drag:end', {
        targetCollection,
        modelToDrop,
        warns,
        validResult,
        dst,
        srcEl
      });

    return created;
  },

  /**
   * Rollback to previous situation
   * @param {Event}
   * @param {Bool} Indicates if rollback in anycase
   * */
  rollback(e) {
    off(this.getDocuments(), 'keydown', this.rollback);
    const key = e.which || e.keyCode;

    if (key == 27) {
      this.moved = 0;
      this.endMove();
    }
  }
});
