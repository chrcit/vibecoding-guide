/*
 * /door/scan: the door's ticket scanner, in the door app's world (dark, one hand, at night). The
 * camera is drawn; the buttons stand in for holding a ticket up to it.
 *
 *   'scan-own'  the scan thread's own worktree: it reads its own made-up format, lantern:ticket:<n>.
 *   'mismatch'  main after merging both threads: the sale page prints LTN-7K2Q, the scanner still
 *               expects lantern:ticket:<n>, so a real ticket is "Not a Lantern ticket".
 *   'together'  fixed: it looks the code up in the sale's orders and remembers what it scanned.
 */
import { anasOrder, findCode, orders, scans, nightNow, hhmm } from './state';
import { esc, firstName, tickets, enter, reduced, ICON, tag, codeSquare } from './ui';

export type ScanStage = 'scan-own' | 'mismatch' | 'together';
export interface View { destroy(): void }

const TEST_CODE = 'lantern:ticket:8841';
/** Valid reads in the versions that don't keep a record (the worktree's and the merged one). */
let testValid = 0;

type Result =
  | { kind: 'ready' }
  | { kind: 'valid'; name: string; sub: string }
  | { kind: 'already'; name: string; at: number; sub: string }
  | { kind: 'invalid'; read: string; bug: boolean };

