import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('research examples explain each process, remain usable on mobile, and keep controls in sync',async({page})=>{
  await page.setViewportSize({width:320,height:780});
  const cases=[
    ['ood-resolution','checkpoints',3],['autometa','extraction',4],['clinician-trust','verification',4],
    ['moral-profile-dynamics','memory',4],['norm-dynamics','configurations',3],['counting-pixels','pixels',3],
  ] as const;
  for(const [slug,kind,count] of cases){
    await page.goto(`/research/${slug}/`);
    const example=page.locator(`[data-research-example="${kind}"]`);
    await example.scrollIntoViewIfNeeded();
    await expect(example).toBeVisible();await expect(example.locator('.example-note')).not.toBeEmpty();
    const buttons=example.locator('[data-example-step]');await expect(buttons).toHaveCount(count);
    const fixedAnswer=kind==='verification'?await example.locator('.answer-record').innerText():'';
    for(let i=0;i<count;i++){
      await buttons.nth(i).click();await expect(example).toHaveAttribute('data-stage',String(i));
      await expect(example.locator('[data-example-step][aria-pressed=true]')).toHaveCount(1);
      await expect(buttons.nth(i)).toHaveAttribute('aria-pressed','true');
      expect((await buttons.nth(i).boundingBox())!.height).toBeGreaterThanOrEqual(44);
      await expect(example.locator('.example-explanation p:visible')).toHaveCount(1);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),slug).toBe(true);
      if(kind==='checkpoints'){
        expect(await example.locator('.em-score').allTextContents()).toEqual(['0 / 4','0 / 4','0 / 4']);
        if(i===1)await expect(example.locator('.latest-checkpoint')).toContainText('-1.6');
        if(i===2)await expect(example.locator('.visual-footnote')).toContainText('Latest among tied checkpoints: C');
      }
      if(kind==='extraction'){
        await expect(example.locator('.source-quote')).toHaveText('Follow-up: 30 days');
        await expect(example.locator(i<2?'.disputed-value':'.corrected-value')).toBeVisible();
        expect(await example.locator('.pool-handoff').isVisible()).toBe(i===3);
      }
      if(kind==='verification')expect(await example.locator('.answer-record').innerText()).toBe(fixedAnswer);
      if(kind==='memory')await expect(example.locator('.agent-card')).toHaveCount(4);
      if(kind==='configurations'){
        const selected=await example.locator('.matrix-cell').evaluateAll(cells=>cells.filter(cell=>getComputedStyle(cell).backgroundColor==='rgb(237, 240, 233)').length);
        expect(selected).toBe([1,4,15][i]);
      }
      if(kind==='pixels'){
        expect(await example.locator('g.pixel-counts').isVisible()).toBe(i>0);
        if(i===2){
          expect(await example.locator('.strong-count').allTextContents()).toEqual(['10','8']);
          expect(await example.locator('.axis-pixel').first().evaluate(el=>getComputedStyle(el).strokeWidth)).toBe('2px');
        }
      }
    }
    await buttons.first().click();await expect(example).toHaveAttribute('data-stage','0');
    const audit=await new AxeBuilder({page}).include('[data-research-example]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(audit.violations,slug).toEqual([]);
  }
  await page.goto('/');await expect(page.locator('[data-research-example]')).toHaveCount(0);
});

test('research example stages remain readable without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();await page.goto('/research/autometa/');
  await expect(page.locator('.example-controls')).toBeHidden();
  await expect(page.locator('.example-static-steps')).toBeVisible();
  await expect(page.locator('.example-static-steps')).toContainText('separate statistical module');
  await context.close();
});

test('word ladder lives on its research page and replays valid single-letter edits',async({page})=>{
  await page.goto('/');
  await expect(page.locator('[data-word-ladder]')).toHaveCount(0);
  await page.goto('/research/beyond-local-validity/');
  const ladder=page.locator('[data-word-ladder]');
  await ladder.scrollIntoViewIfNeeded();
  const words=await ladder.locator('.ladder-word').allTextContents();
  expect(words).toEqual(['COLD','CORD','CARD','WARD','WARM']);
  words.slice(1).forEach((word,i)=>expect([...word].filter((letter,j)=>letter!==words[i][j])).toHaveLength(1));
  await expect(ladder.locator('[data-current] .ladder-word')).toHaveText('WARM',{timeout:5000});
  await ladder.getByRole('button',{name:'Replay edits'}).click();
  await expect(ladder.locator('[data-current] .ladder-word')).toHaveText('COLD');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(ladder.locator('[data-current] .ladder-word')).toHaveText('WARM');
  await page.mouse.move(0,0);await ladder.hover();await page.waitForTimeout(800);
  await expect(ladder.locator('[data-current] .ladder-word')).toHaveText('WARM');
  await expect(ladder.getByRole('button',{name:'Replay edits'})).toBeHidden();
});

