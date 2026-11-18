// Review pages (component kit, level demo, figure gallery) live in src/dev/.
// They are routed at /dev/<name>/ only in `astro dev`, or in a build when
// ACG_DEV_PAGES=1 is set (the figure checks use that). They never ship.
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export default function devPages() {
  return {
    name: 'acg-dev-pages',
    hooks: {
      'astro:config:setup': ({ command, injectRoute, config }) => {
        if (command !== 'dev' && !process.env.ACG_DEV_PAGES) return;
        const dir = new URL('./src/dev/', config.root);
        for (const file of readdirSync(fileURLToPath(dir))) {
          if (!file.endsWith('.astro')) continue;
          const name = file.replace(/\.astro$/, '');
          injectRoute({ pattern: name === 'index' ? '/dev' : `/dev/${name}`, entrypoint: `./src/dev/${file}` });
        }
      },
    },
  };
}
