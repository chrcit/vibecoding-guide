/*
  The guide's contents as a full-height sheet (components/journey/LessonSheet.astro), opened from
  the lesson panel's header. A modal <dialog>: the page behind it is inert, Escape closes it, Tab
  stays inside it, and focus goes back to the button that opened it. It opens with the lesson on
  show in view and focused.
*/
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function bootSheet(trigger: HTMLButtonElement, sheet: HTMLDialogElement) {
  const open = () => {
    if (sheet.open) return;
    sheet.showModal();
    trigger.setAttribute('aria-expanded', 'true');
    const here = sheet.querySelector<HTMLElement>('[aria-current="page"]') ?? sheet.querySelector<HTMLElement>(FOCUSABLE);
    here?.scrollIntoView({ block: 'center' });
    here?.focus({ preventScroll: true });
  };
  trigger.addEventListener('click', open);
  sheet.addEventListener('close', () => {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus();
  });
  // A click on the dimmed page, outside the sheet's own box, closes it.
  sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.close(); });
  sheet.querySelectorAll('[data-jp-close]').forEach((b) => b.addEventListener('click', () => sheet.close()));
  // Keep Tab inside the sheet, from the last link back to the close button and the other way.
  sheet.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const all = [...sheet.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    if (!all.length) return;
    const first = all[0]!, last = all[all.length - 1]!;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}
