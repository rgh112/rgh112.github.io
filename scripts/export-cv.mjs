import { launchBrowser } from './browser.mjs';
import { mkdir } from 'node:fs/promises';
const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  await page.goto(`${process.env.SITE_URL || 'http://127.0.0.1:4321'}/cv/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const updated = await page.locator('[data-cv-updated]').getAttribute('data-cv-updated');
  await mkdir(new URL('../public/', import.meta.url), { recursive: true });
  await page.pdf({ path: new URL('../public/Kunhee_Ryu_CV.pdf', import.meta.url).pathname.replace(/^\/(\w:)/, '$1'), format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: `<div style="width:100%;font-size:8px;color:#777;padding:0 17mm;display:flex;justify-content:space-between"><span>Kunhee Ryu · Curriculum vitae · ${updated}</span><span class="pageNumber"></span></div>` });
  console.log('Exported public/Kunhee_Ryu_CV.pdf from the public CV page.');
} finally { await browser.close(); }
