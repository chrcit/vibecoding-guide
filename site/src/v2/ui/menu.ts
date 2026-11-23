/*
 * The guide menu: the site header's nav, the theme and the reading level, in one dropdown that
 * opens from the top of the sidebar (or, on a phone's thread screen, from the chat header). It
 * follows the menu pattern: the trigger has aria-expanded, arrow keys, Home and End move between
 * items, Escape and Tab close it, focus goes back to the trigger, and a click outside closes it.
 * It scales and fades in from the trigger that opened it (styles/v2.css), and leaves faster.
 */
import { getLevel, isLevel, onLevel, setLevel } from '../../lib/levels';

export function guideMenu(menu: HTMLElement, triggers: HTMLButtonElement[], reduced: MediaQueryList) {
  const items = () => [...menu.querySelectorAll<HTMLElement>('[role^="menuitem"]')];
  const theme = menu.querySelector<HTMLElement>('[data-menu-theme]')!;
  const levels = [...menu.querySelectorAll<HTMLElement>('[data-menu-level]')];
  const doc = document.documentElement;
  const systemDark = matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => (doc.dataset.theme ? doc.dataset.theme === 'dark' : systemDark.matches);
  let opener: HTMLButtonElement | null = null;
  let closing = 0;

  const syncTheme = () => theme.setAttribute('aria-checked', String(isDark()));
  const syncLevel = (lv = getLevel()) => { for (const b of levels) b.setAttribute('aria-checked', String(b.dataset.menuLevel === lv)); };
  syncTheme(); syncLevel();
  systemDark.addEventListener('change', syncTheme);
  onLevel((lv) => syncLevel(lv));

  /** Under the trigger, kept inside the viewport; it grows from the trigger's side. */
  function place(btn: HTMLButtonElement) {
    const r = btn.getBoundingClientRect();
    const gutter = 8;
    menu.style.maxHeight = `${Math.max(160, innerHeight - r.bottom - gutter * 2)}px`;
    const w = menu.offsetWidth;
    const start = btn.dataset.align !== 'end';
    let left = start ? r.left : r.right - w;
    left = Math.max(gutter, Math.min(left, innerWidth - w - gutter));
    menu.style.left = `${Math.round(left)}px`;
    menu.style.top = `${Math.round(r.bottom + 6)}px`;
    const originX = Math.max(0, Math.min(w, (start ? r.left + 16 : r.right - 16) - left));
    menu.style.transformOrigin = `${Math.round(originX)}px top`;
  }

  function open(btn: HTMLButtonElement) {
    clearTimeout(closing);
    opener = btn;
    syncTheme(); syncLevel();
    menu.removeAttribute('data-closing');
    menu.hidden = false;
    place(btn);
    for (const t of triggers) t.setAttribute('aria-expanded', String(t === btn));
    if (!reduced.matches) { menu.removeAttribute('data-open'); void menu.offsetWidth; }
    menu.setAttribute('data-open', '');
    const current = items().find((i) => i.getAttribute('aria-current') === 'page') ?? items()[0];
    current?.focus({ preventScroll: true });
  }

  function close(focus: boolean) {
    if (menu.hidden || !opener) return;
    const btn = opener;
    opener = null;
    for (const t of triggers) t.setAttribute('aria-expanded', 'false');
    menu.removeAttribute('data-open');
    if (reduced.matches) menu.hidden = true;
    else { menu.setAttribute('data-closing', ''); closing = window.setTimeout(() => { menu.hidden = true; menu.removeAttribute('data-closing'); }, 120); }
    if (focus) btn.focus({ preventScroll: true });
  }

  for (const t of triggers) {
    t.addEventListener('click', () => (opener === t ? close(false) : open(t)));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(t); if (e.key === 'ArrowUp') items().at(-1)?.focus(); }
    });
  }

  menu.addEventListener('keydown', (e) => {
    const list = items();
    const i = list.indexOf(document.activeElement as HTMLElement);
    const go = (n: number) => { e.preventDefault(); list[(n + list.length) % list.length]?.focus(); };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(list.length - 1);
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); }
    else if (e.key === 'Tab') close(false);
    else if (e.key === ' ' && document.activeElement instanceof HTMLAnchorElement) { e.preventDefault(); document.activeElement.click(); }
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      // Type-ahead: the next item that starts with the letter.
      const k = e.key.toLowerCase();
      const from = list.slice(i + 1).concat(list.slice(0, i + 1));
      from.find((el) => el.textContent!.trim().toLowerCase().startsWith(k))?.focus();
    }
  });

  menu.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[role^="menuitem"]');
    if (!t) return;
    if (t === theme) {
      const next = isDark() ? 'light' : 'dark';
      doc.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch { /* private window */ }
      syncTheme();
    } else if (t.dataset.menuLevel && isLevel(t.dataset.menuLevel)) {
      setLevel(t.dataset.menuLevel);
    }
    close(!(t instanceof HTMLAnchorElement));
  });

  document.addEventListener('pointerdown', (e) => {
    const t = e.target as Node;
    if (!menu.hidden && opener && !menu.contains(t) && !triggers.some((b) => b.contains(t))) close(false);
  });
  addEventListener('resize', () => { if (opener) place(opener); });
  // A trigger that disappears (the phone's list and thread screens swap) takes the menu with it.
  menu.addEventListener('focusout', (e) => {
    const to = e.relatedTarget as Node | null;
    if (to && !menu.contains(to) && !triggers.some((b) => b === to)) close(false);
  });

  return { close };
}
