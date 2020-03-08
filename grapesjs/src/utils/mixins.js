import { omit, keys, isUndefined, isElement } from 'underscore';

const elProt = window.Element.prototype;
const matches =
  elProt.matches ||
  elProt.webkitMatchesSelector ||
  elProt.mozMatchesSelector ||
  elProt.msMatchesSelector;

/**
 * Returns shallow diff between 2 objects
 * @param  {Object} objOrig
 * @param  {Objec} objNew
 * @return {Object}
 * @example
 * var a = {foo: 'bar', baz: 1, faz: 'sop'};
 * var b = {foo: 'bar', baz: 2, bar: ''};
 * shallowDiff(a, b);
 * // -> {baz: 2, faz: null, bar: ''};
 */
const shallowDiff = (objOrig, objNew) => {
  const result = {};
  const keysNew = keys(objNew);

  for (let prop in objOrig) {
    if (objOrig.hasOwnProperty(prop)) {
      const origValue = objOrig[prop];
      const newValue = objNew[prop];

      if (keysNew.indexOf(prop) >= 0) {
        if (origValue !== newValue) {
          result[prop] = newValue;
        }
      } else {
        result[prop] = null;
      }
    }
  }

  for (let prop in objNew) {
    if (objNew.hasOwnProperty(prop)) {
      if (isUndefined(objOrig[prop])) {
        result[prop] = objNew[prop];
      }
    }
  }

  return result;
};

const on = (el, ev, fn) => {
  ev = ev.split(/\s+/);
  el = el instanceof Array ? el : [el];

  for (let i = 0; i < ev.length; ++i) {
    el.forEach(elem => elem.addEventListener(ev[i], fn));
  }
};

const off = (el, ev, fn) => {
  ev = ev.split(/\s+/);
  el = el instanceof Array ? el : [el];

  for (let i = 0; i < ev.length; ++i) {
    el.forEach(elem => elem.removeEventListener(ev[i], fn));
  }
};

const getUnitFromValue = value => {
  return value.replace(parseFloat(value), '');
};

const upFirst = value => value[0].toUpperCase() + value.toLowerCase().slice(1);

const camelCase = value => {
  const values = value.split('-').filter(String);
  return values[0].toLowerCase() + values.slice(1).map(upFirst);
};

const normalizeFloat = (value, step = 1, valueDef = 0) => {
  let stepDecimals = 0;
  if (isNaN(value)) return valueDef;
  value = parseFloat(value);

  if (Math.floor(value) !== value) {
    const side = step.toString().split('.')[1];
    stepDecimals = side ? side.length : 0;
  }

  return stepDecimals ? parseFloat(value.toFixed(stepDecimals)) : value;
};

const hasDnd = em => {
  return (
    'draggable' in document.createElement('i') &&
    (em ? em.get('Config').nativeDnD : 1)
  );
};

/**
 * Ensure to fetch the element from the input argument
 * @param  {HTMLElement|Component} el Component or HTML element
 * @return {HTMLElement}
 */
const getElement = el => {
  if (isElement(el) || isTextNode(el)) {
    return el;
  } else if (el && el.getEl) {
    return el.getEl();
  }
};

/**
 * Check if element is a text node
 * @param  {HTMLElement} el
 * @return {Boolean}
 */
const isTextNode = el => el && el.nodeType === 3;

/**
 * Check if element is a comment node
 * @param  {HTMLElement} el
 * @return {Boolean}
 */
export const isCommentNode = el => el && el.nodeType === 8;

/**
 * Check if element is a comment node
 * @param  {HTMLElement} el
 * @return {Boolean}
 */
export const isTaggableNode = el => el && !isTextNode(el) && !isCommentNode(el);

/**
 * Ensure to fetch the model from the input argument
 * @param  {HTMLElement|Component} el Component or HTML element
 * @return {Component}
 */
const getModel = (el, $) => {
  let model = el;
  isElement(el) && (model = $(el).data('model'));
  return model;
};

const getElRect = el => {
  const def = {
    top: 0,
    left: 0,
    width: 0,
    height: 0
  };
  if (!el) return def;
  let rectText;

  if (isTextNode(el)) {
    const range = document.createRange();
    range.selectNode(el);
    rectText = range.getBoundingClientRect();
    range.detach();
  }

  return (
    rectText || (el.getBoundingClientRect ? el.getBoundingClientRect() : def)
  );
};

/**
 * Get cross-device pointer event
 * @param  {Event} ev
 * @return {Event}
 */
const getPointerEvent = ev =>
  ev.touches && ev.touches[0] ? ev.touches[0] : ev;

/**
 * Get cross-browser keycode
 * @param  {Event} ev
 * @return {Number}
 */
const getKeyCode = ev => ev.which || ev.keyCode;
const getKeyChar = ev => String.fromCharCode(getKeyCode(ev));
const isEscKey = ev => getKeyCode(ev) === 27;

const capitalize = str => str.charAt(0).toUpperCase() + str.substring(1);

export {
  on,
  off,
  hasDnd,
  upFirst,
  matches,
  getModel,
  getElRect,
  camelCase,
  isTextNode,
  getKeyCode,
  getKeyChar,
  isEscKey,
  getElement,
  shallowDiff,
  normalizeFloat,
  getPointerEvent,
  getUnitFromValue,
  capitalize
};
