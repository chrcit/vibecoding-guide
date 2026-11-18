// Fails if a build contains anything that should exist only in `astro dev`:
// any trace of the review comment tool, or the dev-only review pages under dev/.
// Set ACG_DEV_PAGES=1 to allow dev/ (the figure checks build with it).
//
//   node scripts/check-dist.mjs dist
import fs from 'node:fs';
import path from 'node:path';

// MARKER is the comment tool's host id, its window flag and its storage key prefix;
// /__comments is its endpoint. Every build of the client contains both.
const MARKERS = ['acg-comments-dev-only', '/__comments'].map((m) => Buffer.from(m));

const dist = path.resolve(process.argv[2] || 'dist');
if (!fs.existsSync(dist)) {
  console.log(`check-dist: ${dist} does not exist`);
  process.exit(1);
}

const problems = [];
let files = 0;
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.isFile()) {
      files++;
      const buf = fs.readFileSync(p);
      for (const m of MARKERS) if (buf.includes(m)) problems.push(`${path.relative(dist, p)} contains "${m}"`);
    }
  }
};
walk(dist);

const devDir = path.join(dist, 'dev');
if (fs.existsSync(devDir) && process.env.ACG_DEV_PAGES !== '1') problems.push('dev/ exists (review pages must not ship; set ACG_DEV_PAGES=1 only for figure checks)');

if (problems.length) {
  for (const p of problems) console.log(`  ${p}`);
  console.log(`check-dist: FAIL, ${problems.length} problem(s) in ${files} files`);
  process.exit(1);
}
console.log(`check-dist: ${files} files, no dev-only traces`);
