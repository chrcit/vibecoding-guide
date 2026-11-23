/* Guide v2, Set up: see v2/content.ts for the words, types and helpers. Script: planning/guide-v2/lessons-14-17-setup.md. */
import type { SceneState, Label, P3 } from '../../journey/picture';
import { solo, lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import { t3code } from '../../data/t3code';
import { claims } from '../../data/claims';
import { A, FIRST, RAN, atYou, b, n, points, push, type Lesson } from '../content';

// ---------- Set up: Git and hosting ----------
// Still the week before lesson 1. Git on this computer, a GitHub account T3 Code can use, and a
// plan for where the app will live. The project itself comes in First setup. Names and addresses
// are made up.

const [, , RAN_N] = t3code.screen.workLogGroups.value;
const usd = (v: number) => `$${v}`;

const frame = (): Label[] => [lab('you', 'you', 'left'), termLabel('a0', 'agent', 'top', 'the agent'), termLabel('tools', 'tools')];
function floor(o: { commits?: number; host?: boolean } = {}): SceneState {
  const s = solo({ tools: true, project: o.commits != null ? { rules: 'none', commits: Array(o.commits).fill('ok'), files: ['', '', '', '', '', ''] } : false, blocks: [FIRST], labels: frame() });
  // Without a project the floor is small: keep the camera from zooming in on it.
  if (o.commits == null) s.zoomMax = 1.4;
  if (o.host) {
    s.gear = [{ id: 'host', at: [246, 64], kind: 'server' }];
    s.people = [{ id: 'user0', at: [300, 100], who: 'user', scale: 0.85 }, { id: 'user1', at: [316, 120], who: 'user', scale: 0.85 }];
  }
  return s;
}
const note = (s: SceneState, ...more: Label[]) => { s.labels = [...frame(), ...more]; };
const run = (back: 'tool' | 'bad' = 'tool') => ({ to: 'tool', tool: 'run', back }) as const;
const nearTools = (text: string) => lab('tool:run', text, 'bottom');

const sGit: Lesson = {
  id: 's-git-and-hosting',
  parts: [
    {
      title: 'Git on this computer',
      thread: 'Git and GitHub',
      fresh: true,
      request: 'Set up Git on this computer for the club’s projects. Use the name “Lantern Office” and the email office@lantern.example.',
      lede: 'Git keeps every version of a project. Each commit is a point you can go back to, and T3 Code commits, pushes and diffs with it.',
      points: points(floor(), [
        { say: 'You ask in a scratch thread. Every commit carries a name and an email, so Git needs them first.', moves: [{ to: 'agent' }], ui: { env: '', limits: [], modelName: '' },
          edit: (s) => { push(s, b('you', 2)); A(s).lamp = 'work'; note(s); } },
        { say: 'It checks Git is installed and sets the name and email you gave it.', moves: [run(), run()],
          edit: (s) => { push(s, b('model', 0.6), b('tool', 1), b('model', 0.6), b('tool', 1)); note(s, nearTools('git config: name, email')); } },
        { say: 'Done. From here on, a new project starts with a first commit, and every later commit is a point you can return to.', moves: [{ to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 1.6)); A(s).lamp = 'ok'; note(s, atYou('Git: ready')); } },
      ]),
      log: {
        took: '15s',
        rows: [
          { at: 1, label: n(RAN_N, 3), tone: 'ok', detail: { plain: 'Git is installed; name and email set', technical: 'git --version; git config --global user.name, user.email' } },
        ],
      },
      answer: [
        'Git is installed, and commits on this computer will now say “Lantern Office <office@lantern.example>”.',
        'Without a name and email, T3 Code still makes a new project but skips its first commit.',
      ],
      tryIt: { prompt: 'Set up Git on this computer. Use the name [name] and the email [email].', t3: 'Start this in a thread without a project: it lives in a scratch folder and can become a project later.' },
      sources: ['t3code.newProject', 't3code.scratchThreads', 't3code.worktrees'],
    },
    {
      title: 'A GitHub account T3 Code can use',
      thread: 'Git and GitHub',
      request: 'Connect this computer to the club’s GitHub account, so T3 Code can make private repositories and pull requests.',
      lede: 'GitHub holds a copy of the project off this computer, and it’s where pull requests and reviews happen.',
      points: points(floor({ commits: 0 }), [
        { say: 'T3 Code talks to GitHub with a token: one saved in its settings, GH_TOKEN, or the GitHub CLI signed in.', moves: [{ to: 'agent' }, run('bad')],
          edit: (s) => { push(s, b('you', 2), b('model', 0.6), b('bad', 1)); A(s).lamp = 'work'; note(s, nearTools('gh: not signed in')); } },
        { say: 'Signing in needs you: it starts gh auth login, and you finish it in the browser.', moves: [run()],
          edit: (s) => { push(s, b('model', 0.6), b('tool', 1)); note(s, atYou('you sign in')); } },
        { say: 'Signed in. In Settings → Source control & issues, choose Rescan, and T3 Code finds it. New project can now create a private repository on GitHub.', moves: [run(), { to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 0.6), b('tool', 1), b('model', 1.6)); A(s).lamp = 'ok'; note(s, lab('main', 'GitHub: ready', 'bottom')); } },
      ]),
      log: {
        took: '1m 10s',
        rows: [
          { at: 0, label: RAN, tone: 'bad', detail: { plain: 'the GitHub CLI isn’t signed in', technical: 'gh auth status: not logged in' } },
          { at: 1, label: RAN, detail: { plain: 'sign-in started; you finish it in the browser', technical: 'gh auth login --web' } },
          { at: 2, label: RAN, tone: 'ok', detail: { plain: 'signed in to the club’s account', technical: 'gh auth status: logged in' } },
        ],
      },
      answer: [
        'This computer is signed in to GitHub as the club’s account. In T3 Code, open Settings → Source control & issues and choose Rescan.',
        'When you make the Lantern’s project, turn on Create private repository on GitHub. Keep it private: the guest list will live in it.',
      ],
      tryIt: { prompt: 'Connect this computer to my GitHub account so you can make private repositories and pull requests.', t3: 'For a folder that already has commits but no remote, Publish Repository creates the hosted repository and pushes.' },
      sources: ['t3code.githubAuth', 't3code.publishRepo'],
    },
    {
      title: 'Where it will live',
      thread: 'Git and GitHub',
      request: 'When staff use the app, where should it live? Don’t set anything up yet; tell me the options and the costs.',
      lede: 'For now the app runs on your laptop and only your laptop can open it. Lesson 16 shares a preview; lesson 17 moves work to other machines.',
      points: points(floor({ commits: 1, host: true }), [
        { say: `A host keeps the app running where staff’s phones can reach it. Static pages are free on Cloudflare; its paid Workers plan starts at ${usd(claims.hosting.cloudflarePaid.value)} a month.`, moves: [{ to: 'agent' }],
          edit: (s) => { push(s, b('you', 2.4)); A(s).lamp = 'work'; note(s, lab('gear:host', 'a host', 'right')); } },
        { say: 'Not GitHub Pages: a Pages site is public even when its repository is private. A guest list needs a gate in front.', moves: [{ to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 2)); note(s, lab('gear:host', 'never public', 'right')); } },
        { say: 'Passwords and keys go in the host’s settings, never in the repository. Everything in the repository goes wherever the repository goes.',
          edit: (s) => { note(s, lab('gear:host', 'secrets live here', 'bottom'), lab('project', 'never in the repository', 'right')); } },
      ]),
      answer: [
        `Cloudflare suits this: static pages are free, the paid Workers plan starts at ${usd(claims.hosting.cloudflarePaid.value)} a month, and Cloudflare Access can put an email one-time code in front, free for up to ${claims.hosting.cloudflareAccess.value} users. Only the staff you allow get in.`,
        'Not GitHub Pages: its sites are public, even from a private repository. And whichever host: passwords and keys go in its settings, never in the repository.',
      ],
      deeper: { level: 'technical', text: `For your own devices only, tailscale serve shares a port on this computer with the devices on your tailnet; Tailscale’s Personal plan is free for up to ${claims.hosting.tailscalePersonal.value} users.` },
      tryIt: { prompt: 'Where should [the app] live so [who] can use it, and only them? Tell me the options and what they cost; don’t set anything up yet.', t3: 'Ask in the project’s thread once it exists; the agent can set up the host with your account when you say go.' },
      sources: ['claims.hosting.cloudflareStatic', 'claims.hosting.cloudflarePaid', 'claims.hosting.cloudflareAccess', 'claims.hosting.githubPagesPublic', 'claims.hosting.tailscaleServe', 'claims.hosting.tailscalePersonal'],
    },
  ],
};

export default sGit;
