/*
 * The chat follows the current point the way a live thread follows its newest row, unless the
 * reader has scrolled up to read something. Then it stays put and a "Back to the current point"
 * button appears above the controls; pressing it (or scrolling back down) follows again.
 *
 * Where it scrolls: to the bottom of the thread, but never so far that the anchor (the reply that
 * just landed, or the top of a new part) goes above the view.
 */

export interface Follow {
  /** Show the newest content, if the reader is following. `smooth` for a short glide. */
  follow(anchor: HTMLElement | null, smooth: boolean): void;
  /** Start following again (a new lesson, a jump) and show the anchor. */
  reset(anchor: HTMLElement | null): void;
}

export function follower(scroller: HTMLElement, jump: HTMLElement, reduced: MediaQueryList): Follow {
  let following = true;
  let ownUntil = 0;
  let last: HTMLElement | null = null;
  const NEAR = 72;

  const gap = () => scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop;

  function target(anchor: HTMLElement | null): number {
    const max = scroller.scrollHeight - scroller.clientHeight;
    if (!anchor || !anchor.isConnected || !anchor.offsetParent) return max;
    const top = anchor.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 16;
    return Math.max(0, Math.min(max, top));
  }

  function to(anchor: HTMLElement | null, smooth: boolean) {
    const top = target(anchor);
    const dy = top - scroller.scrollTop;
    if (Math.abs(dy) < 2) return;
    const glide = smooth && !reduced.matches && Math.abs(dy) < 600;
    ownUntil = performance.now() + (glide ? 900 : 120);
    scroller.scrollTo({ top, behavior: glide ? 'smooth' : 'auto' });
  }

  const setJump = (on: boolean) => { if (jump.hidden === on) jump.hidden = !on; };

  // Only the reader's own input counts as leaving: a wheel, a touch, a key or a drag of the
  // scrollbar. Scrolls caused by the page itself (a part leaving, the view clamping) do not.
  let userAt = -Infinity;
  const user = () => { userAt = performance.now(); ownUntil = 0; };
  scroller.addEventListener('wheel', user, { passive: true });
  scroller.addEventListener('touchmove', user, { passive: true });
  scroller.addEventListener('pointerdown', user, { passive: true });
  scroller.addEventListener('keydown', (e) => { if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) user(); });
  scroller.addEventListener('scroll', () => {
    if (performance.now() < ownUntil || performance.now() - userAt > 800) return;
    // The reader moved: follow only while they stay at the live edge.
    following = gap() < NEAR;
    setJump(!following);
  }, { passive: true });
  scroller.addEventListener('scrollend', () => { ownUntil = 0; });

  jump.addEventListener('click', () => { following = true; setJump(false); to(last, true); });

  return {
    follow(anchor, smooth) {
      last = anchor;
      if (following) requestAnimationFrame(() => to(anchor, smooth));
      else setJump(true);
    },
    reset(anchor) {
      last = anchor;
      following = true;
      setJump(false);
      requestAnimationFrame(() => to(anchor, false));
    },
  };
}
