const $targetTime = $('#time');
const $targetMsec = $('#time-millis');

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

/* グローバルオブジェクトとしてh5が使えるはず */
const timerController = {
  __name: 'ltimer.controller.timerController',
  _timer: null,
  __ready: function(context){
    this._timer = require('./timer.js');
    this._timer.timer.setRenderer(renderer);
  },

  _render: function(time, $target){
    $target.text(this._formatter.formatTimeString(time));
  },

  '#startBtn click': function(context, $el) {
    this._timer.timer.start();
  },

  '#pauseBtn click': function(context, $el) {
    this._timer.timer.pause();
  },

  '#resumeBtn click': function(context, $el) {
    this._timer.timer.resume();
  },

  '#stopBtn click': function(context, $el) {
    this._timer.timer.stop();
  }
}

h5.core.controller('#timer', timerController);
h5.core.expose(timerController);
