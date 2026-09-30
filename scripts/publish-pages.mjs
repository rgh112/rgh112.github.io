import { cpSync, existsSync, mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const project = resolve(fileURLToPath(new URL('../', import.meta.url)));
const dist = join(project, 'dist');
function git(cwd, args, allowed = [0]) {
  const result = spawnSync('git', ['-c', `safe.directory=${cwd.replaceAll('\\', '/')}`, ...args], { cwd, encoding: 'utf8' });
  if (result.error) throw result.error;
  if (!allowed.includes(result.status)) throw new Error(result.stderr || `git ${args[0]} failed`);
  return result;
}
const remote = git(project, ['remote', 'get-url', 'origin']).stdout.trim();
if (!/^https:\/\/github\.com\/rgh112\/rgh112\.github\.io(?:\.git)?$/.test(remote)) throw new Error('Expected the rgh112/rgh112.github.io origin.');
if (git(project, ['status', '--porcelain']).stdout.trim()) throw new Error('Commit source changes before publishing.');
if (!existsSync(join(dist, 'index.html')) || !existsSync(join(dist, '.nojekyll'))) throw new Error('Run npm run build first.');
const revision = git(project, ['rev-parse', '--short', 'HEAD']).stdout.trim();
const name = git(project, ['config', 'user.name']).stdout.trim();
const email = git(project, ['config', 'user.email']).stdout.trim();
const tempRoot = realpathSync(tmpdir());
const staging = mkdtempSync(join(tempRoot, 'kunhee-pages-'));
try {
  git(staging, ['init', '-b', 'gh-pages']);
  git(staging, ['config', 'user.name', name]);
  git(staging, ['config', 'user.email', email]);
  git(staging, ['remote', 'add', 'origin', remote]);
  const branch = git(staging, ['ls-remote', '--exit-code', 'origin', 'refs/heads/gh-pages'], [0, 2]);
  if (branch.status === 0) {
    git(staging, ['fetch', '--depth=1', 'origin', 'gh-pages']);
    git(staging, ['checkout', '-B', 'gh-pages', 'FETCH_HEAD']);
    git(staging, ['rm', '-r', '--ignore-unmatch', '.']);
  }
  cpSync(dist, staging, { recursive: true });
  git(staging, ['add', '.']);
  if (!git(staging, ['status', '--porcelain']).stdout.trim()) {
    console.log('The published files already match this build.');
  } else {
    git(staging, ['commit', '-m', `Publish website from ${revision}`]);
    const result = git(staging, ['push', 'origin', 'HEAD:gh-pages']);
    console.log(result.stdout || result.stderr);
    console.log('Uploaded to gh-pages. Website: https://kunheeryu.com/');
  }
} finally {
  // Only remove the freshly created staging directory under the OS temp root.
  const target = realpathSync(staging);
  if (dirname(target) !== resolve(tempRoot) || !basename(target).startsWith('kunhee-pages-')) throw new Error('Unexpected staging path; cleanup stopped.');
  rmSync(target, { recursive: true, force: true });
}
