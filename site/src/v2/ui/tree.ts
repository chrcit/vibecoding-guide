/*
 * The sidebar's folders and its search, as T3 Code's sidebar does them with project folders on.
 * A folder's header opens and closes it; a closed folder shows how many lessons it hides and still
 * shows the lesson on show. Typing in Search keeps the lessons whose titles match, in any folder,
 * open or closed; Escape clears it.
 */

export interface Tree {
  /** Show and hide rows for the folders' state, the search and the lesson on show. */
  refresh(): void;
}

export function sidebarTree(root: HTMLElement): Tree {
  const input = root.querySelector<HTMLInputElement>('[data-side-search]')!;
  const clear = root.querySelector<HTMLButtonElement>('[data-search-clear]')!;
  const empty = root.querySelector<HTMLElement>('[data-search-empty]')!;
  const folders = [...root.querySelectorAll<HTMLElement>('.v2-folder')];

  function refresh() {
    const q = input.value.trim().toLowerCase();
    let any = false;
    for (const f of folders) {
      const head = f.querySelector<HTMLElement>('[data-folder-toggle]')!;
      const closed = head.getAttribute('aria-expanded') === 'false';
      let shown = 0, hiddenByClose = 0;
      for (const li of f.querySelectorAll<HTMLElement>('[data-row-item]')) {
        const title = li.querySelector('.v2-row-title')!.textContent!.toLowerCase();
        const current = !!li.querySelector('.v2-row[aria-current]');
        const match = !q || title.includes(q);
        const show = q ? match : !closed || current;
        li.hidden = !show;
        if (show) shown++;
        else if (!q && closed) hiddenByClose++;
      }
      f.toggleAttribute('data-unmatched', !!q && shown === 0);
      const count = f.querySelector<HTMLElement>('[data-folder-count]')!;
      count.hidden = q !== '' || !closed || hiddenByClose === 0;
      count.firstElementChild!.nextSibling!.textContent = String(hiddenByClose);
      if (!f.hasAttribute('data-scoped-out') && shown > 0) any = true;
    }
    empty.hidden = !q || any;
    clear.hidden = !q;
  }

  root.addEventListener('click', (e) => {
    const head = (e.target as HTMLElement).closest<HTMLElement>('[data-folder-toggle]');
    if (!head) return;
    head.setAttribute('aria-expanded', String(head.getAttribute('aria-expanded') === 'false'));
    refresh();
  });
  input.addEventListener('input', refresh);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && input.value) { e.stopPropagation(); input.value = ''; refresh(); }
    if (e.key === 'Enter') root.querySelector<HTMLElement>('[data-row-item]:not([hidden]) .v2-row')?.click();
  });
  clear.addEventListener('click', () => { input.value = ''; refresh(); input.focus(); });

  refresh();
  return { refresh };
}
