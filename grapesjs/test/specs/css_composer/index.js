const Models = require('./model/CssModels');
const CssRuleView = require('./view/CssRuleView');
const CssRulesView = require('./view/CssRulesView');
const CssComposer = require('css_composer');
const e2e = require('./e2e/CssComposer');
const utils = require('./../test_utils.js');
const Editor = require('editor/model/Editor');

describe('Css Composer', () => {
  describe('Main', () => {
    var obj;
    var em;
    var config;
    var storagMock = utils.storageMock();
    var editorModel = {
      getCss() {
        return 'testCss';
      },
      getCacheLoad() {
        return storagMock.load();
      }
    };

    var setSmConfig = () => {
      config.stm = storagMock;
      config.stm.getConfig = () => ({
        storeCss: 1,
        storeStyles: 1
      });
    };
    var setEm = () => {
      config.em = editorModel;
    };

    beforeEach(() => {
      em = new Editor({});
      config = { em };
      obj = new CssComposer().init(config);
    });

    afterEach(() => {
      obj = null;
    });

    test('Object exists', () => {
      expect(CssComposer).toBeTruthy();
    });

    test('storageKey returns array', () => {
      expect(obj.storageKey() instanceof Array).toEqual(true);
    });

    test('storageKey returns correct composition', () => {
      setSmConfig();
      expect(obj.storageKey()).toEqual(['css', 'styles']);
    });

    test('Store data', () => {
      setSmConfig();
      setEm();
      var expected = { css: 'testCss', styles: '[]' };
      expect(obj.store(1)).toEqual(expected);
    });

    test('Rules are empty', () => {
      expect(obj.getAll().length).toEqual(0);
    });

    test('Create new rule with correct selectors', () => {
      var sel = new obj.Selectors();
      var s1 = sel.add({ name: 'test1' });
      var rule = obj.add(sel.models);
      expect(rule.get('selectors').at(0)).toEqual(s1);
    });

    test('Create new rule correctly', () => {
      var sel = new obj.Selectors();
      var s1 = sel.add({ name: 'test1' });
      var rule = obj.add(sel.models, 'state1', 'width1');
      expect(rule.get('state')).toEqual('state1');
      expect(rule.get('mediaText')).toEqual('width1');
    });

    test('Add rule to collection', () => {
      var sel = new obj.Selectors([{ name: 'test1' }]);
      var rule = obj.add(sel.models);
      expect(obj.getAll().length).toEqual(1);
      expect(
        obj
          .getAll()
          .at(0)
          .get('selectors')
          .at(0)
          .get('name')
      ).toEqual('test1');
    });

    test('Returns correct rule with the same selector', () => {
      var sel = new obj.Selectors([{ name: 'test1' }]);
      var rule1 = obj.add(sel.models);
      var rule2 = obj.get(sel.models);
      expect(rule1).toEqual(rule2);
    });

    test('Returns correct rule with the same selectors', () => {
      var sel1 = new obj.Selectors([{ name: 'test1' }]);
      var rule1 = obj.add(sel1.models);

      var sel2 = new obj.Selectors([{ name: 'test21' }, { name: 'test22' }]);
      var rule2 = obj.add(sel2.models);

      var rule3 = obj.get(sel2.models);
      expect(rule3).toEqual(rule2);
    });

    test('Do not create multiple rules with the same name selectors', () => {
      var sel1 = new obj.Selectors([{ name: 'test21' }, { name: 'test22' }]);
      var rule1 = obj.add(sel1.models);

      var sel2 = new obj.Selectors([{ name: 'test22' }, { name: 'test21' }]);
      var rule2 = obj.add(sel2.models);
      expect(rule2).toEqual(rule1);
    });

    test("Don't duplicate rules", () => {
      var sel = new obj.Selectors([]);
      var s1 = sel.add({ name: 'test1' });
      var s2 = sel.add({ name: 'test2' });
      var s3 = sel.add({ name: 'test3' });

      var rule1 = obj.add([s1, s3]);
      var rule2 = obj.add([s3, s1]);

      expect(rule2).toEqual(rule1);
    });

    test('Returns correct rule with the same mixed selectors', () => {
      var sel = new obj.Selectors([]);
      var s1 = sel.add({ name: 'test1' });
      var s2 = sel.add({ name: 'test2' });
      var s3 = sel.add({ name: 'test3' });
      var rule1 = obj.add([s1, s3]);
      var rule2 = obj.get([s3, s1]);
      expect(rule2).toEqual(rule1);
    });

    test('Returns correct rule with the same selectors and state', () => {
      var sel = new obj.Selectors([]);
      var s1 = sel.add({ name: 'test1' });
      var s2 = sel.add({ name: 'test2' });
      var s3 = sel.add({ name: 'test3' });
      var rule1 = obj.add([s1, s3], 'hover');
      var rule2 = obj.get([s3, s1], 'hover');
      expect(rule2).toEqual(rule1);
    });

    test('Returns correct rule with the same selectors, state and width', () => {
      var sel = new obj.Selectors([]);
      var s1 = sel.add({ name: 'test1' });
      var rule1 = obj.add([s1], 'hover', '1');
      var rule2 = obj.get([s1], 'hover', '1');
      expect(rule2).toEqual(rule1);
    });

    test('Renders correctly', () => {
      expect(obj.render()).toBeTruthy();
    });

    test('Create a rule with id selector by using setIdRule()', () => {
      const name = 'test';
      obj.setIdRule(name, { color: 'red' });
      expect(obj.getAll().length).toEqual(1);
      const rule = obj.getIdRule(name);
      expect(rule.selectorsToString()).toEqual(`#${name}`);
      expect(rule.styleToString()).toEqual(`color:red;`);
      expect(rule.styleToString({ important: 1 })).toEqual(
        `color:red !important;`
      );
      expect(rule.styleToString({ important: ['color'] })).toEqual(
        `color:red !important;`
      );
    });

    test('Create a rule with id selector and state by using setIdRule()', () => {
      const name = 'test';
      const state = 'hover';
      obj.setIdRule(name, { color: 'red' }, { state });
      expect(obj.getAll().length).toEqual(1);
      const rule = obj.getIdRule(name, { state });
      expect(rule.selectorsToString()).toEqual(`#${name}:${state}`);
    });

    test('Create a rule with class selector by using setClassRule()', () => {
      const name = 'test';
      obj.setClassRule(name, { color: 'red' });
      expect(obj.getAll().length).toEqual(1);
      const rule = obj.getClassRule(name);
      expect(rule.selectorsToString()).toEqual(`.${name}`);
      expect(rule.styleToString()).toEqual(`color:red;`);
    });

    test('Create a rule with class selector and state by using setClassRule()', () => {
      const name = 'test';
      const state = 'hover';
      obj.setClassRule(name, { color: 'red' }, { state });
      expect(obj.getAll().length).toEqual(1);
      const rule = obj.getClassRule(name, { state });
      expect(rule.selectorsToString()).toEqual(`.${name}:${state}`);
    });

    test('Create a simple class-based rule with setRule', () => {
      const selector = '.test';
      const result = obj.setRule(selector, { color: 'red' });
      expect(obj.getAll().length).toEqual(1);
      const rule = obj.getRule(selector);
      expect(rule.selectorsToString()).toEqual(selector);
      expect(rule.styleToString()).toEqual(`color:red;`);
    });

    test('Avoid creating multiple rules with the same selector', () => {
      const selector = '.test';
      obj.setRule(selector, { color: 'red' });
      obj.setRule(selector, { color: 'blue' });
      expect(obj.getAll().length).toEqual(1);
      const rule = obj.getRule(selector);
      expect(rule.selectorsToString()).toEqual(selector);
      expect(rule.styleToString()).toEqual(`color:blue;`);
    });

    test('Create a class-based rule with setRule', () => {
      const selector = '.test.test2';
      const result = obj.setRule(selector, { color: 'red' });
      expect(obj.getAll().length).toEqual(1);
      const rule = obj.getRule(selector);
      expect(rule.selectorsToString()).toEqual(selector);
      expect(rule.styleToString()).toEqual(`color:red;`);
    });

    test('Create a class-based rule with a state, by using setRule', () => {
      const selector = '.test.test2:hover';
      const result = obj.setRule(selector, { color: 'red' });
      expect(obj.getAll().length).toEqual(1);
      const rule = obj.getRule(selector);
      expect(rule.selectorsToString()).toEqual(selector);
      expect(rule.styleToString()).toEqual(`color:red;`);
    });

    test('Create a rule with class-based and mixed selectors', () => {
      const selector = '.test.test2:hover, #test .selector';
      obj.setRule(selector, { color: 'red' });
      expect(obj.getAll().length).toEqual(1);
      const rule = obj.getRule(selector);
      expect(rule.selectorsToString()).toEqual(selector);
      expect(rule.styleToString()).toEqual(`color:red;`);
    });

    test('Create a rule with only mixed selectors', () => {
      const selector = '#test1 .class1, .class2 > #id2';
      obj.setRule(selector, { color: 'red' });
      expect(obj.getAll().length).toEqual(1);
      const rule = obj.getRule(selector);
      expect(rule.get('selectors').length).toEqual(0);
      expect(rule.selectorsToString()).toEqual(selector);
      expect(rule.styleToString()).toEqual(`color:red;`);
    });

    test('Create a rule with atRule', () => {
      const toTest = [
        {
          selector: '.class1:hover',
          style: { color: 'blue' },
          opts: {
            atRuleType: 'media',
            atRuleParams: 'screen and (min-width: 480px)'
          }
        },
        {
          selector: '.class1:hover',
          style: { color: 'red' },
          opts: {
            atRuleType: 'media',
            atRuleParams: 'screen and (min-width: 480px)'
          }
        }
      ];
      toTest.forEach(test => {
        const { selector, style, opts } = test;
        const result = obj.setRule(selector, style, opts);
        expect(obj.getAll().length).toEqual(1);
        const rule = obj.getRule(selector, opts);
        expect(rule.getAtRule()).toEqual(
          `@${opts.atRuleType} ${opts.atRuleParams}`
        );
        expect(rule.selectorsToString()).toEqual(selector);
        expect(rule.getStyle()).toEqual(style);
      });
    });

    test('Create different rules by using setRule', () => {
      const toTest = [
        { selector: '.class1:hover', style: { color: '#111' } },
        { selector: '.class1.class2', style: { color: '#222' } },
        { selector: '.class1, .class2 .class3', style: { color: 'red' } },
        { selector: '.class1, .class2 .class4', style: { color: 'green' } },
        { selector: '.class4, .class1 .class2', style: { color: 'blue' } },
        {
          selector: '.class4, .class1 .class2',
          style: { color: 'blue' },
          opt: { atRuleType: 'media', atRuleParams: '(min-width: 480px)' }
        }
      ];
      toTest.forEach(test => {
        const { selector, style, opt = {} } = test;
        obj.setRule(selector, style, opt);
        const rule = obj.getRule(selector, opt);
        const atRule = `${opt.atRuleType || ''} ${opt.atRuleParams ||
          ''}`.trim();
        expect(rule.getAtRule()).toEqual(atRule ? `@${atRule}` : '');
        expect(rule.selectorsToString()).toEqual(selector);
        expect(rule.getStyle()).toEqual(style);
      });
      expect(obj.getAll().length).toEqual(toTest.length);
    });
  });

  Models.run();
  CssRuleView.run();
  CssRulesView.run();
  e2e.run();
});
