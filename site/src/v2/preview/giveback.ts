/*
 * A guest's own invite for the Lantern's birthday night, as the agent builds it in lesson 9. A real,
 * working page: the guest can give back their spot (and their +1) so their promoter gets the room
 * back, with a few seconds to undo before it is final. Warm and personal; calm about cancelling.
 *
 * Stages: 'none' is the dev server's 404; 'invite' is Ana's invite, working; 'door-bug' is the door
 * page after she gave back, still counting her +1 (a helper found it); 'fixed' is her invite given
 * back, with what it freed up; 'trial' is Lea's invite on a copy of Friday's list.
 *
 * Each invite's state lives at module level, so it survives `set()` and a remount. All made up.
 */
import './giveback.css';
import type { MountApp } from './index';
import { INVITES, NIGHT, KAI_SPOTS, EXPECTED_BEFORE, type Invite, type InviteId } from './giveback/data';
import { ICON } from './giveback/icons';
import { doorBugHtml } from './giveback/door';

type Stage = 'none' | 'invite' | 'door-bug' | 'fixed' | 'trial';
const STAGES: readonly Stage[] = ['none', 'invite', 'door-bug', 'fixed', 'trial'];

// ---------- each invite's state, shared by every mount ----------

type Hold = 'held' | 'pending' | 'given';
interface Spot { hold: Hold; until: number; cal: boolean }
const spots: Record<InviteId, Spot> = {
  ana: { hold: 'held', until: 0, cal: false },
  lea: { hold: 'held', until: 0, cal: false },
};
const UNDO_MS = 5000;
/** A give-back is final once its undo window has passed, whether or not a page was open. */
function settle(s: Spot) { if (s.hold === 'pending' && Date.now() >= s.until) s.hold = 'given'; }

// ---------- helpers ----------

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';
function enter(el: Element | null, from: Keyframe, ms = 220, delay = 0) {
  if (!el || reduced()) return;
  (el as HTMLElement).animate([from, { transform: 'none', opacity: 1 }], { duration: ms, easing: EASE, delay, fill: 'backwards' });
}
const spotsWord = (inv: Invite) => (inv.plus ? 'both spots' : 'your spot');

type Toast = { kind: 'undo'; inv: Invite } | { kind: 'note'; text: string } | null;

// ---------- the page ----------

export const url = 'localhost:4321/i/ana';

