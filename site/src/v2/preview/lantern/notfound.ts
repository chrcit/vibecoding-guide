/*
 * What the dev server answers at an address nothing is built at yet: its own raw reply, plus one line
 * in the guide's lesson-mark style (dashed, mono) that says why. Testers in every round read the bare
 * "Cannot GET" as the guide being broken; the line says it is the app, before the agent builds the page.
 */
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export const cannotGet = (path: string) =>
  `<pre>Cannot GET ${esc(path)}</pre><p style="margin:0.75rem 1rem;padding:0.5rem 0.625rem;border:1px dashed currentColor;border-radius:6px;font:12px/1.5 ui-monospace,monospace;opacity:0.75;max-width:30rem">Nothing is at ${esc(path)} yet. The dev server answers; the page appears once the agent builds it.</p>`;
