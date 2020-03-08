module.exports = {
  run(editor, sender, opts = {}) {
    const modal = editor.Modal;
    const am = editor.AssetManager;
    const config = am.getConfig();
    const amContainer = am.getContainer();
    const title = opts.modalTitle || config.modalTitle || '';
    const types = opts.types;
    const accept = opts.accept;

    am.setTarget(opts.target);
    am.onClick(opts.onClick);
    am.onDblClick(opts.onDblClick);
    am.onSelect(opts.onSelect);

    if (!this.rendered || types) {
      let assets = am.getAll().filter(i => 1);

      if (types && types.length) {
        assets = assets.filter(a => types.indexOf(a.get('type')) !== -1);
      }

      am.render(assets);
      this.rendered = 1;
    }

    if (accept) {
      const uploadEl = amContainer.querySelector(
        `input#${config.stylePrefix}uploadFile`
      );
      uploadEl && uploadEl.setAttribute('accept', accept);
    }

    modal
      .open({
        title,
        content: amContainer
      })
      .getModel()
      .once('change:open', () => editor.stopCommand(this.id));
    return this;
  },

  stop(editor) {
    editor.Modal.close();
    return this;
  }
};
