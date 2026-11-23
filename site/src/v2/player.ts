/*
 * Guide v2 in the browser: plays a lesson thread part by part and point by point. It keeps the
 * sidebar (the table of contents), the turns in the chat, the lesson controls in the composer slot,
 * the thread details and the browser panel in step. The browser panel holds one picture for the
 * whole lesson (the journey's engine), so a new part glides from the last one instead of starting
 * blank. The page holds every turn's HTML (pages/v2/index.astro); this only shows, hides and
 * animates.
 *
 * A turn plays like a live T3 Code turn: the request, "Working for …" while the agent works, a
 * work-log row for each step as its point comes, then the reply at the point where the agent
 * answers, with "Worked for …" folding the log above it. The current point's words sit in the
 * composer slot, and the chat follows the newest row unless the reader has scrolled away.
 */
import { Scene, type Script } from '../journey/scene';
import { route, reverse, type SceneState, type XY } from '../journey/picture';
import { TOC, STATUS, MODEL, whereIs, type Move, type Point, type Ui, type Part } from './content';
import { LESSONS, uiAt } from './lessons';
import type { Preview } from './preview';
import { LEVEL_EVENT, isLevel, type Level } from '../lib/levels';
import { esc } from './html';
import { fitStage, markLabels } from './ui/fit';
import { splitter } from './ui/splitter';
import { sheet } from './ui/sheet';
import { projectFilter } from './ui/filter';
import { previewPane } from './ui/preview';
import { guideMenu } from './ui/menu';
import { follower } from './ui/follow';
import { sidebarTree } from './ui/tree';
import { fillExtras, paintCheckout, wireExtras } from './ui/turnextras';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const phone = matchMedia('(max-width: 47.99rem)');
const STORE = 'acg-v2-done';

interface Here { lesson: string; part: number; point: number }
/** How a move was asked for. Only a pointer or playback animates; keys and jumps land still. */
type Via = 'play' | 'pointer' | 'still';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const readLevel = (): Level => { const l = document.documentElement.dataset.level; return isLevel(l) ? l : 'plain'; };

/** The point where the agent answers: the first that sends something back to you, else the last. */
export function replyAt(part: Part): number {
  if (part.replyAt != null) return part.replyAt;
  const i = part.points.findIndex((p) => p.moves.some((m) => m.to === 'you'));
  return i < 0 ? part.points.length - 1 : i;
}

/** "1m 50s" → seconds. */
const seconds = (d: string) => (Number(/(\d+)m/.exec(d)?.[1] ?? 0) * 60) + Number(/(\d+)s/.exec(d)?.[1] ?? 0);
const duration = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`);

// The sidebar's status icons, drawn after lucide's (CircleDashed, CircleCheck, ShieldQuestion).
const ln = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const ico = (d: string) => `<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" focusable="false">${d}</svg>`;
const STATUS_ICON: Record<string, string> = {
  working: ico(`<path ${ln} d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7M21.82 10.1a9.93 9.93 0 0 1 0 3.8M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69M13.9 21.82a9.94 9.94 0 0 1-3.8 0M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7M2.18 13.9a9.93 9.93 0 0 1 0-3.8M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69"/>`),
  done: ico(`<circle ${ln} cx="12" cy="12" r="10"/><path ${ln} d="m9 12 2 2 4-4"/>`),
  // Lessons 14–17: T3 Code's Limited (CircleAlert, warning colour) and a guest's Request (UserRound).
  limited: ico(`<circle ${ln} cx="12" cy="12" r="10"/><path ${ln} d="M12 8v4M12 16h.01"/>`),
  request: ico(`<circle ${ln} cx="12" cy="8" r="5"/><path ${ln} d="M20 21a8 8 0 0 0-16 0"/>`),
  // Lesson 3: T3 Code draws Goal with Working's icon and colour (SidebarThreadRow.tsx).
  goal: ico(`<path ${ln} d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7M21.82 10.1a9.93 9.93 0 0 1 0 3.8M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69M13.9 21.82a9.94 9.94 0 0 1-3.8 0M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7M2.18 13.9a9.93 9.93 0 0 1 0-3.8M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69"/>`),
  approval: ico(`<path ${ln} d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path ${ln} d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3M12 17h.01"/>`),
  // Chapter 3: a lead waiting on its child threads (CircleDotDashed).
  waiting: ico(`<path ${ln} d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7M21.82 10.1a9.93 9.93 0 0 1 0 3.8M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69M13.9 21.82a9.94 9.94 0 0 1-3.8 0M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7M2.18 13.9a9.93 9.93 0 0 1 0-3.8M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69"/><circle ${ln} cx="12" cy="12" r="1"/>`),
  // Lesson 7: Input, T3 Code's MessageCircleQuestion.
  input: ico(`<path ${ln} d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path ${ln} d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>`),
};
/** A status word's key for its icon and colour: "Working" → working. Any status T3 Code has works; unknown icons fall back to none. */
const statusKey = (s: string) => s.toLowerCase().replace(/\s+/g, '-');

