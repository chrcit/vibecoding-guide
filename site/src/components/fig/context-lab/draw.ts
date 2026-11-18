// Fig. 3 drawing: two bars at one scale, the window as it is now and what a compaction throws away.
// layout() is pure geometry from a Lab and a pixel width; render() turns it into SVG once, and the
// page script moves the same parts with transforms when the controls change, so the window fills
// visibly. Text is drawn at the real pixel size (the script redraws at the measured width), so no
// label falls under 13px at any width.
import { PARTS, PART_NAME, k, sum, type Lab, type Part } from './model';

export const LABEL_H = 19;
const FONT = 14;
/** A part with any tokens in it is drawn at least this tall, so it can be seen. */
const MIN_PX = 2;

export interface Seg { part: Part; x: number; y: number; w: number; h: number; on: boolean }
export interface Lbl { part: Part; x: number; y: number; segY: number; colRight: number; name: string; value: string; on: boolean }
export interface Pane { id: 'now' | 'lost'; x: number; top: number; h: number; w: number; head: string; segs: Seg[]; labels: Lbl[] }
export interface Layout { W: number; H: number; narrow: boolean; panes: [Pane, Pane]; compactY: number; compactText: string }

/** Where an explanation lives, for the parts that have one. */
export type SideMap = Partial<Record<Part | 'compact', string>>;

function placeLabels(items: { part: Part; segY: number }[], top: number, bottom: number) {
  const sorted = [...items].sort((a, b) => a.segY - b.segY);
  const ys = sorted.map((i) => i.segY);
  for (let i = 0; i < ys.length; i++) ys[i] = Math.max(ys[i]!, i ? ys[i - 1]! + LABEL_H : top + LABEL_H / 2);
  for (let i = ys.length - 1; i >= 0; i--) ys[i] = Math.min(ys[i]!, i < ys.length - 1 ? ys[i + 1]! - LABEL_H : bottom - LABEL_H / 2);
  return new Map(sorted.map((s, i) => [s.part, ys[i]!]));
}

function pane(id: Pane['id'], amounts: Record<Part, number>, lab: Lab, x: number, top: number, h: number, w: number, head: string, dim: boolean): Pane {
  const win = lab.m.window;
  const bottom = top + h;
  const pxOf = (t: number) => (t > 0 ? Math.max(MIN_PX, (t / win) * h) : 0);
  let y = bottom;
  const segs: Seg[] = PARTS.map((part) => {
    const ph = pxOf(amounts[part]);
    // A bar that overflows its frame is cut at the top; the label still carries the number.
    const y1 = Math.max(top, y - ph);
    const s = { part, x, y: y1, w, h: Math.max(0, y - y1), on: amounts[part] > 0 };
    y = y - ph;
    return s;
  });
  const visible = segs.filter((s) => s.on);
  const pos = placeLabels(visible.map((s) => ({ part: s.part, segY: s.h > 0 ? s.y + s.h / 2 : top })), top, bottom);
  const labels: Lbl[] = segs.map((s) => ({
    part: s.part,
    x: x + w + 26,
    y: pos.get(s.part) ?? bottom,
    segY: s.h > 0 ? s.y + s.h / 2 : top,
    colRight: x + w,
    name: id === 'lost' && dim && s.part === 'summary' ? 'Old summary' : PART_NAME[s.part],
    value: k(amounts[s.part]),
    on: s.on,
  }));
  return { id, x, top, h, w, head, segs, labels };
}

export function layout(lab: Lab, W: number): Layout {
  const narrow = W < 620;
  const w = Math.round(Math.min(150, Math.max(84, W * (narrow ? 0.28 : 0.15))));
  const labW = 190;
  const headH = 30;
  let a: Pane, b: Pane, H: number;
  const lostHead = lab.compacted ? `Fell out at the last compaction · ${k(sum(lab.lost))}` : `Goes if it compacts now · ${k(sum(lab.lost))}`;
  const nowHead = `In the window · ${k(lab.total)} of ${k(lab.m.window)}`;
  if (narrow) {
    const h = 300;
    a = pane('now', lab.now, lab, 8, headH, h, w, nowHead, false);
    b = pane('lost', lab.lost, lab, 8, headH * 2 + h + 22, h, w, lostHead, true);
    H = headH * 2 + h * 2 + 30;
  } else {
    const h = 380;
    const xb = Math.max(W / 2 + 10, W - (w + 26 + labW));
    a = pane('now', lab.now, lab, 8, headH, h, w, nowHead, false);
    b = pane('lost', lab.lost, lab, Math.round(xb), headH, h, w, lostHead, true);
    H = headH + h + 6;
  }
  const compactY = a.top + a.h * (1 - lab.m.compactAt / lab.m.window);
  return { W, H, narrow, panes: [a, b], compactY, compactText: `Compacts at ${k(lab.m.compactAt)}` };
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const f1 = (n: number) => n.toFixed(1);
export const segTransform = (s: Seg) => `translate(${f1(s.x)}px, ${f1(s.y)}px) scale(${f1(s.w)}, ${f1(Math.max(s.h, 0.001))})`;
export const leader = (l: Lbl) => `M${f1(l.colRight + 3)} ${f1(l.segY)}H${f1(l.colRight + 10)}L${f1(l.x - 6)} ${f1(l.y)}`;

export function render(L: Layout, side: SideMap): string {
  const out: string[] = [];
  for (const p of L.panes) {
    const dash = p.id === 'lost' ? ' stroke-dasharray="5 4"' : '';
    out.push(`<g data-pane="${p.id}">`);
    out.push(`<text class="lab-head" x="${p.x}" y="${p.top - 11}" data-head>${esc(p.head)}</text>`);
    out.push(`<rect class="lab-frame" x="${f1(p.x - 0.5)}" y="${f1(p.top - 0.5)}" width="${f1(p.w + 1)}" height="${f1(p.h + 1)}" rx="3"${dash}/>`);
    for (const s of p.segs)
      out.push(`<rect class="lab-seg" data-part="${s.part}" data-seg="${p.id}:${s.part}" x="0" y="0" width="1" height="1" style="transform:${segTransform(s)}"/>`);
    for (const l of p.labels) {
      const href = side[l.part];
      const attrs = href ? ` data-side="${href}" tabindex="0" role="button" aria-label="${esc(l.name)}: what it is"` : '';
      out.push(
        `<g class="lab-label" data-lbl="${p.id}:${l.part}"${l.on ? '' : ' style="display:none"'}${attrs}>` +
          `<path class="lab-leader" d="${leader(l)}"/>` +
          `<text x="${f1(l.x)}" y="${f1(l.y + FONT * 0.36)}"><tspan class="lab-name">${esc(l.name)}</tspan> <tspan class="lab-num" data-num>${l.value}</tspan></text>` +
          `</g>`,
      );
    }
    out.push('</g>');
  }
  const a = L.panes[0];
  const cAttrs = side.compact ? ` data-side="${side.compact}" tabindex="0" role="button" aria-label="Compaction: what it is"` : '';
  out.push(
    `<g class="lab-compact" data-compact${cAttrs}>` +
      `<path class="lab-cline" d="M${f1(a.x - 4)} ${f1(L.compactY)}H${f1(a.x + a.w + 4)}" stroke-dasharray="6 4"/>` +
      `<text class="lab-ctext" x="${f1(a.x + 5)}" y="${f1(L.compactY + 17)}">${esc(L.compactText)}</text>` +
      `</g>`,
  );
  return `<svg class="lab-svg" viewBox="0 0 ${L.W} ${L.H}" width="${L.W}" height="${L.H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="false">${out.join('')}</svg>`;
}
