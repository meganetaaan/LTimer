'use strict';
const DEFAULT_INTERVAL = 300000;
let interval = DEFAULT_INTERVAL;
let startTime = 0;
let status = interval;
let timeout = null;
let render = (timer)=>{};
let renderer = {render: ()=>{}};
const nextFrame = window ? window.requestAnimationFrame : setImmediate;
const cancelFrame = window ? window.cancelAnimationFrame : cancelImmediate;

function setRenderer(_renderer){
  renderer = _renderer;
}

function setRenderCallback(callback){
  render = callback;
}
function setInterval(time){
  interval = time;
}

function start(){
  startTime = Date.now();
  timeout = nextFrame(loop, 0);
  return status;
}

/* start, stopと一緒？
function pause(){
  cancelFrame(timeout);
  return status;
}
*/

function resume(){
  startTime = Date.now();
  timeout = nextFrame(loop, 0);
  return status;
}

function stop(){
  status = 0;
  cancelFrame(timeout);
  return status;
}

function loop(){
  const current = new Date().getTime();
  const passed = current - startTime;
  const status = Math.max(interval - passed, 0);
  renderer.render(status);
  if(status <= 0){
    console.log('finished!');
  }
  timeout = nextFrame(loop);
}

exports.timer = {
  start,
  stop,
  setRenderer,
  setRenderCallback,
  setInterval
};