export function boot(root: HTMLElement) {
  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const $$ = <T extends HTMLElement = HTMLElement>(sel: string) => [...root.querySelectorAll<T>(sel)];
  const base = root.dataset.base ?? '/';
  const scroller = $('[data-scroll]');
  const turns = $$('[data-turn]');
  const soon = $('[data-soon]');
  const turnEl = (lesson: string, part: number) => turns.find((t) => t.dataset.lesson === lesson && Number(t.dataset.part) === part)!;

  let here: Here = { lesson: 'l1', part: 0, point: 0 };
  let playing = false;
  /** Bumped by every playback start and stop: an older loop sees it and quits. */
  let token = 0;
  /** Bumped by every show(): a reply waiting for its pucks lands only if nothing moved since. */
  let shown = 0;
  let lastUi: Ui = {};
  let lastPart = '';
  let lastLesson = '';
  let tab: 'ex' | 'preview' = 'ex';
  let lastStage = '';
  let done = new Set<string>();
  /** Work logs the reader opened or closed by hand, by turn. */
  const folds = new Map<HTMLElement, boolean>();
  try { done = new Set(JSON.parse(localStorage.getItem(STORE) ?? '[]')); } catch { /* private window */ }
  const saveDone = () => { try { localStorage.setItem(STORE, JSON.stringify([...done])); } catch { /* ignore */ } };

  root.setAttribute('data-ready', '');

  const lesson = () => LESSONS[here.lesson];
  const l0 = () => !!lesson();
  const partOf = (): Part => lesson()!.parts[here.part]!;
  const pointOf = (): Point => partOf().points[here.point]!;
  const lastPointOf = (part: number) => lesson()!.parts[part]!.points.length - 1;
  const isLast = () => here.point === lastPointOf(here.part);
  const isAtEnd = () => { const l = lesson(); return !!l && here.part === l.parts.length - 1 && isLast(); };

  const follow = follower(scroller, $('[data-jump]'), reduced);
  const tree = sidebarTree(root);

  // ---------- the picture ----------

  const stage = $('[data-stage]');
  const scene = new Scene(stage);
  scene.base = base;
  scene.level = readLevel();
  let mini: Scene | null = null;

  /** Annotation words new at each point: what changed since the point before. */
  const words = (p: Point) => new Set((p.state.labels ?? []).map((l) => l.text ?? '').filter(Boolean));
  function freshWords(): Set<string> {
    const pts = partOf().points;
    const now = words(pts[here.point]!);
    // Point 1 of a part: what isn't on every point of it (the part's own frame doesn't count).
    const was = here.point > 0 ? words(pts[here.point - 1]!) : new Set([...now].filter((w) => pts.every((p) => words(p).has(w))));
    return new Set([...now].filter((w) => !was.has(w)));
  }
  const fit = fitStage($('[data-view]'), stage, reduced, () => { if (lesson()) markLabels(stage, freshWords()); });

  async function move(sc: Scene, h: Script, m: Move) {
    if (m.to === 'agent') return h.send(route.youToAgent(), 'you', { ms: 560 });
    if (m.to === 'path') return h.send(m.path, m.kind, { ms: m.ms ?? 560 });
    // Chapter 3: several moves at once, for agents that work side by side.
    if (m.to === 'all') { await Promise.all(m.moves.map((x) => move(sc, h, x))); return; }
    if (m.to === 'you') return h.send(reverse(route.youToAgent()), m.kind, { ms: 560 });
    if (m.to === 'gate') {
      await h.send(route.agentToGate(), m.kind, { ms: 420 });
      if (m.through) await h.send(route.gateToYou(), m.kind, { ms: 420 });
      return;
    }
    // Lesson 6: the instructions file and the skills shelf on the project plate.
    if (m.to === 'rules' || m.to === 'load') {
      const p = sc.state.project;
      if (!p) return;
      if (m.to === 'rules') {
        await h.send(route.agentToRules(p), 'model', { ms: 520 });
        h.set((s) => { s.project!.rules = 'lit'; });
        return;
      }
      if (m.from === 'rules') h.set((s) => { s.project!.rules = 'lit'; });
      const path: XY[] = m.from === 'rules' ? reverse(route.agentToRules(p)) : [[p.at[0] + 8, p.at[1] + 19], [p.at[0] - 46, 0], [20, 0]];
      await h.send(path, 'rules', { ms: 560 });
      return;
    }
    const tools = sc.state.tools, project = sc.state.project;
    if (!tools) return;
    h.set((s) => { s.tools!.on = m.tool; s.agents[0]!.busy = true; });
    await h.send(route.agentToTool(tools, m.tool), 'model', { ms: 420 });
    if (m.file != null && project) await h.send(route.toolToFile(tools, m.tool, project, m.file).slice(1), 'model', { ms: 380 });
    else await h.wait(420);
    await h.send(reverse(route.agentToTool(tools, m.tool)), m.back, { ms: 420 });
    h.set((s) => { s.tools!.on = null; s.agents[0]!.busy = false; });
  }
  function travel(sc: Scene, p: Point): Promise<boolean> {
    return sc.run(async (h) => {
      if (p.think) {
        h.set((s) => { s.agents[0]!.busy = true; s.agents[0]!.scan = true; });
        await h.wait(p.think);
      }
      for (const m of p.moves) await move(sc, h, m);
      h.check();
      sc.set(p.state);
    });
  }
  /**
   * Where a point's pucks start: the point before; for a part's first point, where the part before
   * ended when the thread goes on (not `fresh`), else its own state with an empty window.
   */
  function before(): SceneState {
    const pts = partOf().points;
    if (here.point > 0) return pts[here.point - 1]!.state;
    if (here.part > 0 && !partOf().fresh) return lesson()!.parts[here.part - 1]!.points.at(-1)!.state;
    const s = structuredClone(pts[0]!.state);
    for (const a of s.agents) a.blocks = [];
    return s;
  }
  /** Draw the point. Animated, the pucks play into it; resolves when they land (false if replaced). */
  async function draw(via: Via): Promise<boolean> {
    const p = pointOf();
    const animate = via !== 'still' && !reduced.matches;
    if (!animate) {
      scene.stop(); scene.set(p.state, true);
      mini?.stop(); mini?.set(p.state, true);
      fit.refit(false);
      return true;
    }
    scene.set(before());
    mini?.set(before(), true);
    if (mini) void travel(mini, p);
    return travel(scene, p);
  }

  // ---------- the chat ----------

  /** The turns on show: from the part that started this thread up to the current one. */
  function showThread(enter: boolean) {
    const l = lesson();
    soon.hidden = !!l;
    if (!l) $('[data-soon-title]').textContent = whereIs(here.lesson).lesson.title;
    let from = 0;
    if (l) for (let p = 0; p <= here.part; p++) if (l.parts[p]!.fresh) from = p;
    for (const t of turns) {
      const mine = t.dataset.lesson === here.lesson;
      const p = Number(t.dataset.part);
      t.hidden = !mine || p > here.part || p < from;
      const current = mine && p === here.part;
      t.toggleAttribute('data-current', current);
      // An earlier turn rests on its end: every row, the log folded, the reply in.
      if (!t.hidden && !current) fillTurn(t, Infinity);
    }
    const cur = l && turnEl(here.lesson, here.part);
    if (cur && enter && !reduced.matches) {
      cur.removeAttribute('data-enter'); void cur.offsetWidth; cur.setAttribute('data-enter', '');
      setTimeout(() => cur.removeAttribute('data-enter'), 400);
    }
  }

  /** The running highlight over a live row's words: a copy of them in full colour, under a moving mask. */
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

  /**
   * A turn at a point: the rows done by then (the newest one live), "Working for …" until the agent
   * answers, then "Worked for …" over the log and the reply. Earlier turns fold their logs.
   */
  function fillTurn(t: HTMLElement, point: number) {
    const part = LESSONS[t.dataset.lesson!]!.parts[Number(t.dataset.part)]!;
    const answered = replyAt(part);
    const end = point >= answered;
    const current = t.hasAttribute('data-current');
    if (end) t.setAttribute('data-landed', ''); else t.removeAttribute('data-landed');
    for (const li of t.querySelectorAll<HTMLElement>('[data-at]')) {
      const at = Number(li.dataset.at);
      // A pending approval leaves the log once you answer it (data-until); your own messages never shine.
      const until = li.dataset.until ? Number(li.dataset.until) : Infinity;
      li.hidden = at > point || point >= until;
      const label = li.querySelector<HTMLElement>('.v2-wlabel');
      const live = current && at === point && !end && !!label;
      li.toggleAttribute('data-live', live);
      if (label) shine(label, live);
      li.toggleAttribute('data-look', current && li.dataset.tone === 'bad' && point !== Infinity && pointOf()?.look === 'log' && here.lesson === t.dataset.lesson);
    }
    // Chapter 3: each subagent under a "{n} subagents" row runs until its point, then settles.
    for (const sub of t.querySelectorAll<HTMLElement>('[data-sub-done]')) {
      const fin = point >= Number(sub.dataset.subDone);
      sub.dataset.state = fin ? (sub.dataset.tone === 'bad' ? 'bad' : 'done') : 'running';
      const run = sub.querySelector<HTMLElement>('[data-sub-state]');
      if (run) run.textContent = fin ? (sub.dataset.tone === 'bad' ? run.dataset.bad! : run.dataset.done!) : run.dataset.running!;
    }
    for (const grp of t.querySelectorAll<HTMLElement>('[data-sub-line]')) {
      // T3 Code's summary: "{count} working · {count} done · {count} failed", leaving out the zeros.
      const subs = [...grp.closest('li')!.querySelectorAll<HTMLElement>('[data-sub-done]')];
      const n = { working: 0, done: 0, failed: 0 };
      for (const x of subs) n[x.dataset.state === 'running' ? 'working' : x.dataset.state === 'bad' ? 'failed' : 'done']++;
      grp.textContent = (['working', 'done', 'failed'] as const).filter((k) => n[k]).map((k) => grp.dataset[`tpl${k[0]!.toUpperCase()}${k.slice(1)}`]!.replace('{count}', String(n[k]))).join(' · ');
    }
    // A slash command sent before the request (lesson 5's /compact): its row runs, then says what it
    // did, and the request follows at its point. The ghost marker after the reply shows from its point.
    if (part.command) {
      const c = part.command;
      const did = point >= c.doneAt;
      const label = t.querySelector<HTMLElement>('[data-cmd-label]')!;
      const text = did ? c.done : c.running;
      if (label.firstChild?.textContent !== text) label.textContent = text;
      t.querySelector<HTMLElement>('[data-cmd-row]')!.toggleAttribute('data-live', current && !did);
      shine(label, current && !did);
      t.querySelector<HTMLElement>('[data-user]')!.hidden = point < c.requestAt;
    }
    const ghost = t.querySelector<HTMLElement>('[data-ghost]');
    if (ghost && part.ghost) ghost.hidden = point < part.ghost.at;
    const working = t.querySelector<HTMLElement>('[data-working]')!;
    // Lesson 4: a queued request has no turn of its own until it is sent.
    const waiting = !!part.queued && point < part.queued.at;
    working.hidden = end || waiting;
    if (!end && !waiting) {
      const took = working.dataset.took ? seconds(working.dataset.took) : 0;
      // The timer stands where the agent is: a share of the turn's time, by point.
      const text = took ? working.dataset.tpl!.replace('{duration}', duration(Math.max(3, Math.round((took * (point + 1)) / (answered + 1))))) : working.dataset.plain!;
      const label = working.querySelector<HTMLElement>('[data-working-text]')!;
      if (label.firstChild?.textContent !== text) { label.textContent = text; }
      shine(label, current);
    }
    const fold = t.querySelector<HTMLElement>('[data-fold]');
    if (fold) {
      fold.hidden = !end;
      const open = !end || (folds.get(t) ?? current);
      fold.setAttribute('aria-expanded', String(open));
      t.toggleAttribute('data-folded', !open);
    }
    fillExtras(t, part, point, current);
  }

  /** The reply lands: it rises in when the move was animated, and the chat shows its start. */
  function land(t: HTMLElement, still: boolean) {
    t.toggleAttribute('data-still', still || reduced.matches);
    if (!t.hasAttribute('data-landed')) t.setAttribute('data-landed', '');
    follow.follow(t.querySelector<HTMLElement>('[data-reply]'), !still);
  }

  // ---------- what the app shows ----------

  /** Tokens as T3 Code's context row writes them: 710k, 1m (formatContextWindowTokens). */
  const ctxTokens = (v: number) => (v < 1_000 ? String(Math.round(v)) : v < 10_000 ? `${(v / 1_000).toFixed(1).replace(/\.0$/, '')}k` : v < 999_500 ? `${Math.round(v / 1_000)}k` : `${(v / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`);
  /** Thread details opened by a point (`look: 'context'`), so the next point can close them again. */
  let autoDetails = false;

  function flash(el: HTMLElement, animate: boolean) {
    if (!animate || reduced.matches) return;
    el.removeAttribute('data-new'); void el.offsetWidth; el.setAttribute('data-new', '');
    setTimeout(() => el.removeAttribute('data-new'), 900);
  }

  /** Features appear at the point that teaches them and stay; each gets a short ring when it does. */
  function showUi(animate: boolean) {
    const ui = lesson() ? uiAt(here.lesson, here.part, here.point) : uiAt(here.lesson, 0, -1);
    const model = $('[data-ui="model"]');
    model.hidden = !ui.model;
    if (ui.model && !lastUi.model) flash(model, animate);
    // Lesson 14: the chip can name another model and effort; it rings when it changes.
    const modelText = ui.modelName || MODEL;
    if (model.textContent !== modelText) { model.textContent = modelText; if (lastUi.model) flash(model, animate); }
    const env = $('[data-ui="env"]');
    env.hidden = !ui.env;
    if (ui.env) {
      env.querySelector('[data-env-name]')!.textContent = ui.env;
      if (ui.env !== lastUi.env) flash(env, animate);
    }
    const perm = $('[data-ui="perm"]');
    perm.hidden = !ui.perm;
    if (ui.perm) {
      perm.textContent = perm.dataset.permTpl!.replace('{mode}', ui.perm);
      if (ui.perm !== lastUi.perm) flash(perm, animate);
    }
    const details = $('[data-ui="context"]');
    const limits = ui.limits ?? [];
    details.hidden = ui.context == null && !limits.length;
    $('[data-ctx-sec]').hidden = ui.context == null;
    // Lesson 14: Usage limits under the context window, one "{label}: {left}% left" row per window.
    const lim = $('[data-limits]');
    lim.hidden = !limits.length;
    const limKey = limits.map((w) => `${w.label}:${w.left}`).join('|');
    if (lim.dataset.key !== limKey) {
      lim.dataset.key = limKey;
      const tpl = lim.dataset.tpl!;
      lim.querySelector('[data-limit-rows]')!.innerHTML = limits.map((w) => `<li data-low="${w.left <= 10 ? 'yes' : 'no'}"><span class="v2-pop-val">${esc(tpl.replace('{label}', w.label).replace('{left}', String(w.left)))}</span><span class="v2-meter" aria-hidden="true"><span style="transform:scaleX(${Math.max(0.01, w.left / 100)})"></span></span></li>`).join('');
      if (limits.length) flash($('[data-details-btn]'), animate);
    }
    // The button's short value is the context when there is one, else the lowest limit.
    if (limits.length && ui.context == null) $('[data-ctx-short]').textContent = `${Math.min(...limits.map((w) => w.left))}% left`;
    if (ui.context != null) {
      const text = $('[data-ctx-text]');
      text.textContent = text.dataset.tpl!.replace('{used}', String(ui.context));
      $('[data-ctx-bar]').style.transform = `scaleX(${Math.max(0.01, ui.context / 100)})`;
      $('[data-ctx-short]').textContent = `${ui.context}%`;
      // T3 Code's row (t3code.screen.contextRow): the tokens against the window, the warning colour
      // from 80% and the error colour from 90%. The tokens follow from the example percentage.
      const max = Number(details.dataset.max), used = Math.round((ui.context / 100) * max);
      $('[data-ctx-tokens]').textContent = `${ctxTokens(used)} / ${ctxTokens(max)}`;
      const of = $('[data-ctx-of]');
      of.textContent = of.dataset.tpl!.replace('{used}', used.toLocaleString('en-US')).replace('{max}', max.toLocaleString('en-US'));
      details.dataset.tone = ui.context >= 90 ? 'error' : ui.context >= 80 ? 'warning' : '';
      // Taught or changed here: the button rings once. It never opens by itself over the thread.
      if (ui.context !== lastUi.context) flash($('[data-details-btn]'), animate);
    } else setDetails(false);
    root.toggleAttribute('data-has-log', !!ui.log);
    // Lesson 4: the workspace and branch controls, once taught.
    const work = $('[data-ui="checkout"]'), branch = $('[data-ui="branch"]');
    const hadBranch = !branch.hidden;
    if (paintCheckout(work, branch, ui.checkout) && ui.checkout) {
      flash(work, animate);
      if (ui.checkout.branch && !hadBranch) flash(branch, animate);
    }
    $('[data-foot]').hidden = !ui.model && !ui.perm;
    $('[data-branchbar]').hidden = !ui.env && !ui.checkout;
    lastUi = ui;
  }

  /**
   * Lesson 7: the agent's question at this point, as T3 Code's question panel inside the composer:
   * the header (and "n/N" when it asks several), the question, and its options with radio marks and
   * number keys. A drawing: the story picks the answer, shown selected at the point you give it.
   */
  let lastAsk = '';
  function showAsk(animate: boolean) {
    const box = $('[data-ask]');
    const a = lesson() ? pointOf().ask : undefined;
    root.toggleAttribute('data-asking', !!a);
    const key = a ? JSON.stringify(a) : '';
    if (key === lastAsk) return;
    const opened = !lastAsk && !!a;
    lastAsk = key;
    box.hidden = !a;
    if (!a) { box.replaceChildren(); return; }
    const dismiss = box.dataset.dismiss ?? '';
    box.innerHTML = `<div class="v2-ask-head"><span class="v2-ask-h">${esc(a.header)}</span>${a.of ? `<span class="v2-ask-n">${a.of[0]}/${a.of[1]}</span>` : ''}<span class="v2-ask-x" title="${esc(dismiss)}" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" focusable="false"><path ${ln} d="M18 6 6 18M6 6l12 12"/></svg></span></div>`
      + `<p class="v2-ask-q">${esc(a.question)}</p>`
      + `<ol class="v2-ask-opts">${a.options.map((o, i) => `<li${a.pick === i ? ' data-on' : ''}><span class="v2-ask-radio" aria-hidden="true"></span><span class="v2-ask-o"><span class="v2-ask-l">${esc(o.label)}${a.pick === i ? '<span class="visually-hidden"> (chosen)</span>' : ''}</span>${o.description ? `<span class="v2-ask-d">${esc(o.description)}</span>` : ''}</span><kbd aria-hidden="true">${i + 1}</kbd></li>`).join('')}</ol>`;
    if (opened && animate && !reduced.matches) { box.removeAttribute('data-in'); void box.offsetWidth; box.setAttribute('data-in', ''); }
  }

  /** The story threads of the lesson so far, in order: a part with a new title and `fresh` starts one. */
  function threadsSoFar(): { title: string; part: number }[] {
    const l = lesson();
    if (!l) return [];
    const out: { title: string; part: number }[] = [];
    l.parts.slice(0, here.part + 1).forEach((pt, j) => {
      const title = pt.thread ?? whereIs(here.lesson).lesson.title;
      if (!out.length || (pt.fresh && out.at(-1)!.title !== title)) out.push({ title, part: j });
    });
    return out;
  }
  const threadOf = (): string => threadsSoFar().at(-1)?.title ?? whereIs(here.lesson).lesson.title;

  const setStatus = (el: HTMLElement, status: string) => {
    const key = statusKey(status);
    if (el.dataset.s === key) return;
    el.dataset.s = key;
    el.innerHTML = key ? `${STATUS_ICON[key] ?? ''}<span>${esc(status)}</span>` : '';
  };

  /**
   * The lesson rows, with T3 Code's status in the time slot: Working on the lesson that plays,
   * Done once it has been played through. When a lesson opens a second story thread, its threads
   * show as rows under it, the live one with the status.
   */
  function showSidebar() {
    // The thread's status is the story's, not the playback's: Working while the agent works on this
    // turn, then nothing once the reply has landed, as T3 Code shows the thread you have open (Done
    // marks only a finished thread you haven't looked at yet).
    const live = lesson() ? (pointOf().status ?? (here.point < replyAt(partOf()) ? STATUS.working : '')) : '';
    const threads = threadsSoFar();
    // Lesson 4: the point lists every story thread with its own status; otherwise the threads so
    // far, the newest one live.
    const story = lesson() ? pointOf().threads : undefined;
    const shownThreads = story
      ? story.map((t, i) => ({ title: t.title, part: t.part, child: !!t.child, status: t.status ?? '', current: t.title === threadOf() || (i === 0 && !story.some((s) => s.title === threadOf())) }))
      : threads.map((t, i) => ({ title: t.title, part: t.part as number | undefined, child: false, status: i === threads.length - 1 ? live : '', current: i === threads.length - 1 }));
    const many = story ? story.length > 0 : threads.length > 1;
    for (const a of $$('a.v2-row[data-lesson]')) {
      const id = a.dataset.lesson!;
      const cur = id === here.lesson;
      if (cur) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      // With the threads drawn under it, the lesson row keeps Done and the thread row says Working.
      const s = cur && live && !many ? live : done.has(id) ? STATUS.done : '';
      setStatus(a.querySelector<HTMLElement>('[data-status]')!, s);
    }
    for (const ol of $$('[data-threads]')) {
      const list = ol.dataset.threads === here.lesson && many ? shownThreads : [];
      const key = list.map((t) => `${t.title}:${t.part ?? ''}`).join('|');
      if (ol.dataset.key !== key) {
        const before = ol.childElementCount;
        ol.dataset.key = key;
        ol.innerHTML = list.map((t, i) => `<li${before > 0 && i >= before ? ' data-enter' : ''}><button type="button" class="v2-row v2-row-child"${t.child ? ' data-sub' : ''}${t.part != null ? ` data-thread-part="${t.part}"` : ' disabled'}><span class="v2-row-title">${esc(t.title)}</span><span class="v2-status"></span></button></li>`).join('');
      }
      ol.hidden = !list.length;
      const rows = [...ol.querySelectorAll<HTMLElement>('.v2-row-child')];
      rows.forEach((b, i) => {
        const t = list[i]!;
        if (t.current) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
        setStatus(b.querySelector<HTMLElement>('.v2-status')!, t.status || (t.current && story ? live : ''));
      });
    }
    tree.refresh();
  }

  function showHead() {
    const { chapter, lesson: tl } = whereIs(here.lesson);
    $('[data-crumb-fav]').textContent = chapter.n ? String(chapter.n) : 'S';
    $('[data-crumb-project]').textContent = chapter.title;
    // The story thread's own title, as T3 Code titles a thread from its first message.
    $('[data-crumb-thread]').textContent = lesson() ? threadOf() : tl.title;
  }

  const playableCount = () => TOC.flatMap((c) => c.lessons).filter((x) => LESSONS[x.id]).length;
  function nextPlayable(id: string): string | undefined {
    const ids = TOC.flatMap((c) => c.lessons.map((l) => l.id)).filter((x) => LESSONS[x]);
    return ids[ids.indexOf(id) + 1];
  }

  /** The words for this point in the composer slot: they change with it, gently when it plays. */
  function sayIt(text: string, animate: boolean) {
    const say = $('[data-c-say]');
    if (say.textContent === text) return;
    say.textContent = text;
    if (animate && !reduced.matches) { say.removeAttribute('data-in'); void say.offsetWidth; say.setAttribute('data-in', ''); }
  }

  function showControls(animate = false) {
    const l = lesson();
    for (const play of $$('[data-c="play"]')) {
      play.setAttribute('aria-pressed', String(playing));
      play.setAttribute('aria-label', playing ? 'Pause' : 'Play');
      play.title = `${playing ? 'Pause' : 'Play'} (Space)`;
      (play as HTMLButtonElement).disabled = !l;
    }
    const prev = $<HTMLButtonElement>('[data-c="prev"]'), next = $<HTMLButtonElement>('[data-c="next"]');
    if (!l) {
      prev.disabled = next.disabled = true;
      $('[data-c-title]').textContent = whereIs(here.lesson).lesson.title;
      $('[data-c-where]').textContent = 'Not built yet';
      sayIt(`This lesson isn’t built yet. ${playableCount()} of ${TOC.flatMap((c) => c.lessons).length} lessons play.`, false);
      $('[data-dots]').replaceChildren();
      for (const n of $$('[data-n]')) n.textContent = '';
      $('[data-mini-sub]').textContent = '';
      return;
    }
    const part = partOf(), total = part.points.length;
    const nx = nextPlayable(here.lesson);
    prev.disabled = here.part === 0 && here.point === 0;
    next.disabled = isAtEnd() && !nx;
    const nextLabel = isAtEnd() && nx ? 'Next lesson' : isLast() ? 'Next part' : 'Forward one point';
    next.setAttribute('aria-label', nextLabel);
    next.title = `${nextLabel} (→)`;
    $('[data-c-title]').textContent = part.title;
    $('[data-c-where]').textContent = `Part ${here.part + 1} of ${l.parts.length} · Point ${here.point + 1} of ${total}`;
    sayIt(pointOf().say, animate);
    for (const n of $$('[data-n]')) n.textContent = `${here.point + 1} / ${total}`;
    $('[data-mini-sub]').textContent = `Point ${here.point + 1} of ${total}`;
    // One button per point, so any point is a click away.
    const dots = $('[data-dots]');
    if (dots.childElementCount !== total || dots.dataset.part !== `${here.lesson}:${here.part}`) {
      dots.dataset.part = `${here.lesson}:${here.part}`;
      dots.innerHTML = part.points.map((p, i) => `<li><button type="button" class="v2-dot" data-go="${i}" aria-label="Point ${i + 1} of ${total}: ${esc(p.say)}"><span></span></button></li>`).join('');
    }
    $$('.v2-dot').forEach((d, i) => {
      d.dataset.state = i === here.point ? 'now' : i < here.point ? 'past' : 'later';
      if (i === here.point) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
    });
  }

  // ---------- the browser panel ----------

  const preview = previewPane($('[data-preview]'));
  const tabPreview = $('[data-tab="preview"]');

  /** The app at this point: the newest preview so far in the lesson, or its app before anything is built. */
  function previewAt(): Preview | null {
    const l = lesson();
    if (!l) return null;
    let found: Preview | undefined, first: Preview | undefined;
    l.parts.forEach((pt, j) => pt.points.forEach((p, i) => {
      const v = p.preview;
      if (!v) return;
      first ??= v;
      if (j < here.part || (j === here.part && i <= here.point)) found = v;
    }));
    if (!first) return null;
    // Chapter 3: before a lesson's first Preview point the tab stays hidden. Every tester read a
    // dev-server 404 there as broken. A lesson that wants the 404 sets it, as lesson 2 does (door 'none').
    return found ?? null;
  }

  function setTab(t: 'ex' | 'preview', focus = false) {
    if (t === 'preview' && tabPreview.hidden) t = 'ex';
    tab = t;
    for (const b of $$('[data-tab]')) {
      const on = b.dataset.tab === t;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    }
    for (const pane of $$('[data-pane]')) pane.hidden = pane.dataset.pane !== t;
    root.dataset.browserTab = t;
    if (t === 'preview') {
      setBadge(false);
      // Trying the app by hand: hold the lesson still so the page doesn't change underneath.
      if (playing) pause();
    } else fit.refit(false);
    showAddress();
  }
  let address = '';
  // An app can move to another of its pages when the reader follows a link in it: it says where.
  $('[data-preview]').addEventListener('v2:url', (e) => { address = (e as CustomEvent<string>).detail; showAddress(); });
  function showAddress() {
    const addr = $('[data-addr]');
    if (tab === 'preview') addr.innerHTML = `<span class="v2-mono">${esc(address || ' ')}</span>`;
    else addr.innerHTML = `<span>Explainer</span>${lesson() ? `<span class="v2-addr-sub">· ${esc(partOf().title)}</span>` : ''}`;
  }
  /**
   * A dot on the Preview tab, and the same in the phone's mini player. `testing` is the stage where
   * the agent's own test runs in the app, which it only does once the Preview is on screen, so the
   * badge says where to look.
   */
  function setBadge(on: boolean, testing = false) {
    const badge = $('[data-badge]'), mb = $('[data-mini-badge]');
    badge.hidden = mb.hidden = !on;
    badge.querySelector('.visually-hidden')!.textContent = testing ? ': the test runs here' : ': changed';
    mb.textContent = testing ? 'Test runs in Preview' : 'Preview changed';
  }

  function showBrowser() {
    const l = lesson();
    const say = $('[data-say]');
    const text = l ? pointOf().say : 'This lesson isn’t built yet.';
    if (say.textContent !== text) say.textContent = text;
    stage.setAttribute('aria-label', l ? `${partOf().title}: ${pointOf().say}` : text);
    const p = previewAt();
    tabPreview.hidden = !p;
    if (!p && tab === 'preview') setTab('ex');
    // A lesson with no Preview yet keys as `<lesson>:`, so the tab's first appearance gets the changed dot.
    const key = p ? `${here.lesson}:${p.app}:${p.stage}` : l ? `${here.lesson}:` : '';
    if (key !== lastStage) {
      // The app changed while the reader looks elsewhere, or its test is about to run: a dot on the tab says so.
      const testing = p?.stage === 'testing';
      const changed = !!p && lastStage.startsWith(`${here.lesson}:`);
      setBadge(tab !== 'preview' && (testing || changed), testing);
      lastStage = key;
      void preview.set(p).then((a) => { if (lastStage === key) { address = a; showAddress(); } });
    }
    showAddress();
  }

  // ---------- drawing the page for where we are ----------

  /** Draw everything for `here`. Resolves when the point has landed (false if something moved on). */
  async function show(via: Via): Promise<boolean> {
    const mine = ++shown;
    const key = `${here.lesson}:${here.part}`;
    const newPart = key !== lastPart;
    const newLesson = here.lesson !== lastLesson;
    lastPart = key;
    lastLesson = here.lesson;
    const animate = via !== 'still' && !reduced.matches;
    showThread(newPart && animate);
    showHead();
    showUi(via !== 'still');
    showAsk(animate);
    // A point about the context window opens the thread details on it; the next point closes them.
    if (l0() && pointOf().look === 'context') { setDetails(true, true); autoDetails = true; }
    else if (autoDetails) { setDetails(false); autoDetails = false; }
    showSidebar();
    showControls(animate);
    showBrowser();
    try { history.replaceState(null, '', `#${here.lesson}${lesson() ? `-p${here.part + 1}` : ''}`); } catch { /* sandboxed */ }
    const l = lesson();
    if (!l) {
      scene.stop(); scene.set({ agents: [] }, true);
      follow.reset(null);
      scroller.scrollTo({ top: 0 });
      return true;
    }
    const turn = turnEl(here.lesson, here.part);
    const answered = replyAt(partOf());
    fillTurn(turn, here.point);
    // The reply waits for the pucks that carry it; with nothing animating it is simply there.
    const landsNow = here.point === answered;
    if (landsNow && animate) turn.removeAttribute('data-landed');
    turn.toggleAttribute('data-still', !animate);
    const look = pointOf().look === 'log' ? turn.querySelector<HTMLElement>('[data-look]') : null;
    const anchor = newPart ? turn : look ?? (here.point >= answered ? turn.querySelector<HTMLElement>('[data-reply]') : null);
    if (newLesson) follow.reset(newPart ? turn : anchor); else follow.follow(anchor, animate);
    const ok = await draw(via);
    if (ok && mine === shown && landsNow && animate) land(turn, false);
    return ok && mine === shown;
  }

  // ---------- moving ----------

  /** One point forward, across parts. 'end' at the lesson's last point. */
  function stepForward(): 'point' | 'part' | 'end' {
    const l = lesson()!;
    if (!isLast()) { here = { ...here, point: here.point + 1 }; return 'point'; }
    if (here.part < l.parts.length - 1) { here = { ...here, part: here.part + 1, point: 0 }; return 'part'; }
    return 'end';
  }
  function stepBack(): boolean {
    if (here.point > 0) { here = { ...here, point: here.point - 1 }; return true; }
    if (here.part > 0) { here = { ...here, part: here.part - 1, point: lastPointOf(here.part - 1) }; return true; }
    return false;
  }
  function markEnd() {
    if (isAtEnd()) { done.add(here.lesson); saveDone(); showSidebar(); }
  }

  const dwell = (p: Point, last: boolean) => 1800 + p.say.length * 32 + (last ? 3600 : 0);

  /** Play from here. `first` is how the current point is drawn. */
  async function playLoop(first: Via) {
    const mine = ++token;
    playing = true;
    showSidebar(); showControls();
    let ok = await show(first);
    while (playing && mine === token) {
      if (!ok) return;
      await sleep(dwell(pointOf(), isLast()));
      if (!playing || mine !== token) return;
      if (stepForward() === 'end') { playing = false; markEnd(); showSidebar(); showControls(); return; }
      ok = await show('play');
    }
  }
  function pause() {
    playing = false;
    token++;
    showSidebar(); showControls();
  }
  function play() {
    if (!lesson()) return;
    // From the end, play starts the lesson again; the first point lands still, then it plays on.
    if (isAtEnd()) { here = { lesson: here.lesson, part: 0, point: 0 }; lastLesson = ''; void playLoop('still'); return; }
    void playLoop('play');
  }

  /** Go somewhere. Moving never changes play state: playing goes on from there, paused stays paused. */
  /** The lesson on show, scrolled into view in the sidebar (on a short screen it can sit below the fold). */
  const revealRow = () => requestAnimationFrame(() => root.querySelector<HTMLElement>('a.v2-row[aria-current]')?.scrollIntoView({ block: 'nearest' }));

  function go(to: Here, via: Via, opts: { play?: boolean } = {}) {
    const keep = opts.play ?? playing;
    if (playing) { playing = false; token++; }
    if (to.lesson !== here.lesson) { lastStage = ''; lastPart = ''; folds.clear(); revealRow(); }
    here = to;
    if (keep && lesson()) { void playLoop(via); return; }
    showSidebar(); showControls();
    void show(via).then(() => markEnd());
  }

  function forward(via: Via) {
    const was = here;
    const step = stepForward();
    if (step !== 'end') { const to = here; here = was; go(to, via); return; }
    const nx = nextPlayable(here.lesson);
    if (nx) go({ lesson: nx, part: 0, point: 0 }, 'still');
  }
  function back() {
    const was = here;
    if (!stepBack()) return;
    const to = here; here = was;
    go(to, 'still');
  }

  // ---------- controls ----------

  const viaClick = (e: MouseEvent): Via => (e.detail > 0 ? 'pointer' : 'still');
  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const c = t.closest<HTMLElement>('[data-c]')?.dataset.c;
    if (c && lesson()) {
      if (c === 'play') { if (playing) pause(); else play(); }
      else if (c === 'next') forward(viaClick(e));
      else if (c === 'prev') back();
      return;
    }
    const dot = t.closest<HTMLElement>('[data-go]');
    if (dot && lesson()) {
      const i = Number(dot.dataset.go);
      if (i !== here.point) go({ ...here, point: i }, i === here.point + 1 ? viaClick(e) : 'still');
    }
  });

  // Space plays and pauses, ← → move by point and Shift+← → by part, from anywhere outside a field.
  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (e.altKey || e.metaKey || e.ctrlKey || !lesson() || (root.dataset.view === 'list' && phone.matches)) return;
    if (t.closest('input, textarea, select, [contenteditable="true"], [role="tablist"], [role="separator"], [data-parts], [data-filter-pop], [data-preview], [data-guide-menu]')) return;
    if (e.key === ' ' && !t.closest('button, a, summary')) { e.preventDefault(); if (playing) pause(); else play(); return; }
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    if (t.closest('.v2-side')) return;
    e.preventDefault();
    if (e.shiftKey) {
      const l = lesson()!;
      if (e.key === 'ArrowRight' && here.part < l.parts.length - 1) go({ ...here, part: here.part + 1, point: 0 }, 'still');
      if (e.key === 'ArrowLeft') go({ ...here, part: here.point > 0 ? here.part : Math.max(0, here.part - 1), point: 0 }, 'still');
      return;
    }
    if (e.key === 'ArrowRight') forward('still'); else back();
  });

  // ---------- the part list ----------

  const partsBtn = $('[data-parts-btn]'), parts = $('[data-parts]');
  function renderParts() {
    const l = lesson();
    if (!l) return;
    const { lesson: tl } = whereIs(here.lesson);
    $('[data-parts-head]').textContent = tl.n ? `Lesson ${tl.n} · ${tl.title}` : `${whereIs(here.lesson).chapter.title} · ${tl.title}`;
    const finished = done.has(here.lesson);
    const nx = nextPlayable(here.lesson);
    $('[data-parts-list]').innerHTML = l.parts.map((pt, j) => {
      const s = j === here.part ? 'now' : j < here.part || finished ? 'done' : 'todo';
      return `<li><button type="button" class="v2-part" data-part-go="${j}"${j === here.part ? ' aria-current="step"' : ''}><span class="v2-part-mark" data-s="${s}" aria-hidden="true">${s === 'done' ? STATUS_ICON.done : ''}</span><span>${esc(pt.title)}</span><em>${j === here.part ? 'from the start' : ''}</em></button></li>`;
    }).join('') + (nx ? `<li class="v2-part-next"><button type="button" class="v2-part" data-lesson-go="${nx}"><span class="v2-part-mark" aria-hidden="true">→</span><span>Next lesson: ${esc(whereIs(nx).lesson.title)}</span><em></em></button></li>` : '');
  }
  function setParts(on: boolean, e?: MouseEvent) {
    if (on) renderParts();
    parts.toggleAttribute('data-still', !e || e.detail === 0);
    parts.hidden = !on;
    partsBtn.setAttribute('aria-expanded', String(on));
    if (on) parts.querySelector<HTMLElement>('[aria-current]')?.focus({ preventScroll: true });
  }
  partsBtn.addEventListener('click', (e) => { if (lesson()) setParts(parts.hidden, e); });
  parts.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-part-go], [data-lesson-go]');
    if (!b) return;
    setParts(false);
    partsBtn.focus({ preventScroll: true });
    if (b.dataset.lessonGo) go({ lesson: b.dataset.lessonGo, part: 0, point: 0 }, 'still', { play: true });
    else go({ ...here, part: Number(b.dataset.partGo), point: 0 }, 'still', { play: true });
  });
  parts.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); setParts(false); partsBtn.focus(); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const all = [...parts.querySelectorAll<HTMLElement>('button')];
      const i = all.indexOf(document.activeElement as HTMLElement);
      e.preventDefault();
      all[(i + (e.key === 'ArrowDown' ? 1 : all.length - 1)) % all.length]?.focus();
    }
  });
  document.addEventListener('pointerdown', (e) => { if (!parts.hidden && !(e.target as HTMLElement).closest('[data-parts], [data-parts-btn]')) setParts(false); });

  // ---------- chapter 3: open or close a "{n} subagents" group ----------

  root.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-sub-toggle]');
    if (b) b.setAttribute('aria-expanded', String(b.getAttribute('aria-expanded') !== 'true'));
  });

  // ---------- "Worked for …": open or close one turn's log ----------

  root.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-fold]');
    if (!b) return;
    const t = b.closest<HTMLElement>('[data-turn]')!;
    const open = b.getAttribute('aria-expanded') !== 'true';
    folds.set(t, open);
    b.setAttribute('aria-expanded', String(open));
    t.toggleAttribute('data-folded', !open);
  });

  // ---------- tabs ----------

  for (const b of $$('[data-tab]')) b.addEventListener('click', () => setTab(b.dataset.tab as 'ex' | 'preview'));
  $('.v2-tabs').addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    setTab(tab === 'ex' ? 'preview' : 'ex', true);
  });

  // ---------- lessons in the sidebar, their threads, and links to them ----------

  const menu = guideMenu($('[data-guide-menu]'), $$<HTMLButtonElement>('[data-guide-menu-btn]'), reduced);
  const setView = (v: 'list' | 'thread') => { if (root.dataset.view !== v) { menu.close(false); root.dataset.view = v; } };

  root.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-thread-part]');
    if (!b) return;
    setView('thread');
    go({ ...here, part: Number(b.dataset.threadPart), point: 0 }, 'still');
  });

  root.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[data-lesson], a[data-lesson-link]');
    if (!a) return;
    e.preventDefault();
    const id = a.dataset.lesson ?? a.dataset.lessonLink!;
    setView('thread');
    // The lesson on show carries on where it is; another one plays from its start.
    if (id !== here.lesson) go({ lesson: id, part: 0, point: 0 }, 'still', { play: !!LESSONS[id] && !reduced.matches });
    else if (!playing && lesson() && !isAtEnd() && !reduced.matches) play();
    if (phone.matches) $('[data-to-list]').focus({ preventScroll: true });
  });
  $('[data-to-list]').addEventListener('click', (e) => {
    e.preventDefault();
    pause();
    setView('list');
    root.querySelector<HTMLElement>('.v2-row[aria-current]')?.focus();
  });

  // ---------- thread details ----------

  const dBtn = $<HTMLButtonElement>('[data-details-btn]'), dPop = $('[data-details-pop]');
  /**
   * `auto`: a point opened them. Then they show compact (the context row only), and on a phone as a
   * strip under the header that moves the thread down instead of covering the part's heading.
   */
  function setDetails(open: boolean, auto = false) {
    dPop.hidden = !open;
    dBtn.setAttribute('aria-expanded', String(open));
    root.toggleAttribute('data-details-auto', open && auto);
  }
  dBtn.addEventListener('click', () => setDetails(dPop.hidden));
  document.addEventListener('pointerdown', (e) => { if (!dPop.hidden && !(e.target as HTMLElement).closest('.v2-details')) setDetails(false); });
  // Escape closes them from anywhere, not only from inside.
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !dPop.hidden) { const inside = dPop.contains(document.activeElement); setDetails(false); autoDetails = false; if (inside) dBtn.focus(); } });

  // ---------- copy ----------

  root.addEventListener('click', async (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]');
    if (!b) return;
    const code = b.parentElement!.querySelector('[data-prompt]')!;
    const word = b.querySelector('span')!;
    try { await navigator.clipboard.writeText(code.textContent ?? ''); word.textContent = 'Copied'; }
    catch { const r = document.createRange(); r.selectNodeContents(code); getSelection()?.removeAllRanges(); getSelection()?.addRange(r); word.textContent = 'Selected'; }
    setTimeout(() => { word.textContent = 'Copy'; }, 1600);
  });

  // ---------- the rest of the frame ----------

  projectFilter(root);
  wireExtras(root);
  splitter($('[data-main]'), $('[data-split]'), $('[data-browser]'), root);
  const sh = sheet({ browser: $('[data-browser]'), scrim: $('[data-scrim]'), top: $('[data-top]'), behind: $('[data-chat]'), close: $('[data-close]'), opener: $('[data-mini]'), phone });
  // The mini opens the browser; while it carries the Preview badge, it opens on that tab.
  $('[data-mini]').addEventListener('click', () => {
    if (!$('[data-mini-badge]').hidden) setTab('preview');
    sh.set(true);
    fit.refit(false);
  });

  // On a phone the picture also plays small in the mini player above the controls.
  function phoneChange() {
    if (phone.matches && !mini) {
      mini = new Scene($('[data-mini-stage]'));
      mini.base = base;
      mini.level = readLevel();
      if (lesson()) mini.set(pointOf().state, true);
    } else if (!phone.matches && mini) {
      mini.stop();
      mini = null;
      $('[data-mini-stage]').replaceChildren();
    }
  }
  phoneChange();
  phone.addEventListener('change', phoneChange);

  document.addEventListener(LEVEL_EVENT, (e) => {
    const lv = (e as CustomEvent).detail;
    if (!isLevel(lv)) return;
    for (const s of [scene, mini]) if (s) { s.level = lv; s.set(s.state, true); }
    // The live row's highlight copies the words of the old level: draw it again.
    for (const label of $$('.v2-shine')) { const host = label.parentElement!; label.remove(); shine(host, true); }
  });

  // ---------- start ----------

  // #l5-p3 is what the page writes; #l5/3 (and #l5/3/2 or #l5-p3-2, with a point) also open it.
  const HASH = /^#(l\d+|s-[a-z-]+?)(?:(?:-p|\/)(\d+)(?:[-/](\d+))?)?$/;
  const known = (id: string) => TOC.some((c) => c.lessons.some((l) => l.id === id));
  const fromHash = (h: RegExpExecArray): Here => {
    const id = h[1]!;
    const part = LESSONS[id] ? Math.min(Math.max(0, Number(h[2] ?? 1) - 1), LESSONS[id]!.parts.length - 1) : 0;
    const point = LESSONS[id] ? Math.min(Math.max(0, Number(h[3] ?? 1) - 1), LESSONS[id]!.parts[part]!.points.length - 1) : 0;
    return { lesson: id, part, point };
  };
  const m = HASH.exec(location.hash);
  if (m && known(m[1]!)) { here = fromHash(m); root.dataset.view = 'thread'; }
  setTab('ex');
  revealRow();
  // The thread plays as soon as it is on screen: at once on a wide screen, or from a link to a lesson.
  // Under reduced motion it waits on the first point; the reader starts it.
  if (lesson() && !reduced.matches && (!phone.matches || root.dataset.view === 'thread')) play();
  else void show('still');
  addEventListener('hashchange', () => {
    const h = HASH.exec(location.hash);
    if (!h || !known(h[1]!)) return;
    const to = fromHash(h);
    if (to.lesson === here.lesson && to.part === here.part && (!h[3] || to.point === here.point)) return;
    setView('thread');
    go(to, 'still', { play: !!LESSONS[to.lesson] && !reduced.matches });
  });
}
