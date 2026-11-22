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

  /**
   * Put the bubble beside its part, never over it: above it, to its right or left at the height of
   * its top (a station's cap, a pawn's head; narrower if that is what fits), or below it. Of those
   * inside the stage, the one clear of the chip and the step buttons that covers least of the other
   * parts wins. When none fits, the side with most room, pulled inside the stage.
   */
  private place(instant: boolean) {
    const part = this.at ? this.scene.partBox(this.at) : null;
    if (!part) return;
    const W = this.stage.clientWidth, H = this.stage.clientHeight;
    const b = this.bubble;
    const pad = 6, gap = 10, narrowest = 170;
    b.style.maxWidth = '';
    const full = b.offsetWidth;
    const keep = this.scene.reserved();
    const cx = part.l + part.w / 2;
    const sizeAt = (maxW: number) => { b.style.maxWidth = `${Math.round(maxW)}px`; return { w: b.offsetWidth, h: b.offsetHeight }; };
    type Spot = { side: string; l: number; t: number; w: number; h: number };
    const make = (side: string): Spot | null => {
      if (side === 'above' || side === 'below') {
        const { w, h } = sizeAt(full);
        const l = Math.max(pad, Math.min(W - pad - w, cx - w / 2));
        return { side, l, t: side === 'above' ? part.t - gap - h : part.t + part.h + gap, w, h };
      }
      const room = (side === 'right' ? W - (part.l + part.w) : part.l) - gap - pad;
      if (room < narrowest) return null;
      const { w, h } = sizeAt(Math.min(full, room));
      const t = Math.max(pad, Math.min(H - pad - h, part.ay - h / 2));
      return { side, l: side === 'right' ? part.l + part.w + gap : part.l - gap - w, t, w, h };
    };
    const inside = (c: Spot) => c.l >= pad - 0.5 && c.t >= pad - 0.5 && c.l + c.w <= W - pad + 0.5 && c.t + c.h <= H - pad + 0.5;
    const overlap = (c: Spot, k: Box) => Math.max(0, Math.min(c.l + c.w, k.l + k.w) - Math.max(c.l, k.l)) * Math.max(0, Math.min(c.t + c.h, k.t + k.h) - Math.max(c.t, k.t));
    // The other main parts on the picture: better not covered either, but they may be when the
    // picture is full.
    const s = this.scene.state;
    const own = this.at!.replace(/^(tool|tank):.*/, (m) => (m.startsWith('tool') ? 'tools' : m.slice(5)));
    const others = ['you', 'tools', 'project', ...s.agents.map((a) => a.id), ...(s.gates ?? []).map((g) => g.id)]
      .filter((id) => id !== own && id !== this.at)
      .map((id) => this.scene.partBox(id)).filter((x): x is NonNullable<typeof x> => !!x);
    // Inside the stage first; then clear of the chip and the buttons; then covering the least; then
    // the order above, right, left, below.
    const cost = (c: Spot, i: number) => (keep.some((k) => overlap(c, k) > 0) ? 1e7 : 0) + others.reduce((n, k) => n + overlap(c, k), 0) + i;
    const spots = ['above', 'right', 'left', 'below'].map(make).filter((c): c is Spot => !!c);
    let pick = spots.map((c, i) => ({ c, n: cost(c, i) })).filter((x) => inside(x.c)).sort((a, b) => a.n - b.n)[0]?.c;
    if (!pick) {
      const room = (side: string) => side === 'above' ? part.t : side === 'below' ? H - part.t - part.h : side === 'right' ? W - part.l - part.w : part.l;
      const side = ['above', 'below', 'right', 'left'].sort((x, y) => room(y) - room(x))[0]!;
      const { w, h } = sizeAt(full);
      const l = side === 'right' ? part.l + part.w + gap : side === 'left' ? part.l - gap - w : cx - w / 2;
      const t = side === 'above' ? part.t - gap - h : side === 'below' ? part.t + part.h + gap : part.ay - h / 2;
      pick = { side, w, h, l: Math.max(pad, Math.min(W - pad - w, l)), t: Math.max(pad, Math.min(H - pad - h, t)) };
    }
    sizeAt(pick.w === full ? full : pick.w);
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
