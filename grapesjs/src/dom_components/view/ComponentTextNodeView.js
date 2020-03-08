module.exports = require('backbone').View.extend({
  initialize() {
    const { $el, model } = this;
    $el.data('model', model);
    model.view = this;
  },
  _createElement() {
    return document.createTextNode(this.model.get('content'));
  }
});
