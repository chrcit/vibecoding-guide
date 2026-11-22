/*
 * Guide v2 in the browser: plays a lesson thread part by part and point by point, keeps the
 * sidebar (the table of contents), the chips under the thread and the thread details in step, and
 * drives the journey's picture engine for each turn's picture. The page holds every turn's HTML
 * (pages/v2/index.astro); this only shows, hides and animates.
 */
import { Scene } from '../journey/scene';
import { route, reverse } from '../journey/picture';
import { LESSONS, TOC, whereIs, uiAt, type Move, type Point, type Ui } from './content';
import { LEVEL_EVENT, isLevel, type Level } from '../lib/levels';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const STORE = 'acg-v2-done';

interface Here { lesson: string; part: number; point: number }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const readLevel = (): Level => { const l = document.documentElement.dataset.level; return isLevel(l) ? l : 'plain'; };

export function boot(root: HTMLElement) {
  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const $$ = <T extends HTMLElement = HTMLElement>(sel: string) => [...root.querySelectorAll<T>(sel)];
  const base = root.dataset.base ?? '/';
  const scroller = $('[data-scroll]');
  const turns = $$('[data-turn]');
  const soon = $('[data-soon]');
  const turnEl = (lesson: string, part: number) => turns.find((t) => t.dataset.lesson === lesson && Number(t.dataset.part) === part);
  const scenes = new Map<HTMLElement, Scene>();
  const settled = new Map<HTMLElement, string>();

  let here: Here = { lesson: 'l1', part: 0, point: 0 };
  let playing = false;
  let token = 0;
  let lastUi: Ui = {};
  let done = new Set<string>();
  try { done = new Set(JSON.parse(localStorage.getItem(STORE) ?? '[]')); } catch { /* private window */ }
  const saveDone = () => { try { localStorage.setItem(STORE, JSON.stringify([...done])); } catch { /* ignore */ } };

  root.setAttribute('data-ready', '');

  // ---------- the picture ----------

  function sceneFor(turn: HTMLElement): Scene {
    let s = scenes.get(turn);
    if (!s) {
      s = new Scene(turn.querySelector<HTMLElement>('[data-stage]')!);
      s.base = base;
      s.level = readLevel();
      scenes.set(turn, s);
    }
    return s;
  }

  async function travel(scene: Scene, p: Point) {
    return scene.run(async (h) => {
      if (p.think) {
        h.set((s) => { s.agents[0]!.busy = true; s.agents[0]!.scan = true; });
        await h.wait(p.think);
      }
      for (const m of p.moves) await move(scene, h, m);
      h.check();
      scene.set(p.state);
    });
  }
  async function move(scene: Scene, h: Parameters<Parameters<Scene['run']>[0]>[0], m: Move) {
    if (m.to === 'agent') return h.send(route.youToAgent(), 'you', { ms: 560 });
    if (m.to === 'you') return h.send(reverse(route.youToAgent()), m.kind, { ms: 560 });
    if (m.to === 'gate') {
      await h.send(route.agentToGate(), m.kind, { ms: 420 });
      if (m.through) await h.send(route.gateToYou(), m.kind, { ms: 420 });
      return;
    }
    const tools = scene.state.tools, project = scene.state.project;
    if (!tools) return;
    h.set((s) => { s.tools!.on = m.tool; s.agents[0]!.busy = true; });
    await h.send(route.agentToTool(tools, m.tool), 'model', { ms: 420 });
    if (m.file != null && project) await h.send(route.toolToFile(tools, m.tool, project, m.file).slice(1), 'model', { ms: 380 });
    else await h.wait(420);
    await h.send(reverse(route.agentToTool(tools, m.tool)), m.back, { ms: 420 });
    h.set((s) => { s.tools!.on = null; s.agents[0]!.busy = false; });
  }

  // ---------- drawing the page for where we are ----------

  const lesson = () => LESSONS[here.lesson];
  const partOf = () => lesson()!.parts[here.part]!;
  const pointOf = () => partOf().points[here.point]!;

  function showTurns() {
    const l = lesson();
    soon.hidden = !!l;
    let from = 0;
    if (l) for (let p = 0; p <= here.part; p++) if (l.parts[p]!.fresh) from = p;
    for (const t of turns) {
      const mine = t.dataset.lesson === here.lesson;
      const p = Number(t.dataset.part);
      t.hidden = !mine || p > here.part || p < from;
      t.toggleAttribute('data-current', mine && p === here.part);
      if (!t.hidden && mine && p < here.part) {
        // An earlier turn rests on its last point.
        const pts = l!.parts[p]!.points;
        const key = `${p}:${readLevel()}`;
        if (settled.get(t) !== key) { fillTurn(t, pts.length - 1, pts.length); sceneFor(t).set(pts.at(-1)!.state, true); settled.set(t, key); }
      }
    }
  }

  function fillTurn(t: HTMLElement, point: number, count: number) {
    for (const li of t.querySelectorAll<HTMLElement>('[data-at]')) {
      const at = Number(li.dataset.at);
      li.hidden = at > point;
      li.toggleAttribute('data-now', at === point && point < count - 1);
    }
    const sum = t.querySelector<HTMLElement>('[data-log-sum]');
    if (sum) sum.textContent = point === count - 1 ? sum.dataset.done! : 'Working';
    t.querySelector('[data-answer]')?.toggleAttribute('data-later', point < count - 1);
    const n = t.querySelector('[data-cap-n]'), cap = t.querySelector('[data-cap]');
    const p = LESSONS[t.dataset.lesson!]!.parts[Number(t.dataset.part)]!.points[point]!;
    if (n) n.textContent = `${point + 1} of ${count}`;
    if (cap) cap.textContent = p.say;
    t.querySelectorAll('[data-points] li').forEach((li, i) => li.toggleAttribute('data-current', i === point));
  }

  function showUi(animate: boolean) {
    const ui = lesson() ? uiAt(here.lesson, here.part, here.point) : uiAt(here.lesson, 0, -1);
    const flash = (el: HTMLElement) => { if (!animate || reduced.matches) return; el.removeAttribute('data-new'); void el.offsetWidth; el.setAttribute('data-new', ''); setTimeout(() => el.removeAttribute('data-new'), 2400); };
    const model = $('[data-ui="model"]');
    model.hidden = !ui.model;
    if (ui.model && !lastUi.model) flash(model);
    const perm = $('[data-ui="perm"]');
    perm.hidden = !ui.perm;
    if (ui.perm) {
      $('[data-perm]').textContent = ui.perm;
      perm.setAttribute('aria-label', perm.dataset.permTpl!.replace('{mode}', ui.perm));
      perm.title = perm.getAttribute('aria-label')!;
      if (ui.perm !== lastUi.perm) flash(perm);
    }
    const details = $('[data-ui="context"]');
    details.hidden = ui.context == null;
    if (ui.context != null) {
      const text = $('[data-ctx-text]');
      text.textContent = text.dataset.tpl!.replace('{used}', String(ui.context));
      $('[data-ctx-bar]').style.transform = `scaleX(${Math.max(0.01, ui.context / 100)})`;
      if (lastUi.context == null) { setDetails(true); flash(details); }
      else if (ui.context !== lastUi.context) flash(details);
    }
    root.toggleAttribute('data-has-log', !!ui.log);
    lastUi = ui;
  }

  function showSidebar() {
    for (const a of $$('[data-lesson]')) {
      if (!a.classList.contains('v2-row')) continue;
      const id = a.dataset.lesson!;
      const cur = id === here.lesson;
      a.toggleAttribute('aria-current', cur);
      if (cur) a.setAttribute('aria-current', 'page');
      const pill = a.querySelector<HTMLElement>('[data-status]')!;
      let status = '';
      if (cur && lesson()) {
        const l = lesson()!;
        const atEnd = here.part === l.parts.length - 1 && here.point === partOf().points.length - 1;
        status = pointOf().status ?? (atEnd && done.has(id) ? 'Completed' : playing ? 'Working' : '');
      } else if (done.has(id)) status = 'Completed';
      pill.textContent = status;
      pill.dataset.s = status;
    }
  }

  function showHead() {
    const { chapter, lesson: tl } = whereIs(here.lesson);
    $('[data-crumb-fav]').textContent = chapter.n ? String(chapter.n) : 'S';
    $('[data-crumb-project]').textContent = chapter.title;
    const fresh = lesson() && partOf().fresh;
    $('[data-crumb-thread]').textContent = fresh ? 'New thread' : tl.title;
  }

  function showControls() {
    const l = lesson();
    const btn = (c: string) => $<HTMLButtonElement>(`[data-c="${c}"]`);
    const play = btn('play');
    play.setAttribute('aria-pressed', String(playing));
    play.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    if (!l) {
      for (const c of ['part-prev', 'pt-prev', 'pt-next', 'part-next', 'play']) btn(c).disabled = true;
      $('[data-c-title]').textContent = whereIs(here.lesson).lesson.title;
      $('[data-c-where]').textContent = 'Not built yet';
      $('[data-dots]').replaceChildren();
      return;
    }
    const part = partOf(), lastPart = l.parts.length - 1, lastPoint = part.points.length - 1;
    btn('play').disabled = false;
    btn('part-prev').disabled = here.part === 0 && here.point === 0;
    btn('pt-prev').disabled = here.part === 0 && here.point === 0;
    btn('pt-next').disabled = here.part === lastPart && here.point === lastPoint;
    const nextLesson = nextPlayable(here.lesson);
    btn('part-next').disabled = here.part === lastPart && !nextLesson;
    btn('part-next').setAttribute('aria-label', here.part === lastPart && nextLesson ? 'Next lesson' : 'Next part');
    $('[data-c-title]').textContent = part.title;
    $('[data-c-where]').textContent = `Part ${here.part + 1} of ${l.parts.length} · point ${here.point + 1} of ${part.points.length}`;
    const dots = $('[data-dots]');
    dots.replaceChildren(...part.points.map((_, i) => { const d = document.createElement('i'); if (i === here.point) d.dataset.on = ''; else if (i < here.point) d.dataset.past = ''; return d; }));
  }

  /** Draw everything for `here`. `animate` plays the way into the point; otherwise the picture glides there. */
  async function show(animate: boolean, scroll = false): Promise<boolean> {
    showTurns();
    showHead();
    showUi(animate);
    showSidebar();
    showControls();
    try { history.replaceState(null, '', `#${here.lesson}${lesson() ? `-p${here.part + 1}` : ''}`); } catch { /* sandboxed */ }
    const l = lesson();
    if (!l) {
      soon.querySelector('[data-soon-title]')!.textContent = whereIs(here.lesson).lesson.title;
      const { chapter, lesson: tl } = whereIs(here.lesson);
      soon.querySelector('[data-soon-meta]')!.textContent = chapter.n ? `Chapter ${chapter.n} · ${chapter.title} › Lesson ${tl.n} · ${tl.title}` : `${chapter.title} › ${tl.title}`;
      scroller.scrollTo({ top: 0 });
      return true;
    }
    const turn = turnEl(here.lesson, here.part)!;
    settled.delete(turn);
    fillTurn(turn, here.point, partOf().points.length);
    if (scroll) requestAnimationFrame(() => scroller.scrollTo({ top: Math.max(0, turn.offsetTop - 12), behavior: reduced.matches || !animate ? 'auto' : 'smooth' }));
    const scene = sceneFor(turn);
    if (animate) return travel(scene, pointOf());
    scene.stop();
    scene.set(pointOf().state);
    return true;
  }

  function nextPlayable(id: string): string | undefined {
    const ids = TOC.flatMap((c) => c.lessons.map((l) => l.id)).filter((x) => LESSONS[x]);
    return ids[ids.indexOf(id) + 1];
  }

  // ---------- moving ----------

  function lastPointOf(part: number) { return lesson()!.parts[part]!.points.length - 1; }

  /** One point forward; across parts and into the next lesson. Returns false at the very end. */
  function stepForward(): 'point' | 'part' | 'end' {
    const l = lesson()!;
    if (here.point < lastPointOf(here.part)) { here.point++; return 'point'; }
    if (here.part < l.parts.length - 1) { here.part++; here.point = 0; return 'part'; }
    return 'end';
  }
  function stepBack(): boolean {
    if (here.point > 0) { here.point--; return true; }
    if (here.part > 0) { here.part--; here.point = lastPointOf(here.part); return true; }
    return false;
  }

  function markEnd() {
    const l = lesson();
    if (l && here.part === l.parts.length - 1 && here.point === lastPointOf(here.part)) { done.add(here.lesson); saveDone(); }
  }

  const dwell = (p: Point, last: boolean) => (reduced.matches ? 1400 : 1800) + p.say.length * 32 + (last ? 3200 : 0);

  async function playLoop() {
    const mine = ++token;
    playing = true;
    showSidebar(); showControls();
    let ok = await show(true, false);
    while (playing && mine === token && ok) {
      const last = here.point === lastPointOf(here.part);
      await sleep(dwell(pointOf(), last));
      if (!playing || mine !== token) return;
      const step = stepForward();
      if (step === 'end') { markEnd(); playing = false; showSidebar(); showControls(); return; }
      ok = await show(true, step === 'part');
    }
  }

  function pause() {
    playing = false;
    token++;
    showSidebar(); showControls();
  }

  function go(to: Here, opts: { play?: boolean; animate?: boolean; scroll?: boolean } = {}) {
    pause();
    const changedLesson = to.lesson !== here.lesson;
    here = to;
    if (changedLesson) { for (const s of scenes.values()) s.stop(); settled.clear(); }
    if (opts.play && lesson()) { void playLoop().then(() => markEnd()); return; }
    void show(!!opts.animate, opts.scroll ?? true).then(() => { markEnd(); showSidebar(); });
  }

  // ---------- controls ----------

  root.addEventListener('click', (e) => {
    const c = (e.target as HTMLElement).closest<HTMLElement>('[data-c]')?.dataset.c;
    if (!c || !lesson()) return;
    if (c === 'play') { if (playing) { pause(); } else { if (isAtEnd()) here = { lesson: here.lesson, part: 0, point: 0 }; void playLoop(); } return; }
    if (c === 'pt-next') { const step = stepForward(); if (step !== 'end') go(here, { animate: true, scroll: step === 'part' }); return; }
    if (c === 'pt-prev') { if (stepBack()) go(here, { scroll: false }); return; }
    if (c === 'part-next') {
      if (here.part < lesson()!.parts.length - 1) go({ ...here, part: here.part + 1, point: 0 }, { play: true });
      else { const nx = nextPlayable(here.lesson); if (nx) go({ lesson: nx, part: 0, point: 0 }, { play: true }); }
      return;
    }
    if (c === 'part-prev') {
      if (here.point > 0) go({ ...here, point: 0 });
      else if (here.part > 0) go({ ...here, part: here.part - 1, point: 0 });
    }
  });
  const isAtEnd = () => { const l = lesson(); return !!l && here.part === l.parts.length - 1 && here.point === lastPointOf(here.part); };

  root.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('input, textarea, [data-filter-pop]') || e.altKey || e.metaKey || e.ctrlKey) return;
    const map: Record<string, string> = { ArrowRight: e.shiftKey ? 'part-next' : 'pt-next', ArrowLeft: e.shiftKey ? 'part-prev' : 'pt-prev' };
    const c = map[e.key];
    if (!c || !t.closest('.v2-main')) return;
    e.preventDefault();
    $<HTMLButtonElement>(`[data-c="${c}"]`).click();
  });

  // Lessons in the sidebar, and links to them: a click plays the lesson from its start.
  root.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[data-lesson], a[data-lesson-link]');
    if (!a) return;
    e.preventDefault();
    const id = a.dataset.lesson ?? a.dataset.lessonLink!;
    root.dataset.view = 'thread';
    go({ lesson: id, part: 0, point: 0 }, { play: !!LESSONS[id] });
    if (matchMedia('(max-width: 47.99rem)').matches) $('[data-to-list]').focus({ preventScroll: true });
  });
  $('[data-to-list]').addEventListener('click', (e) => { e.preventDefault(); pause(); root.dataset.view = 'list'; root.querySelector<HTMLElement>('.v2-row[aria-current]')?.focus(); });

  // ---------- the filter: threads by project ----------

  const fBtn = $<HTMLButtonElement>('[data-filter-btn]'), fPop = $('[data-filter-pop]'), fQ = $<HTMLInputElement>('[data-filter-q]');
  let scope = new Set<string>();
  const setPop = (open: boolean) => {
    fPop.hidden = !open;
    fBtn.setAttribute('aria-expanded', String(open));
    if (open) { fQ.value = ''; filterOptions(''); fQ.focus(); }
  };
  const filterOptions = (q: string) => {
    for (const b of fPop.querySelectorAll<HTMLElement>('[data-scope]')) {
      const li = b.parentElement!;
      li.hidden = b.dataset.scope !== 'all' && !b.textContent!.toLowerCase().includes(q.trim().toLowerCase());
      if (q.trim() && b.dataset.scope === 'all') li.hidden = true;
    }
  };
  const applyScope = () => {
    for (const f of $$('[data-project]')) f.hidden = scope.size > 0 && !scope.has(f.dataset.project!);
    for (const b of fPop.querySelectorAll<HTMLElement>('[data-scope]')) b.setAttribute('aria-selected', String(b.dataset.scope === 'all' ? scope.size === 0 : scope.has(b.dataset.scope!)));
    const icon = $('[data-filter-icon]');
    if (!icon.dataset.svg) icon.dataset.svg = icon.innerHTML;
    if (scope.size === 0) icon.innerHTML = icon.dataset.svg;
    else icon.replaceChildren(...[...scope].slice(0, 2).map((id) => { const s = document.createElement('span'); s.className = 'v2-fav'; const c = TOC.find((x) => x.id === id)!; s.textContent = c.n ? String(c.n) : 'S'; return s; }));
    const names = [...scope].map((id) => TOC.find((x) => x.id === id)!.title);
    const label = names.length ? `${fBtn.title}: ${names.join(', ')}` : fBtn.title;
    fBtn.setAttribute('aria-label', label);
  };
  fBtn.addEventListener('click', () => setPop(fPop.hidden));
  fQ.addEventListener('input', () => filterOptions(fQ.value));
  fQ.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { const first = [...fPop.querySelectorAll<HTMLElement>('[data-scope]')].find((b) => !b.parentElement!.hidden); first?.click(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); [...fPop.querySelectorAll<HTMLElement>('[data-scope]')].find((b) => !b.parentElement!.hidden)?.focus(); }
  });
  fPop.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { setPop(false); fBtn.focus(); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const opts = [...fPop.querySelectorAll<HTMLElement>('[data-scope]')].filter((b) => !b.parentElement!.hidden);
      const i = opts.indexOf(document.activeElement as HTMLElement);
      if (i < 0) return;
      e.preventDefault();
      opts[(i + (e.key === 'ArrowDown' ? 1 : opts.length - 1)) % opts.length]!.focus();
    }
  });
  fPop.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-scope]');
    if (!b) return;
    const id = b.dataset.scope!;
    if (id === 'all') scope = new Set();
    else if (e.shiftKey) { if (scope.has(id)) scope.delete(id); else scope.add(id); }
    else scope = new Set([id]);
    applyScope();
    if (!e.shiftKey) { setPop(false); fBtn.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (!fPop.hidden && !(e.target as HTMLElement).closest('.v2-filter')) setPop(false);
  });

  // ---------- thread details ----------

  const dBtn = $<HTMLButtonElement>('[data-details-btn]'), dPop = $('[data-details-pop]');
  function setDetails(open: boolean) { dPop.hidden = !open; dBtn.setAttribute('aria-expanded', String(open)); }
  dBtn.addEventListener('click', () => setDetails(dPop.hidden));

  // ---------- copy ----------

  root.addEventListener('click', async (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]');
    if (!b) return;
    const text = b.parentElement!.querySelector('[data-prompt]')!.textContent ?? '';
    const word = b.querySelector('span')!;
    try { await navigator.clipboard.writeText(text); word.textContent = 'Copied'; }
    catch { const r = document.createRange(); r.selectNodeContents(b.parentElement!.querySelector('[data-prompt]')!); getSelection()?.removeAllRanges(); getSelection()?.addRange(r); word.textContent = 'Selected'; }
    setTimeout(() => { word.textContent = 'Copy'; }, 1600);
  });

  // ---------- reader level ----------

  document.addEventListener(LEVEL_EVENT, (e) => {
    const lv = (e as CustomEvent).detail;
    if (!isLevel(lv)) return;
    for (const s of scenes.values()) { s.level = lv; s.set(s.state, true); }
  });

  // ---------- start ----------

  const m = /^#(l\d+|s-[\w-]+)(?:-p(\d+))?$/.exec(location.hash);
  const known = (id: string) => TOC.some((c) => c.lessons.some((l) => l.id === id));
  if (m && known(m[1]!)) {
    const id = m[1]!;
    const part = LESSONS[id] ? Math.min(Math.max(0, Number(m[2] ?? 1) - 1), LESSONS[id]!.parts.length - 1) : 0;
    here = { lesson: id, part, point: 0 };
    root.dataset.view = 'thread';
  }
  void show(false, true);
  addEventListener('hashchange', () => {
    const h = /^#(l\d+|s-[\w-]+)(?:-p(\d+))?$/.exec(location.hash);
    if (!h || !known(h[1]!) || (h[1] === here.lesson && Number(h[2] ?? 1) - 1 === here.part)) return;
    root.dataset.view = 'thread';
    go({ lesson: h[1]!, part: LESSONS[h[1]!] ? Math.max(0, Number(h[2] ?? 1) - 1) : 0, point: 0 }, { play: !!LESSONS[h[1]!] });
  });
}