export function mountScan(host: HTMLElement, stage: ScanStage): View {
  const root = document.createElement('div');
  root.className = 'tk-page tk-scan';
  root.dataset.stage = stage;
  host.append(root);
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s);
  let result: Result = { kind: 'ready' };
  let timer = 0;
  let typing = false;
  const clock = window.setInterval(() => { const c = $('[data-clock]'); if (c) c.textContent = hhmm(nightNow()); }, 15_000);

  const primary = () => stage === 'scan-own'
    ? { code: TEST_CODE, label: 'Scan a test code' }
    : (() => { const o = anasOrder(); return { code: o.codes[0]!, label: `Scan ${firstName(o.name)}’s ticket` }; })();
  const scannedCount = () => stage === 'together' ? scans.size : testValid;

  /** The other tickets one could hold up: the rest of the reader's codes, then a couple sold before. */
  function others(skip: string) {
    const list: { code: string; who: string }[] = [];
    for (let i = orders.length - 1; i >= 0 && list.length < 6; i--) {
      const o = orders[i]!;
      if (o.refunded) continue;
      for (const c of o.codes) if (c !== skip && list.length < 6) list.push({ code: c, who: firstName(o.name) });
    }
    return list;
  }

  // ---------- what each version does with a code ----------

  function check(raw: string): Result {
    const read = raw.trim();
    if (stage !== 'together') {
      // The worktree's scanner: only its own test format exists.
      const m = /^lantern:ticket:(\d+)$/i.exec(read);
      if (m && m[1] === '8841') { testValid++; return { kind: 'valid', name: 'Test Guest', sub: `1 ticket · ${TEST_CODE}` }; }
      return { kind: 'invalid', read, bug: stage === 'mismatch' && /^LTN-/i.test(read) };
    }
    const hit = findCode(read);
    if (!hit || hit.order.refunded) return { kind: 'invalid', read, bug: false };
    const c = hit.order.codes[hit.index]!;
    const n = hit.order.codes.length;
    const sub = `${tickets(n)}${n > 1 ? ` · this is ${hit.index + 1} of ${n}` : ''} · ${c}`;
    const at = scans.get(c);
    if (at != null) return { kind: 'already', name: hit.order.name, at, sub };
    scans.set(c, nightNow());
    return { kind: 'valid', name: hit.order.name, sub };
  }

  // ---------- painting ----------

  function shell() {
    const p = primary();
    const more = stage === 'scan-own' ? [] : others(p.code);
    root.innerHTML = `<div class="tk-scan-col">
      ${stage === 'scan-own' ? `<div class="tk-scan-tags">${tag('worktree: t3/door-scan')}</div>` : ''}
      <header class="tk-scan-head">
        <span class="tk-mark">${ICON.lantern}</span>
        <span class="tk-scan-brand"><b>Scan tickets</b><span>Door · Fri <time data-clock>${hhmm(nightNow())}</time></span></span>
        <span class="tk-scan-count"><b data-count>${scannedCount()}</b><span>scanned</span></span>
      </header>
      <div class="tk-view" data-view>
        <div class="tk-view-ticket" data-ticket></div>
        <svg class="tk-view-frame" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M2 18V6a4 4 0 0 1 4-4h12M82 2h12a4 4 0 0 1 4 4v12M98 82v12a4 4 0 0 1-4 4H82M18 98H6a4 4 0 0 1-4-4V82" vector-effect="non-scaling-stroke"/>
        </svg>
        <i class="tk-view-line" data-line aria-hidden="true"></i>
        <p class="tk-view-hint" data-hint>Hold the ticket’s code inside the frame</p>
      </div>
      <div class="tk-result" data-result role="status" aria-live="polite"></div>
      <div class="tk-scan-foot">
        ${more.length ? `<div class="tk-scan-more"><span class="tk-scan-more-label">Other tickets</span><div class="tk-scan-chips">${more.map((m) => `<button type="button" class="tk-chip" data-code="${m.code}"><span>${esc(m.who)}</span><b>${m.code}</b></button>`).join('')}</div></div>` : ''}
        <div class="tk-scan-actions" data-actions${typing ? ' hidden' : ''}>
          <button type="button" class="tk-scan-btn" data-code="${esc(p.code)}">${ICON.scan}<span>${esc(p.label)}</span></button>
          <button type="button" class="tk-scan-key" data-keys aria-label="Type a code instead">${ICON.keys}</button>
        </div>
        <form class="tk-scan-type" data-type${typing ? '' : ' hidden'}>
          <label class="tk-scan-input"><span class="tk-vh">Ticket code</span><input data-input type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="go" placeholder="LTN-…"></label>
          <button type="submit" class="tk-scan-check">Check</button>
          <button type="button" class="tk-scan-key" data-untype aria-label="Back to scanning">${ICON.close}</button>
        </form>
      </div>
    </div>`;
    paintResult(false);
  }

  function paintResult(animate: boolean) {
    const $r = $('[data-result]');
    if (!$r) return;
    root.dataset.result = result.kind;
    let html = '';
    if (result.kind === 'ready') {
      html = `<div class="tk-res tk-res--ready"><span class="tk-res-dot" aria-hidden="true"></span><p class="tk-res-ready">Ready · ${stage === 'together' ? 'every code sold on /tickets works' : 'point the camera at a code'}</p></div>`;
    } else if (result.kind === 'valid') {
      html = `<div class="tk-res tk-res--valid">
        <span class="tk-res-icon">${ICON.check}</span>
        <div class="tk-res-text"><p class="tk-res-k">Valid</p><p class="tk-res-name">${esc(result.name)}</p><p class="tk-res-sub">${esc(result.sub)}</p></div>
      </div>`;
    } else if (result.kind === 'already') {
      html = `<div class="tk-res tk-res--already">
        <span class="tk-res-icon">${ICON.again}</span>
        <div class="tk-res-text"><p class="tk-res-k">Already scanned at ${hhmm(result.at)}</p><p class="tk-res-name">${esc(result.name)}</p><p class="tk-res-sub">${esc(result.sub)}</p></div>
      </div>`;
    } else {
      html = `<div class="tk-res tk-res--invalid">
        <span class="tk-res-icon">${ICON.stop}</span>
        <div class="tk-res-text"><p class="tk-res-k tk-res-big">Not a Lantern ticket</p><p class="tk-res-sub">Read <code>${esc(result.read || '(nothing)')}</code></p></div>
        ${result.bug ? tag('the bug, made up', 'bug') : ''}
      </div>`;
    }
    $r.innerHTML = html;
    if (animate) enter($r.firstElementChild, { transform: 'translateY(10px)', opacity: 0 }, 220);
    const count = $('[data-count]');
    if (count) count.textContent = String(scannedCount());
  }

  /** Hold a code up to the camera: the ticket slides into the frame, the line sweeps, the answer lands. */
  function scan(code: string) {
    if (timer) clearTimeout(timer);
    const isTicket = /^LTN-/i.test(code.trim());
    const $t = $('[data-ticket]');
    if ($t) {
      $t.innerHTML = `<div class="tk-held${isTicket ? '' : ' tk-held--test'}">${codeSquare(code.trim())}<span>${esc(code.trim() || '—')}</span></div>`;
      enter($t.firstElementChild, { transform: 'translateY(24px) scale(0.94)', opacity: 0 }, 240);
    }
    $('[data-hint]')?.setAttribute('hidden', '');
    root.dataset.scanning = 'yes';
    const line = $('[data-line]');
    const done = () => {
      timer = 0;
      root.dataset.scanning = 'no';
      result = check(code);
      paintResult(true);
      const frame = $('.tk-view-frame');
      if (frame && !reduced()) frame.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
    };
    if (reduced()) return done();
    const h = $('[data-view]')?.clientHeight ?? 200;
    line?.animate([{ transform: 'translateY(0)', opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 1, offset: 0.85 }, { transform: `translateY(${h - 24}px)`, opacity: 0 }], { duration: 420, easing: 'ease-in-out' });
    timer = window.setTimeout(done, 430);
  }

  function setTyping(on: boolean) {
    typing = on;
    $('[data-actions]')?.toggleAttribute('hidden', on);
    $('[data-type]')?.toggleAttribute('hidden', !on);
    if (on) { const i = $<HTMLInputElement>('[data-input]'); i?.focus({ preventScroll: true }); enter($('[data-type]'), { transform: 'translateY(6px)', opacity: 0 }, 180); }
    else $<HTMLElement>('[data-keys]')?.focus({ preventScroll: true });
  }

  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const c = t.closest<HTMLElement>('[data-code]');
    if (c) return scan(c.dataset.code!);
    if (t.closest('[data-keys]')) return setTyping(true);
    if (t.closest('[data-untype]')) return setTyping(false);
  });
  root.addEventListener('submit', (e) => {
    e.preventDefault();
    const i = $<HTMLInputElement>('[data-input]');
    if (!i || !i.value.trim()) return;
    scan(i.value);
    i.select();
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && typing) { setTyping(false); e.stopPropagation(); }
  });

  shell();
  return {
    destroy() {
      if (timer) clearTimeout(timer);
      clearInterval(clock);
      root.remove();
    },
  };
}
