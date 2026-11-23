/*
 * The door page later on Friday (lessons 7 and 8). Rico Vance, who started a fight last Friday, is
 * on Noor's list tonight and marked do-not-admit. Red on the door means one thing: do not admit.
 *
 *   'listed'   Rico is on Noor's list, unmarked: nothing stops a tap-in yet.
 *   'dna'      the row is red, says "Do not admit", and has no tap-in; a tap says so and counts nobody.
 *   'dnaFull'  a tap opens what to do: the reason, and who to call (the answers from lesson 7, part 4).
 *   'proof'    the same page, while the agent tries four cases in the shared browser (./proof.ts).
 *   'practice' the same page with made-up guests in practice mode: nothing tapped reaches tonight's
 *              list, and a bar ticks off the four cases as the reader tries them.
 *
 * Markup only; door.ts calls these and keeps the state. Everything here is made up.
 */
import { LISTS, type Guest } from './guests';

/** Stages where Rico is on tonight's lists. */
export const LATE_STAGES = ['listed', 'dna', 'dnaFull', 'proof', 'practice'];
/** Stages where he is marked do-not-admit. */
export const DNA_STAGES = ['dna', 'dnaFull', 'proof', 'practice'];
/** Stages where a tap on a do-not-admit guest opens what to do. */
export const FULL_STAGES = ['dnaFull', 'proof', 'practice'];

/** What the club wrote down for each do-not-admit guest (made up). */
export const MARKS: Record<string, { reason: string; by: string; at: string }> = {
  'rico-vance': { reason: 'Started a fight at the bar last Friday.', by: 'you', at: '19:12' },
};
/** Who Sami calls, from the answer in lesson 7, part 4: security on shift (staff from guests.ts). */
export const CALL = ['Finn Gallagher', 'Marek Duda'];

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const initials = (name: string) => { const w = name.split(' '); return (w[0]![0]! + (w.length > 1 ? w[w.length - 1]![0]! : '')).toUpperCase(); };
const first = (name: string) => name.split(' ')[0]!;

const STOP = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>';
const TICK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 8.4 6.4 11.5 12.8 4.6"/></svg>';

/** A do-not-admit guest's row: red, with nothing to tap in. `name` is the name with the search marks. */
export function dnaRow(g: Guest, name: string, full: boolean): string {
  const label = `${g.name}, ${LISTS[g.list].label}, do not admit${full ? '. Tap for what to do' : ''}`;
  return `<li><button type="button" class="dr-row dr-row--dna dr-l-${g.list}" data-id="${g.id}" data-dna aria-label="${esc(label)}">
    <span class="dr-av dr-av--dna" aria-hidden="true">${initials(g.name)}</span>
    <span class="dr-who" aria-hidden="true">
      <span class="dr-name">${name}</span>
      <span class="dr-meta"><i class="dr-dot"></i>${esc(LISTS[g.list].label)}${g.plus ? `<span class="dr-plus">+${g.plus}</span>` : ''}</span>
    </span>
    <span class="dr-status" aria-hidden="true"><span class="dr-dna">${STOP}<span>Do not admit</span></span></span>
  </button></li>`;
}

/** The line above the search box after a tap on a do-not-admit guest. */
export function dnaDeck(g: Guest, full: boolean): string {
  return `<div class="dr-toast" data-kind="dna">
    <span class="dr-toast-icon">${STOP}</span>
    <span class="dr-toast-text"><b>Do not admit · ${esc(g.name)}</b><span>${full ? 'Not counted · tap the name for what to do' : 'Not checked in, not counted'}</span></span>
  </div>`;
}

/** What to do, in a sheet: the mark, the reason, the group, who to call. */
export function dnaSheet(g: Guest): string {
  const m = MARKS[g.id];
  return `<div class="dr-scrim" data-close></div>
    <div class="dr-panel dr-panel--dna" role="dialog" aria-modal="true" aria-labelledby="dr-dna-title">
      <div class="dr-panel-head">
        <span class="dr-av dr-av--dna" aria-hidden="true">${initials(g.name)}</span>
        <span class="dr-who"><b id="dr-dna-title">${esc(g.name)}</b><span class="dr-meta"><i class="dr-dot"></i>${esc(LISTS[g.list].label)}${g.plus ? ` · with ${g.plus} plus-one${g.plus > 1 ? 's' : ''}` : ''}</span></span>
      </div>
      <p class="dr-dna-big">${STOP}<span>Do not admit</span></p>
      <p class="dr-dna-who">Not ${esc(first(g.name))}, and nobody who came with them.</p>
      <dl class="dr-dna-facts">
        ${m ? `<div><dt>Why</dt><dd>${esc(m.reason)}</dd></div>` : ''}
        <div><dt>Call</dt><dd>Security on shift: ${CALL.map((n) => esc(first(n))).join(' and ')}</dd></div>
        ${m ? `<div><dt>Marked</dt><dd>By ${esc(m.by)} at ${esc(m.at)}</dd></div>` : ''}
      </dl>
      <button type="button" class="dr-cancel dr-dna-ok" data-close>Got it</button>
    </div>`;
}

/** Under tonight's lists, when nothing is typed: who is on do-not-admit tonight. */
export function dnaLists(gs: Guest[]): string {
  if (!gs.length) return '';
  return `<p class="dr-lists-dna">${STOP}<span><b>Do not admit</b> · ${gs.map((g) => `${esc(g.name)} (${esc(LISTS[g.list].short)})`).join(', ')}</span></p>`;
}

// ---------- practice mode ----------

export const PRACTICE_CASES = ['Tap Ana in', 'A name nobody has', 'Tap Ana again', 'Find Rico'];

/** The yellow bar at the top in practice mode, with the four cases the reader ticks off. */
export function practiceBar(done: boolean[]): string {
  const all = done.every(Boolean);
  return `<div class="dr-practice-top">
      <b>Practice</b><span>${all ? 'All four tried, by you' : 'Made-up guests · nothing here reaches tonight’s list'}</span>
    </div>
    <ol class="dr-practice-cases" aria-label="Four cases to try">${PRACTICE_CASES.map((c, i) => `<li${done[i] ? ' data-done' : ''}><span class="dr-practice-mark" aria-hidden="true">${done[i] ? TICK : i + 1}</span><span>${esc(c)}</span><span class="dr-vh">${done[i] ? ': tried' : ': not tried yet'}</span></li>`).join('')}</ol>`;
}
