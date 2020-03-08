/**
 * Editor contains the top level API which you'll probably use to customize the editor or extend it with plugins.
 * You get the Editor instance on init method and you can pass options via its [Configuration Object](https://github.com/artf/grapesjs/blob/master/src/editor/config/config.js)
 *
 * ```js
 * const editor = grapesjs.init({
 *    // options
 * });
 * ```
 *
 * ## Available Events
 *
 * You can make use of available events in this way
 * ```js
 * editor.on('EVENT-NAME', (some, argument) => {
 *    // do something
 * })
 * ```
 *
 * ### Components
 * * `component:create` - Component is created (only the model, is not yet mounted in the canvas), called after the init() method
 * * `component:mount` - Component is mounted to an element and rendered in canvas
 * * `component:add` - Triggered when a new component is added to the editor, the model is passed as an argument to the callback
 * * `component:remove` - Triggered when a component is removed, the model is passed as an argument to the callback
 * * `component:clone` - Triggered when a component is cloned, the new model is passed as an argument to the callback
 * * `component:update` - Triggered when a component is updated (moved, styled, etc.), the model is passed as an argument to the callback
 * * `component:update:{propertyName}` - Listen any property change, the model is passed as an argument to the callback
 * * `component:styleUpdate` - Triggered when the style of the component is updated, the model is passed as an argument to the callback
 * * `component:styleUpdate:{propertyName}` - Listen for a specific style property change, the model is passed as an argument to the callback
 * * `component:selected` - New component selected, the selected model is passed as an argument to the callback
 * * `component:deselected` - Component deselected, the deselected model is passed as an argument to the callback
 * * `component:toggled` - Component selection changed, toggled model is passed as an argument to the callback
 * * `component:type:add` - New component type added, the new type is passed as an argument to the callback
 * * `component:type:update` - Component type updated, the updated type is passed as an argument to the callback
 * ### Blocks
 * * `block:add` - New block added
 * * `block:remove` - Block removed
 * * `block:drag:start` - Started dragging block, model of the block is passed as an argument
 * * `block:drag` - Dragging block, the block's model and the drag event are passed as arguments
 * * `block:drag:stop` - Dragging of the block is stopped. As agruments for the callback you get, the dropped component model (if dropped successfully) and the model of the block
 * ### Assets
 * * `asset:add` - New asset added
 * * `asset:remove` - Asset removed
 * * `asset:upload:start` - Before the upload is started
 * * `asset:upload:end` - After the upload is ended
 * * `asset:upload:error` - On any error in upload, passes the error as an argument
 * * `asset:upload:response` - On upload response, passes the result as an argument
 * ### Keymaps
 * * `keymap:add` - New keymap added. The new keyamp object is passed as an argument
 * * `keymap:remove` - Keymap removed. The removed keyamp object is passed as an argument
 * * `keymap:emit` - Some keymap emitted, in arguments you get keymapId, shortcutUsed, Event
 * * `keymap:emit:{keymapId}` - `keymapId` emitted, in arguments you get keymapId, shortcutUsed, Event
 * ### Style Manager
 * * `styleManager:update:target` - The target (Component or CSSRule) is changed
 * * `styleManager:change` - Triggered on style property change from new selected component, the view of the property is passed as an argument to the callback
 * * `styleManager:change:{propertyName}` - As above but for a specific style property
 * ### Storages
 * * `storage:start` - Before the storage request is started
 * * `storage:start:store` - Before the store request. The object to store is passed as an argumnet (which you can edit)
 * * `storage:start:load` - Before the load request. Items to load are passed as an argumnet (which you can edit)
 * * `storage:load` - Triggered when something was loaded from the storage, loaded object passed as an argumnet
 * * `storage:store` - Triggered when something is stored to the storage, stored object passed as an argumnet
 * * `storage:end` - After the storage request is ended
 * * `storage:end:store` - After the store request
 * * `storage:end:load` - After the load request
 * * `storage:error` - On any error on storage request, passes the error as an argument
 * * `storage:error:store` - Error on store request, passes the error as an argument
 * * `storage:error:load` - Error on load request, passes the error as an argument
 * ### Canvas
 * * `canvas:dragenter` - When something is dragged inside the canvas, `DataTransfer` instance passed as an argument
 * * `canvas:dragover` - When something is dragging on canvas, `DataTransfer` instance passed as an argument
 * * `canvas:drop` - Something is dropped in canvas, `DataTransfer` instance and the dropped model are passed as arguments
 * * `canvas:dragend` - When a drag operation is ended, `DataTransfer` instance passed as an argument
 * * `canvas:dragdata` - On any dataTransfer parse, `DataTransfer` instance and the `result` are passed as arguments.
 *  By changing `result.content` you're able to customize what is dropped
 * ### Selectors
 * * `selector:add` - Triggers when a new selector/class is created
 * ### RTE
 * * `rte:enable` - RTE enabled. The view, on which RTE is enabled, is passed as an argument
 * * `rte:disable` - RTE disabled. The view, on which RTE is disabled, is passed as an argument
 * ### Modal
 * * `modal:open` - Modal is opened
 * * `modal:close` - Modal is closed
 * ### Commands
 * * `run:{commandName}` - Triggered when some command is called to run (eg. editor.runCommand('preview'))
 * * `stop:{commandName}` - Triggered when some command is called to stop (eg. editor.stopCommand('preview'))
 * * `run:{commandName}:before` - Triggered before the command is called
 * * `stop:{commandName}:before` - Triggered before the command is called to stop
 * * `abort:{commandName}` - Triggered when the command execution is aborted (`editor.on(`run:preview:before`, opts => opts.abort = 1);`)
 * * `run` - Triggered on run of any command. The id and the result are passed as arguments to the callback
 * * `stop` - Triggered on stop of any command. The id and the result are passed as arguments to the callback
 * ### General
 * * `canvasScroll` - Canvas is scrolled
 * * `update` - The structure of the template is updated (its HTML/CSS)
 * * `undo` - Undo executed
 * * `redo` - Redo executed
 * * `load` - Editor is loaded
 *
 * @module Editor
 */
