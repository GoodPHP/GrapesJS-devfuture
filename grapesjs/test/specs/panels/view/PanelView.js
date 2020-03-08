const PanelView = require('panels/view/PanelView');
const Panel = require('panels/model/Panel');

module.exports = {
  run() {
    describe('PanelView', () => {
      var fixtures;
      var model;
      var view;

      beforeEach(() => {
        model = new Panel();
        view = new PanelView({
          model
        });
        document.body.innerHTML = '<div id="fixtures"></div>';
        fixtures = document.body.querySelector('#fixtures');
        fixtures.appendChild(view.render().el);
      });

      afterEach(() => {
        view.remove();
      });

      test('Panel empty', () => {
        fixtures.firstChild.className = '';
        expect(fixtures.innerHTML).toEqual('<div class=""></div>');
      });

      test('Append content', () => {
        model.set('appendContent', 'test');
        model.set('appendContent', 'test2');
        expect(view.$el.html()).toEqual('testtest2');
      });

      test('Update content', () => {
        model.set('content', 'test');
        model.set('content', 'test2');
        expect(view.$el.html()).toEqual('test2');
      });

      test('Hide panel', () => {
        expect(view.$el.hasClass('hidden')).toBeFalsy();
        model.set('visible', false);
        expect(view.$el.hasClass('hidden')).toBeTruthy();
      });

      test('Show panel', () => {
        model.set('visible', false);
        expect(view.$el.hasClass('hidden')).toBeTruthy();
        model.set('visible', true);
        expect(view.$el.hasClass('hidden')).toBeFalsy();
      });

      describe('Init with options', () => {
        beforeEach(() => {
          model = new Panel({
            buttons: [{}]
          });
          view = new PanelView({
            model
          });
          document.body.innerHTML = '<div id="fixtures"></div>';
          fixtures = document.body.querySelector('#fixtures');
          fixtures.appendChild(view.render().el);
        });

        afterEach(() => {
          view.remove();
        });
      });
    });
  }
};
