import Backbone from 'backbone';
const Layers = require('navigator');
const $ = Backbone.$;

module.exports = {
  run(editor) {
    const lm = editor.LayerManager;
    const pn = editor.Panels;

    if (!this.layers) {
      const id = 'views-container';
      const layers = document.createElement('div');
      const panels = pn.getPanel(id) || pn.addPanel({ id });
      layers.appendChild(lm.render());
      panels.set('appendContent', layers).trigger('change:appendContent');
      this.layers = layers;
    }

    this.layers.style.display = 'block';
  },

  stop() {
    const layers = this.layers;
    layers && (layers.style.display = 'none');
  }
};
