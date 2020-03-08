/**
 * You can customize the initial state of the module from the editor initialization, by passing the following [Configuration Object](https://github.com/artf/grapesjs/blob/master/src/device_manager/config/config.js)
 * ```js
 * const editor = grapesjs.init({
 *  deviceManager: {
 *    // options
 *  }
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API. Before using these methods you should get the module from the instance
 *
 * ```js
 * const deviceManager = editor.DeviceManager;
 * ```
 *
 * * [add](#add)
 * * [get](#get)
 * * [getAll](#getAll)
 *
 * @module DeviceManager
 */

module.exports = () => {
  var c = {},
    defaults = require('./config/config'),
    Devices = require('./model/Devices'),
    DevicesView = require('./view/DevicesView');
  var devices, view;

  return {
    /**
     * Name of the module
     * @type {String}
     * @private
     */
    name: 'DeviceManager',

    /**
     * Initialize module. Automatically called with a new instance of the editor
     * @param {Object} config Configurations
     * @param {Array<Object>} [config.devices=[]] Default devices
     * @example
     * ...
     * {
     *    devices: [
     *      {name: 'Desktop', width: ''}
     *      {name: 'Tablet', width: '991px'}
     *    ],
     * }
     * ...
     * @return {this}
     * @private
     */
    init(config) {
      c = config || {};
      for (var name in defaults) {
        if (!(name in c)) c[name] = defaults[name];
      }

      devices = new Devices(c.devices);
      view = new DevicesView({
        collection: devices,
        config: c
      });
      return this;
    },

    /**
     * Add new device to the collection. URLs are supposed to be unique
     * @param {string} name Device name
     * @param {string} width Width of the device
     * @param {Object} opts Custom options
     * @return {Device} Added device
     * @example
     * deviceManager.add('Tablet', '900px');
     * deviceManager.add('Tablet2', '900px', {
     *  height: '300px',
     *  widthMedia: '810px', // the width that will be used for the CSS media
     * });
     */
    add(name, width, opts) {
      var obj = opts || {};
      obj.name = name;
      obj.width = width;
      return devices.add(obj);
    },

    /**
     * Return device by name
     * @param  {string} name Name of the device
     * @example
     * var device = deviceManager.get('Tablet');
     * console.log(JSON.stringify(device));
     * // {name: 'Tablet', width: '900px'}
     */
    get(name) {
      return devices.get(name);
    },

    /**
     * Return all devices
     * @return {Collection}
     * @example
     * var devices = deviceManager.getAll();
     * console.log(JSON.stringify(devices));
     * // [{name: 'Desktop', width: ''}, ...]
     */
    getAll() {
      return devices;
    },

    /**
     * Render devices
     * @return {string} HTML string
     * @private
     */
    render() {
      return view.render().el;
    }
  };
};
