(function(){
  'use strict';
  const DEFAULT_INTERVAL = 300000;
  let limit = DEFAULT_INTERVAL;
  let interval = DEFAULT_INTERVAL;
  let startTime = 0;
  let lastStoppedTime = interval;
  let status = interval;
  let lastStatus = interval;
  let timeout = null;
  let render = (timer)=>{};
  let renderer = {render: ()=>{}};
  let onSecondCallback = second => {};
  let onStartCallback = second => {};
  let onStopCallback = () => {};
  const nextFrame = window ? window.requestAnimationFrame : setImmediate;
  const cancelFrame = window ? window.cancelAnimationFrame : cancelImmediate;

  function setRenderer(_renderer){
    renderer = _renderer;
  }

  function setOnSecondCallback(callback){
    onSecondCallback = callback;
  }

  function setOnStartCallback(callback){
    onStopCallback = callback;
  }

  function setOnStopCallback(callback){
    onStopCallback = callback;
  }

  function setRenderCallback(callback){
    render = callback;
  }

  function reset(time){
    if(time){
      limit = time;
    }
    status = interval = limit;
    renderer.render(limit);
  }

  function start(){
    if(status <= 0){
      return;
    }
    startTime = Date.now();
    lastStatus = startTime;
    timeout = nextFrame(loop, 0);
    return status;
  }

  function pause(){
    interval = status;
    cancelFrame(timeout);
    return status;
  }

  function stop(){
    status = 0;
    cancelFrame(timeout);
    renderer.render(status);
    onStopCallback();
    return status;
  }

  function loop(){
    lastStatus = status;
    const current = new Date().getTime();
    const passed = current - startTime;
    status = Math.max(interval - passed, 0);
    renderer.render(status);
    if(Math.floor(status / 1000) !== Math.floor(lastStatus / 1000)){
      onSecondCallback(Math.floor(lastStatus / 1000));
    }
    if(status <= 0){
      stop();
    } else {
      timeout = nextFrame(loop);
    }
  }

  module.exports = {
    start,
    pause,
    stop,
    reset,
    setRenderer,
    setRenderCallback,
    setOnStopCallback,
    setOnSecondCallback
  };
})();
