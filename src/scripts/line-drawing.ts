type Influence = {x:number;y:number;strength:number};

// Seven open curves; the same geometry is rendered before JavaScript loads.
export function drawingPath(index:number, phase=0, influence?:Influence) {
  const offset=index-3;
  return Array.from({length:65},(_,i)=>{
    const t=i/64;
    const envelope=Math.sin(Math.PI*t)**2;
    let x=22+Math.abs(offset)*7+t*(276-Math.abs(offset)*14);
    let y=95+offset*11+envelope*(Math.sin((t-.15)*Math.PI*2)*24+offset*3*Math.cos(Math.PI*t));
    y+=envelope*phase*Math.sin(t*Math.PI*2+index*.22)*5;
    if(influence){
      const dx=x-influence.x,dy=y-influence.y;
      const weight=Math.exp(-(dx*dx+dy*dy)/6500)*influence.strength*envelope;
      x+=dx*.12*weight;y+=dy*.45*weight;
    }
    return `${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
}

export function initLineDrawing(host:HTMLElement) {
  const paths=[...host.querySelectorAll('path')];
  const svg=host.querySelector('svg')!;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const events=new AbortController();
  const influence={x:160,y:95,strength:0};
  let targetX=160,targetY=95,targetStrength=0;
  let frame=0,visible=false,started=false,introStart:number|null=null,last=0;
  function render(phase=0){paths.forEach((path,i)=>path.setAttribute('d',drawingPath(i,phase,influence)));}
  function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
  function tick(now:number){
    frame=0;
    if(!visible||document.hidden||reduced.matches)return;
    const easing=1-Math.exp(-Math.min(last?(now-last)/1000:1/60,.05)*10);last=now;
    influence.x+=(targetX-influence.x)*easing;influence.y+=(targetY-influence.y)*easing;
    influence.strength+=(targetStrength-influence.strength)*easing;
    let phase=0;
    if(introStart!==null){
      const progress=Math.min(1,(now-introStart)/4200);
      phase=Math.sin(progress*Math.PI)**2*Math.sin(progress*Math.PI*2);
      if(progress===1)introStart=null;
    }
    const moving=Math.abs(influence.strength-targetStrength)>.001 ||
      targetStrength>0&&(Math.abs(influence.x-targetX)+Math.abs(influence.y-targetY)>.05);
    if(!moving){influence.strength=targetStrength;influence.x=targetX;influence.y=targetY;}
    render(phase);
    if(moving||introStart!==null)frame=requestAnimationFrame(tick);else last=0;
  }
  function start(){if(!frame&&visible&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick);}
  host.addEventListener('pointermove',event=>{
    if(!fine.matches||event.pointerType==='touch'||reduced.matches)return;
    const rect=svg.getBoundingClientRect();
    targetX=(event.clientX-rect.left)/rect.width*320;targetY=(event.clientY-rect.top)/rect.height*190;
    targetStrength=1;start();
  },{signal:events.signal});
  host.addEventListener('pointerleave',()=>{targetStrength=0;start();},{signal:events.signal});
  const observer=new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(!visible){stop();introStart=null;targetStrength=0;influence.strength=0;render();return;}
    // A short entrance movement on touch screens, then rest without a looping animation.
    if(!started){started=true;if(!fine.matches&&!reduced.matches)introStart=performance.now();}
    start();
  });
  observer.observe(host);
  reduced.addEventListener('change',()=>{stop();introStart=null;targetStrength=0;influence.strength=0;render();},{signal:events.signal});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){stop();introStart=null;targetStrength=0;influence.strength=0;render();}else start();
  },{signal:events.signal});
  window.addEventListener('pagehide',event=>{if(!event.persisted){stop();observer.disconnect();events.abort();}},{signal:events.signal});
}
