/*
 * The agent trying the door page in T3 Code's shared browser panel: a bar says it is driving, a
 * touch pointer types and taps, and the three "done when" cases tick off as it goes. The page is
 * real; the run only calls what a tap or a keystroke would. About 9 s. `stop()` cuts it short and
 * applies the rest of the run at once, so the page always ends in the same state.
 */
export interface Page {
  root: HTMLElement;
  bar: HTMLElement;
  field(): HTMLElement | null;
  clearButton(): HTMLElement | null;
  row(id: string): HTMLElement | null;
  /** Show the search box as focused without taking the reader's focus. */
  agentFocus(on: boolean): void;
  setQuery(q: string): void;
  tapRow(id: string): void;
  count(): number;
  /** Put a guest back to not arrived, as a fresh test run would find them. */
  resetGuest(id: string): void;
}

type CaseState = 'wait' | 'run' | 'pass' | 'fail';
const CASES = ['A listed guest is found and tapped in', 'A name that isn’t listed stays out', 'Nobody can be tapped in twice'];

const ICON: Record<CaseState, string> = {
  wait: '',
  run: '',
  pass: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.2 5 8.6l4.5-5"/></svg>',
  fail: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 3l6 6M9 3 3 9"/></svg>',
};

export interface Run { stop(): void; readonly done: boolean }

export function runAgent(page: Page, guest: { id: string; name: string }, opts: { instant: boolean; onDone?: () => void }): Run {
  const { root, bar } = page;
  const states: CaseState[] = ['wait', 'wait', 'wait'];
  let caption = 'Opening /door at 390 × 844';
  let finished = false;
  let before = 0, afterFirst = 0, afterSecond = 0;

  bar.hidden = false;
  bar.innerHTML = `
    <div class="dr-agent-top">
      <span class="dr-agent-live" aria-hidden="true"></span>
      <span class="dr-agent-title" data-title>Agent is using this page</span>
      <ol class="dr-agent-cases" aria-label="Your three cases"></ol>
    </div>
    <p class="dr-agent-step" data-step aria-live="polite"></p>`;
  const $title = bar.querySelector<HTMLElement>('[data-title]')!;
  const $cases = bar.querySelector<HTMLElement>('.dr-agent-cases')!;
  const $step = bar.querySelector<HTMLElement>('[data-step]')!;
  function paint() {
    $cases.innerHTML = states.map((s, i) => `<li data-s="${s}" title="${CASES[i]}"><span class="dr-vh">Case ${i + 1}, ${CASES[i]}: ${s === 'wait' ? 'not run yet' : s === 'run' ? 'running' : s === 'pass' ? 'passed' : 'failed'}</span>${ICON[s] || `<span aria-hidden="true">${i + 1}</span>`}</li>`).join('');
    $step.textContent = caption;
    bar.dataset.state = finished ? 'done' : 'run';
  }
  paint();

  // The touch pointer. It lives in the page's root, above everything, and never takes events.
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
    const x = (t.left - r.left + t.width * fx) / k, y = (t.top - r.top + t.height / 2) / k;
    dot.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  }
  function tapFx() {
    if (!live) return;
    dot.querySelector('i')!.animate([{ transform: 'scale(0.6)', opacity: 0.7 }, { transform: 'scale(1.9)', opacity: 0 }], { duration: 300, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    dot.animate([{ transform: dot.style.transform + ' scale(0.82)' }, { transform: dot.style.transform }], { duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
  }
  const say = (s: string) => { caption = s; paint(); };
  const set = (i: number, s: CaseState) => { states[i] = s; paint(); };
  const type = (text: string, gap: number): [number, () => void][] =>
    [...text].map((_, i) => [i ? gap : 0, () => page.setQuery(text.slice(0, i + 1))]);
  const first = guest.name.split(' ')[0]!;

  // [wait before this step in ms, what it does]. Steps run their logic even when cut short;
  // pointer moves are skipped then.
  const steps: [number, () => void][] = [
    [0, () => { page.resetGuest(guest.id); page.setQuery(''); before = page.count(); if (live) { dot.style.transform = `translate(${root.offsetWidth * 0.62}px, ${root.offsetHeight * 0.72}px)`; dot.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' }); } }],
    [450, () => { set(0, 'run'); say('Case 1 · type “ana”'); point(page.field(), 0.32); }],
    [380, () => { tapFx(); page.agentFocus(true); }],
    ...type('ana', 170),
    [520, () => { say(`Case 1 · tap ${guest.name}`); point(page.row(guest.id), 0.62); }],
    [380, () => { tapFx(); page.tapRow(guest.id); afterFirst = page.count(); }],
    [600, () => { set(0, afterFirst === before + 1 ? 'pass' : 'fail'); say(`Case 1 passed · ${first} in, count ${before} → ${afterFirst}`); }],
    [700, () => { set(1, 'run'); say('Case 2 · type “zed”'); point(page.field(), 0.32); }],
    [380, () => { tapFx(); }],
    ...type('zed', 170),
    [520, () => { set(1, page.count() === afterFirst ? 'pass' : 'fail'); say('Case 2 passed · “Not on tonight’s list”'); }],
    [700, () => { set(2, 'run'); say(`Case 3 · find ${first} again`); point(page.clearButton()); }],
    [380, () => { tapFx(); page.setQuery(''); point(page.field(), 0.32); }],
    [300, () => {}],
    ...type('ana', 170),
    [520, () => { say(`Case 3 · tap ${first} a second time`); point(page.row(guest.id), 0.62); }],
    [380, () => { tapFx(); page.tapRow(guest.id); afterSecond = page.count(); }],
    [500, () => { say(`Case 3 · check the count stayed ${afterFirst}`); point(page.field(), 0.32); }],
    [380, () => { tapFx(); }],
    ...type('ana', 170),
    [700, () => {
      const twice = afterSecond !== afterFirst;
      set(2, twice ? 'fail' : 'pass');
      finished = true;
      const passed = states.filter((s) => s === 'pass').length;
      $title.textContent = `Agent finished · ${passed} of 3 passed`;
      say(twice ? `Case 3 failed · ${first} counted twice, ${afterFirst} → ${afterSecond}` : 'All three cases passed');
      page.agentFocus(false);
      if (live) dot.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-out', fill: 'forwards' }).finished.then(() => dot.remove(), () => dot.remove());
      opts.onDone?.();
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

  return {
    stop: finish,
    get done() { return i >= steps.length; },
  };
}
