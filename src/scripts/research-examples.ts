export function initResearchExamples(){
  document.querySelectorAll<HTMLElement>('[data-research-example]').forEach(example=>{
    const buttons=[...example.querySelectorAll<HTMLButtonElement>('[data-example-step]')];
    const views=[...example.querySelectorAll<HTMLElement|SVGElement>('[data-example-view]')];
    example.querySelector<HTMLElement>('.example-controls')!.hidden=false;
    buttons.forEach(button=>button.addEventListener('click',()=>{
      const stage=button.dataset.exampleStep!;
      example.dataset.stage=stage;
      buttons.forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
      views.forEach(view=>view.toggleAttribute('hidden',!view.dataset.exampleView!.split(' ').includes(stage)));
    }));
  });
}
