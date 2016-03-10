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
          sounds[i].load();
        }
      },
      play : () => {
        sounds[index].pause();
        sounds[index].currentTime = 0.3;
        sounds[index].play();
        index = (index + 1) % n;
      }
    }
  }
  const sound = createMultiSound('./src/res/sound/gong.mp3', 5);

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
  const onStopCallback = (function($time, $msec, sound){
    return function(){
      $('#resetBtn').show();
      $('#pauseBtn').hide();
      $('#startBtn').hide();
      $msec.empty();
      $time.text('DONE');
      sound.play();
    }
  })($targetTime, $targetMsec, sound)

  const timerController = {
    __name: 'ltimer.controller.timerController',
    _timer: null,
    __ready: function(context){
      this._timer = require('./timer.js');
      this._timer.setRenderer(renderer);
      this._timer.setOnSecondCallback(onSecondCallback);
      this._timer.setOnStopCallback(onStopCallback);
      //this._timer.reset(300000);
      this._timer.reset(30000);
    },

    _render: function(time, $target){
      $target.text(this._formatter.formatTimeString(time));
    }
  };

  /**
   * touch-action(または-ms-touch-action)プロパティがサポートされているか
   */
  const isTouchActionSupported = (function() {
    // divを作って、styleにtouchActionまたはmsTouchActionがあるか判定する
    // いずれかがあった場合にtouchActionPropを設定して、trueを返す
    const div = document.createElement('div');
    if (typeof div.style.touchAction !== 'undefined') {
      return true;
    } else if (typeof div.style.msTouchAction !== 'undefined') {
      return true;
    }
    return false;
  })();

  const clickAction = isTouchActionSupported ? 'click' : 'touchend';
  timerController[`#startBtn ${clickAction}`] = function(context, $el) {
    //MEMO: iOSではクリックイベントのハンドラ内で明示的にloadする必要がある
    sound.load();
    this.$find('#startBtn').hide();
    this.$find('#pauseBtn').show();
    this.$find('#stopBtn').show();
    this._timer.start();
  };

  timerController[`#pauseBtn ${clickAction}`] = function(context, $el) {
    this.$find('#pauseBtn').hide();
    this.$find('#stopBtn').show();
    this.$find('#startBtn').show();
    this._timer.pause();
  };

  timerController[`#stopBtn ${clickAction}`] = function(context, $el) {
    //sound.play();
    this._timer.stop();
  };

  timerController[`#resetBtn ${clickAction}`] = function(context, $el) {
      this.$find('#stopBtn').hide();
      this.$find('#resetBtn').hide();
      this.$find('#pauseBtn').hide();
      this.$find('#startBtn').show();
      $content.removeClass('warn danger');
      this._timer.reset();
    };

    /*
    '#startBtn click': function(context, $el) {
      //MEMO: iOSではクリックイベントのハンドラ内で明示的にloadする必要がある
      sound.load();
      this.$find('#startBtn').hide();
      this.$find('#pauseBtn').show();
      this.$find('#stopBtn').show();
      this._timer.start();
    },

    '#pauseBtn click': function(context, $el) {
      this.$find('#pauseBtn').hide();
      this.$find('#stopBtn').show();
      this.$find('#startBtn').show();
      this._timer.pause();
    },

    '#stopBtn click': function(context, $el) {
      //sound.play();
      this._timer.stop();
    },

    '#resetBtn click': function(context, $el) {
      this.$find('#stopBtn').hide();
      this.$find('#resetBtn').hide();
      this.$find('#pauseBtn').hide();
      this.$find('#startBtn').show();
      $content.removeClass('warn danger');
      this._timer.reset();
    }
  }
  */
  module.exports = timerController; 
})(jQuery);
