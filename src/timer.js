'use strict';
const DEFAULT_INTERVAL = 300000;
let interval = DEFAULT_INTERVAL;
let startTime = 0;
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

function setInterval(time){
  interval = time;
  render(interval)
}

function start(){
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

function resume(){
  startTime = Date.now();
  timeout = nextFrame(loop, 0);
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
    console.log('finished!');
    stop();
  } else {
    timeout = nextFrame(loop);
  }
}

exports.timer = {
  start,
  pause,
  resume,
  stop,
  setRenderer,
  setRenderCallback,
  setOnStopCallback,
  setOnSecondCallback,
  setInterval
};
