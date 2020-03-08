const SectorsView = require('style_manager/view/SectorsView');
const Sectors = require('style_manager/model/Sectors');

module.exports = {
  run() {
    describe('SectorsView', () => {
      var fixtures;
      var model;
      var view;

      beforeEach(() => {
        model = new Sectors([]);
        view = new SectorsView({
          collection: model
        });
        document.body.innerHTML = '<div id="fixtures"></div>';
        fixtures = document.body.firstChild;
        fixtures.appendChild(view.render().el);
      });

      afterEach(() => {
        view.collection.reset();
      });

      test('Collection is empty', () => {
        expect(view.el.innerHTML).toEqual('');
      });

      test('Add new sectors', () => {
        view.collection.add([{}, {}]);
        expect(view.el.children.length).toEqual(2);
      });
    });
  }
};
