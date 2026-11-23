/*
 * What the picture says for itself, drawn on top of it: one speech bubble at the part that speaks,
 * and one counter chip in a corner. Everything else the run says goes in the step text (run.ts).
 * The brief is planning/journey-mobile/SPEC.md; "For chapter authors" there says how to use it.
 *
 *   say(who, text)    a line someone in the picture said. Shown as a bubble pointing at their part,
 *                     replacing the line before. False when the speaker has no part on the picture:
 *                     run.ts then puts the line in the narration line instead.
 *   counter(pairs)    the readout's main number as a chip, top left. The first pair of ctx.stat,
 *                     unless the chapter or step pins another (Chapter.counter, StepDef.counter).
 *
 * The speaker-to-part map is SPEAKERS below, and nowhere else. A chapter adds to it with
 * Chapter.speakers or StepDef.speakers.
 */
import type { SceneState } from './picture';
import type { Scene, Box } from './scene';
import type { StatPair, CounterPin, Ctx } from './chapter';

/** Where a part is, as a label's anchor name ("you", "a0", "gate", "tool:run", "peer", …). */
type Find = (s: SceneState) => string | null;

const agent = (id: string): Find => (s) => (s.agents.some((a) => a.id === id) ? id : null);
const person = (who: 'peer' | 'client' | 'user'): Find => (s) => s.people?.find((p) => (p.who ?? 'peer') === who)?.id ?? null;
/** The station you talk to: the agent a0, or the first job when several run. */
const main: Find = (s) => (s.agents.find((a) => a.id === 'a0') ?? s.agents[0])?.id ?? null;
/** A helper: the one that is busy, or the first. */
const helper: Find = (s) => {
  const ws = s.agents.filter((a) => /^w\d/.test(a.id));
  return (ws.find((a) => a.busy || a.lamp === 'work') ?? ws[0])?.id ?? null;
};

/**
 * Who stands where. Tried in order, after the chapter's own map and after a label on the picture
 * whose words are the speaker's name (a station labelled "Opus 5.5" speaks for "Opus 5.5").
 */
export const SPEAKERS: [RegExp, Find][] = [
  [/^you$/i, (s) => (s.you ? 'you' : null)],
  [/^(the )?(model|agent|lead|planner|builder)$/i, main],
  [/^(the )?check\b|^test run$|^judge$/i, (s) => s.gates?.[0]?.id ?? null],
  [/^(the )?(tools?|progress)$/i, (s) => (s.tools ? (s.tools.on ? `tool:${s.tools.on}` : 'tools') : null)],
  [/^(the )?reviewer$/i, agent('r0')],
  [/^(a |the )?helper$/i, helper],
  [/^(a |the )?colleague$/i, person('peer')],
  [/^(a |the )?client$/i, person('client')],
  [/^(a |the )?users?$/i, person('user')],
];

const norm = (s: string) => s.trim().toLowerCase();

export class Overlay {
  private bubble: HTMLElement;
  private text: HTMLElement;
  private chip: HTMLElement;
  private chipName: HTMLElement;
  private chipValue: HTMLElement;
  /** The part the bubble points at, while it shows. */
  private at: string | null = null;
  /** The chapter's and the step's own speaker map, keyed by the speaker in lower case. */
  speakers: Record<string, string | null> = {};

  constructor(private stage: HTMLElement, private scene: Scene) {
    this.bubble = document.createElement('div');
    this.bubble.className = 'j-bubble';
    this.bubble.setAttribute('aria-hidden', 'true');
    this.bubble.hidden = true;
    this.text = document.createElement('p');
    this.bubble.append(this.text);
    this.chip = document.createElement('p');
    this.chip.className = 'j-counter';
    this.chip.setAttribute('aria-hidden', 'true');
    this.chip.hidden = true;
    this.chipName = document.createElement('span');
    this.chipValue = document.createElement('b');
    this.chip.append(this.chipName, ' ', this.chipValue);
    stage.append(this.chip, this.bubble);
  }

