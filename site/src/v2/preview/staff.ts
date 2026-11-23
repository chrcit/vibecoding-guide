/*
 * The Lantern's staff app, weeks after the first Friday (lessons 14–17 and Set up). A working,
 * phone-first app with five tabs in the thumb zone: Tonight, Bar, Rota, Payouts, Report.
 *
 * Stages (staff/stages.ts, in story order):
 *   'none'            the dev server's 404 for /payouts ('none-report' etc. for another path)
 *   'starter'         Set up: the new project's first page, tonight's list, read only
 *   'bar', 'bar-ale', 'bar-sorted'                  Bar in front (14.1, 14.3)
 *   'payouts', 'payouts-why', 'payouts-broken'      Payouts in front (14.2, 14.3, 15.3)
 *   'tables-missing', 'tables'                      Tonight in front (15.1, 15.2)
 *   'swap-open', 'swap'                             Rota in front, signed in as Bea (16.1, 16.2)
 *   'gate', 'stock', 'stock-delivery'               the private preview: sign-in, then Bar › Stock (16.3, 16.4)
 *   'report'                                        Report in front (17)
 * Unknown stages show 'tables'. Each stage picks the front tab; every tab still works and shows
 * what existed at that point (or says it isn't built yet).
 *
 * What the reader does lives at module level (staff/state.ts): check-ins, bar taps, stock counts,
 * a swap, the gate. It survives `set()` and a remount. Everything here is made up.
 */
import './staff.css';
import type { MountApp } from './index';
import { features, normalize, type Features, type Stage, type Tab } from './staff/stages';
import { gate } from './staff/state';
import type { Ctx, Person, Screen, Toast, UI } from './staff/ctx';
import { tonight } from './staff/tonight';
import { bar } from './staff/bar';
import { rota, rotaPerson, enterRota } from './staff/rota';
import { payouts } from './staff/payouts';
import { report } from './staff/report';
import { gateHtml, gateSubmit } from './staff/gate';
import { LIST_LABEL, TONIGHT } from './staff/data';
import { enter, esc, ICON } from './staff/ui';

export const url = 'localhost:4321/tonight';

const SCREENS: Record<Tab, Screen> = { tonight, bar, rota, payouts, report };
const TABS: Tab[] = ['tonight', 'bar', 'rota', 'payouts', 'report'];
const OWNER: Person = { name: 'Owner', label: 'Owner', short: 'You', initials: 'O' };
const BEA: Person = { name: 'Bea Lindqvist', label: 'Bea · Bar', short: 'Bea', initials: 'BL' };
const PRIVATE: Stage[] = ['gate', 'stock', 'stock-delivery'];

