import Backbone from 'backbone';
const StyleManager = require('style_manager');
const $ = Backbone.$;

module.exports = {
  run(em, sender) {
    this.sender = sender;
    if (!this.$cn) {
      var config = em.getConfig(),
        panels = em.Panels;
      // Main container
      this.$cn = $('<div></div>');
      // Secondary container
      this.$cn2 = $('<div></div>');
      this.$cn.append(this.$cn2);

      // Device Manager
      var dvm = em.DeviceManager;
      if (dvm && config.showDevices) {
        var devicePanel = panels.addPanel({ id: 'devices-c' });
        devicePanel
          .set('appendContent', dvm.render())
          .trigger('change:appendContent');
      }

      // Class Manager container
      var clm = em.SelectorManager;
      if (clm) this.$cn2.append(clm.render([]));

      this.$cn2.append(em.StyleManager.render());
      var smConfig = em.StyleManager.getConfig();
      const pfx = smConfig.stylePrefix;
      // Create header
      this.$header = $(
        `<div class="${pfx}header">${smConfig.textNoElement}</div>`
      );
      this.$cn.append(this.$header);

      // Create panel if not exists
      if (!panels.getPanel('views-container'))
        this.panel = panels.addPanel({ id: 'views-container' });
      else this.panel = panels.getPanel('views-container');

      // Add all containers to the panel
      this.panel.set('appendContent', this.$cn).trigger('change:appendContent');

      this.target = em.editor;
      this.listenTo(this.target, 'component:toggled', this.toggleSm);
    }
    this.toggleSm();
  },

  /**
   * Toggle Style Manager visibility
   * @private
   */
  toggleSm() {
    const { target, sender } = this;
    if (sender && sender.get && !sender.get('active')) return;

    if (target.getSelectedAll().length === 1) {
      this.$cn2.show();
      this.$header.hide();
    } else {
      this.$cn2.hide();
      this.$header.show();
    }
  },

  stop() {
    // Hide secondary container if exists
    if (this.$cn2) this.$cn2.hide();

    // Hide header container if exists
    if (this.$header) this.$header.hide();
  }
};
