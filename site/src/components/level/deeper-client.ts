// Runtime for deeper blocks, from <Deeper> and from `> [!technical]` markdown alike.
//
// CSS alone decides what is collapsed before this runs (levels.css). Once it
// runs, each collapsed body gets `hidden="until-found"`, so find-in-page and
// fragment links can still reach the text: the browser fires `beforematch`,
// reveals the body, and we mark the block open. Browsers without until-found
// get plain `hidden`; links still open blocks through the hash handling below.

import { covers, getLevel, isLevel, LEVEL_EVENT, type Level } from '../../lib/levels';

const UNTIL_FOUND = 'onbeforematch' in document.body;

function blockLevel(block: HTMLElement): Level {
  const value = block.dataset.deeper;
  return isLevel(value) ? value : 'technical';
}

function parts(block: HTMLElement) {
  return {
    body: block.querySelector<HTMLElement>(':scope > .deeper-body'),
    toggle: block.querySelector<HTMLButtonElement>(':scope > .deeper-toggle'),
  };
}

/** Bring one block's attributes in line with the level and its open state. */
function sync(block: HTMLElement, level: Level): void {
  const { body, toggle } = parts(block);
  if (!body) return;
  const below = !covers(level, blockLevel(block));
  if (!below) block.classList.remove('is-open');
  const collapsed = below && !block.classList.contains('is-open');
  if (collapsed) {
    if (UNTIL_FOUND) body.setAttribute('hidden', 'until-found');
    else body.hidden = true;
  } else {
    body.removeAttribute('hidden');
  }
  toggle?.setAttribute('aria-expanded', String(!collapsed));
  block.dataset.state = collapsed ? 'collapsed' : below ? 'opened' : 'level';
}

function syncAll(level: Level = getLevel()): void {
  document.querySelectorAll<HTMLElement>('.deeper').forEach((block) => sync(block, level));
}

function open(block: HTMLElement): void {
  if (block.dataset.state !== 'collapsed') return;
  block.classList.add('is-open');
  sync(block, getLevel());
}

function close(block: HTMLElement): void {
  block.classList.remove('is-open');
  sync(block, getLevel());
}

/** Open every collapsed block that contains `el` (or is `el`), outermost first. */
function reveal(el: Element): void {
  const chain: HTMLElement[] = [];
  for (let b = el.closest<HTMLElement>('.deeper'); b; b = b.parentElement?.closest<HTMLElement>('.deeper') ?? null) chain.unshift(b);
  chain.forEach(open);
}

function targetOf(hash: string): Element | null {
  if (!hash || hash === '#') return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

function revealHash(scroll: boolean): void {
  const target = targetOf(location.hash);
  if (!target || !target.closest('.deeper')) return;
  const before = target.closest('.deeper-body[hidden]');
  reveal(target);
  if (scroll && before) target.scrollIntoView({ block: 'start' });
}

// Clicks on the toggle buttons and on the faded extract.
document.addEventListener('click', (event) => {
  const el = event.target as Element | null;
  const toggle = el?.closest<HTMLButtonElement>('.deeper-toggle');
  if (toggle) {
    const block = toggle.parentElement as HTMLElement;
    block.dataset.state === 'collapsed' ? open(block) : close(block);
    return;
  }
  const extract = el?.closest('.deeper-extract');
  if (extract) {
    open(extract.parentElement as HTMLElement);
    return;
  }
  // In-page links: open the target's blocks before the browser scrolls to it.
  const link = el?.closest<HTMLAnchorElement>('a[href*="#"]');
  if (link && link.origin === location.origin && link.pathname === location.pathname) {
    const target = targetOf(link.hash);
    if (target) reveal(target);
  }
});

// Find-in-page and fragment navigation reveal an until-found body themselves.
document.addEventListener(
  'beforematch',
  (event) => {
    const body = event.target as Element;
    if (body.classList?.contains('deeper-body')) {
      const block = body.parentElement as HTMLElement;
      block.classList.add('is-open');
      // The browser removes `hidden` itself; record the state to match.
      queueMicrotask(() => sync(block, getLevel()));
    }
  },
  true,
);

addEventListener('hashchange', () => revealHash(true));
document.addEventListener(LEVEL_EVENT, (event) => syncAll((event as CustomEvent<Level>).detail));

syncAll();
revealHash(true);
