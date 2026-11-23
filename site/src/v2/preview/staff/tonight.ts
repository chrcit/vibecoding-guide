/*
 * Tonight: the guest list for the door and the floor. Search sits at the bottom, by the thumb; a
 * tap checks a guest in (with the plus-ones they're listed with) and a second tap only says when
 * they arrived. From 'tables' on, guests with a booking show their table; at 'tables-missing' the
 * lesson marks where Ana Lopez's "Table 4" should be.
 */
import { ANA, CAPACITY, LIST_LABEL, TONIGHT, type TonightGuest } from './data';
import { arrivals, headCount, hhmm, now } from './state';
import { esc, highlight, ICON, initials, match, nudge, plural, tokensOf } from './ui';
import { marker, type Ctx, type Screen } from './ctx';

const byId = new Map(TONIGHT.map((g) => [g.id, g]));

function row(c: Ctx, g: TonightGuest, marks: number[] | null) {
  const a = arrivals.get(g.id);
  const list = LIST_LABEL[g.list];
  const table = c.f.tables && g.table
    ? `<span class="st-table">${ICON.table}Table ${g.table}</span>`
    : c.f.tablesMarker && g.id === ANA
      ? `<span class="st-table st-table--missing st-marker">${marker('Table 4 should be here')}</span>`
      : '';
  const label = a
    ? `${g.name}, ${list}, in since ${hhmm(a.at)}${c.f.tables && g.table ? `, table ${g.table}` : ''}`
    : `Check in ${g.name}, ${list}${g.plus ? `, with ${plural(g.plus, 'plus-one')}` : ''}${c.f.tables && g.table ? `, table ${g.table}` : ''}`;
  return `<li><button type="button" class="st-guest st-l-${g.list}" data-guest="${g.id}" data-in="${a ? 'yes' : 'no'}" aria-label="${esc(label)}">
    <span class="st-av" aria-hidden="true">${initials(g.name)}</span>
    <span class="st-guest-who" aria-hidden="true">
      <span class="st-guest-name">${highlight(g.name, marks)}</span>
      <span class="st-guest-meta"><i class="st-dot"></i>${esc(list)}${g.plus ? `<span class="st-plus">+${g.plus}</span>` : ''}${table}</span>
    </span>
    <span class="st-guest-status" aria-hidden="true">${a
      ? `<span class="st-in">${ICON.check}${hhmm(a.at)}</span>`
      : '<span class="st-go">Check in</span>'}</span>
  </button></li>`;
}

export const tonight: Screen = {
  title: 'Tonight',
  html(c) {
    const tokens = tokensOf(c.ui.query);
    const hits = TONIGHT.map((g) => ({ g, marks: tokens.length ? match(g.name, tokens) : null })).filter((h) => !tokens.length || h.marks);
    const listedIn = TONIGHT.filter((g) => arrivals.has(g.id)).length;
    const tables = TONIGHT.filter((g) => g.table).length;
    const n = headCount();
    const stats = `<section class="st-stats" aria-label="Tonight so far">
      <div class="st-stat"><span class="st-stat-n">${n}<small>/${CAPACITY}</small></span><span class="st-stat-l">in the club</span><span class="st-meter" aria-hidden="true"><i style="transform:scaleX(${Math.min(1, n / CAPACITY).toFixed(3)})"></i></span></div>
      <div class="st-stat"><span class="st-stat-n">${listedIn}<small>/${TONIGHT.length}</small></span><span class="st-stat-l">listed, in</span></div>
      ${c.f.tables ? `<div class="st-stat"><span class="st-stat-n">${tables}</span><span class="st-stat-l">tables</span></div>` : ''}
    </section>`;
    const head = `<div class="st-h"><h2>${tokens.length ? 'Matches' : 'Tonight’s list'}</h2><span>${tokens.length ? `${hits.length} of ${TONIGHT.length}` : `${TONIGHT.length} names · A–Z`}</span></div>`;
    const body = hits.length
      ? `<ol class="st-guests" aria-label="${hits.length} on tonight’s list">${hits.map((h) => row(c, h.g, h.marks)).join('')}</ol>`
      : `<div class="st-none" role="status"><p class="st-none-title">Not on tonight’s list</p><p class="st-none-sub">No name starts with “${esc(c.ui.query.trim())}”. Check the spelling, or ask who invited them.</p></div>`;
    return `${tokens.length ? '' : stats}${head}${body}`;
  },
  foot(c) {
    return `<form class="st-search" role="search" data-search>
      <label class="st-field">${ICON.search}<span class="st-vh">Search tonight’s list</span>
        <input data-q type="search" enterkeyhint="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Search a name" value="${esc(c.ui.query)}">
        <button type="button" class="st-clear" data-clear aria-label="Clear search"${c.ui.query ? '' : ' data-hidden'}>${ICON.clear}</button>
      </label>
    </form>`;
  },
  input(c, t) {
    if (!t.matches('[data-q]')) return;
    c.ui.query = t.value;
    c.root.querySelector('[data-clear]')?.toggleAttribute('data-hidden', !t.value);
    c.paint({ foot: false });
  },
  submit(c) {
    const tokens = tokensOf(c.ui.query);
    const hits = TONIGHT.filter((g) => tokens.length && match(g.name, tokens));
    if (hits.length === 1) tap(c, hits[0]!.id);
  },
  click(c, t) {
    if (t.closest('[data-clear]')) {
      c.ui.query = '';
      const input = c.root.querySelector<HTMLInputElement>('[data-q]');
      if (input) { input.value = ''; input.focus({ preventScroll: true }); }
      t.closest('[data-clear]')!.toggleAttribute('data-hidden', true);
      c.paint({ foot: false });
      return true;
    }
    const b = t.closest<HTMLElement>('[data-guest]');
    if (b) { tap(c, b.dataset.guest!); return true; }
  },
};

function tap(c: Ctx, id: string) {
  const g = byId.get(id);
  if (!g) return;
  const was = arrivals.get(id);
  if (was) {
    c.toast({ kind: 'note', text: `Already in · ${hhmm(was.at)}`, sub: `${g.name} wasn’t counted again`, ms: 3000 });
    c.announce(`${g.name} is already in, since ${hhmm(was.at)}. Not counted again.`);
    nudge(c.root.querySelector(`[data-guest="${id}"]`));
    return;
  }
  const a = { at: now(), plus: g.plus };
  arrivals.set(id, a);
  const hadQuery = !!c.ui.query;
  c.ui.query = '';
  c.paint({ foot: hadQuery });
  c.toast({
    kind: 'ok', text: `${g.name} is in`, sub: `${hhmm(a.at)}${g.plus ? ` · with ${plural(g.plus, 'plus-one')}` : ` · ${LIST_LABEL[g.list]}`}`, ms: 5000,
    action: { label: 'Undo', run: () => { arrivals.delete(id); c.paint(); c.toast({ text: 'Undone', sub: `${g.name} is not checked in`, ms: 2200 }); c.announce(`Undone. ${g.name} is not checked in.`); } },
  });
  c.announce(`${g.name} checked in at ${hhmm(a.at)}.`);
}
