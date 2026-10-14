// Build the pinned engine and package its runtime, licences and matching source.
import { spawnSync } from 'node:child_process';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const repo = resolve('vendor/gobnative');
const output = resolve('public/other-projects/gobnative/play');
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`${command} failed (${result.status})`);
  return result;
}
try {
  await readFile(join(repo, 'scripts/build-web.sh'));
} catch {
  throw new Error(
    'Initialize gobnative first: git submodule update --init --recursive',
  );
}
// The downloadable source must match the engine being compiled.
run('git', ['-C', repo, 'diff', '--quiet', 'HEAD', '--']);
run('sh', [join(repo, 'scripts/build-web.sh')]);
const revision = run('git', ['-C', repo, 'rev-parse', 'HEAD'], {
  stdio: ['ignore', 'pipe', 'inherit'],
})
  .stdout.toString()
  .trim();
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(join(repo, 'dist/web'), output, { recursive: true });
run('git', [
  '-C',
  repo,
  'archive',
  '--format=tar.gz',
  `--output=${join(output, 'gobnative-source.tar.gz')}`,
  'HEAD',
]);
await writeFile(
  join(output, 'BUILD.txt'),
  `gobnative ${revision}\nEmscripten 6.0.12\nBuild: scripts/build-web.sh\nSource: gobnative-source.tar.gz\nRepository: https://github.com/initcore0/gobnative/tree/${revision}\n`,
);
// Adapt the shell for hosting without changing the engine or its import flow.
const shellPath = join(output, 'index.html');
const shell = (await readFile(shellPath, 'utf8'))
  .replace(
    'Module.canvas.focus();',
    'Module.canvas.focus({ preventScroll: true });',
  )
  .replace(
    '<title>gobnative</title>',
    '<title>gobnative — Play in your browser</title>\n<meta name="description" content="Play the Goblins trilogy with your own GOG installers. Game files and saves stay in your browser.">\n<meta name="robots" content="noindex">',
  )
  .replace(
    '</footer>',
    '<a href="../">Project page</a> <a href="gobnative-source.tar.gz">Engine source (GPL v3+)</a> <a href="LICENSE.txt">License</a>\n</footer>',
  );
await writeFile(shellPath, shell);
console.log(`Packaged gobnative ${revision.slice(0, 7)} at ${output}`);