test('touch layouts keep controls usable, story text visible, and figure zoom contained',async({browser})=>{
  for(const viewport of [{width:320,height:568},{width:390,height:844},{width:430,height:932},{width:844,height:390}]){
    const context=await browser.newContext({viewport,isMobile:true,hasTouch:true});
    const page=await context.newPage();
    await page.goto('/');await page.evaluate(()=>document.fonts.ready);
    if(viewport.width<760){
      for(const link of await page.locator('.site-header nav a, .story-steps a').all()){
        expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
    }
    await page.locator('[data-step="0"]').tap();
    await page.waitForTimeout(700);
    await page.evaluate(()=>scrollBy({top:200,behavior:'instant'}));
    const copy=page.locator('.chapter-copy').first();
    await expect.poll(async()=>copy.evaluate(el=>el.getBoundingClientRect().bottom)).toBeLessThan(viewport.height);
    expect(await copy.evaluate(el=>el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(0);
    await page.goto('/research/autometa/');
    const trigger=page.locator('.figure-open');await trigger.scrollIntoViewIfNeeded();
    const before=await page.evaluate(()=>scrollY);await trigger.tap();
    const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
    await dialog.locator('img').evaluate((el:HTMLImageElement)=>el.decode());
    const close=page.getByRole('button',{name:'Close figure'});
    const box=(await close.boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(0);expect(box.y+box.height).toBeLessThan(viewport.height);
    expect(await dialog.locator('.viewer-canvas').evaluate(el=>el.clientHeight)).toBeGreaterThan(150);
    await page.getByRole('button',{name:'Zoom in',exact:true}).tap();
    expect(await dialog.locator('.viewer-canvas').evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);
    expect(await page.evaluate(()=>getComputedStyle(document.body).position)).toBe('fixed');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await close.tap();await expect(dialog).not.toBeVisible();
    await expect.poll(async()=>Math.abs(await page.evaluate(()=>scrollY)-before)).toBeLessThan(2);
    await expect(trigger).toBeFocused();await context.close();
  }
});

const pages = ['/', '/research/', '/directions/', '/about/', '/cv/', '/research/beyond-local-validity/', '/research/ood-resolution/', '/research/autometa/', '/research/clinician-trust/', '/research/moral-profile-dynamics/', '/research/norm-dynamics/', '/research/counting-pixels/'];

test('all pages render, internal links resolve, and public text excludes private material', async ({page, request}) => {
  const links = new Set<string>();
  const errors: string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  for (const path of pages) {
    const response=await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveCount(1);
    const text=await page.locator('body').innerText();
    expect(text).not.toMatch(/\bGPA\b|under review|anonymous submission|\+82[ -]*10/i);
    for(const link of await page.locator('a[href^="/"]').evaluateAll(els=>els.map(el=>el.getAttribute('href')!)))links.add(link.split('#')[0]);
  }
  for(const href of links)expect((await request.get(href)).status(),href).toBe(200);
  expect(errors).toEqual([]);
});

test('topic filter, search, empty state, and reset work together', async ({page})=>{
  await page.goto('/research/');
  await page.getByRole('button',{name:'Learning & evaluation',exact:true}).click();
  await expect(page.locator('.paper-card:visible')).toHaveCount(1);
  await expect(page.locator('.paper-card:visible')).toContainText('Checkpoint selection with limited validation data');
  await page.getByRole('searchbox').fill('no-such-paper');
  await expect(page.getByText('No matching research.')).toBeVisible();
  await page.getByRole('button',{name:'Clear filters'}).click();
  await expect(page.locator('.paper-card:visible')).toHaveCount(7);
  await page.getByRole('searchbox').fill('clinician');
  await expect(page.locator('.paper-card:visible')).toHaveCount(1);
});

test('interactive explanations update their visible and accessible states',async({page})=>{
  await page.goto('/research/beyond-local-validity/');
  await page.getByRole('button',{name:'Take the dead end'}).click();
  await expect(page.locator('.diagram-feedback')).toContainText('Recoverability is lost');
  await expect(page.getByRole('button',{name:'Take the dead end'})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Preserve a path'}).click();
  await expect(page.locator('.diagram-feedback')).toContainText('remains recoverable');
  await page.goto('/research/ood-resolution/');
  await page.getByRole('button',{name:'Exact match only'}).click();
  await expect(page.locator('.diagram-feedback')).toContainText('cannot rank');
  await expect(page.locator('#origin')).toContainText('inner power');
  await expect(page.locator('#origin')).not.toContainText(/[가-힣]/);
  await page.getByRole('button',{name:'Insight',exact:true}).click();
  await expect(page.getByRole('button',{name:'Insight',exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('[data-practice-caption]:visible')).toContainText('The barrier comes into focus.');
  await page.getByRole('button',{name:'Breakthrough',exact:true}).click();
  await expect(page.locator('[data-practice-caption]:visible')).toContainText('Beyond the barrier.');
  await expect(page.getByRole('button',{name:'Insight',exact:true})).toHaveAttribute('aria-pressed','false');
  await page.getByRole('button',{name:'Copy citation'}).click();
  await expect(page.getByRole('button',{name:'Copied'})).toBeVisible();
});

test('mobile pages fit the viewport and meet automated accessibility checks',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const path of ['/', '/research/', '/research/ood-resolution/', '/directions/', '/about/', '/cv/']){
    await page.goto(path);
    await page.evaluate(()=>document.fonts.ready);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path).toBe(true);
    const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(results.violations.map(v=>({id:v.id,description:v.description,nodes:v.nodes.map(n=>n.target)})),path).toEqual([]);
  }
});

test('reduced motion and disabled JavaScript preserve the content',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce'});
  const page=await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Kunhee Ryu',exact:true})).toBeVisible();
  await context.close();
  const nojs=await browser.newContext({javaScriptEnabled:false});
  const fallback=await nojs.newPage();
  await fallback.goto('/');
  await expect(fallback.locator('.chapter-figure').first()).toBeVisible();
  await expect(fallback.getByRole('heading',{name:'Selected research.'})).toBeVisible();
  await fallback.goto('/research/ood-resolution/');
  await expect(fallback.locator('.figure-open')).toHaveAttribute('href','/figures/ood-checkpoint-audit.webp');
  await expect(fallback.locator('.source-figure-image img')).toBeVisible();
  await nojs.close();
});

test('every paper has a readable source figure and an accessible zoom viewer', async ({page}) => {
  for(const path of pages.filter(path=>/^\/research\/.+\/$/.test(path))){
    await page.goto(path);
    const figure=page.locator('.paper-source-figure');
    await expect(figure).toHaveCount(1);
    await figure.scrollIntoViewIfNeeded();
    const size=await figure.locator('.source-figure-image img').evaluate(async (el:HTMLImageElement)=>{await el.decode();return [el.naturalWidth,el.naturalHeight];});
    expect(size[0]).toBeGreaterThan(900);expect(size[1]).toBeGreaterThan(400);
    await expect(figure.locator('.figure-attribution')).not.toBeEmpty();
  }
  await page.goto('/research/ood-resolution/');
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:900});
    const trigger=page.locator('.figure-open');
    await trigger.click();
    const dialog=page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.getByRole('button',{name:'Zoom in',exact:true}).click();
    await expect(page.getByRole('button',{name:'Fit to screen'})).toHaveAttribute('aria-pressed','true');
    expect(await dialog.locator('.viewer-canvas').evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(audit.violations).toEqual([]);
    await page.getByRole('button',{name:'Fit to screen'}).click();
    expect(await dialog.locator('.viewer-canvas').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();await expect(trigger).toBeFocused();
    await trigger.click();await page.getByRole('button',{name:'Close figure'}).click();
    await expect(dialog).not.toBeVisible();await expect(trigger).toBeFocused();
  }
});

test('one persistent research structure morphs continuously and reverses without detached edges', async ({page}) => {
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/');
  const graphic=page.locator('[data-story-morph]');
  const node=await page.locator('[data-node="12"]').elementHandle();
  async function move(progress:number) {
    await page.evaluate(p=>{
      const chapters=[...document.querySelectorAll<HTMLElement>('[data-chapter]')];
      const anchors=chapters.map(el=>el.getBoundingClientRect().top+scrollY+parseFloat(getComputedStyle(el).paddingTop)-innerHeight*.39);
      const i=Math.min(2,Math.floor(p));
      scrollTo({top:anchors[i]+(anchors[i+1]-anchors[i])*(p-i),behavior:'instant'});
    },progress);
    await expect.poll(async()=>Math.abs(Number(await graphic.getAttribute('data-progress'))-progress)).toBeLessThan(.006);
  }
  await move(0);
  const start=Number(await page.locator('[data-node="12"]').getAttribute('cx'));
  await move(.4);
  const middle=Number(await page.locator('[data-node="12"]').getAttribute('cx'));
  await move(1);
  const end=Number(await page.locator('[data-node="12"]').getAttribute('cx'));
  expect(middle).toBeGreaterThan(end+5);expect(middle).toBeLessThan(start-5);
  for(const p of [1.5,2,2.6,3,1.3,0]) {
    await move(p);
    expect(await node!.evaluate(el=>el.isConnected)).toBe(true);
    await expect(page.locator('[data-node]')).toHaveCount(19);
    const maxGap=await page.locator('.morph-svg').evaluate(svg=>{
      let gap=0;
      for(const edge of svg.querySelectorAll<SVGPathElement>('[data-edge]')) {
        const points=(edge.getAttribute('d')!.match(/-?[\d.]+/g) || []).map(Number);
        for(const [attr,x,y] of [['data-from',points[0],points[1]],['data-to',points[4],points[5]]] as const) {
          const node=svg.querySelector(`[data-node="${edge.getAttribute(attr)}"]`)!;
          gap=Math.max(gap,Math.hypot(x-Number(node.getAttribute('cx')),y-Number(node.getAttribute('cy'))));
        }
      }
      return gap;
    });
    expect(maxGap).toBeLessThan(.01);
  }
  await page.locator('[data-step="3"]').click();
  await expect.poll(async()=>Number(await graphic.getAttribute('data-progress'))).toBeGreaterThan(2.99);
  await expect(page.locator('[data-morph-source]')).toContainText('Research direction');
  await page.setViewportSize({width:390,height:844});
  await expect(page.locator('.story-sticky')).toBeVisible();
  await expect(page.locator('.chapter-figure:visible')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
