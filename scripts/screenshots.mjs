import { launchBrowser } from './browser.mjs';
import { mkdir } from 'node:fs/promises';
const browser = await launchBrowser();
const output = new URL('../../.private/preview/', import.meta.url);
await mkdir(output, {recursive:true});
try {
  const page = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for (const [name,path] of [['home','/'],['research','/research/'],['ood','/research/ood-resolution/'],['local','/research/beyond-local-validity/'],['cv','/cv/'],['directions','/directions/']]) {
    await page.goto(`http://127.0.0.1:4321${path}`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await page.screenshot({path:new URL(`${name}-desktop.png`,output).pathname.replace(/^\/(\w:)/,'$1'),fullPage:true});
  }
  await page.setViewportSize({width:390,height:844});
  for(const [name,path] of [['home','/'],['research','/research/'],['ood','/research/ood-resolution/'],['cv','/cv/']]){
    await page.goto(`http://127.0.0.1:4321${path}`,{waitUntil:'networkidle'});
    await page.screenshot({path:new URL(`${name}-mobile.png`,output).pathname.replace(/^\/(\w:)/,'$1'),fullPage:true});
  }
  console.log(JSON.stringify({errors,output:output.pathname}));
} finally {await browser.close();}