import $ from 'cash-dom';

export default (config = {}) => {
  const defaults = require('./config/config');
  const EditorModel = require('./model/Editor');
  const EditorView = require('./view/EditorView');
  const c = {
    ...defaults,
    ...config
  };

  c.pStylePrefix = c.stylePrefix;
  var em = new EditorModel(c);
  var editorView = new EditorView({
    model: em,
    config: c
  });

  return {
    $,

    /**
     * @property {EditorModel}
     * @private
     */
    editor: em,

    /**
     * @property {DomComponents}
     * @private
     */
    DomComponents: em.get('DomComponents'),

    /**
     * @property {LayerManager}
     * @private
     */
    LayerManager: em.get('LayerManager'),

    /**
     * @property {CssComposer}
     * @private
     */
    CssComposer: em.get('CssComposer'),

    /**
     * @property {StorageManager}
     * @private
     */
    StorageManager: em.get('StorageManager'),

    /**
     * @property {AssetManager}
     * @private
     */
    AssetManager: em.get('AssetManager'),

    /**
     * @property {BlockManager}
     * @private
     */
    BlockManager: em.get('BlockManager'),

    /**
     * @property {TraitManager}
     * @private
     */
    TraitManager: em.get('TraitManager'),

    /**
     * @property {SelectorManager}
     * @private
     */
    SelectorManager: em.get('SelectorManager'),

    /**
     * @property {CodeManager}
     * @private
     */
    CodeManager: em.get('CodeManager'),

    /**
     * @property {Commands}
     * @private
     */
    Commands: em.get('Commands'),

    /**
     * @property {Keymaps}
     * @private
     */
    Keymaps: em.get('Keymaps'),

    /**
     * @property {Modal}
     * @private
     */
    Modal: em.get('Modal'),

    /**
     * @property {Panels}
     * @private
     */
    Panels: em.get('Panels'),

    /**
     * @property {StyleManager}
     * @private
     */
    StyleManager: em.get('StyleManager'),

    /**
     * @property {Canvas}
     * @private
     */
    Canvas: em.get('Canvas'),

    /**
     * @property {UndoManager}
     * @private
     */
    UndoManager: em.get('UndoManager'),

    /**
     * @property {DeviceManager}
     * @private
     */
    DeviceManager: em.get('DeviceManager'),

    /**
     * @property {RichTextEditor}
     * @private
     */
    RichTextEditor: em.get('RichTextEditor'),

    /**
     * @property {Parser}
     * @private
     */
    Parser: em.get('Parser'),

    /**
     * @property {Utils}
     * @private
     */
    Utils: em.get('Utils'),

    /**
     * @property {Utils}
     * @private
     */
    Config: em.get('Config'),

    /**
     * Initialize editor model
     * @return {this}
     * @private
     */
    init() {
      em.init(this);
      return this;
    },

    /**
     * Returns configuration object
     * @param  {string} [prop] Property name
     * @return {any} Returns the configuration object or
     *  the value of the specified property
     */
    getConfig(prop) {
      return em.getConfig(prop);
    },

    /**
     * Returns HTML built inside canvas
     * @return {string} HTML string
     */
    getHtml(opts) {
      return em.getHtml(opts);
    },

    /**
     * Returns CSS built inside canvas
     * @param {Object} [opts={}] Options
     * @return {string} CSS string
     */
    getCss(opts) {
      return em.getCss(opts);
    },

    /**
     * Returns JS of all components
     * @return {string} JS string
     */
    getJs() {
      return em.getJs();
    },

    /**
     * Return the complete tree of components. Use `getWrapper` to include also the wrapper
     * @return {Components}
     */
    getComponents() {
      return em.get('DomComponents').getComponents();
    },

    /**
     * Return the wrapper and its all components
     * @return {Component}
     */
    getWrapper() {
      return em.get('DomComponents').getWrapper();
    },

    /**
     * Set components inside editor's canvas. This method overrides actual components
     * @param {Array<Object>|Object|string} components HTML string or components model
     * @return {this}
     * @example
     * editor.setComponents('<div class="cls">New component</div>');
     * // or
     * editor.setComponents({
     *  type: 'text',
     *   classes:['cls'],
     *   content: 'New component'
     * });
     */
    setComponents(components) {
      em.setComponents(components);
      return this;
    },

    /**
     * Add components
     * @param {Array<Object>|Object|string} components HTML string or components model
     * @param {Object} opts Options
     * @param {Boolean} [opts.avoidUpdateStyle=false] If the HTML string contains styles,
     * by default, they will be created and, if already exist, updated. When this option
     * is true, styles already created will not be updated.
     * @return {Model|Array<Model>}
     * @example
     * editor.addComponents('<div class="cls">New component</div>');
     * // or
     * editor.addComponents({
     *  type: 'text',
     *   classes:['cls'],
     *   content: 'New component'
     * });
     */
    addComponents(components, opts) {
      return this.getComponents().add(components, opts);
    },

    /**
     * Returns style in JSON format object
     * @return {Object}
     */
    getStyle() {
      return em.get('CssComposer').getAll();
    },

    /**
     * Set style inside editor's canvas. This method overrides actual style
     * @param {Array<Object>|Object|string} style CSS string or style model
     * @return {this}
     * @example
     * editor.setStyle('.cls{color: red}');
     * //or
     * editor.setStyle({
     *   selectors: ['cls']
     *   style: { color: 'red' }
     * });
     */
    setStyle(style) {
      em.setStyle(style);
      return this;
    },

    /**
     * Returns the last selected component, if there is one
     * @return {Model}
     */
    getSelected() {
      return em.getSelected();
    },

    /**
     * Returns an array of all selected components
     * @return {Array}
     */
    getSelectedAll() {
      return em.getSelectedAll();
    },

    /**
     * Get a stylable entity from the selected component.
     * If you select a component without classes the entity is the Component
     * itself and all changes will go inside its 'style' attribute. Otherwise,
     * if the selected component has one or more classes, the function will
     * return the corresponding CSS Rule
     * @return {Model}
     */
    getSelectedToStyle() {
      let selected = em.getSelected();

      if (selected) {
        return this.StyleManager.getModelToStyle(selected);
      }
    },

    /**
     * Select a component
     * @param  {Component|HTMLElement} el Component to select
     * @param  {Object} [opts] Options
     * @param  {Boolean} [opts.scroll] Scroll canvas to the selected element
     * @return {this}
     * @example
     * // Select dropped block
     * editor.on('block:drag:stop', function(model) {
     *  editor.select(model);
     * });
     */
    select(el, opts) {
      em.setSelected(el, opts);
      return this;
    },

    /**
     * Add component to selection
     * @param  {Component|HTMLElement|Array} el Component to select
     * @return {this}
     * @example
     * editor.selectAdd(model);
     */
    selectAdd(el) {
      em.addSelected(el);
      return this;
    },

    /**
     * Remove component from selection
     * @param  {Component|HTMLElement|Array} el Component to select
     * @return {this}
     * @example
     * editor.selectRemove(model);
     */
    selectRemove(el) {
      em.removeSelected(el);
      return this;
    },

    /**
     * Toggle component selection
     * @param  {Component|HTMLElement|Array} el Component to select
     * @return {this}
     * @example
     * editor.selectToggle(model);
     */
    selectToggle(el) {
      em.toggleSelected(el);
      return this;
    },

    /**
     * Set device to the editor. If the device exists it will
     * change the canvas to the proper width
     * @param {string} name Name of the device
     * @return {this}
     * @example
     * editor.setDevice('Tablet');
     */
    setDevice(name) {
      em.set('device', name);
      return this;
    },

    /**
     * Return the actual active device
     * @return {string} Device name
     * @example
     * var device = editor.getDevice();
     * console.log(device);
     * // 'Tablet'
     */
    getDevice() {
      return em.get('device');
    },

    /**
     * Execute command
     * @param {string} id Command ID
     * @param {Object} options Custom options
     * @return {*} The return is defined by the command
     * @example
     * editor.runCommand('myCommand', {someValue: 1});
     */
    runCommand(id, options = {}) {
      return em.get('Commands').run(id, options);
    },

    /**
     * Stop the command if stop method was provided
     * @param {string} id Command ID
     * @param {Object} options Custom options
     * @return {*} The return is defined by the command
     * @example
     * editor.stopCommand('myCommand', {someValue: 1});
     */
    stopCommand(id, options = {}) {
      return em.get('Commands').stop(id, options);
    },

    /**
     * Store data to the current storage
     * @param {Function} clb Callback function
     * @return {Object} Stored data
     */
    store(clb) {
      return em.store(clb);
    },

    /**
     * Load data from the current storage
     * @param {Function} clb Callback function
     * @return {Object} Stored data
     */
    load(clb) {
      return em.load(clb);
    },

    /**
     * Returns container element. The one which was indicated as 'container'
     * on init method
     * @return {HTMLElement}
     */
    getContainer() {
      return c.el;
    },

    /**
     * Return the count of changes made to the content and not yet stored.
     * This count resets at any `store()`
     * @return {number}
     */
    getDirtyCount() {
      return em.getDirtyCount();
    },

    /**
     * Update editor dimensions and refresh data useful for positioning of tools
     *
     * This method could be useful when you update, for example, some position
     * of the editor element (eg. canvas, panels, etc.) with CSS, where without
     * refresh you'll get misleading position of tools (eg. rich text editor,
     * component highlighter, etc.)
     *
     * @private
     */
    refresh() {
      em.refreshCanvas();
    },

    /**
     * Replace the built-in Rich Text Editor with a custom one.
     * @param {Object} obj Custom RTE Interface
     * @example
     * editor.setCustomRte({
     *   // Function for enabling custom RTE
     *   // el is the HTMLElement of the double clicked Text Component
     *   // rte is the same instance you have returned the first time you call
     *   // enable(). This is useful if need to check if the RTE is already enabled so
     *   // ion this case you'll need to return the RTE and the end of the function
     *   enable: function(el, rte) {
     *     rte = new MyCustomRte(el, {}); // this depends on the Custom RTE API
     *     ...
     *     return rte; // return the RTE instance
     *   },
     *
     *   // Disable the editor, called for example when you unfocus the Text Component
     *  disable: function(el, rte) {
     *     rte.blur(); // this depends on the Custom RTE API
     *  }
     *
     * // Called when the Text Component is focused again. If you returned the RTE instance
     * // from the enable function, the enable won't be called again instead will call focus,
     * // in this case to avoid double binding of the editor
     *  focus: function (el, rte) {
     *   rte.focus(); // this depends on the Custom RTE API
     *  }
     * });
     */
    setCustomRte(obj) {
      this.RichTextEditor.customRte = obj;
    },

    /**
     * Replace the default CSS parser with a custom one.
     * The parser function receives a CSS string as a parameter and expects
     * an array of CSSRule objects as a result. If you need to remove the
     * custom parser, pass `null` as the argument
     * @param {Function|null} parser Parser function
     * @return {this}
     * @example
     * editor.setCustomParserCss(css => {
     *  const result = [];
     *  // ... parse the CSS string
     *  result.push({
     *    selectors: '.someclass, div .otherclass',
     *    style: { color: 'red' }
     *  })
     *  // ...
     *  return result;
     * });
     */
    setCustomParserCss(parser) {
      this.Parser.getConfig().parserCss = parser;
      return this;
    },

    /**
     * Trigger event log message
     * @param  {*} msg Message to log
     * @param  {Object} [opts={}] Custom options
     * @param  {String} [opts.ns=''] Namespace of the log (eg. to use in plugins)
     * @param  {String} [opts.level='debug'] Level of the log, `debug`, `info`, `warning`, `error`
     * @return {this}
     * @example
     * editor.log('Something done!', { ns: 'from-plugin-x', level: 'info' });
     * // This will trigger following events
     * // `log`, `log:info`, `log-from-plugin-x`, `log-from-plugin-x:info`
     * // Callbacks of those events will always receive the message and
     * // options, as arguments, eg:
     * // editor.on('log:info', (msg, opts) => console.info(msg, opts))
     */
    log(msg, opts = {}) {
      em.log(msg, opts);
      return this;
    },

    /**
     * Attach event
     * @param  {string} event Event name
     * @param  {Function} callback Callback function
     * @return {this}
     */
    on(event, callback) {
      em.on(event, callback);
      return this;
    },

    /**
     * Attach event and detach it after the first run
     * @param  {string} event Event name
     * @param  {Function} callback Callback function
     * @return {this}
     */
    once(event, callback) {
      em.once(event, callback);
      return this;
    },

    /**
     * Detach event
     * @param  {string} event Event name
     * @param  {Function} callback Callback function
     * @return {this}
     */
    off(event, callback) {
      em.off(event, callback);
      return this;
    },

    /**
     * Trigger event
     * @param  {string} event Event to trigger
     * @return {this}
     */
    trigger(event) {
      em.trigger.apply(em, arguments);
      return this;
    },

    /**
     * Destroy the editor
     */
    destroy() {
      return em.destroyAll();
    },

    /**
     * Returns editor element
     * @return {HTMLElement}
     * @private
     */
    getEl() {
      return editorView.el;
    },

    /**
     * Returns editor model
     * @return {Model}
     * @private
     */
    getModel() {
      return em;
    },

    /**
     * Render editor
     * @return {HTMLElement}
     */
    render() {
      // Do post render stuff after the iframe is loaded otherwise it'll
      // be empty during tests
      em.on('loaded', () => {
        this.UndoManager.clear();
        em.get('modules').forEach(module => {
          module.postRender && module.postRender(editorView);
        });
      });

      editorView.render();
      return editorView.el;
    }
  };
};
