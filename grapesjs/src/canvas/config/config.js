module.exports = {
  stylePrefix: 'cv-',

  /*
   * Append external scripts to the `<head>` of the iframe.
   * Be aware that these scripts will not be printed in the export code
   * @example
   * scripts: [ 'https://...1.js', 'https://...2.js' ]
   */
  scripts: [],

  /*
   * Append external styles to the `<head>` of the iframe
   * Be aware that these styles will not be printed in the export code
   * @example
   * styles: [ 'https://...1.css', 'https://...2.css' ]
   */
  styles: [],

  /**
   * Add custom badge naming strategy
   * @example
   * customBadgeLabel: function(component) {
   *  return component.getName();
   * }
   */
  customBadgeLabel: '',

  /**
   * Indicate when to start the auto scroll of the canvas on component/block dragging (value in px )
   */
  autoscrollLimit: 50,

  /**
   * When some textable component is selected and focused (eg. input or text component) the editor
   * stops some commands (eg. disables the copy/paste of components with CTRL+C/V to allow the copy/paste of the text).
   * This option allows to customize, by a selector, which element should not be considered textable
   */
  notTextable: ['button', 'a', 'input[type=checkbox]', 'input[type=radio]']
};
