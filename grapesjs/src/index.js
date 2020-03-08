import $ from 'cash-dom';
import Editor from './editor';
import { isElement, isFunction } from 'underscore';
import polyfills from 'utils/polyfills';
import PluginManager from './plugin_manager';

polyfills();

module.exports = (() => {
  const plugins = new PluginManager();
  const editors = [];
  const defaultConfig = {
    // If true renders editor on init
    autorender: 1,

    // Array of plugins to init
    plugins: [],

    // Custom options for plugins
    pluginsOpts: {}
  };

  return {
    $,

    editors,

    plugins,

    // Will be replaced on build
    version: '<# VERSION #>',

    /**
     * Initialize the editor with passed options
     * @param {Object} config Configuration object
     * @param {string|HTMLElement} config.container Selector which indicates where render the editor
     * @param {Boolean} [config.autorender=true] If true, auto-render the content
     * @param {Array} [config.plugins=[]] Array of plugins to execute on start
     * @param {Object} [config.pluginsOpts={}] Custom options for plugins
     * @return {Editor} Editor instance
     * @example
     * var editor = grapesjs.init({
     *   container: '#myeditor',
     *   components: '<article class="hello">Hello world</article>',
     *   style: '.hello{color: red}',
     * })
     */
    init(config = {}) {
      const els = config.container;
      if (!els) throw new Error("'container' is required");
      config = { ...defaultConfig, ...config };
      config.el = isElement(els) ? els : document.querySelector(els);
      const editor = new Editor(config).init();

      // Load plugins
      config.plugins.forEach(pluginId => {
        let plugin = plugins.get(pluginId);
        const plgOptions = config.pluginsOpts[pluginId] || {};

        // Try to search in global context
        if (!plugin) {
          const wplg = window[pluginId];
          plugin = wplg && wplg.default ? wplg.default : wplg;
        }

        if (plugin) {
          plugin(editor, plgOptions);
        } else if (isFunction(pluginId)) {
          pluginId(editor, plgOptions);
        } else {
          console.warn(`Plugin ${pluginId} not found`);
        }
      });

      // Execute `onLoad` on modules once all plugins are initialized.
      // A plugin might have extended/added some custom type so this
      // is a good point to load stuff like components, css rules, etc.
      editor.getModel().loadOnStart();
      config.autorender && editor.render();
      editors.push(editor);

      return editor;
    }
  };
})();