  /** The part a speaker stands for, or null when they have none on the picture now. */
  where(who: string): string | null {
    const s = this.scene.state;
    const name = norm(who);
    if (name in this.speakers) return this.speakers[name] ?? null;
    const byLabel = this.scene.labelFor(name);
    if (byLabel) return byLabel;
    for (const [re, find] of SPEAKERS) if (re.test(name)) return find(s);
    return null;
  }

  /** A line someone said. True when it is on the picture. */
  say(who: string, text: string): boolean {
    const at = this.where(who);
    if (!at || !this.scene.partBox(at)) return false;
    this.at = at;
    this.text.textContent = text;
    const fresh = this.bubble.hidden;
    this.bubble.hidden = false;
    this.place(fresh);
    // A new line pops in; the bubble that moves to another speaker glides there.
    this.bubble.removeAttribute('data-new');
    void this.bubble.offsetWidth;
    this.bubble.setAttribute('data-new', '');
    return true;
  }

  clear() {
    this.at = null;
    this.bubble.hidden = true;
    this.text.textContent = '';
  }

  /** The scene was drawn again: keep the bubble at its speaker, or drop it when they left. */
  follow() {
    if (!this.at || this.bubble.hidden) return;
    if (!this.scene.partBox(this.at)) { this.clear(); return; }
    this.place(false);
  }

  /** The chip: one number from the readout. */
  counter(pairs: StatPair[], pin: CounterPin | undefined, ctx: Ctx, restarted: boolean) {
    let name = '', value = '';
    if (typeof pin === 'function') {
      value = pin(pairs, ctx) ?? '';
    } else {
      const want = pin ? norm(pin) : null;
      const pair = want ? pairs.find(([n]) => norm(n) === want) ?? pairs.find(([n]) => norm(n).startsWith(want)) : pairs[0];
      if (pair) {
        // The name up to its first comma: "turns, this run" is "turns" on the chip.
        name = pair[0].split(',')[0]!.trim();
        value = String(pair[1]);
      }
    }
    if (!value) { this.chip.hidden = true; this.chipName.textContent = this.chipValue.textContent = ''; return; }
    this.chipName.textContent = name;
    this.chipName.hidden = !name;
    this.chipValue.textContent = value;
    this.chip.hidden = false;
    if (restarted) { this.chip.removeAttribute('data-reset'); void this.chip.offsetWidth; this.chip.setAttribute('data-reset', ''); }
  }

  /** The chip's box, so labels and the bubble keep clear of it. */
  chipBox(): Box | null {
    if (this.chip.hidden) return null;
    return { l: this.chip.offsetLeft, t: this.chip.offsetTop, w: this.chip.offsetWidth, h: this.chip.offsetHeight };
  }

