'use strict';
const $targetTime = $('#time');
const $targetMsec = $('#time-millis');
const $content = $('.page-content');

const renderer = {
  formatter : require('./formatter.js'),
  $targets: {
    $time: $targetTime,
    $msec: $targetMsec,
  },
  render: function(time){
    this.$targets.$time.text(this.formatter.formatTimeString(time));
    this.$targets.$msec.text(this.formatter.formatMsecString(time));
  }
};

const formatter = require('./formatter.js');
const onStartCallback = (function($content){
  $content.removeClass('warn danger');
})($content)
const onSecondCallback = (function($con){
  return function(time){
    if(time < 15000){
      $con.removeClass('warn danger').addClass('danger');
    } else if(time < 30000){
      $con.removeClass('warn danger').addClass('warn');
    }
  }
})($content)
const onStopCallback = (function($time, $msec){
  return function(){
    $msec.empty();
    $time.text('DONE!');
  }
})($targetTime, $targetMsec, $content)

const timerController = {
  __name: 'ltimer.controller.timerController',
  _timer: null,
  __ready: function(context){
    this._timer = require('./timer.js');
    this._timer.timer.setRenderer(renderer);
    this._timer.timer.setOnSecondCallback(onSecondCallback);
    this._timer.timer.setOnStopCallback(onStopCallback);
    this._timer.timer.setInterval(300000);
  },

  _render: function(time, $target){
    $target.text(this._formatter.formatTimeString(time));
  },

  '#startBtn click': function(context, $el) {
    this.$find('#startBtn').hide();
    this.$find('#pauseBtn').show();
    this.$find('#stopBtn').show();
    this._timer.timer.start();
  },

  '#pauseBtn click': function(context, $el) {
    this.$find('#pauseBtn').hide();
    this.$find('#stopBtn').show();
    this.$find('#startBtn').show();
    this._timer.timer.pause();
  },

  '#stopBtn click': function(context, $el) {
    this.$find('#stopBtn').hide();
    this.$find('#pauseBtn').hide();
    this.$find('#startBtn').show();
    this._timer.timer.stop();
  }
}

// ページの読み込みが終わったらコントローラをバインドする
$(function(){h5.core.controller('#timer', timerController);})
