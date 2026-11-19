// Chapter 3 (Part 1: Foundations): Git, GitHub, static vs dynamic cloud hosting, and server specs.
import type { Chapter, Ctx } from '../chapter';
import { byLevel } from '../chapter';
import type { Script } from '../scene';
import { solo, jobs, ship, lab } from '../presets';
import { route, reverse } from '../picture';

type HostKind = 'static' | 'dynamic';
type SpecTier = 'hobby' | 'small' | 'scaled';

async function runGit(ctx: Ctx, h: Script, undo = false) {
  ctx.model(
    'Git (your safety net).',
    byLevel(ctx.level, {
      plain: 'Git takes snapshots (“commits”) of your project folder. Save a snapshot before letting an agent try something big—if you hate the result, one command puts everything back exactly as it was.',
      technical: 'Commit working states before every agent run (`git commit`). Clean diffs let you inspect every line changed, run `git diff`, or revert a bad turn instantly with zero fear.',
      engineer: 'Git turns autonomous agent mutations into atomic, auditable transactions—every run operates against a known clean HEAD so rollbacks and bisects stay trivial.',
    }),
  );
  h.set((s) => Object.assign(s, solo({
    tools: true,
    project: { rules: 'plain', commits: ['ok', 'ok'] },
    labels: [
      lab('you', 'you', 'left'),
      lab('a0', 'agent', 'top', 'wiki/agent/'),
      lab('project', 'git history', 'top', 'wiki/version-control/'),
    ],
  })));
  if (!undo) {
    ctx.stat([['saved snapshots', '2 commits'], ['status', 'working cleanly'], ['can undo?', 'always']]);
    ctx.say('you', 'Save a snapshot first, then try redesigning the header.');
    await h.send(route.youToAgent(), 'you', { ms: 380 });
    h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 3 }, { t: 'tool', h: 4 }]; s.project!.commits = ['ok', 'ok', 'bad']; s.agents[0]!.lamp = 'bad'; });
    ctx.stat([['saved snapshots', '2 safe + 1 broken'], ['status', 'header broke mobile'], ['can undo?', '1 click back']]);
    ctx.say(null, 'The new edit broke mobile layout. Because you saved a commit first, nothing is lost—press Undo to jump straight back.');
  } else {
    h.set((s) => { s.project!.commits = ['ok', 'ok']; s.agents[0]!.lamp = 'ok'; });
    ctx.stat([['saved snapshots', '2 commits'], ['status', 'restored to last good commit'], ['lost work', '0']]);
    ctx.say(null, 'Reverted in one second. Every file is back to the exact state before the broken edit.');
  }
}

async function runGithub(ctx: Ctx, h: Script) {
  ctx.model(
    'GitHub & branches.',
    byLevel(ctx.level, {
      plain: 'GitHub is your project’s online home. A branch lets an agent build a new feature off to the side so your live version stays safe until you approve it.',
      technical: 'Push feature branches to GitHub so CI runs `tsc --noEmit` and unit tests automatically, and review the Pull Request diff before merging into `main`.',
      engineer: 'GitHub provides remote durability, branch protection rules, automated status checks, preview environments per PR, and the collaboration surface for human + agent reviews.',
    }),
  );
  h.set((s) => Object.assign(s, ship(2, {
    trees: true,
    people: ['peer'],
    labels: [
      lab('you', 'you', 'left'),
      lab('a0', 'local repo', 'top', 'wiki/version-control/'),
      lab('w0', 'feature branch', 'top', 'wiki/branch/'),
      lab('mgate', 'PR check', 'top', 'wiki/pull-request/'),
      lab('project', 'GitHub main', 'top'),
    ],
  })));
  ctx.stat([['live branch', 'main (protected)'], ['agent works on', 'separate branch'], ['backup', 'safe on GitHub']]);
  ctx.say(null, 'Your laptop could fall in a lake and your whole project history is still safe on GitHub—and main only updates when a branch passes checks.');
  h.set((s) => { s.agents[1]!.blocks = [{ t: 'tool', h: 4 }, { t: 'model', h: 3 }]; s.gates![0]!.lamp = 'ok'; s.project!.commits = ['ok', 'ok', 'ok']; });
  await h.wait(600);
}

