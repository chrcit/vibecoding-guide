/*
 * A page drawn as a schematic phone screen: a few bars and blocks in the page's colours. Sized in
 * em, so one drawing serves the list (tiny) and the detail sheet (larger). Each layout marks one
 * block with data-t: the element a fix touched, styled by pagecheck.css for "before" and "after".
 */
import type { FixKind, Layout } from './pages';

const k = (cls: string, t = false) => `<i class="pc-k pc-k-${cls}"${t ? ' data-t' : ''}></i>`;
const rows = (n: number, target = -1, tag = false) =>
  Array.from({ length: n }, (_, i) => `<span class="pc-k-row"${i === target ? ' data-t' : ''}>${k('dot')}${k('ln')}${tag ? k('tag') : ''}</span>`).join('');

const BODY: Record<Layout, (fx?: FixKind) => string> = {
  list: (fx) => k('head') + k('search') + rows(5, fx ? 0 : -1, fx === 'tag' || !fx),
  form: (fx) =>
    k('head') + k('title') +
    `<span class="pc-k-field"${fx === 'label' ? ' data-t' : ''}>${k('lab')}${k('box')}</span>` +
    `<span class="pc-k-field">${k('lab')}${k('box')}</span>` +
    (fx === 'overlap' ? `<span class="pc-k-total" data-t>${k('ln')}${k('num')}</span>${k('pad')}` : `<span class="pc-k-field">${k('lab')}${k('box')}</span>`) +
    k('btn', fx === 'focus' || fx === 'contrast'),
  scan: () => k('head') + `<span class="pc-k-view"><i></i></span>` + k('btn'),
  dash: (fx) => k('head') + k('big') + `<span class="pc-k-chart"${fx ? ' data-t' : ''}>${[5, 8, 6, 11, 9, 13, 10].map((h) => `<i style="height:${h * 7}%"></i>`).join('')}</span>` + rows(2),
  ticket: (fx) => `<span class="pc-k-hero"></span>` + k('title') + k('ln') + k('ln pc-k-short') + `<span class="pc-k-buy">${k('num')}${k('btn', !!fx)}</span>`,
  profile: () => `<span class="pc-k-me">${k('av')}${k('title')}</span>` + `<span class="pc-k-card">${k('ln')}${k('ln pc-k-short')}</span>`.repeat(3),
  grid: () => k('head') + `<span class="pc-k-grid">${Array.from({ length: 20 }, (_, i) => `<i${[1, 4, 6, 9, 11, 15, 18].includes(i) ? ' data-on' : ''}></i>`).join('')}</span>`,
  empty: () => `<span class="pc-k-empty">${k('big')}${k('ln')}${k('btn')}</span>`,
  invite: (fx) => k('head') + k('title') + `<span class="pc-k-qr"${fx ? ' data-t' : ''}><i></i></span>` + k('ln') + k('ln pc-k-short'),
};

export interface ThumbOpts {
  theme: 'light' | 'dark';
  fx?: FixKind;
  /** Which side of the change to draw. */
  side?: 'before' | 'after';
  cls?: string;
}

export function thumb(layout: Layout, o: ThumbOpts): string {
  const fx = o.fx ? ` pc-fx-${o.fx} pc-fx--${o.side ?? 'after'}` : '';
  return `<span class="pc-thumb pc-thumb--${o.theme} pc-lay-${layout}${fx}${o.cls ? ` ${o.cls}` : ''}" aria-hidden="true"><span class="pc-thumb-in">${BODY[layout](o.fx)}</span></span>`;
}
