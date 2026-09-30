import { layouts, storyEdges } from '../data/story-geometry';
import { story } from '../data/story';

export function initStoryMorph(root: HTMLElement) {
  const graphic=root.querySelector<HTMLElement>('[data-story-morph]')!;
  const nodes=[...graphic.querySelectorAll<SVGCircleElement>('[data-node]')];
  const edges=[...graphic.querySelectorAll<SVGPathElement>('[data-edge]')];
  const halos=[...graphic.querySelectorAll<SVGCircleElement>('[data-halo]')];
  const labels=[...graphic.querySelectorAll<SVGGElement>('[data-label-group]')];
  const sources=graphic.querySelector<SVGGElement>('[data-morph-sources]')!;
  const haloGroup=graphic.querySelector<SVGGElement>('[data-morph-halos]')!;
  const goal=graphic.querySelector<SVGCircleElement>('[data-morph-goal]')!;
  const stop=graphic.querySelector<SVGGElement>('[data-morph-stop]')!;
  const key=graphic.querySelector<SVGGElement>('[data-morph-key]')!;
  const chapters=[...root.querySelectorAll<HTMLElement>('[data-chapter]')];
  const steps=[...root.querySelectorAll<HTMLAnchorElement>('[data-step]')];
  const sticky=root.querySelector<HTMLElement>('.story-sticky')!;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let anchors:number[]=[],frame=0,progress=0,target=0,active=-1,last=0;
  const clamp=(n:number)=>Math.max(0,Math.min(1,n));
  const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
  const smooth=(t:number)=>t*t*(3-2*t);
  const attribute=(el:Element,key:string,value:number)=>el.setAttribute(key,value.toFixed(3));

  function render(p:number) {
    const from=Math.min(2,Math.floor(p)),to=from+1,t=smooth(p-from);
    const a=layouts[from],b=layouts[to];
    const positions=a.map((node,i)=>({x:lerp(node.position[0],b[i].position[0],t),y:lerp(node.position[1],b[i].position[1],t)}));
    nodes.forEach((node,i)=>{
      attribute(node,'cx',positions[i].x);attribute(node,'cy',positions[i].y);
      attribute(node,'r',lerp(a[i].radius,b[i].radius,t));attribute(node,'opacity',lerp(a[i].opacity,b[i].opacity,t));
    });
    const forecast=clamp(p-2);
    edges.forEach((path,i)=>{
      const edge=storyEdges[i],start=positions[edge.from],end=positions[edge.to];
      const bend=lerp(edge.bends[from],edge.bends[to],t);
      // Every curve endpoint is recomputed from its node, including halfway states.
      const cx=(start.x+end.x)/2,cy=(start.y+end.y)/2;
      const dx=end.x-start.x,dy=end.y-start.y,length=Math.max(1,Math.hypot(dx,dy));
      const controlX=cx-dy/length*bend,controlY=cy+dx/length*bend;
      path.setAttribute('d',`M${start.x.toFixed(3)},${start.y.toFixed(3)}Q${controlX.toFixed(3)},${controlY.toFixed(3)} ${end.x.toFixed(3)},${end.y.toFixed(3)}`);
      const opacity=lerp(edge.weights[from],edge.weights[to],t);
      attribute(path,'opacity',opacity);
      attribute(path,'stroke-width',1.2+opacity*.9);
      // Break prospective edges into dashes continuously; no replacement path.
      const future=edge.from<12||edge.from>=16||edge.to>=16;
      path.setAttribute('stroke-dasharray',future?`${(10-4*forecast).toFixed(2)} ${(5*forecast).toFixed(2)}`:'none');
    });
    attribute(sources,'opacity',1-smooth(clamp(p/.7)));
    attribute(haloGroup,'opacity',Math.max(0,1-Math.abs(p-1))* .65);
    halos.forEach((halo,i)=>{attribute(halo,'cx',positions[12+i].x);attribute(halo,'cy',positions[12+i].y);});
    attribute(goal,'cx',positions[0].x);attribute(goal,'cy',positions[0].y);attribute(goal,'opacity',smooth(clamp(p-1.4)));
    stop.setAttribute('transform',`translate(${positions[4].x.toFixed(3)} ${positions[4].y.toFixed(3)})`);
    attribute(stop,'opacity',smooth(clamp(p-1.35))*(1-forecast*.7));
    attribute(key,'opacity',smooth(forecast));
    labels.forEach((label,i)=>attribute(label,'opacity',smooth(clamp(1-Math.abs(p-i)*2.2))));
    graphic.dataset.progress=p.toFixed(4);
    steps.forEach((step,i)=>step.style.setProperty('--step-progress',String(clamp(p-i+1))));
    const next=Math.round(p);
    if(next!==active){
      active=next;root.dataset.active=String(next);
      graphic.querySelector('[data-morph-number]')!.textContent=story[next].n;
      graphic.querySelector('[data-morph-title]')!.textContent=story[next].visualTitle;
      graphic.querySelector('[data-morph-caption]')!.textContent=story[next].visualCaption;
      graphic.querySelector('[data-morph-source]')!.textContent=story[next].source;
      chapters.forEach((chapter,i)=>chapter.classList.toggle('chapter-active',i===next));
      steps.forEach((step,i)=>{if(i===next)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');});
    }
  }
  function readTarget(){
    if(!anchors.length)return;
    const y=scrollY;
    let index=0;
    while(index<2&&y>=anchors[index+1])index++;
    target=Math.max(0,Math.min(3,index+(y-anchors[index])/Math.max(1,anchors[index+1]-anchors[index])));
    if(reduced.matches)target=Math.round(target);
  }
  function tick(time:number){
    frame=0;
    const dt=Math.min(64,time-last||16);last=time;
    progress=reduced.matches?target:lerp(progress,target,1-Math.exp(-dt/95));
    if(Math.abs(progress-target)<.0003)progress=target;
    render(progress);
    if(progress!==target)frame=requestAnimationFrame(tick);
  }
  function schedule(){readTarget();if(!frame)frame=requestAnimationFrame(tick);}
  function measure(){
    const mobile=innerWidth<=1000 && !(innerWidth>=600 && innerWidth>innerHeight);
    root.style.setProperty('--story-copy-top',`${sticky.offsetHeight+20}px`);
    const line=mobile?sticky.offsetHeight+38:innerHeight*.39;
    anchors=chapters.map(chapter=>chapter.getBoundingClientRect().top+scrollY+parseFloat(getComputedStyle(chapter).paddingTop)-line);
    schedule();
  }
  root.classList.add('story-enhanced');
  steps.forEach((step,i)=>step.addEventListener('click',event=>{
    event.preventDefault();
    history.replaceState(null,'',step.hash);
    scrollTo({top:anchors[i],behavior:reduced.matches?'instant':'smooth'});
  }));
  const observer=new ResizeObserver(measure);observer.observe(root);observer.observe(sticky);
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);addEventListener('pageshow',measure);
  reduced.addEventListener('change',schedule);
  document.fonts.ready.then(measure);
  measure();readTarget();progress=target;render(progress);
  addEventListener('pagehide',()=>{cancelAnimationFrame(frame);observer.disconnect();removeEventListener('scroll',schedule);removeEventListener('resize',measure);},{once:true});
}