  /** Try each side of the speaker, sliding along that side to clear obstacles. */
  private place(instant: boolean) {
    const part = this.at ? this.scene.partBox(this.at) : null;
    if (!part) return;
    const W = this.stage.clientWidth, H = this.stage.clientHeight;
    const b = this.bubble;
    const pad = 6, gap = 8;
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
    const measure = (maxWidth = '') => {
      b.style.maxWidth = maxWidth;
      const { width: w, height: h } = b.getBoundingClientRect();
      return { w, h, maxWidth };
    };
    const full = measure();
    const keep = this.scene.reserved();
    const labels = this.scene.labelBoxes();
    const s = this.scene.state;
    const own = this.at!.replace(/^tool:.*/, 'tools').replace(/^tank:/, '').replace(/^card:.*/, 'tray');
    const parts = ['you', 'tools', 'project', 'tray', ...s.agents.map((a) => a.id), ...(s.gates ?? []).map((g) => g.id)]
      .filter((id) => id !== own && id !== this.at)
      .map((id) => this.scene.partBox(id)).filter((x): x is NonNullable<typeof x> => !!x);
    const obstacles = [...keep, ...labels, ...parts];
    const overlap = (a: Box, b: Box) =>
      Math.max(0, Math.min(a.l + a.w, b.l + b.w) - Math.max(a.l, b.l)) *
      Math.max(0, Math.min(a.t + a.h, b.t + b.h) - Math.max(a.t, b.t));
    const { l, t, w, h, ax, ay } = part;
    const sides = [
      { side: 'above', vertical: true, before: true, room: t },
      { side: 'right', vertical: false, before: false, room: W - l - w },
      { side: 'left', vertical: false, before: true, room: l },
      { side: 'below', vertical: true, before: false, room: H - t - h },
    ] as const;
    const spots = sides.flatMap(({ side, vertical, before, room }, order) => {
      const space = room - gap - pad;
      if (space <= 0) return [];
      const size = vertical || space >= full.w ? full : measure(`${Math.floor(space)}px`);
      const depth = vertical ? size.h : size.w;
      if (depth > space || (size !== full && this.text.scrollHeight > this.text.clientHeight + 1)) return [];

      const fixed = before ? room - gap - depth : (vertical ? H : W) - room + gap;
      const span = vertical ? size.w : size.h;
      const limit = (vertical ? W : H) - pad - span;
      const anchor = vertical ? ax : ay;
      const centred = clamp(anchor - span / 2, pad, limit);
      const positions = [centred];
      // Try just past either end of an obstacle in this strip, with the pointer over the speaker.
      for (const box of obstacles) {
        const cross = vertical ? box.t : box.l, thickness = vertical ? box.h : box.w;
        if (cross + thickness <= fixed || cross >= fixed + depth) continue;
        const near = vertical ? box.l : box.t, length = vertical ? box.w : box.h;
        for (const edge of [near - span - 2, near + length + 2]) {
          const pos = clamp(edge, pad, limit);
          if (pos <= anchor && anchor <= pos + span) positions.push(pos);
        }
      }
      return positions.map((pos) => {
        const box = { ...size, side, l: vertical ? pos : fixed, t: vertical ? fixed : pos };
        const score = keep.reduce((n, k) => n + overlap(box, k), 0) * 1000
          + labels.reduce((n, k) => n + overlap(box, k), 0) * 2
          + parts.reduce((n, k) => n + overlap(box, k), 0)
          + (size === full ? 0 : sides.length) + order + Math.abs(pos - centred) / (vertical ? W : H);
        return { box, score };
      });
    });
    let pick = spots.sort((a, b) => a.score - b.score)[0]?.box;
    if (!pick) {
      // A crowded stage can have no room on any side. Keep the text inside the stage.
      const { side, vertical, before, room } = [...sides].sort((a, b) => b.room - a.room)[0]!;
      const fixed = before ? room - gap - (vertical ? full.h : full.w) : (vertical ? H : W) - room + gap;
      pick = { ...full, side,
        l: clamp(vertical ? ax - full.w / 2 : fixed, pad, W - pad - full.w),
        t: clamp(vertical ? fixed : ay - full.h / 2, pad, H - pad - full.h) };
    }
    b.style.maxWidth = pick.maxWidth;
    b.dataset.side = pick.side;
    // The pointer aims at the part's top along the side the bubble sits on.
    const along = pick.side === 'above' || pick.side === 'below'
      ? Math.max(14, Math.min(pick.w - 14, part.ax - pick.l))
      : Math.max(12, Math.min(pick.h - 12, part.ay - pick.t));
    b.style.setProperty('--along', `${Math.round(along)}px`);
    if (instant) b.setAttribute('data-instant', '');
    b.style.transform = `translate(${Math.round(pick.l)}px, ${Math.round(pick.t)}px)`;
    if (instant) requestAnimationFrame(() => requestAnimationFrame(() => b.removeAttribute('data-instant')));
  }
}
