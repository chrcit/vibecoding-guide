// Dev-only review comments: the browser half. Injected by ./index.mjs in `astro dev` only.
// Select text, press the Comment button (or `c`), write, save with Cmd/Ctrl+Enter.
// Everything lives in one shadow root so the site's styles and ours stay apart.

const MARKER = 'acg-comments-dev-only'; // scripts/check-dist.mjs fails the build if this string ships
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
// The endpoint sits at the server root even under a base path: Astro answers everything
// below the base itself, before a plugin middleware sees it.
const API = '/__comments';
const CONTEXT = 40;

function start() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hasHighlights = typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight === 'function';

  // ---- Highlight styles (must live in the document, where the text is) ----
  const hlStyle = document.createElement('style');
  hlStyle.id = `${MARKER}-highlights`;
  hlStyle.textContent = `
    ::highlight(acg-comment) { background-color: color-mix(in oklab, var(--blue, #2b4f86) 18%, transparent); text-decoration: underline 2px var(--blue, #2b4f86); text-underline-offset: 3px; }
    ::highlight(acg-comment-active) { background-color: color-mix(in oklab, var(--blue, #2b4f86) 38%, transparent); color: var(--ink, #1c1b18); }
  `;
  document.head.append(hlStyle);

  // ---- UI shell ----
  const host = document.createElement('div');
  host.id = MARKER;
  host.setAttribute('data-nosnippet', '');
  host.style.cssText = 'position:absolute;top:0;left:0;width:0;height:0;z-index:2147483000;';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>${CSS_TEXT}</style>
    <button class="fab" type="button" hidden aria-label="Comment on the selected text (shortcut: c)" title="Comment (c)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg><span>Comment</span>
    </button>
    <form class="pop" hidden role="dialog" aria-label="New review comment">
      <p class="tag">Review comment · dev only</p>
      <blockquote class="pq"></blockquote>
      <label class="sr" for="acg-new">Comment</label>
      <textarea id="acg-new" rows="4" placeholder="What should change here?"></textarea>
      <p class="err" role="alert" hidden></p>
      <p class="hint"><kbd>${navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</kbd> <kbd>Enter</kbd> save · <kbd>Esc</kbd> cancel</p>
      <div class="row">
        <button type="button" class="b ghost" data-cancel>Cancel</button>
        <button type="submit" class="b">Save</button>
      </div>
    </form>
    <button class="toggle" type="button" aria-expanded="false" aria-controls="acg-panel">
      <span class="dot" aria-hidden="true"></span><span class="tlabel">Review</span><span class="count">0</span>
    </button>
    <section class="panel" id="acg-panel" hidden aria-label="Review comments on this page">
      <header>
        <h2>Review comments <span class="tag">dev only</span></h2>
        <button type="button" class="b ghost icon" data-close aria-label="Close review comments">✕</button>
      </header>
      <label class="check"><input type="checkbox" data-resolved> Show resolved</label>
      <p class="empty" hidden>No comments on this page yet. Select some text to add one.</p>
      <ol class="list"></ol>
    </section>`;
  document.body.append(host);

  const $ = (s) => root.querySelector(s);
  const fab = $('.fab');
  const pop = $('.pop');
  const popQuote = $('.pq');
  const textarea = $('#acg-new');
  const popErr = $('.err');
  const toggle = $('.toggle');
  const panel = $('.panel');
  const list = $('.list');
  const empty = $('.empty');
  const showResolved = $('[data-resolved]');
  try { showResolved.checked = localStorage.getItem(`${MARKER}:resolved`) === '1'; } catch {}

  let pending = null; // { range, quote } for the selection being commented on
  let comments = [];
  let anchors = new Map(); // id -> Range (or null when the quote is not found)
  let activeId = null;
  let pointerDown = false;

  // ---- Page identity ----
  const pagePath = () => {
    let p = decodeURI(location.pathname);
    const b = BASE.replace(/\/$/, '');
    if (b && p.startsWith(b)) p = p.slice(b.length) || '/';
    return p.startsWith('/') ? p : '/' + p;
  };

  const api = async (path, opts = {}) => {
    const res = await fetch(API + path, {
      ...opts,
      headers: opts.body ? { 'content-type': 'application/json' } : undefined,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  };

  // ---- Text index: page text with whitespace collapsed, mapped back to DOM positions ----
  function buildIndex() {
    const segs = [];
    let text = '';
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        if (!p || p.closest(`script,style,noscript,template,textarea,#${MARKER}`)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const raw = n.data;
      const offs = [];
      const startLen = text.length;
      let chunk = '';
      for (let i = 0; i < raw.length; i++) {
        const ch = raw[i];
        if (/\s/.test(ch)) {
          const last = chunk.length ? chunk[chunk.length - 1] : text[text.length - 1];
          if (last === undefined || last === ' ') continue;
          chunk += ' ';
        } else chunk += ch;
        offs.push(i);
      }
      text += chunk;
      if (offs.length) segs.push({ node: n, start: startLen, offs });
    }
    return { text, segs };
  }

  function offsetsOfRange(range, idx) {
    let s = -1, e = -1, first = null;
    for (const seg of idx.segs) {
      if (!range.intersectsNode(seg.node)) {
        if (s >= 0) break;
        continue;
      }
      let a = 0, z = seg.offs.length;
      if (seg.node === range.startContainer) { a = seg.offs.findIndex((o) => o >= range.startOffset); if (a < 0) a = z; }
      if (seg.node === range.endContainer) { z = seg.offs.findIndex((o) => o >= range.endOffset); if (z < 0) z = seg.offs.length; }
      if (a >= z) continue;
      if (s < 0) { s = seg.start + a; first = seg; }
      e = seg.start + z;
    }
    if (s < 0) return null;
    while (s < e && idx.text[s] === ' ') s++;
    while (e > s && idx.text[e - 1] === ' ') e--;
    if (s >= e) return null;
    // The first segment with real text decides which source file the selection came from.
    const startSeg = idx.segs.find((g) => g.start + g.offs.length > s) || first;
    return { s, e, startNode: startSeg?.node };
  }

  function rangeOfOffsets(s, e, idx) {
    const at = (i) => {
      let lo = 0, hi = idx.segs.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (idx.segs[mid].start <= i) lo = mid; else hi = mid - 1;
      }
      const seg = idx.segs[lo];
      return { node: seg.node, off: seg.offs[Math.min(i - seg.start, seg.offs.length - 1)] };
    };
    const a = at(s), z = at(e - 1);
    const r = document.createRange();
    r.setStart(a.node, a.off);
    r.setEnd(z.node, z.off + 1);
    return r;
  }

  function quoteOf(range) {
    const idx = buildIndex();
    const o = offsetsOfRange(range, idx);
    if (!o) return null;
    const { text } = idx;
    return {
      quote: {
        exact: text.slice(o.s, o.e),
        prefix: text.slice(Math.max(0, o.s - CONTEXT), o.s),
        suffix: text.slice(o.e, o.e + CONTEXT),
      },
      startNode: o.startNode,
      range: rangeOfOffsets(o.s, o.e, idx),
    };
  }

  /** Find a quote again. Several matches are ranked by how much of the prefix and suffix agree. */
  function anchor(quote, idx) {
    const { text } = idx;
    const exact = quote?.exact;
    if (!exact) return null;
    let best = null, bestScore = -1;
    for (let i = text.indexOf(exact); i >= 0; i = text.indexOf(exact, i + 1)) {
      let score = 0;
      const pre = quote.prefix || '', suf = quote.suffix || '';
      while (score < pre.length && text[i - 1 - score] === pre[pre.length - 1 - score]) score++;
      let k = 0;
      while (k < suf.length && text[i + exact.length + k] === suf[k]) k++;
      score += k;
      if (score > bestScore) { bestScore = score; best = i; }
    }
    return best === null ? null : rangeOfOffsets(best, best + exact.length, idx);
  }

  function nearestHeading(range) {
    let found = null;
    for (const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
      if (host.contains(h)) continue;
      if (range.comparePoint(h, 0) === -1) found = h; else break;
    }
    if (!found) return null;
    return { text: found.textContent.replace(/\s+/g, ' ').trim(), id: found.id || found.querySelector('[id]')?.id || null };
  }

  // In dev, Astro marks every element written in an .astro file with data-astro-source-file
  // and -loc. Markdown output carries no mark. The dev toolbar strips the attributes once it
  // starts (keeping them in its own WeakMap), so take a copy now and ask the toolbar after.
  const annotations = new WeakMap();
  const snapshot = () => {
    for (const el of document.querySelectorAll('[data-astro-source-file]')) {
      annotations.set(el, { file: el.getAttribute('data-astro-source-file'), loc: el.getAttribute('data-astro-source-loc') });
    }
  };
  snapshot();
  let toolbarAnnotations = null;
  const toolbarSrc = [...document.scripts].map((s) => s.src).find((s) => s.includes('/dev-toolbar/entrypoint.js'));
  if (toolbarSrc) {
    import(/* @vite-ignore */ toolbarSrc.replace('/entrypoint.js', '/apps/audit/annotations.js'))
      .then((m) => { toolbarAnnotations = m.getAnnotationsForElement; })
      .catch(() => {});
  }

  function sourceHint(node) {
    const el = node?.nodeType === 1 ? node : node?.parentElement;
    if (!el) return null;
    if (el.hasAttribute('data-astro-source-file')) annotations.set(el, { file: el.getAttribute('data-astro-source-file'), loc: el.getAttribute('data-astro-source-loc') });
    const a = annotations.get(el) || toolbarAnnotations?.(el);
    if (!a?.file) return null; // no mark: the text came from markdown (or set:html)
    return { file: a.file, loc: a.loc || a.location || null };
  }

  function theme() {
    const set = document.documentElement.dataset.theme;
    if (set) return set;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark (system)' : 'light (system)';
  }

  // ---- Highlights ----
  function paint() {
    if (!hasHighlights) return;
    const ranges = [];
    for (const c of comments) if (c.status === 'open' && anchors.get(c.id)) ranges.push(anchors.get(c.id));
    CSS.highlights.set('acg-comment', new Highlight(...ranges));
    const active = pending?.range || (activeId && anchors.get(activeId));
    if (active) CSS.highlights.set('acg-comment-active', new Highlight(active));
    else CSS.highlights.delete('acg-comment-active');
  }

  function reanchor() {
    const idx = buildIndex();
    anchors = new Map(comments.map((c) => [c.id, anchor(c.quote, idx)]));
    paint();
  }

  async function load() {
    try {
      const data = await api(`?page=${encodeURIComponent(pagePath())}`);
      comments = data.comments.sort((a, b) => a.created.localeCompare(b.created));
    } catch (err) {
      comments = [];
      console.warn('[review comments]', err);
    }
    reanchor();
    render();
  }

  // ---- Selection -> Comment button ----
  const editable = (el) => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

  function currentSelection() {
    const sel = document.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
    const r = sel.getRangeAt(0);
    const anchorEl = r.commonAncestorContainer.nodeType === 1 ? r.commonAncestorContainer : r.commonAncestorContainer.parentElement;
    if (!anchorEl || host.contains(anchorEl) || editable(anchorEl) || editable(document.activeElement)) return null;
    if (!sel.toString().trim()) return null;
    return r;
  }

  let selTimer = 0;
  function onSelection() {
    clearTimeout(selTimer);
    selTimer = setTimeout(() => {
      if (!pop.hidden || pointerDown) return;
      const r = currentSelection();
      if (!r) { fab.hidden = true; return; }
      placeNear(fab, r, 'fab');
      fab.hidden = false;
    }, 120);
  }

  function placeNear(el, range, kind) {
    const rects = range.getClientRects();
    const last = rects[rects.length - 1] || range.getBoundingClientRect();
    const first = rects[0] || last;
    el.style.visibility = 'hidden';
    el.hidden = false;
    const w = el.offsetWidth, h = el.offsetHeight;
    const vw = document.documentElement.clientWidth;
    let left = kind === 'fab' ? last.right - w / 2 : last.left;
    left = Math.max(8, Math.min(left, vw - w - 8));
    let top = last.bottom + 8;
    // A popover that does not fit below goes above the whole selection, not over it.
    if (kind === 'pop' && top + h > innerHeight - 8 && first.top - h - 8 > 0) { top = first.top - h - 8; left = Math.max(8, Math.min(first.left, vw - w - 8)); }
    else if (kind === 'pop' && top + h > innerHeight - 8) top = Math.max(8, innerHeight - h - 8);
    el.style.left = `${left + scrollX}px`;
    el.style.top = `${top + scrollY}px`;
    el.style.visibility = '';
  }

  // ---- New comment popover ----
  function openPop() {
    const r = currentSelection();
    if (!r) return;
    const q = quoteOf(r);
    if (!q) return;
    pending = { ...q, heading: nearestHeading(q.range), element: sourceHint(q.startNode) };
    fab.hidden = true;
    popQuote.textContent = clip(q.quote.exact, 160);
    popErr.hidden = true;
    textarea.value = '';
    placeNear(pop, q.range, 'pop');
    pop.hidden = false;
    paint();
    textarea.focus({ preventScroll: true });
  }

  function closePop(restore = true) {
    if (pop.hidden) return;
    pop.hidden = true;
    const r = pending?.range;
    pending = null;
    paint();
    if (restore && r) {
      const sel = document.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
    }
  }

  async function savePop() {
    const comment = textarea.value.trim();
    if (!comment || !pending) { textarea.focus(); return; }
    const body = {
      page: pagePath(),
      quote: pending.quote,
      heading: pending.heading,
      element: pending.element,
      level: document.documentElement.dataset.level || null,
      theme: theme(),
      viewport: { width: innerWidth, height: innerHeight },
      comment,
    };
    try {
      const { comment: saved } = await api('', { method: 'POST', body });
      closePop(false);
      document.getSelection()?.removeAllRanges();
      comments.push(saved);
      reanchor();
      render();
      flash(toggle);
    } catch (err) {
      popErr.textContent = `Not saved: ${err.message}`;
      popErr.hidden = false;
    }
  }

  // ---- Panel ----
  function render() {
    const open = comments.filter((c) => c.status === 'open');
    const missing = open.filter((c) => !anchors.get(c.id)).length;
    toggle.querySelector('.count').textContent = String(open.length);
    toggle.classList.toggle('has', open.length > 0);
    toggle.setAttribute('aria-label', `Review comments: ${open.length} open on this page${missing ? `, ${missing} not found` : ''}`);
    const shown = comments.filter((c) => showResolved.checked || c.status === 'open');
    empty.hidden = shown.length > 0;
    empty.textContent = comments.length
      ? 'All comments on this page are resolved.'
      : 'No comments on this page yet. Select some text to add one.';
    list.replaceChildren(...shown.map(item));
  }

  function item(c) {
    const li = document.createElement('li');
    li.dataset.id = c.id;
    li.className = `item ${c.status}${c.id === activeId ? ' active' : ''}`;
    const found = !!anchors.get(c.id);
    li.innerHTML = `
      <blockquote></blockquote>
      <p class="text"></p>
      <p class="meta"></p>
      <div class="row actions">
        <button type="button" class="b ghost" data-act="jump">Show</button>
        <button type="button" class="b ghost" data-act="edit">Edit</button>
        <button type="button" class="b ghost" data-act="status"></button>
        <button type="button" class="b ghost danger" data-act="delete">Delete</button>
      </div>`;
    li.querySelector('blockquote').textContent = clip(c.quote?.exact || '', 200);
    li.querySelector('.text').textContent = c.comment;
    const bits = [];
    if (c.status === 'resolved') bits.push('Resolved');
    if (!found) bits.push('Quote not found on this page');
    if (c.heading?.text) bits.push(`Under “${clip(c.heading.text, 48)}”`);
    bits.push(new Date(c.created).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }));
    li.querySelector('.meta').textContent = bits.join(' · ');
    if (!found) li.querySelector('.meta').classList.add('warn');
    const jump = li.querySelector('[data-act=jump]');
    jump.disabled = !found;
    jump.setAttribute('aria-label', `Show comment in the page`);
    li.querySelector('[data-act=status]').textContent = c.status === 'open' ? 'Resolve' : 'Reopen';
    return li;
  }

  function openPanel() {
    reanchor();
    render();
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    (list.querySelector('button:not(:disabled)') || $('[data-close]')).focus({ preventScroll: true });
  }

  function closePanel(focusToggle = true) {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    activeId = null;
    paint();
    if (focusToggle) toggle.focus({ preventScroll: true });
  }

  function jumpTo(id) {
    const r = anchors.get(id);
    if (!r) return;
    activeId = id;
    paint();
    for (const li of list.children) li.classList.toggle('active', li.dataset.id === id);
    let el = r.startContainer.parentElement;
    for (let d = el?.closest('details'); d; d = d.parentElement?.closest('details')) d.open = true;
    const rect = r.getBoundingClientRect();
    const narrow = innerWidth < 640;
    const target = rect.top + scrollY - (narrow ? innerHeight * 0.2 : innerHeight / 3);
    window.scrollTo({ top: Math.max(0, target), behavior: reduced.matches ? 'auto' : 'smooth' });
    if (narrow) { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.focus({ preventScroll: true }); }
  }

  function startEdit(li, c) {
    const text = li.querySelector('.text');
    const form = document.createElement('form');
    form.className = 'edit';
    form.innerHTML = `<label class="sr" for="acg-edit-${c.id}">Edit comment</label>
      <textarea id="acg-edit-${c.id}" rows="3"></textarea>
      <div class="row"><button type="button" class="b ghost" data-cancel>Cancel</button><button type="submit" class="b">Save</button></div>`;
    const ta = form.querySelector('textarea');
    ta.value = c.comment;
    text.replaceWith(form);
    li.querySelector('.actions').hidden = true;
    ta.focus();
    const done = () => { render(); list.querySelector(`[data-id="${c.id}"] [data-act=edit]`)?.focus(); };
    const save = async () => {
      const v = ta.value.trim();
      if (!v) return;
      try {
        const { comment: updated } = await api(`/${c.id}`, { method: 'PATCH', body: { comment: v } });
        Object.assign(c, updated);
        done();
      } catch (err) { alertIn(form, err); }
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); save(); });
    form.querySelector('[data-cancel]').addEventListener('click', done);
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); save(); }
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(); }
    });
  }

  function alertIn(el, err) {
    let p = el.querySelector('.err');
    if (!p) { p = document.createElement('p'); p.className = 'err'; p.setAttribute('role', 'alert'); el.append(p); }
    p.textContent = `Failed: ${err.message}`;
  }

  list.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const li = btn.closest('li');
    const c = comments.find((x) => x.id === li.dataset.id);
    if (!c) return;
    const act = btn.dataset.act;
    try {
      if (act === 'jump') jumpTo(c.id);
      if (act === 'edit') startEdit(li, c);
      if (act === 'status') {
        const { comment: updated } = await api(`/${c.id}`, { method: 'PATCH', body: { status: c.status === 'open' ? 'resolved' : 'open' } });
        Object.assign(c, updated);
        if (activeId === c.id) activeId = null;
        paint();
        render();
        (list.querySelector(`[data-id="${c.id}"] [data-act=status]`) || list.querySelector('button') || $('[data-close]')).focus();
      }
      if (act === 'delete') {
        if (btn.dataset.confirm !== '1') {
          btn.dataset.confirm = '1';
          btn.textContent = 'Really delete?';
          setTimeout(() => { if (btn.isConnected) { btn.dataset.confirm = ''; btn.textContent = 'Delete'; } }, 4000);
          return;
        }
        await api(`/${c.id}`, { method: 'DELETE' });
        comments = comments.filter((x) => x.id !== c.id);
        anchors.delete(c.id);
        if (activeId === c.id) activeId = null;
        paint();
        render();
        (list.querySelector('button') || $('[data-close]')).focus();
      }
    } catch (err) { alertIn(li, err); }
  });

  // ---- Wiring ----
  document.addEventListener('selectionchange', onSelection);
  document.addEventListener('pointerdown', (e) => { if (!e.composedPath().includes(host)) pointerDown = true; }, true);
  document.addEventListener('pointerup', () => { pointerDown = false; onSelection(); }, true);
  document.addEventListener('pointercancel', () => { pointerDown = false; }, true);

  fab.addEventListener('pointerdown', (e) => e.preventDefault()); // keep the page selection
  fab.addEventListener('click', openPop);

  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.isComposing) return;
    if (e.key === 'c' && pop.hidden && !editable(e.target) && !e.composedPath().includes(host) && currentSelection()) {
      e.preventDefault();
      openPop();
    }
  });

  pop.addEventListener('submit', (e) => { e.preventDefault(); savePop(); });
  pop.querySelector('[data-cancel]').addEventListener('click', () => closePop());
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); savePop(); }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closePop(); }
  });
  // Clicking elsewhere in the page keeps a typed draft open; an empty one closes.
  document.addEventListener('pointerdown', (e) => {
    if (!pop.hidden && !e.composedPath().includes(host) && !textarea.value.trim()) closePop(false);
  });

  toggle.addEventListener('click', () => (panel.hidden ? openPanel() : closePanel()));
  $('[data-close]').addEventListener('click', () => closePanel());
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); closePanel(); }
  });
  showResolved.addEventListener('change', () => {
    try { localStorage.setItem(`${MARKER}:resolved`, showResolved.checked ? '1' : '0'); } catch {}
    render();
  });

  addEventListener('resize', () => { if (!fab.hidden) onSelection(); });

  load();
}

