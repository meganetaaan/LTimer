(function($){
  /* global h5, window */
  'use strict';
  // TODO: jQueryオブジェクトのキャッシュを集約する(コントローラ内が望ましい？）
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

  const onStartCallback = (function($content){
    $content.removeClass('warn danger');
  })($content)
  const onSecondCallback = (function($con){
    return function(time){
      if(time <= 15){
        $con.removeClass('warn danger').addClass('danger');
      } else if(time <= 30){
        $con.removeClass('warn danger').addClass('warn');
      }
    }
  })($content)
  const onStopCallback = (function($time, $msec){
    return function(){
      $('#resetBtn').show();
      $('#pauseBtn').hide();
      $('#startBtn').hide();
      $msec.empty();
      $time.text('DONE!');
    }
  })($targetTime, $targetMsec, $content)

  const timerController = {
    __name: 'ltimer.controller.timerController',
    _timer: null,
    __ready: function(context){
      this._timer = require('./timer.js');
      this._timer.setRenderer(renderer);
      this._timer.setOnSecondCallback(onSecondCallback);
      this._timer.setOnStopCallback(onStopCallback);
      this._timer.reset(31000);
    },

    _render: function(time, $target){
      $target.text(this._formatter.formatTimeString(time));
    },

    '#startBtn _click': function(context, $el) {
      this.$find('#startBtn').hide();
      this.$find('#pauseBtn').show();
      this.$find('#stopBtn').show();
      this._timer.start();
    },

    '#pauseBtn _click': function(context, $el) {
      this.$find('#pauseBtn').hide();
      this.$find('#stopBtn').show();
      this.$find('#startBtn').show();
      this._timer.pause();
    },

    '#stopBtn _click': function(context, $el) {
      this._timer.stop();
    },

    '#resetBtn _click': function(context, $el) {
      this.$find('#stopBtn').hide();
      this.$find('#resetBtn').hide();
      this.$find('#pauseBtn').hide();
      this.$find('#startBtn').show();
      $content.removeClass('warn danger');
      this._timer.reset();
    }
  }

  // ページの読み込みが終わったらコントローラをバインドする
  $(function(){h5.core.controller('#timer', timerController);})
})(jQuery);
