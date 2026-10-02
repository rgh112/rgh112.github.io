export function initWordLadder(host:HTMLElement){
  const steps=[...host.querySelectorAll<HTMLElement>('[data-ladder-step]')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const events=new AbortController();
  let timer:ReturnType<typeof setTimeout>|undefined;
  let visible=false,started=false,current=4;
  function show(index:number){current=index;steps.forEach((step,i)=>step.toggleAttribute('data-current',i===index));}
  function stop(){clearTimeout(timer);timer=undefined;show(4);}
  function advance(){
    show(current+1);
    if(current<4)timer=setTimeout(advance,750);else timer=undefined;
  }
  function play(){
    if(reduced.matches||document.hidden||!visible||timer!==undefined)return;
    show(0);timer=setTimeout(advance,750);
  }
  const observer=new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(!visible){stop();return;}
    if(!started){started=true;play();}
  });observer.observe(host);
  host.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')play();},{signal:events.signal});
  host.addEventListener('focus',play,{signal:events.signal});
  reduced.addEventListener('change',stop,{signal:events.signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();},{signal:events.signal});
  window.addEventListener('pagehide',event=>{if(!event.persisted){stop();observer.disconnect();events.abort();}},{signal:events.signal});
}
