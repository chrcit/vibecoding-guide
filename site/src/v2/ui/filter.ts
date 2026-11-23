/*
 * The sidebar's project filter, as T3 Code's "Filter threads by project": "Search projects...",
 * "All projects", and Shift-click to pick several. Here a project is a chapter, so picking one
 * shows that chapter's lessons. With projects picked, the button shows their favicons.
 */
import { TOC } from '../content';

export function projectFilter(root: HTMLElement) {
  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const btn = $<HTMLButtonElement>('[data-filter-btn]'), pop = $('[data-filter-pop]'), q = $<HTMLInputElement>('[data-filter-q]');
  const options = () => [...pop.querySelectorAll<HTMLElement>('[data-scope]')];
  const visible = () => options().filter((b) => !b.parentElement!.hidden);
  let scope = new Set<string>();

  function setPop(open: boolean) {
    pop.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (open) { q.value = ''; filterOptions(''); q.focus(); }
  }
  function filterOptions(text: string) {
    const t = text.trim().toLowerCase();
    for (const b of options()) b.parentElement!.hidden = b.dataset.scope === 'all' ? !!t : !b.textContent!.toLowerCase().includes(t);
    $('[data-filter-empty]').hidden = visible().length > 0;
  }
  function apply() {
    // A folder outside the scope leaves the list (styles/v2.css); the search keeps its own mark.
    for (const f of root.querySelectorAll<HTMLElement>('[data-project]')) f.toggleAttribute('data-scoped-out', scope.size > 0 && !scope.has(f.dataset.project!));
    for (const b of options()) b.setAttribute('aria-selected', String(b.dataset.scope === 'all' ? scope.size === 0 : scope.has(b.dataset.scope!)));
    const icon = $('[data-filter-icon]');
    if (!icon.dataset.svg) icon.dataset.svg = icon.innerHTML;
    if (scope.size === 0) icon.innerHTML = icon.dataset.svg;
    else icon.replaceChildren(...[...scope].slice(0, 2).map((id) => {
      const s = document.createElement('span');
      const c = TOC.find((x) => x.id === id)!;
      s.className = 'v2-fav';
      s.textContent = c.n ? String(c.n) : 'S';
      return s;
    }));
    const names = [...scope].map((id) => TOC.find((x) => x.id === id)!.title);
    btn.setAttribute('aria-label', names.length ? `${btn.title}: ${names.join(', ')}` : btn.title);
  }

  btn.addEventListener('click', () => setPop(pop.hidden));
  q.addEventListener('input', () => filterOptions(q.value));
  q.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') visible()[0]?.click();
    if (e.key === 'ArrowDown') { e.preventDefault(); visible()[0]?.focus(); }
  });
  pop.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { setPop(false); btn.focus(); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const opts = visible();
      const i = opts.indexOf(document.activeElement as HTMLElement);
      if (i < 0) return;
      e.preventDefault();
      opts[(i + (e.key === 'ArrowDown' ? 1 : opts.length - 1)) % opts.length]!.focus();
    }
  });
  pop.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-scope]');
    if (!b) return;
    const id = b.dataset.scope!;
    if (id === 'all') scope = new Set();
    else if (e.shiftKey) { if (scope.has(id)) scope.delete(id); else scope.add(id); }
    else scope = new Set([id]);
    apply();
    if (!e.shiftKey) { setPop(false); btn.focus(); }
  });
  document.addEventListener('pointerdown', (e) => { if (!pop.hidden && !(e.target as HTMLElement).closest('.v2-filter')) setPop(false); });
}