function clip(s, n) {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;
}

function flash(el) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 260, easing: 'ease-out' });
}

// Plainly a tool: mono type, square-ish corners, a dashed rule, site tokens for colour.
const CSS_TEXT = `
:host { all: initial; }
* { box-sizing: border-box; }
[hidden] { display: none !important; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
button, textarea, input { font: inherit; color: inherit; }
.fab, .pop, .toggle, .panel {
  font-family: var(--mono, ui-monospace, Menlo, monospace); font-size: 13px; line-height: 1.45;
  color: var(--ink, #1c1b18); -webkit-font-smoothing: antialiased;
}
:focus-visible { outline: 2px solid var(--accent, #c8431a); outline-offset: 2px; }
.b {
  min-height: 40px; padding: 0 12px; border-radius: 4px; cursor: pointer;
  border: 1px solid var(--ink, #1c1b18); background: var(--ink, #1c1b18); color: var(--paper, #f4f1e9);
}
.b.ghost { background: transparent; color: var(--ink, #1c1b18); border-color: var(--rule, #dcd5c6); }
.b.ghost:hover { border-color: var(--ink-2, #3d3a34); }
.b.danger[data-confirm='1'] { border-color: var(--accent, #c8431a); color: var(--accent, #c8431a); }
.b:disabled { opacity: 0.45; cursor: default; }
.b.icon { width: 40px; padding: 0; }
.row { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; justify-content: flex-end; }
.tag { color: var(--muted, #6e695e); font-size: 13px; font-weight: 400; }
kbd { font: inherit; border: 1px solid var(--rule, #dcd5c6); border-bottom-width: 2px; border-radius: 3px; padding: 0 4px; }
.err { color: var(--accent, #c8431a); margin: 6px 0 0; }

.fab {
  position: absolute; display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 0 12px;
  border-radius: 4px; border: 1px solid var(--ink, #1c1b18); background: var(--ink, #1c1b18); color: var(--paper, #f4f1e9);
  cursor: pointer; box-shadow: 0 6px 18px -8px rgba(0,0,0,0.45);
}

.pop {
  position: absolute; width: min(24rem, calc(100vw - 16px)); padding: 12px;
  background: var(--card, #fbf9f4); border: 1px solid var(--rule, #dcd5c6); border-top: 3px dashed var(--blue, #2b4f86);
  border-radius: 4px; box-shadow: 0 12px 32px -12px rgba(0,0,0,0.45);
}
.pop .tag { margin: 0 0 8px; }
blockquote {
  margin: 0 0 8px; padding: 2px 0 2px 10px; border-left: 3px solid var(--blue, #2b4f86); color: var(--ink-2, #3d3a34);
  overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
textarea {
  display: block; width: 100%; min-height: 5.5em; resize: vertical; padding: 8px; border-radius: 4px;
  border: 1px solid var(--rule, #dcd5c6); background: var(--paper, #f4f1e9); font-size: 14px;
}
textarea:focus-visible { outline-offset: 0; }
.pop .row { margin-top: 8px; }
.hint { color: var(--muted, #6e695e); margin: 6px 0 0; }

.toggle {
  position: fixed; right: 16px; bottom: 16px; display: inline-flex; align-items: center; gap: 8px;
  min-height: 40px; padding: 0 12px; border-radius: 4px; cursor: pointer;
  background: var(--card, #fbf9f4); border: 1px dashed var(--ink-2, #3d3a34); box-shadow: 0 6px 18px -10px rgba(0,0,0,0.4);
}
.toggle .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--muted, #6e695e); }
.toggle.has .dot { background: var(--blue, #2b4f86); }
.toggle .count { font-variant-numeric: tabular-nums; font-weight: 600; }

.panel {
  position: fixed; right: 16px; bottom: 64px; width: min(26rem, calc(100vw - 32px)); max-height: min(70vh, calc(100vh - 96px));
  display: flex; flex-direction: column; background: var(--card, #fbf9f4);
  border: 1px solid var(--rule, #dcd5c6); border-top: 3px dashed var(--blue, #2b4f86); border-radius: 4px;
  box-shadow: 0 16px 40px -16px rgba(0,0,0,0.5);
}
.panel header { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 6px 0 12px; }
.panel h2 { font-size: 14px; font-weight: 600; margin: 0; }
.check { display: flex; align-items: center; gap: 8px; min-height: 40px; padding: 0 12px; color: var(--ink-2, #3d3a34); cursor: pointer; }
.check input { width: 18px; height: 18px; margin: 0; accent-color: var(--blue, #2b4f86); }
.empty { margin: 4px 12px 14px; color: var(--muted, #6e695e); }
.list { list-style: none; margin: 0; padding: 0 12px 12px; overflow-y: auto; overscroll-behavior: contain; }
.item { padding: 10px 0; border-top: 1px solid var(--rule, #dcd5c6); }
.item.active blockquote { border-left-color: var(--accent, #c8431a); }
.item.resolved .text, .item.resolved blockquote { opacity: 0.6; }
.item .text { margin: 0 0 4px; white-space: pre-wrap; overflow-wrap: anywhere; font-size: 14px; }
.item .meta { margin: 0 0 8px; color: var(--muted, #6e695e); }
.item .meta.warn { color: var(--accent, #c8431a); }
.item .actions { justify-content: flex-start; }
.edit .row { margin-top: 6px; }

@media (prefers-reduced-motion: no-preference) {
  .pop:not([hidden]), .panel:not([hidden]), .fab:not([hidden]) { animation: acg-in 140ms ease-out; }
  @keyframes acg-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
}
`;

if (!window[MARKER] && document.body) {
  window[MARKER] = true;
  start();
}
