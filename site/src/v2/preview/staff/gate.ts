/*
 * The gate in front of the private preview (16.3): a plain one-time-code sign-in, on purpose
 * nobody's brand. An email on the list gets a code; any six digits work, because it's made up.
 */
import { ALLOWED } from './data';
import { esc, ICON } from './ui';
import type { UI } from './ctx';

export function gateHtml(ui: UI['gate']) {
  const code = ui.step === 'code';
  return `<div class="st-gate">
    <p class="st-gate-host">private preview · stock page</p>
    <div class="st-gate-inner">
      <span class="st-gate-icon">${code ? ICON.mail : ICON.lock}</span>
      <h1 class="st-gate-title">${code ? 'Check your email' : 'This preview is private'}</h1>
      <p class="st-gate-sub">${code
        ? `We sent a six-digit code to <b>${esc(ui.email)}</b>. It works once, for ten minutes.`
        : 'Enter your email. If it’s on the list, we’ll send you a one-time code.'}</p>
      <form class="st-gate-form" data-gate novalidate>
        ${code
          ? `<label class="st-label" for="st-code">Code</label>
             <input class="st-input st-input--code" id="st-code" data-code inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="••••••" aria-describedby="st-gate-err"${ui.error ? ' aria-invalid="true"' : ''}>`
          : `<label class="st-label" for="st-email">Email</label>
             <input class="st-input" id="st-email" data-email type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" placeholder="you@example.com" value="${esc(ui.email)}" aria-describedby="st-gate-err"${ui.error ? ' aria-invalid="true"' : ''}>`}
        <p class="st-gate-err" id="st-gate-err" role="alert">${esc(ui.error)}</p>
        <button type="submit" class="st-btn st-btn--primary st-btn--wide st-btn--tall">${code ? 'Continue' : 'Send code'}</button>
      </form>
      ${code
        ? `<p class="st-gate-small">Any six digits work here: it’s made up.</p>
           <button type="button" class="st-btn st-btn--quiet st-btn--wide" data-change>Use another email</button>`
        : `<p class="st-gate-small">Only the addresses on the list get a code.</p>
           <button type="button" class="st-demo" data-fill>${ICON.mail}Fill in Bea’s address <span>made up</span></button>`}
    </div>
  </div>`;
}

export type GateResult = { kind: 'error' } | { kind: 'sent' } | { kind: 'in'; email: string };

export function gateSubmit(ui: UI['gate'], form: HTMLFormElement): GateResult {
  if (ui.step === 'email') {
    const email = (form.querySelector<HTMLInputElement>('[data-email]')?.value ?? '').trim().toLowerCase();
    ui.email = email;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { ui.error = 'Enter an email address.'; return { kind: 'error' }; }
    if (!ALLOWED.includes(email)) { ui.error = 'This email isn’t allowed here.'; return { kind: 'error' }; }
    ui.error = '';
    ui.step = 'code';
    return { kind: 'sent' };
  }
  const code = (form.querySelector<HTMLInputElement>('[data-code]')?.value ?? '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(code)) { ui.error = 'Enter the six digits from the email.'; return { kind: 'error' }; }
  ui.error = '';
  return { kind: 'in', email: ui.email };
}
