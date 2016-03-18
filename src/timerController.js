(function($){
  /* global h5, window */
  'use strict';

  var userAgent = (function(u){
    return {
      Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1) 
        || u.indexOf("ipad") != -1
        || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
        || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
        || u.indexOf("kindle") != -1
        || u.indexOf("silk") != -1
        || u.indexOf("playbook") != -1,
      Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
        || u.indexOf("iphone") != -1
        || u.indexOf("ipod") != -1
        || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
        || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
        || u.indexOf("blackberry") != -1
  }})(window.navigator.userAgent.toLowerCase());

  const TIMER_STATUS = {
    READY: 'READY',
    RUNNING: 'RUNNING',
    PAUSED: 'PAUSED',
    DONE: 'DONE'
  };
  const ATTR_DATA_STATUS = 'data-status';
  const DEFAULT_SOUND_FILE_PATH = './src/res/sound/gong.mp3';
  const DEFAULT_SOUND_NUM = 3;

  const createRenderer = function(targets){
    return {
      formatter : require('./formatter.js'),
      render: function(time){
        targets.$time.text(this.formatter.formatTimeString(time));
        targets.$msec.text(this.formatter.formatMsecString(time));
      }
    };
  };

  const createMultiSound = function(source, n){
    let index = 0;
    const sounds = Array(n);
    for(let i = 0; i < n; i++){
      sounds[i] = new Audio(source);
      sounds[i].load();
    }
    return {
      load : () => {
        for(let i = 0; i < n; i++){
          if(sounds[i].readyState < 3){
            sounds[i].load();
          }
        }
      },
      play : () => {
        sounds[index].pause();
        sounds[index].currentTime = 0.0;
        sounds[index].play();
        index = (index + 1) % n;
      }
    }
  }

  const timerController = {
    __name: 'ltimer.controller.timerController',
    _timer: null,
    _timerElement: null,
    _renderer: null,
    _$content: null,
    __ready: function(context){
      this._sound = createMultiSound(DEFAULT_SOUND_FILE_PATH, DEFAULT_SOUND_NUM);
      this._timerElement = this.rootElement;
      this._targets = {
        $time : this.$find('#time'),
        $msec : this.$find('#time-millis')
      }
      this._$content = $('.page-content');

      this._timer = require('./timer.js');

      this._renderer = createRenderer(this._targets);
      this._timer.setRenderer(this._renderer);

      const onStartCallback = (function($content){
        $content.removeClass('warn danger');
      })(this._$content, this._timerElement);
      this._timer.setOnStartCallback(onStartCallback);

      const onSecondCallback = (function($content){
        return function(time){
          if(time <= 15){
            $content.removeClass('warn danger').addClass('danger');
          } else if(time <= 30){
            $content.removeClass('warn danger').addClass('warn');
          }
        }
      })(this._$content)
      this._timer.setOnSecondCallback(onSecondCallback);

      const onStopCallback = (function(targets, sound, stateElement){
        return function(){
          targets.$msec.empty();
          targets.$time.text('DONE');
          sound.play();
          stateElement.setAttribute(ATTR_DATA_STATUS, TIMER_STATUS.DONE);
        }
      })(this._targets, this._sound, this._timerElement)
      this._timer.setOnStopCallback(onStopCallback);

      this._timerElement.setAttribute(ATTR_DATA_STATUS, TIMER_STATUS.READY);
      this._timer.reset(300000);
    },

    /* private method */
    _resetTimer: function(time){
      this._timerElement.setAttribute(ATTR_DATA_STATUS, TIMER_STATUS.READY);
      this._$content.removeClass('warn danger');
      this._timer.reset(time);
    },

    /* event handler */
    '#setTimeBtn click': function(context, $el){
      var timeStr = this.$find('#timeInput').val();
      var timeArr = timeStr.split(':');
      var time = (Number(timeArr[0]) * 60 + Number(timeArr[1])) * 1000;
      this._resetTimer(time);
    }
  };

  // スマートデバイスでの反応速度向上のためにクリックではなくタッチを使う
  const clickAction = userAgent.Tablet || userAgent.Mobile ? 'touchend' : 'click';
  timerController[`#startBtn ${clickAction}`] = function(context, $el) {
    //MEMO: iOSではクリックイベントのハンドラ内で明示的にloadする必要がある
    this._sound.load();
    this._timerElement.setAttribute(ATTR_DATA_STATUS, TIMER_STATUS.RUNNING);
    this._timer.start();
  };

  timerController[`#pauseBtn ${clickAction}`] = function(context, $el) {
    this._timerElement.setAttribute(ATTR_DATA_STATUS, TIMER_STATUS.PAUSED);
    this._timer.pause();
  };

  timerController[`#stopBtn ${clickAction}`] = function(context, $el) {
    this._timer.stop();
  };

  timerController[`#resetBtn ${clickAction}`] = function(context, $el) {
    this._resetTimer();
  };
  module.exports = timerController; 
})(jQuery);
