# GrapesJS Countdown

Simple countdown component for GrapesJS Editor

<p align="center"><img src="https://artf.github.io/grapesjs/img/countdown.gif" alt="GrapesJS" align="center"/></p>
<br/>

# [Demo](http://grapesjs.com/demo.html)





## Summary

* Plugin name: `gjs-component-countdown`
* Components: `countdown`
* Blocks: `countdown`





## Options

* `blocks` Which blocks to add, default: `['countdown']` (all)
* `defaultStyle` Add default style to blocks, default: true
* `startTime` Default start time, eg. '2018-01-25 00:00', default: ''
* `endText` Text to show when the countdown is ended, default: 'EXPIRED'
* `dateInputType` Date input type, eg, 'date', 'datetime-local', default: 'date'
* `countdownClsPfx` Countdown class prefix, default: 'countdown'
* `labelCountdown` Countdown label, default 'Countdown'
* `labelCountdownCategory` Countdown category label, default 'Extra'
* `labelDays` Days label text used in component, default 'days'
* `labelHours` Hours label text used in component, default 'hours'
* `labelMinutes` Minutes label text used in component, default 'minutes'
* `labelSeconds` Seconds label text used in component, default 'seconds'





## Download

* `npm i grapesjs-component-countdown` or `yarn add grapesjs-component-countdown`





## Usage

```html
<link href="path/to/grapes.min.css" rel="stylesheet"/>
<script src="path/to/grapes.min.js"></script>
<script src="path/to/grapesjs-component-countdown.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container : '#gjs',
      plugins: ['gjs-component-countdown'],
      pluginsOpts: {
        'gjs-component-countdown': {/* ...options */}
      }
  });
</script>
```





## Development

Clone the repository

```sh
$ git clone https://github.com/artf/grapesjs-component-countdown.git
$ cd grapesjs-component-countdown
```

Install it

```sh
$ npm i
```

Start the dev server

```sh
$ npm start
```

Build before the commit. This will also increase the patch level version of the package

```sh
$ npm run build
```





## License

BSD 3-Clause
