/*
 * A file, open in T3 Code's file viewer (t3code.browser: "a browser … plus a file viewer"), drawn in
 * the browser panel's Preview tab. Lesson 6 shows the Lantern's AGENTS.md and its door-check skill
 * here. It follows the guide's light or dark theme, like the rest of the drawing of T3 Code; the
 * club's own pages (door.ts, lantern.ts) keep their dark look.
 *
 * Stages:
 *   'agents'      AGENTS.md as first written (part 2)
 *   'agents-red'  one line added, marked as the turn's change (part 3)
 *   'agents-long' weeks later: 240 lines, folded around the door-check section (part 4)
 *   'agents-131'  the same, with the rule a thread missed marked
 *   'skill'       .claude/skills/door-check/SKILL.md (part 4)
 *
 * The folds open and close; the text can be selected. Everything in the files is made up.
 */
import './file.css';
import type { MountApp } from './index';
import { AGENTS_V1, AGENTS_V2, AGENTS_LONG, RED_AT, MISSED_LINE, SKILL, SKILL_PATH } from './file/docs';

type Stage = 'agents' | 'agents-red' | 'agents-long' | 'agents-131' | 'skill';
const STAGES: Stage[] = ['agents', 'agents-red', 'agents-long', 'agents-131', 'skill'];

interface View {
  path: string;
  lines: string[];
  /** 1-based lines added in this turn. */
  added?: number[];
  /** A 1-based line to point at, with a note. */
  mark?: { line: number; note: string };
  /** Folded ranges, 1-based and inclusive, until the reader opens them. */
  folds?: [number, number][];
}

const VIEWS: Record<Stage, View> = {
  agents: { path: 'AGENTS.md', lines: AGENTS_V1 },
  'agents-red': { path: 'AGENTS.md', lines: AGENTS_V2, added: [RED_AT + 1] },
  'agents-long': { path: 'AGENTS.md', lines: AGENTS_LONG, folds: [[26, 120], [142, AGENTS_LONG.length]] },
  'agents-131': { path: 'AGENTS.md', lines: AGENTS_LONG, mark: { line: MISSED_LINE, note: 'not run last Friday' }, folds: [[26, 120], [142, AGENTS_LONG.length]] },
  skill: { path: SKILL_PATH, lines: SKILL },
};

export const url = 'AGENTS.md';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Light Markdown colouring: headings, list marks, `code`, front matter keys. */
function paint(line: string, inFront: boolean): string {
  if (inFront) {
    const m = /^([\w-]+):(.*)$/.exec(line);
    return m ? `<span class="fv-key">${esc(m[1]!)}</span>:${esc(m[2]!)}` : `<span class="fv-mute">${esc(line)}</span>`;
  }
  if (/^#{1,6} /.test(line)) return `<span class="fv-h">${esc(line)}</span>`;
  const list = /^(\s*)(- |\d+\. )(.*)$/.exec(line);
  const body = (t: string) => esc(t).replace(/`([^`]+)`/g, '<code>$1</code>');
  if (list) return `${list[1]}<span class="fv-mark">${esc(list[2]!)}</span>${body(list[3]!)}`;
  return body(line);
}

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export const file: MountApp = (el, initial) => {
  let stage: Stage = STAGES.includes(initial as Stage) ? (initial as Stage) : 'agents';
  /** Folds the reader opened, per stage. */
  const opened = new Map<Stage, Set<number>>();
  const root = document.createElement('div');
  root.className = 'fv';
  el.append(root);

  function render() {
    const v = VIEWS[stage];
    const open = opened.get(stage) ?? new Set<number>();
    let front = v.lines[0] === '---';
    let rows = '';
    for (let i = 1; i <= v.lines.length; i++) {
      const fold = v.folds?.findIndex(([a, b]) => i === a && !open.has(a));
      if (fold != null && fold >= 0) {
        const [a, b] = v.folds![fold]!;
        rows += `<li class="fv-fold"><button type="button" data-open="${a}"><span>Show lines ${a}–${b}</span><span class="fv-fold-n">${b - a + 1} lines</span></button></li>`;
        i = b;
        continue;
      }
      const text = v.lines[i - 1]!;
      const inFront = front && i > 1;
      if (front && i > 1 && text === '---') front = false;
      const added = v.added?.includes(i);
      const marked = v.mark?.line === i;
      rows += `<li class="fv-line"${added ? ' data-added' : ''}${marked ? ' data-mark' : ''}><span class="fv-n" aria-hidden="true">${added ? '+' : i}</span><span class="fv-t">${paint(text, inFront && text !== '---') || ' '}${marked ? `<span class="fv-note">${esc(v.mark!.note)}</span>` : ''}</span></li>`;
    }
    const chip = v.added ? `<span class="fv-chip fv-chip-add">+${v.added.length} line${v.added.length > 1 ? 's' : ''}</span>` : '';
    root.innerHTML = `
      <header class="fv-head">
        <span class="fv-path">${v.path.split('/').map((p, i, a) => (i === a.length - 1 ? `<b>${esc(p)}</b>` : `<span>${esc(p)}</span><i>/</i>`)).join('')}</span>
        <span class="fv-meta">${chip}<span>${v.lines.length} lines</span><span class="fv-lang">Markdown</span></span>
      </header>
      <ol class="fv-body" aria-label="${esc(v.path)}, ${v.lines.length} lines">${rows}</ol>`;
    pending = !!root.querySelector('[data-mark], [data-added]');
    requestAnimationFrame(reveal);
  }

  /** Scroll the line the lesson points at into view, once the page has a size (the tab may be hidden). */
  let pending = false;
  function reveal() {
    const body = root.querySelector<HTMLElement>('.fv-body');
    const target = root.querySelector<HTMLElement>('[data-mark], [data-added]');
    if (!pending || !body || !target || !body.clientHeight) return;
    pending = false;
    body.scrollTop = Math.max(0, target.offsetTop - body.clientHeight / 3);
    if (!reduced()) target.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
  }
  const ro = new ResizeObserver(reveal);
  ro.observe(root);

  root.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-open]');
    // Only the app's own folds: the phone sheet around it carries data-open too.
    if (!b || !root.contains(b)) return;
    const set = opened.get(stage) ?? new Set<number>();
    set.add(Number(b.dataset.open));
    opened.set(stage, set);
    const top = root.querySelector<HTMLElement>('.fv-body')!.scrollTop;
    render();
    root.querySelector<HTMLElement>('.fv-body')!.scrollTop = top;
  });

  render();
  return {
    set(next: string) {
      if (!STAGES.includes(next as Stage) || next === stage) return;
      stage = next as Stage;
      render();
      el.dispatchEvent(new CustomEvent('v2:url', { bubbles: true, detail: VIEWS[stage].path }));
    },
    destroy() { ro.disconnect(); root.remove(); },
  };
};

export const app = file;
