const rest={range:232,height:74,progress:.34};

// A projectile under constant gravity, parameterized by its range and peak height.
export function trajectory(range=rest.range,height=rest.height,progress=rest.progress){
  const point=(t:number)=>({x:36+range*t,y:145-4*height*t*(1-t)});
  const path=(from:number,to:number)=>Array.from({length:49},(_,i)=>{
    const p=point(from+(to-from)*i/48);
    return `${i?'L':'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  }).join(' ');
  const ball=point(progress),end=point(1);
  const length=Math.hypot(range,4*height),dx=range/length,dy=-4*height/length;
  const tip={x:36+dx*25,y:145+dy*25};
  return {...ball,past:path(0,progress),future:path(progress,1),
    launch:`M36 145L${tip.x},${tip.y}m${-dx*5-dy*3},${-dy*5+dx*3}L${tip.x},${tip.y}l${-dx*5+dy*3},${-dy*5-dx*3}`,
    landing:`M${end.x-4} 145h8M${end.x} 141v8`};
}

export function initTrajectorySketch(host:HTMLElement){
  const svg=host.querySelector('svg')!;
  const parts=Object.fromEntries(['past','future','launch','landing','ball','shadow'].map(key=>[key,host.querySelector(`[data-${key}]`)!]));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const events=new AbortController();
  const current={...rest},target={...rest};
  let frame=0,last=0,visible=false,started=false,introStart:number|null=null;
  function render(){
    const model=trajectory(current.range,current.height,current.progress);
    for(const key of ['past','future','launch','landing'] as const)parts[key].setAttribute('d',model[key]);
    parts.ball.setAttribute('cx',String(model.x));parts.ball.setAttribute('cy',String(model.y));
    parts.shadow.setAttribute('cx',String(model.x));
  }
  function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
  function reset(){stop();introStart=null;Object.assign(current,rest);Object.assign(target,rest);render();}
  function tick(now:number){
    frame=0;if(!visible||document.hidden||reduced.matches)return;
    const easing=1-Math.exp(-Math.min(last?(now-last)/1000:1/60,.05)*9);last=now;
    current.range+=(target.range-current.range)*easing;current.height+=(target.height-current.height)*easing;
    if(introStart!==null){
      const progress=Math.min(1,(now-introStart)/2800);
      current.progress=rest.progress*progress;
      if(progress===1)introStart=null;
    }
    const moving=Math.abs(current.range-target.range)+Math.abs(current.height-target.height)>.01;
    if(!moving){current.range=target.range;current.height=target.height;}
    render();
    if(moving||introStart!==null)frame=requestAnimationFrame(tick);else last=0;
  }
  function start(){if(!frame&&visible&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick);}
  host.addEventListener('pointermove',event=>{
    if(!fine.matches||event.pointerType==='touch'||reduced.matches)return;
    const rect=svg.getBoundingClientRect();
    const x=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));
    const y=Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));
    target.range=180+x*66;target.height=96-y*48;start();
  },{signal:events.signal});
  host.addEventListener('pointerleave',()=>{Object.assign(target,rest);start();},{signal:events.signal});
  const observer=new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(!visible){reset();return;}
    if(!started){started=true;if(!fine.matches&&!reduced.matches){introStart=performance.now();current.progress=0;}}
    start();
  });observer.observe(host);
  reduced.addEventListener('change',reset,{signal:events.signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();else start();},{signal:events.signal});
  window.addEventListener('pagehide',event=>{if(!event.persisted){stop();observer.disconnect();events.abort();}},{signal:events.signal});
}
