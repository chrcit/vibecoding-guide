/*
 * Tonight's post for the club's account, as the agent wrote it in lesson 4, part 4: the file it
 * made, shown the way it would read on a phone, with the checks from the request under it. The
 * acts are made up, and none of their names is on tonight's lists (door/guests.ts, lantern/store.ts).
 * Stages: 'none' and 'ready'.
 */
import './lantern/lantern.css';
import type { MountApp } from './index';
import { esc, ICON, brand, notFound } from './lantern/ui';

export const url = 'localhost:4321/posts/tonight';

const TEXT = `Friday at the Lantern.
Halcyon Drift play live at midnight, then Oona Sol b2b Pell take it to close. Tomas Reyes warms up from 23:00.
Doors open at 23:00. The guest list closes at 00:30, so get your name to your promoter early. After that it’s the door, cash or card.
Bring ID, look after each other. See you there tonight.`;
const WORDS = TEXT.split(/\s+/).filter(Boolean).length;

export const app: MountApp = (el, initial) => {
  let stage = initial;
  let copied = false;
  const root = document.createElement('div');
  root.className = 'ln';
  el.append(root);

  function paint() {
    if (stage === 'none') return notFound(root, '/posts/tonight');
    root.className = 'ln';
    root.innerHTML = `
      <header class="ln-head">${brand('Tonight’s post', 'posts/tonight.md · draft')}<button type="button" class="br-copy ln-press" data-copy>${copied ? 'Copied' : 'Copy text'}</button></header>
      <div class="ln-body"><div class="ln-col">
        <article class="ps-card">
          <div class="ps-art" aria-hidden="true"><small>The Lantern · Friday</small><b>Halcyon Drift live</b></div>
          <p class="ps-text">${esc(TEXT)}</p>
          <div class="ps-meta"><span>${ICON.check}${WORDS} words</span><span>${ICON.check}Fits one phone screen</span><span>${ICON.check}No names from tonight’s lists</span></div>
        </article>
      </div></div>`;
  }
  root.addEventListener('click', async (e) => {
    if (!(e.target as HTMLElement).closest('[data-copy]')) return;
    try { await navigator.clipboard.writeText(TEXT); copied = true; } catch { copied = false; }
    paint();
  });
  paint();
  return {
    set(next: string) { if (next !== stage) { stage = next; paint(); } },
    destroy() { root.remove(); },
  };
};