function runHosting(ctx: Ctx, kind: HostKind) {
  ctx.model(
    kind === 'static' ? 'Static hosting.' : 'Dynamic cloud hosting.',
    kind === 'static'
      ? byLevel(ctx.level, {
          plain: 'Just HTML, CSS and JavaScript files uploaded to a fast global network (like GitHub Pages or Cloudflare Pages). Often free, blazing fast, and almost impossible to crash—ideal for guides, sites, and simple tools.',
          technical: 'Pre-built static assets served straight from a CDN edge (GitHub Pages, Cloudflare Pages, Netlify). Zero server runtime to patch, automatic HTTPS, and instant branch previews.',
          engineer: 'Immutable build artifacts pushed to CDN edge nodes—O(1) operational overhead, near-zero cold start and attack surface. Reach for static first unless server state or secrets require compute.',
        })
      : byLevel(ctx.level, {
          plain: 'Adds a live server computer and a database in the cloud. You need this once people create accounts, save data across devices, or take payments.',
          technical: 'Runs backend code (Node, Python, Go, Edge workers) plus a persistent database (Postgres, SQLite/Turso) and secret environment variables for auth, APIs and mutations.',
          engineer: 'Introduces runtime state, schema migrations, auth/session boundaries, secret management, observability and scaling limits—choose only when client-side or static flows genuinely cannot satisfy requirements.',
        }),
  );
  void ctx.scene.run(async (h) => {
    if (kind === 'static') {
      h.set((s) => Object.assign(s, jobs(1, {
        gap: 88,
        machines: ['cloud'],
        trees: false,
        labels: [
          lab('you', 'visitors', 'left'),
          lab('j0', 'CDN files', 'top', 'wiki/deployment/'),
          lab('zone:0', 'static host (Pages / Cloudflare)', 'bottom'),
          lab('project', 'HTML · CSS · JS', 'top', 'wiki/frontend/'),
        ],
      })));
      ctx.stat([['needs a server?', 'no'], ['typical cost', '$0 – pennies'], ['great for', 'sites, docs, calculators, client tools']]);
      ctx.say(null, 'Static hosting sends ready-made files straight to the visitor’s browser. Nothing to keep awake or patch.');
      h.set((s) => { s.agents[0]!.blocks = [{ t: 'model', h: 3 }]; s.agents[0]!.lamp = 'ok'; });
    } else {
      h.set((s) => Object.assign(s, jobs(2, {
        gap: 92,
        machines: ['cloud', 'box'],
        trees: false,
        labels: [
          lab('you', 'users', 'left'),
          lab('j0', 'app server', 'top', 'wiki/backend/'),
          lab('j1', 'database', 'top', 'wiki/database/'),
          lab('zone:0', 'compute server', 'bottom'),
          lab('zone:1', 'persistent storage', 'bottom'),
          lab('project', 'saved data', 'top'),
        ],
      })));
      ctx.stat([['needs a server?', 'yes + database'], ['unlocks', 'logins, saved data, private APIs'], ['examples', 'Fly.io, Railway, Render, Vercel, VPS']]);
      ctx.say(null, 'Dynamic hosting runs your backend code on a cloud server connected to a database—needed for logins, payments, and shared user data.');
      h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 3 }, { t: 'tool', h: 4 }]; s.agents[1]!.blocks = [{ t: 'rules', h: 4 }, { t: 'tool', h: 4 }]; s.agents[0]!.lamp = 'ok'; s.agents[1]!.lamp = 'ok'; });
    }
    await h.wait(400);
  });
}