export const staff: MountApp = (el, initial) => {
  let stage: Stage = 'tables';
  let missing = '';
  let f: Features = features(stage);
  /** Signed out of the private preview on a stock stage: show the gate until signed in again. */
  let signedOut = false;
  let toastTimer = 0;
  const ui: UI = {
    tab: 'tonight', query: '', barView: 'low', open: new Set(),
    rota: { mode: 'idle', from: null, to: null, asOther: false },
    gate: { step: 'email', email: '', error: '' },
  };

  const root = document.createElement('div');
  root.className = 'st';
  el.append(root);
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s);

  const ctx: Ctx = {
    get f() { return f; },
    ui,
    root,
    me: () => rotaPerson(ctx) ?? (f.bea ? BEA : OWNER),
    paint,
    toast,
    announce: (s) => { const sr = $('[data-sr]'); if (sr) { sr.textContent = ''; sr.textContent = s; } },
  };

  const gated = () => !gate.passed && (stage === 'gate' || (signedOut && PRIVATE.includes(stage)));

  // ---------- pages ----------

  function shell() {
    clearToast();
    root.dataset.stage = stage;
    if (stage === 'none') {
      root.className = 'st st--none';
      root.innerHTML = `<pre>Cannot GET ${esc(missing)}</pre>`;
      return;
    }
    if (stage === 'starter') {
      root.className = 'st st--starter';
      root.innerHTML = starterHtml();
      return;
    }
    if (gated()) {
      root.className = 'st st--gate';
      root.innerHTML = `${gateHtml(ui.gate)}<p class="st-vh" aria-live="polite" data-sr></p>`;
      return;
    }
    root.className = 'st';
    const strip = PRIVATE.includes(stage) && gate.passed
      ? `<div class="st-private">${ICON.lock}<span>Private preview · <b>${esc(gate.passed)}</b></span><button type="button" data-signout>Sign out</button></div>`
      : '';
    root.innerHTML = `${strip}
      <header class="st-head">
        <span class="st-mark" aria-hidden="true">${ICON.lantern}</span>
        <span class="st-head-text"><span class="st-over">The Lantern</span><h1 class="st-title" data-title></h1></span>
        <span class="st-me" data-me></span>
      </header>
      <div class="st-main">
        <div class="st-scroll" data-scroll><div class="st-body" data-body></div></div>
        <div class="st-dock">
          <div class="st-toast-slot" data-toast></div>
          <div class="st-foot" data-foot></div>
        </div>
      </div>
      <nav class="st-tabs" aria-label="Staff app">
        <ul>${TABS.map((t) => `<li><button type="button" class="st-tab" data-tab="${t}">${ICON[t]}<span>${SCREENS[t].title}</span></button></li>`).join('')}</ul>
      </nav>
      <p class="st-vh" aria-live="polite" data-sr></p>`;
    paint();
  }

  function paint(opts: { foot?: boolean } = {}) {
    const body = $('[data-body]');
    if (!body) return;
    const screen = SCREENS[ui.tab];
    body.innerHTML = screen.html(ctx);
    if (opts.foot !== false) {
      const foot = $('[data-foot]')!;
      foot.innerHTML = screen.foot?.(ctx) ?? '';
      foot.parentElement!.toggleAttribute('data-empty', !foot.innerHTML.trim());
    }
    $('[data-title]')!.textContent = screen.title;
    const me = ctx.me();
    const $me = $('[data-me]')!;
    $me.innerHTML = `<span class="st-av st-av--s" aria-hidden="true">${esc(me.initials)}</span><span class="st-me-label"><span class="st-vh">Signed in as </span>${esc(me.label)}</span>`;
    $me.dataset.who = me === OWNER ? 'owner' : 'staff';
    for (const b of root.querySelectorAll<HTMLElement>('[data-tab]')) {
      if (b.dataset.tab === ui.tab) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    }
  }

  function starterHtml() {
    return `<div class="st-starter">
      <header class="st-starter-head">
        <span class="st-mark" aria-hidden="true">${ICON.lantern}</span>
        <h1>The Lantern</h1>
        <p>Tonight’s list · ${TONIGHT.length} names</p>
      </header>
      <ol class="st-starter-list">${TONIGHT.map((g) => `<li><span>${esc(g.name)}</span><span class="st-muted">${esc(LIST_LABEL[g.list])}${g.plus ? ` · +${g.plus}` : ''}</span></li>`).join('')}</ol>
      <p class="st-starter-foot">Read only · made-up names</p>
    </div>`;
  }

  // ---------- toast: one line above the thumb zone ----------

  function clearToast() {
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = 0;
    const slot = $('[data-toast]');
    if (slot) slot.innerHTML = '';
  }
  let toastAction: (() => void) | null = null;
  function toast(t: Toast) {
    clearToast();
    const slot = $('[data-toast]');
    if (!slot) return;
    toastAction = t.action?.run ?? null;
    const icon = t.kind === 'ok' ? ICON.check : t.kind === 'note' ? '<b aria-hidden="true">!</b>' : '';
    slot.innerHTML = `<div class="st-toast" data-kind="${t.kind ?? 'plain'}">
      ${icon ? `<span class="st-toast-icon">${icon}</span>` : ''}
      <span class="st-toast-text"><b>${esc(t.text)}</b>${t.sub ? `<span>${esc(t.sub)}</span>` : ''}</span>
      ${t.action ? `<button type="button" class="st-toast-act" data-toast-act>${esc(t.action.label)}</button>` : ''}
    </div>`;
    enter(slot.firstElementChild, { transform: 'translateY(8px)', opacity: 0 }, 220);
    toastTimer = window.setTimeout(() => {
      toastTimer = 0;
      const el = slot.firstElementChild as HTMLElement | null;
      if (!el) return;
      const done = () => { if (!toastTimer) slot.innerHTML = ''; };
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return done();
      el.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(4px)' }], { duration: 160, easing: 'ease-out', fill: 'forwards' }).finished.then(done, done);
    }, t.ms ?? 3000);
  }

  // ---------- tabs ----------

  function go(t: Tab) {
    if (t === ui.tab) { const s = $('[data-scroll]'); s?.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    ui.tab = t;
    if (t !== 'rota') ui.rota.asOther = false;
    clearToast();
    paint();
    const s = $('[data-scroll]');
    if (s) s.scrollTop = 0;
    enter($('[data-body]'), { transform: 'translateY(6px)', opacity: 0 }, 180);
  }

  // ---------- events (all on root, gone with it) ----------

  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const tab = t.closest<HTMLElement>('[data-tab]');
    if (tab) return go(tab.dataset.tab as Tab);
    if (t.closest('[data-toast-act]')) { const run = toastAction; clearToast(); run?.(); return; }
    if (t.closest('[data-signout]')) {
      gate.passed = null;
      signedOut = true;
      ui.gate = { step: 'email', email: '', error: '' };
      shell();
      return;
    }
    if (t.closest('[data-fill]')) {
      const input = $<HTMLInputElement>('[data-email]');
      if (input) { input.value = 'bea@thelantern.example'; input.focus({ preventScroll: true }); }
      return;
    }
    if (t.closest('[data-change]')) { ui.gate = { step: 'email', email: ui.gate.email, error: '' }; shell(); $<HTMLInputElement>('[data-email]')?.focus({ preventScroll: true }); return; }
    if (root.classList.contains('st--gate')) return;
    SCREENS[ui.tab].click?.(ctx, t);
  });
  root.addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.matches('[data-code]')) { const d = t.value.replace(/\D/g, '').slice(0, 6); if (d !== t.value) t.value = d; return; }
    SCREENS[ui.tab].input?.(ctx, t);
  });
  root.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (form.matches('[data-gate]')) {
      const r = gateSubmit(ui.gate, form);
      if (r.kind === 'in') {
        gate.passed = r.email;
        signedOut = false;
        ui.gate = { step: 'email', email: '', error: '' };
        ui.tab = 'bar';
        ui.barView = 'stock';
        f = withSignIn(features(stage));
        shell();
        toast({ kind: 'ok', text: 'You’re in', sub: `Signed in as ${r.email}`, ms: 2600 });
        ctx.announce(`Signed in as ${r.email}. Bar stock.`);
        return;
      }
      shell();
      const input = $<HTMLInputElement>(ui.gate.step === 'code' ? '[data-code]' : '[data-email]');
      input?.focus({ preventScroll: true });
      if (r.kind === 'error') { const err = $('.st-gate-err'); if (err && !matchMedia('(prefers-reduced-motion: reduce)').matches) err.animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(3px)' }, { transform: 'none' }], { duration: 200, easing: 'ease-out' }); }
      else enter($('.st-gate-inner'), { transform: 'translateY(8px)', opacity: 0 }, 220);
      return;
    }
    SCREENS[ui.tab].submit?.(ctx, form);
  });
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const t = e.target as HTMLElement;
    if (t.matches('[data-q]') && ui.query) {
      ui.query = '';
      (t as HTMLInputElement).value = '';
      $('[data-clear]')?.toggleAttribute('data-hidden', true);
      paint({ foot: false });
      e.stopPropagation();
    }
  });

  /** Signed in to the preview as the owner: the owner's view, not Bea's. */
  function withSignIn(x: Features): Features {
    return PRIVATE.includes(stage) && gate.passed?.startsWith('owner@') ? { ...x, bea: false } : x;
  }

  function enterStage(next: string) {
    const n = normalize(next);
    stage = n.stage;
    missing = n.missing;
    f = withSignIn(features(stage));
    if (stage !== 'none' && stage !== 'starter') {
      ui.tab = f.front;
      if (PRIVATE.includes(stage)) ui.barView = 'stock';
      else if (stage.startsWith('bar')) ui.barView = 'low';
      if (stage.startsWith('payouts') && !ui.open.size) ui.open.add('kai');
      if (f.front === 'rota') enterRota(ctx);
      else ui.rota.asOther = false;
    }
    shell();
    const s = $('[data-scroll]');
    if (s) s.scrollTop = 0;
  }

  let current = initial;
  enterStage(initial);

  return {
    set(next: string) {
      if (next === current) return;
      current = next;
      enterStage(next);
    },
    destroy() {
      if (toastTimer) clearTimeout(toastTimer);
      root.remove();
    },
  };
};

export const app = staff;
