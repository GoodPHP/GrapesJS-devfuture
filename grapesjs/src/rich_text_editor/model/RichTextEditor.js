// The initial version of this RTE was borrowed from https://github.com/jaredreich/pell
// and adapted to the GrapesJS's need

import { on, off } from 'utils/mixins';

const RTE_KEY = '_rte';

const defActions = {
  bold: {
    name: 'bold',
    icon: '<b>B</b>',
    attributes: { title: 'Bold' },
    result: rte => rte.exec('bold')
  },
  italic: {
    name: 'italic',
    icon: '<i>I</i>',
    attributes: { title: 'Italic' },
    result: rte => rte.exec('italic')
  },
  underline: {
    name: 'underline',
    icon: '<u>U</u>',
    attributes: { title: 'Underline' },
    result: rte => rte.exec('underline')
  },
  strikethrough: {
    name: 'strikethrough',
    icon: '<strike>S</strike>',
    attributes: { title: 'Strike-through' },
    result: rte => rte.exec('strikeThrough')
  },
  link: {
    icon: `<span style="transform:rotate(45deg)">&supdsub;</span>`,
    name: 'link',
    attributes: {
      style: 'font-size:1.4rem;padding:0 4px 2px;',
      title: 'Link'
    },
    result: rte => {
      const anchor = rte.selection().anchorNode;
      const nextSibling = anchor && anchor.nextSibling;
      if (nextSibling && nextSibling.nodeName == 'A') {
        rte.exec('unlink');
      } else {
        rte.insertHTML(`<a class="link" href="">${rte.selection()}</a>`);
      }
    }
  }
};

export default class RichTextEditor {
  constructor(settings = {}) {
    const el = settings.el;

    if (el[RTE_KEY]) {
      return el[RTE_KEY];
    }

    el[RTE_KEY] = this;
    this.setEl(el);
    this.updateActiveActions = this.updateActiveActions.bind(this);

    const settAct = settings.actions || [];
    settAct.forEach((action, i) => {
      if (typeof action === 'string') {
        action = defActions[action];
      } else if (defActions[action.name]) {
        action = { ...defActions[action.name], ...action };
      }
      settAct[i] = action;
    });
    const actions = settAct.length
      ? settAct
      : Object.keys(defActions).map(action => defActions[action]);

    settings.classes = {
      ...{
        actionbar: 'actionbar',
        button: 'action',
        active: 'active'
      },
      ...settings.classes
    };

    const classes = settings.classes;
    let actionbar = settings.actionbar;
    this.actionbar = actionbar;
    this.settings = settings;
    this.classes = classes;
    this.actions = actions;

    if (!actionbar) {
      const actionbarCont = settings.actionbarContainer;
      actionbar = document.createElement('div');
      actionbar.className = classes.actionbar;
      actionbarCont.appendChild(actionbar);
      this.actionbar = actionbar;
      actions.forEach(action => this.addAction(action));
    }

    settings.styleWithCSS && this.exec('styleWithCSS');
    this.syncActions();

    return this;
  }

  setEl(el) {
    this.el = el;
    this.doc = el.ownerDocument;
  }

  updateActiveActions() {
    this.getActions().forEach(action => {
      const btn = action.btn;
      const update = action.update;
      const active = this.classes.active;
      const name = action.name;
      const doc = this.doc;
      btn.className = btn.className.replace(active, '').trim();

      // doc.queryCommandValue(name) != 'false'
      if (doc.queryCommandSupported(name) && doc.queryCommandState(name)) {
        btn.className += ` ${active}`;
      }

      update && update(this, action);
    });
  }

  enable() {
    if (this.enabled) {
      return this;
    }

    this.actionbarEl().style.display = '';
    this.el.contentEditable = true;
    on(this.el, 'mouseup keyup', this.updateActiveActions);
    this.syncActions();
    this.updateActiveActions();
    this.el.focus();
    this.enabled = 1;
    return this;
  }

  disable() {
    this.actionbarEl().style.display = 'none';
    this.el.contentEditable = false;
    off(this.el, 'mouseup keyup', this.updateActiveActions);
    this.enabled = 0;
    return this;
  }

  /**
   * Sync actions with the current RTE
   */
  syncActions() {
    this.getActions().forEach(action => {
      const event = action.event || 'click';
      action.btn[`on${event}`] = e => {
        action.result(this, action);
        this.updateActiveActions();
      };
    });
  }

  /**
   * Add new action to the actionbar
   * @param {Object} action
   * @param {Object} [opts={}]
   */
  addAction(action, opts = {}) {
    const sync = opts.sync;
    const btn = document.createElement('span');
    const icon = action.icon;
    const attr = action.attributes || {};
    btn.className = this.classes.button;
    action.btn = btn;

    for (let key in attr) {
      btn.setAttribute(key, attr[key]);
    }

    if (typeof icon == 'string') {
      btn.innerHTML = icon;
    } else {
      btn.appendChild(icon);
    }

    this.actionbarEl().appendChild(btn);

    if (sync) {
      this.actions.push(action);
      this.syncActions();
    }
  }

  /**
   * Get the array of current actions
   * @return {Array}
   */
  getActions() {
    return this.actions;
  }

  /**
   * Returns the Selection instance
   * @return {Selection}
   */
  selection() {
    return this.doc.getSelection();
  }

  /**
   * Execute the command
   * @param  {string} command Command name
   * @param  {any} [value=null Command's arguments
   */
  exec(command, value = null) {
    this.doc.execCommand(command, false, value);
  }

  /**
   * Get the actionbar element
   * @return {HTMLElement}
   */
  actionbarEl() {
    return this.actionbar;
  }

  /**
   * Set custom HTML to the selection, useful as the default 'insertHTML' command
   * doesn't work in the same way on all browsers
   * @param  {string} value HTML string
   */
  insertHTML(value) {
    let lastNode;
    const doc = this.doc;
    const sel = doc.getSelection();

    if (sel && sel.rangeCount) {
      const node = doc.createElement('div');
      const range = sel.getRangeAt(0);
      range.deleteContents();
      node.innerHTML = value;
      Array.prototype.slice.call(node.childNodes).forEach(nd => {
        range.insertNode(nd);
        lastNode = nd;
      });

      sel.removeAllRanges();
      sel.addRange(range);
      this.el.focus();
    }
  }
}