export const giveback: MountApp = (el, initial) => {
  let stage: Stage = normalize(initial);
  let toast: Toast = null;
  let settleTimer = 0;
  let toastTimer = 0;
  let sheetOpen = false;

  const root = document.createElement('div');
  root.className = 'gb';
  el.append(root);
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s);

  function normalize(s: string): Stage { return STAGES.includes(s as Stage) ? (s as Stage) : 'invite'; }
  const invite = (): Invite => INVITES[stage === 'trial' ? 'lea' : 'ana'];
  /** 'fixed' shows Ana's give-back done, whatever the reader did: it is the lesson's outcome. */
  const holdOf = (inv: Invite): Hold => (stage === 'fixed' ? 'given' : spots[inv.id].hold);

  // ---------- shell ----------

  function shell() {
    if (stage === 'none') {
      root.className = 'gb gb--none';
      root.innerHTML = '<pre>Cannot GET /i/ana</pre>';
      return;
    }
    if (stage === 'door-bug') {
      root.className = 'gb gb--door';
      root.innerHTML = doorBugHtml();
      enter($('.gb-dcol'), { transform: 'translateY(8px)', opacity: 0 }, 240);
      return;
    }
    root.className = `gb${stage === 'trial' ? ' gb--trial' : ''}`;
    root.innerHTML = `
      <div class="gb-scroll" data-scroll>
        ${stage === 'trial' ? `<div class="gb-trial" role="note"><b>Trial</b><span>Copy of Friday’s list · nothing here changes the real list</span></div>` : ''}
        <div class="gb-col">
          <header class="gb-top">
            <span class="gb-brand"><span class="gb-lantern">${ICON.lantern}</span>The Lantern</span>
            <span class="gb-top-meta">Your invite</span>
          </header>
          <div class="gb-ticket" data-ticket></div>
          <div class="gb-after" data-after></div>
        </div>
      </div>
      <div class="gb-toastbay" data-toast></div>
      <p class="gb-vh" aria-live="polite" data-sr></p>`;
    paintTicket(false);
    enter($('[data-ticket]'), { transform: 'translateY(14px)', opacity: 0 }, 260);
  }

  // ---------- the invite ----------

  function factsHtml(inv: Invite) {
    return `<dl class="gb-facts">
      <div><dt>${NIGHT.day}</dt><dd>${NIGHT.date}</dd></div>
      <div><dt>Doors</dt><dd>${NIGHT.doors}</dd></div>
      <div><dt>You bring</dt><dd>${inv.plus ? `+${inv.plus}` : 'Just you'}</dd></div>
    </dl>`;
  }

  function heldHtml(inv: Invite) {
    const cal = spots[inv.id].cal;
    return `
      <div class="gb-part gb-part--top">
        ${ICON.confetti}
        <p class="gb-eyebrow">The Lantern’s birthday</p>
        <p class="gb-hi">Hi ${esc(inv.first)},</p>
        <h1 class="gb-title">You’re on ${esc(inv.promoter)}’s list</h1>
        ${factsHtml(inv)}
      </div>
      <div class="gb-part gb-part--stub">
        <div class="gb-where">
          <span class="gb-where-icon">${ICON.pin}</span>
          <span class="gb-where-text"><b>${NIGHT.venue}</b><span>${esc(NIGHT.address)}</span></span>
        </div>
        <p class="gb-door-note">${ICON.id}<span>Give your name at the door and bring ID${inv.plus ? '. Your +1 comes in with you' : ''}.</span></p>
        <button type="button" class="gb-cal" data-cal${cal ? ' data-on' : ''}>${cal ? `${ICON.check}In your calendar` : `${ICON.cal}Add to calendar`}</button>
      </div>`;
  }

  function givenHtml(inv: Invite, hold: Hold) {
    const freed = stage === 'fixed';
    const n = 1 + inv.plus;
    return `
      <div class="gb-part gb-part--top gb-part--done">
        <div class="gb-done-row">
          <span class="gb-done-mark">${ICON.check}</span>
          <span class="gb-stamp">${hold === 'pending' ? 'Giving back' : 'Given back'}</span>
        </div>
        <h1 class="gb-title">Your spot is back with ${esc(inv.promoter)}</h1>
        <p class="gb-sub">${inv.plus ? `<span class="gb-too">+${inv.plus} too</span>` : ''}Thanks for letting us know.</p>
        <div class="gb-void">${factsHtml(inv)}</div>
      </div>
      <div class="gb-part gb-part--stub">
        ${freed ? `
        <section class="gb-freed" aria-labelledby="gb-freed-h">
          <h2 id="gb-freed-h">What this freed up</h2>
          <p class="gb-freed-lede">${n} spot${n > 1 ? 's' : ''} back on ${esc(inv.promoter)}’s list</p>
          <ul>
            <li>${ICON.check}<span>${esc(inv.promoter)}’s list</span><b>${KAI_SPOTS - n} of ${KAI_SPOTS}</b></li>
            <li>${ICON.check}<span>Door expects</span><b>${EXPECTED_BEFORE - n}</b></li>
            <li>${ICON.check}<span>Late list</span><b>${esc(inv.first)} removed</b></li>
          </ul>
        </section>` : `
        <p class="gb-later">See you another night. ${esc(inv.promoter)} can put you on a list again any time.</p>`}
      </div>`;
  }

  function afterHtml(inv: Invite, hold: Hold) {
    if (hold === 'held') return `<p class="gb-out"><span>Can’t make it?</span><button type="button" class="gb-link" data-give>Give back your spot</button></p>`;
    if (hold === 'pending') return '';
    if (stage === 'fixed') return `<p class="gb-out gb-out--quiet">Changed your mind? Ask ${esc(inv.promoter)} for a new link.</p>`;
    return `<p class="gb-out gb-out--quiet"><span>Changed your mind?</span><button type="button" class="gb-link" data-relink>Ask ${esc(inv.promoter)} for a new link</button></p>`;
  }

  function paintTicket(animate: boolean) {
    const inv = invite();
    settle(spots[inv.id]);
    const hold = holdOf(inv);
    const $t = $('[data-ticket]'), $a = $('[data-after]');
    if (!$t || !$a) return;
    $t.dataset.hold = hold;
    $t.innerHTML = hold === 'held' ? heldHtml(inv) : givenHtml(inv, hold);
    $a.innerHTML = afterHtml(inv, hold);
    if (animate) {
      enter($t.querySelector('.gb-part--top'), { transform: 'translateY(6px)', opacity: 0 }, 240);
      enter($t.querySelector('.gb-part--stub'), { transform: 'translateY(6px)', opacity: 0 }, 240, 40);
      enter($a.firstElementChild, { opacity: 0 }, 200, 80);
      const stamp = $t.querySelector<HTMLElement>('.gb-stamp');
      if (stamp && !reduced()) stamp.animate([{ transform: 'rotate(-7deg) scale(1.3)', opacity: 0 }, { transform: 'rotate(-7deg) scale(1)', opacity: 1 }], { duration: 240, easing: EASE, delay: 140, fill: 'backwards' });
    }
    scheduleSettle(inv);
  }

  /** While a give-back is pending, finish it when its undo window ends. */
  function scheduleSettle(inv: Invite) {
    if (settleTimer) clearTimeout(settleTimer);
    settleTimer = 0;
    const s = spots[inv.id];
    if (stage === 'fixed' || s.hold !== 'pending') return;
    settleTimer = window.setTimeout(() => {
      settleTimer = 0;
      settle(s);
      if (toast?.kind === 'undo') showToast(null);
      paintTicket(true);
      announce(`Done. Your spot is back with ${inv.promoter}.`);
    }, Math.max(0, s.until - Date.now()));
  }

  // ---------- toast: undo while pending, short notes otherwise ----------

  function paintToast(animate: boolean) {
    const $d = $('[data-toast]');
    if (!$d) return;
    if (!toast) {
      const old = $d.firstElementChild as HTMLElement | null;
      if (!old) return;
      if (!animate || reduced()) { $d.innerHTML = ''; return; }
      old.style.pointerEvents = 'none';
      old.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(6px)' }], { duration: 160, easing: 'ease-out', fill: 'forwards' })
        .finished.then(() => { if (!toast) $d.innerHTML = ''; }, () => {});
      return;
    }
    if (toast.kind === 'undo') {
      const inv = toast.inv;
      $d.innerHTML = `<div class="gb-toast" data-kind="undo">
        <span class="gb-toast-text"><b>${inv.plus ? 'Spot and +1 given back' : 'Spot given back'}</b><span>Final in a few seconds</span></span>
        <button type="button" class="gb-undo" data-undo>Undo</button>
        <i class="gb-toast-timer" aria-hidden="true"></i>
      </div>`;
      const left = Math.max(0, spots[inv.id].until - Date.now());
      const timer = $d.querySelector<HTMLElement>('.gb-toast-timer');
      if (timer) {
        timer.style.transform = `scaleX(${(left / UNDO_MS).toFixed(3)})`;
        if (!reduced()) timer.animate([{ transform: `scaleX(${(left / UNDO_MS).toFixed(3)})` }, { transform: 'scaleX(0)' }], { duration: left, easing: 'linear', fill: 'forwards' });
      }
    } else {
      $d.innerHTML = `<div class="gb-toast" data-kind="note"><span class="gb-toast-icon">${ICON.check}</span><span class="gb-toast-text"><b>${esc(toast.text)}</b></span></div>`;
    }
    if (animate) enter($d.firstElementChild, { transform: 'translateY(10px)', opacity: 0 }, 220);
  }

  function showToast(t: Toast, ms = 0) {
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = 0;
    toast = t;
    paintToast(true);
    if (t && ms) toastTimer = window.setTimeout(() => { toastTimer = 0; toast = null; paintToast(true); }, ms);
  }

  const announce = (s: string) => { const sr = $('[data-sr]'); if (sr) sr.textContent = s; };

  // ---------- give back ----------

  function openSheet() {
    const inv = invite();
    closeSheet(false);
    sheetOpen = true;
    const sheet = document.createElement('div');
    sheet.className = 'gb-sheet';
    sheet.innerHTML = `
      <div class="gb-scrim" data-close></div>
      <div class="gb-panel" role="dialog" aria-modal="true" aria-labelledby="gb-sheet-title" aria-describedby="gb-sheet-body">
        <div class="gb-seats" aria-hidden="true">
          <span class="gb-seat">${esc(inv.first.slice(0, 1))}</span>${inv.plus ? '<span class="gb-seat gb-seat--plus">+1</span>' : ''}
        </div>
        <h2 class="gb-panel-title" id="gb-sheet-title">Give back your spot${inv.plus ? ' and your +1' : ''}?</h2>
        <p class="gb-panel-body" id="gb-sheet-body">${esc(inv.promoter)} gets ${inv.plus ? 'both places' : 'the place'} back to offer someone else. You can undo it for a few seconds.</p>
        <button type="button" class="gb-primary" data-confirm>Give back ${spotsWord(inv)}</button>
        <button type="button" class="gb-cancel" data-close>Keep my spot</button>
      </div>`;
    root.append(sheet);
    if (!reduced()) {
      sheet.querySelector<HTMLElement>('.gb-scrim')!.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
      sheet.querySelector<HTMLElement>('.gb-panel')!.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: 280, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' });
    }
    sheet.querySelector<HTMLElement>('.gb-cancel')?.focus({ preventScroll: true });
  }

  function closeSheet(animate = true) {
    const sheet = $('.gb-sheet');
    const was = sheetOpen;
    sheetOpen = false;
    if (!sheet) return;
    if (!animate || reduced()) { sheet.remove(); return; }
    sheet.style.pointerEvents = 'none';
    sheet.querySelector<HTMLElement>('.gb-scrim')!.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'ease-out', fill: 'forwards' });
    sheet.querySelector<HTMLElement>('.gb-panel')!.animate([{ transform: 'none' }, { transform: 'translateY(100%)' }], { duration: 200, easing: 'ease-out', fill: 'forwards' })
      .finished.then(() => sheet.remove(), () => sheet.remove());
    if (was) $<HTMLElement>('[data-give]')?.focus({ preventScroll: true });
  }

  function giveBack() {
    const inv = invite();
    const s = spots[inv.id];
    closeSheet();
    s.hold = 'pending';
    s.until = Date.now() + UNDO_MS;
    paintTicket(true);
    $('[data-scroll]')?.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
    showToast({ kind: 'undo', inv });
    $<HTMLElement>('[data-undo]')?.focus({ preventScroll: true });
    announce(`Your spot${inv.plus ? ' and your +1 are' : ' is'} given back to ${inv.promoter}. Undo within five seconds.`);
  }

  function undo() {
    const inv = invite();
    const s = spots[inv.id];
    if (s.hold !== 'pending') return;
    s.hold = 'held';
    s.until = 0;
    paintTicket(true);
    showToast({ kind: 'note', text: `You’re still on ${inv.promoter}’s list` }, 2400);
    announce(`Undone. You’re still on ${inv.promoter}’s list.`);
  }

  /** "Ask Kai for a new link": in this made-up world, Kai answers at once. */
  function relink() {
    const inv = invite();
    spots[inv.id].hold = 'held';
    paintTicket(true);
    showToast({ kind: 'note', text: `${inv.promoter} sent you a new link` }, 2600);
    announce(`${inv.promoter} sent you a new link. You’re on the list again.`);
  }

  function toggleCal() {
    const inv = invite();
    const s = spots[inv.id];
    s.cal = !s.cal;
    const b = $('[data-cal]');
    if (b) {
      b.toggleAttribute('data-on', s.cal);
      b.innerHTML = s.cal ? `${ICON.check}In your calendar` : `${ICON.cal}Add to calendar`;
      enter(b.firstElementChild, { transform: 'scale(0.6)', opacity: 0 }, 200);
    }
    announce(s.cal ? `Added: ${NIGHT.day} ${NIGHT.date}, doors ${NIGHT.doors}.` : 'Removed from your calendar.');
  }

  // ---------- events (all on root, gone with it) ----------

  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('[data-close]')) return closeSheet();
    if (t.closest('[data-confirm]')) return giveBack();
    if (t.closest('[data-give]')) return openSheet();
    if (t.closest('[data-undo]')) return undo();
    if (t.closest('[data-relink]')) return relink();
    if (t.closest('[data-cal]')) return toggleCal();
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sheetOpen) { closeSheet(); e.stopPropagation(); }
  });

  function enterStage(s: Stage) {
    stage = s;
    closeSheet(false);
    if (toastTimer) clearTimeout(toastTimer);
    if (settleTimer) clearTimeout(settleTimer);
    toastTimer = settleTimer = 0;
    toast = null;
    shell();
    if (s === 'invite' || s === 'trial') {
      const inv = invite();
      settle(spots[inv.id]);
      // Back on a page whose give-back is still in its undo window: the undo is still there.
      if (spots[inv.id].hold === 'pending') { toast = { kind: 'undo', inv }; paintToast(false); }
    }
  }

  enterStage(stage);

  return {
    set(next: string) {
      const s = normalize(next);
      if (s === stage) return;
      enterStage(s);
    },
    destroy() {
      if (toastTimer) clearTimeout(toastTimer);
      if (settleTimer) clearTimeout(settleTimer);
      root.remove();
    },
  };
};

export const app = giveback;