const SPECS: Record<SpecTier, { label: string; stat: [string, string][]; say: string; model: Record<'plain' | 'technical' | 'engineer', string> }> = {
  hobby: {
    label: 'Starter / Free tier',
    stat: [['compute', 'shared CPU · 256–512 MB RAM'], ['sleep', 'may pause when idle'], ['cost', '$0–$5 / month']],
    say: 'Perfect for trying ideas, sharing demos with friends, or a club app with 20 members. Might take 2 seconds to wake up after being idle.',
    model: {
      plain: 'Start small! Almost every early project runs fine on a free or $5/month starter tier—upgrade only when real people actually use it.',
      technical: 'Single container or serverless tier with a managed starter DB; watch out for cold starts and ephemeral local filesystems (store uploads in object storage).',
      engineer: 'Use ephemeral starter environments for prototypes and PR previews; enforce stateless app instances early so scaling later requires zero rewrite.',
    },
  },
  small: {
    label: 'Always-on small server',
    stat: [['compute', '1–2 vCPU · 1–4 GB RAM'], ['sleep', 'always awake'], ['cost', '~$5–$25 / month']],
    say: 'Handles hundreds to thousands of everyday users cleanly on one VPS or managed PaaS (Hetzner, Fly.io, Railway, Render) plus automated daily database backups.',
    model: {
      plain: 'A modest $10–$20/month cloud box is shockingly capable—it easily powers a real small business app without complex setup.',
      technical: '1–2 vCPU + 2 GB RAM + managed Postgres (or SQLite + Litestream) covers most production SaaS apps cleanly; add health checks and automated backups.',
      engineer: 'Sweet spot for early production: predictable fixed cost, zero cold starts, vertical headroom, and straightforward observability before distributed complexity is warranted.',
    },
  },
  scaled: {
    label: 'Multi-instance cloud',
    stat: [['compute', 'multiple servers + CDN'], ['database', 'managed primary + backups'], ['extras', 'staging, queues, alerts']],
    say: 'When downtime costs real money or traffic spikes hard: separate web servers, managed database with point-in-time recovery, background job queues, and a staging environment.',
    model: {
      plain: 'You only need this once an app has serious traffic or strict uptime rules—don’t let an agent over-engineer a huge cloud setup on day one.',
      technical: 'Split stateless app replicas behind a load balancer, isolate background workers, run migrations safely across deploys, and mirror prod in a staging environment.',
      engineer: 'Architect for horizontal statelessness, zero-downtime schema migrations, connection pooling, idempotent background queues and infrastructure-as-code reproducibility.',
    },
  },
};

function runSpec(ctx: Ctx, tier: SpecTier) {
  const sp = SPECS[tier];
  ctx.model(`${sp.label}.`, sp.model[ctx.level]);
  void ctx.scene.run(async (h) => {
    const count = tier === 'hobby' ? 1 : tier === 'small' ? 2 : 3;
    h.set((s) => Object.assign(s, jobs(count, {
      gap: 84,
      machines: Array.from({ length: count }, () => 'cloud' as const),
      trees: false,
      labels: [
        lab('you', 'users', 'left'),
        lab('j0', tier === 'hobby' ? 'tiny app' : 'web server', 'top', 'wiki/deployment/'),
        ...(count >= 2 ? [lab('j1', 'database', 'top', 'wiki/database/')] : []),
        ...(count >= 3 ? [lab('j2', 'workers & cache', 'top')] : []),
      ],
    })));
    ctx.stat(sp.stat);
    ctx.say(null, sp.say);
    h.set((s) => {
      for (const a of s.agents) { a.blocks = [{ t: 'tool', h: tier === 'hobby' ? 2.5 : tier === 'small' ? 4 : 6 }]; a.lamp = 'ok'; }
    });
    await h.wait(300);
  });
}

export async function demo(ctx: Ctx, h: Script) {
  await runGit(ctx, h, false);
  await h.wait(900);
  await runGit(ctx, h, true);
}

export const stackCh: Chapter = {
  steps: {
    git: { scene: () => solo({ tools: true, project: { rules: 'plain', commits: ['ok', 'ok'] } }), enter: (ctx) => void ctx.scene.run((h) => runGit(ctx, h, false)) },
    github: { scene: () => ship(2, { trees: true, people: ['peer'] }), enter: (ctx) => void ctx.scene.run((h) => runGithub(ctx, h)) },
    hosting: { scene: () => jobs(1, { gap: 88, machines: ['cloud'], trees: false }), enter: (ctx) => runHosting(ctx, 'static') },
    specs: { scene: () => jobs(1, { gap: 84, machines: ['cloud'], trees: false }), enter: (ctx) => runSpec(ctx, 'hobby') },
  },
  actions: {
    git: (ctx, val) => void ctx.scene.run((h) => runGit(ctx, h, val === 'undo')),
    hosting: (ctx, val) => runHosting(ctx, val as HostKind),
    spec: (ctx, val) => runSpec(ctx, val as SpecTier),
  },
};
