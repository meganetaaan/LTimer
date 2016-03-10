const jQuery = require('jquery');
//const h5 = require('../lib/hifive/h5.dev.js');
require('../lib/hifive/h5.dev.js');
//const timer = require('./timer');
const timerController = require('./timerController');
// ページの読み込みが終わったらコントローラをバインドする
jQuery(function(){h5.core.controller('#timer', timerController);})
