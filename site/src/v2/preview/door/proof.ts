/*
 * Lesson 8, part 2: the agent brings proof. It tries the door at phone size in T3 Code's shared
 * browser, one case after another, the four cases the reply then reports: Ana found and tapped in,
 * Zed not on the list, Ana's second tap refused, Rico red with nothing to tap. The page is real;
 * the run only calls what a tap or a keystroke would, like ./agent.ts (lesson 2's three cases).
 * About 11 s. `stop()` applies the rest at once, so the page always ends in the same state.
 */
import type { Page } from './agent';

export interface ProofPage extends Page {
  /** What the last tap left above the search box: 'in', 'already', 'dna', or 'hint'. */
  deck(): string;
  /** The results view: 'idle', 'hits' or 'none'. */
  view(): string;
}

type CaseState = 'wait' | 'run' | 'pass' | 'fail';
const CASES = ['Ana is found and tapped in', 'Zed is not on the list', 'A second tap on Ana is refused', 'Rico shows red, with no tap-in'];
const PASS = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.2 5 8.6l4.5-5"/></svg>';
const FAIL = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 3l6 6M9 3 3 9"/></svg>';

export interface Run { stop(): void; readonly done: boolean }

export function runProof(page: ProofPage, ana: { id: string; name: string }, rico: { id: string }, opts: { instant: boolean }): Run {
  const { root, bar } = page;
  const states: CaseState[] = ['wait', 'wait', 'wait', 'wait'];
  let caption = 'Opening /door at 390 × 844';
  let finished = false;
  let before = 0, afterFirst = 0;

  bar.hidden = false;
  bar.innerHTML = `
    <div class="dr-agent-top">
      <span class="dr-agent-live" aria-hidden="true"></span>
      <span class="dr-agent-title" data-title>Agent is using this page</span>
      <ol class="dr-agent-cases" aria-label="Four cases"></ol>
    </div>
    <p class="dr-agent-step" data-step aria-live="polite"></p>`;
  const $title = bar.querySelector<HTMLElement>('[data-title]')!;
  const $cases = bar.querySelector<HTMLElement>('.dr-agent-cases')!;
  const $step = bar.querySelector<HTMLElement>('[data-step]')!;
  function paint() {
    $cases.innerHTML = states.map((s, i) => `<li data-s="${s}" title="${CASES[i]}"><span class="dr-vh">Case ${i + 1}, ${CASES[i]}: ${s === 'wait' ? 'not run yet' : s === 'run' ? 'running' : s === 'pass' ? 'passed' : 'failed'}</span>${s === 'pass' ? PASS : s === 'fail' ? FAIL : `<span aria-hidden="true">${i + 1}</span>`}</li>`).join('');
    $step.textContent = caption;
    bar.dataset.state = finished ? 'done' : 'run';
    bar.dataset.result = finished && states.every((s) => s === 'pass') ? 'pass' : '';
  }
  paint();

  const dot = document.createElement('div');
  dot.className = 'dr-pointer';
  dot.setAttribute('aria-hidden', 'true');
  dot.innerHTML = '<i></i>';
  let live = !opts.instant;
  if (live) root.append(dot);

  function point(target: HTMLElement | null, fx = 0.5) {
    if (!live || !target) return;
    const r = root.getBoundingClientRect(), t = target.getBoundingClientRect();
    const k = r.width / (root.offsetWidth || 1) || 1;
    dot.style.transform = `translate(${((t.left - r.left + t.width * fx) / k).toFixed(1)}px, ${((t.top - r.top + t.height / 2) / k).toFixed(1)}px)`;
  }
  function tapFx() {
    if (!live) return;
    dot.querySelector('i')!.animate([{ transform: 'scale(0.6)', opacity: 0.7 }, { transform: 'scale(1.9)', opacity: 0 }], { duration: 300, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
  }
  const say = (s: string) => { caption = s; paint(); };
  const set = (i: number, s: CaseState) => { states[i] = s; paint(); };
  const type = (text: string): [number, () => void][] => [...text].map((_, i) => [i ? 150 : 0, () => page.setQuery(text.slice(0, i + 1))]);
  const name = ana.name.split(' ')[0]!;
  const clear = (): [number, () => void][] => [[520, () => point(page.clearButton())], [320, () => { tapFx(); page.setQuery(''); point(page.field(), 0.32); }]];

  const steps: [number, () => void][] = [
    [0, () => { page.resetGuest(ana.id); page.setQuery(''); before = page.count(); if (live) { dot.style.transform = `translate(${root.offsetWidth * 0.62}px, ${root.offsetHeight * 0.72}px)`; dot.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' }); } }],
    [420, () => { set(0, 'run'); say(`Case 1 · find ${name}`); point(page.field(), 0.32); }],
    [340, () => { tapFx(); page.agentFocus(true); }],
    ...type('ana'),
    [480, () => { say(`Case 1 · tap ${ana.name}`); point(page.row(ana.id), 0.62); }],
    [340, () => { tapFx(); page.tapRow(ana.id); afterFirst = page.count(); }],
    [520, () => { set(0, afterFirst === before + 1 ? 'pass' : 'fail'); say(`Case 1 passed · ${name} in, ${before} → ${afterFirst}`); point(page.field(), 0.32); }],
    [620, () => { set(1, 'run'); say('Case 2 · type “zed”'); tapFx(); }],
    ...type('zed'),
    [520, () => { set(1, page.view() === 'none' && page.count() === afterFirst ? 'pass' : 'fail'); say('Case 2 passed · “Not on tonight’s list”'); }],
    [600, () => { set(2, 'run'); say(`Case 3 · tap ${name} again`); }],
    ...clear(),
    ...type('ana'),
    [480, () => point(page.row(ana.id), 0.62)],
    [340, () => { tapFx(); page.tapRow(ana.id); }],
    [560, () => { set(2, page.deck() === 'already' && page.count() === afterFirst ? 'pass' : 'fail'); say(`Case 3 passed · “Already in”, still ${afterFirst}`); }],
    [600, () => { set(3, 'run'); say('Case 4 · find Rico'); }],
    ...clear(),
    ...type('rico'),
    [480, () => point(page.row(rico.id), 0.62)],
    [340, () => { tapFx(); page.tapRow(rico.id); }],
    [600, () => {
      set(3, page.deck() === 'dna' && page.count() === afterFirst ? 'pass' : 'fail');
      finished = true;
      const passed = states.filter((s) => s === 'pass').length;
      $title.textContent = `Agent finished · ${passed} of 4 passed`;
      say(passed === 4 ? 'All four cases passed at 390 × 844' : `${4 - passed} case${passed === 3 ? '' : 's'} failed`);
      page.agentFocus(false);
      if (live) dot.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-out', fill: 'forwards' }).finished.then(() => dot.remove(), () => dot.remove());
    }],
  ];

  let i = 0, timer = 0;
  function next() {
    timer = 0;
    if (i >= steps.length) return;
    steps[i++]![1]();
    if (i < steps.length) timer = window.setTimeout(next, steps[i]![0]);
  }
  function finish() {
    live = false;
    dot.remove();
    if (timer) clearTimeout(timer);
    timer = 0;
    while (i < steps.length) steps[i++]![1]();
  }
  if (opts.instant) finish();
  else timer = window.setTimeout(next, 120);

  return { stop: finish, get done() { return i >= steps.length; } };
}
