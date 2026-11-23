/*
 * Lessons 3 and 4: the pieces of a turn that only some parts have, drawn the way T3 Code draws
 * them (read on main at 7b47a21):
 *
 *   - a turn of the same thread still running when the part starts (`Part.running`): its request,
 *     "Working for …" with rows appearing at their points, then "Worked for …" folding the rows and
 *     its reply. T3 Code's own work-group rows (TimelineWorkGroupRows.tsx).
 *   - the part's request waiting as a queued message (`Part.queued`): a dashed, unfilled bubble with
 *     Send now, edit and remove under it (QueuedRunsControl.tsx), until the running turn ends.
 *   - the goal line at the end of the thread (`Part.goal`): a target icon, "Pursuing goal" or "Goal
 *     complete", the checks so far, the objective and Clear (ThreadActivityBanners.tsx, goalNowItem).
 *   - the workspace and branch controls under the composer (`Ui.checkout`, BranchToolbar).
 *
 * The page (pages/v2/index.astro) renders their markup; the player calls these at every point.
 */
import type { Part, Ui } from '../content';
import { t3code } from '../../data/t3code';

const [PURSUING, COMPLETE, CHECKS] = t3code.screen.goalLine.value;

/** "1m 50s" → seconds, and back. */
const seconds = (d: string) => (Number(/(\d+)m/.exec(d)?.[1] ?? 0) * 60) + Number(/(\d+)s/.exec(d)?.[1] ?? 0);
const duration = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`);

/** The running highlight over a live label, as the player draws it for the lesson's own turn. */
function shine(label: HTMLElement, on: boolean) {
  const had = label.querySelector(':scope > .v2-shine');
  if (!on) { had?.remove(); return; }
  if (had) return;
  const s = document.createElement('span');
  s.className = 'v2-shine';
  s.setAttribute('aria-hidden', 'true');
  s.innerHTML = `<span class="v2-shine-counter"><span class="v2-shine-text">${label.innerHTML}</span></span>`;
  label.append(s);
}

/** Run-turn folds the reader opened by hand, by turn. */
const opened = new WeakMap<HTMLElement, boolean>();

/** Draw a turn's extras at a point (Infinity: the turn at rest, after its end). */
export function fillExtras(t: HTMLElement, part: Part, point: number, current: boolean) {
  const run = part.running;
  const box = t.querySelector<HTMLElement>('[data-running]');
  if (run && box) {
    const ended = point >= run.ends;
    for (const li of box.querySelectorAll<HTMLElement>('[data-run-at]')) {
      const at = Number(li.dataset.runAt);
      li.hidden = at > point;
      const live = current && !ended && at === Math.min(point, Math.max(...run.rows.map((r) => r.at)));
      li.toggleAttribute('data-live', live);
    }
    const working = box.querySelector<HTMLElement>('[data-run-working]')!;
    working.hidden = ended;
    if (!ended) {
      // The earlier turn has been running a while already: its timer starts part-way.
      const took = seconds(run.took);
      const text = working.dataset.tpl!.replace('{duration}', duration(Math.round(took * (0.55 + (0.45 * (point + 1)) / (run.ends + 1)))));
      const label = working.querySelector<HTMLElement>('[data-run-working-text]')!;
      if (label.firstChild?.textContent !== text) label.textContent = text;
      shine(label, current);
    }
    const fold = box.querySelector<HTMLElement>('[data-run-fold]')!;
    fold.hidden = !ended;
    const open = !ended || (opened.get(t) ?? false);
    fold.setAttribute('aria-expanded', String(open));
    box.toggleAttribute('data-folded', !open);
    box.querySelector<HTMLElement>('[data-run-reply]')!.hidden = !ended;
  }

  const user = t.querySelector<HTMLElement>('[data-user]');
  if (part.queued && user) {
    const waiting = point < part.queued.at;
    user.toggleAttribute('data-queued', waiting);
    const actions = user.querySelector<HTMLElement>('[data-queued-actions]');
    if (actions) actions.hidden = !waiting;
    // No turn of its own yet: its work log starts once it is sent.
    const work = t.querySelector<HTMLElement>('[data-work]');
    if (work) work.hidden = waiting;
  }

  const goal = t.querySelector<HTMLElement>('[data-goal]');
  if (part.goal && goal) {
    const g = part.goal;
    const i = Math.min(point, g.checks.length - 1);
    const met = point >= g.met;
    const n = g.checks[i] ?? 0;
    goal.dataset.state = met ? 'complete' : 'active';
    const title = `${met ? COMPLETE : PURSUING}${n ? ` · ${CHECKS.replace('{count}', String(n)).replace(/checks$/, n === 1 ? 'check' : 'checks')}` : ''}`;
    const el = goal.querySelector<HTMLElement>('[data-goal-title]')!;
    if (el.textContent !== title) el.textContent = title;
  }
}

/** The fold of a running turn's rows opens and closes by hand, like the lesson turn's own. */
export function wireExtras(root: HTMLElement) {
  root.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-run-fold]');
    if (!b) return;
    const t = b.closest<HTMLElement>('[data-turn]')!;
    const box = b.closest<HTMLElement>('[data-running]')!;
    const open = b.getAttribute('aria-expanded') !== 'true';
    opened.set(t, open);
    b.setAttribute('aria-expanded', String(open));
    box.toggleAttribute('data-folded', !open);
  });
}

// Icons drawn after lucide's (Folder, FolderGit2, GitBranch), as the branch toolbar uses them.
const ln = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const ico = (d: string) => `<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" focusable="false">${d}</svg>`;
const FOLDER = ico(`<path ${ln} d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>`);
const FOLDER_GIT = ico(`<path ${ln} d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5"/><circle ${ln} cx="13" cy="12" r="2"/><path ${ln} d="M18 19c-2.8 0-5-2.2-5-5v8"/><circle ${ln} cx="20" cy="19" r="2"/>`);
const BRANCH = ico(`<line ${ln} x1="6" x2="6" y1="3" y2="15"/><circle ${ln} cx="18" cy="6" r="3"/><circle ${ln} cx="6" cy="18" r="3"/><path ${ln} d="M18 9a9 9 0 0 1-9 9"/>`);
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** The workspace and branch controls. Returns true when what they say changed. */
export function paintCheckout(work: HTMLElement, branch: HTMLElement, c: Ui['checkout']): boolean {
  const key = c ? `${c.label}|${c.worktree ? 1 : 0}|${c.branch ?? ''}` : '';
  if (work.dataset.key === key) return false;
  work.dataset.key = key;
  work.hidden = !c;
  branch.hidden = !c?.branch;
  if (c) {
    work.innerHTML = `${c.worktree ? FOLDER_GIT : FOLDER}<span>${esc(c.label)}</span>`;
    work.title = c.worktree ? 'Worktree' : 'Workspace';
    if (c.branch) branch.innerHTML = `${BRANCH}<span>${esc(c.branch)}</span>`;
  }
  return true;
}
