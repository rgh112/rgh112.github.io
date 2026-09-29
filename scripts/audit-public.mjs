import { readdir, readFile } from 'node:fs/promises';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const blockedText = [
  /\bGPA\b/i,
  /\+82[\s-]*10[\s-]*\d{4}/,
  /(?:under review|anonymous submission|do not distribute)/i,
  /(?:Letter.of.Intent|Common.PhD.SOP|Specific.Skills)/i,
  /(?:\.private[\\/]|papers[\\/](?:AAAI|ICLR|CIKM|NeurIPS))/i,
];
let total = 0;
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) { await visit(file); continue; }
    total++;
    if (/\.(?:txt|docx|tex|map)$/i.test(entry.name)) throw new Error(`Unexpected public file: ${file}`);
    if (extname(file) === '.pdf' && entry.name !== 'Kunhee_Ryu_CV.pdf') throw new Error(`Unapproved PDF in public output: ${file}`);
    if (/\.(?:html|js|css|json|svg)$/i.test(entry.name)) {
      const text = await readFile(file, 'utf8');
      for (const pattern of blockedText) if (pattern.test(text)) throw new Error(`Public-content check failed in ${relative(root, file)}: ${pattern}`);
    }
  }
}
await visit(root);
console.log(`Public-content audit passed: ${total} files. No private-source paths or restricted text found.`);
