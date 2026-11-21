// Contact tidy: the page. Reads text, runs Tidy, draws the before-and-after, writes the download.
(() => {
  'use strict';
  const T = window.Tidy;
  const $ = (s) => document.querySelector(s);

  const SAMPLE = [
    'Full name,Email,Phone,Birthday,Town,Notes',
    '  jane   whitlock ,JANE.WHITLOCK@Example.org,07700 900123,14/03/1988,Lowbridge,"Treasurer, book club"',
    'MARCUS O\'DOWD,marcus@odowd.example,(07700) 900 456,03/04/1979,Fenwick Cross,',
    'anna-lena van der berg,anna@vdb.example,0044 7700 900789,7 June 1992,Lowbridge,"Said ""call after 6"""',
    'Tomás Ferreira,tomas.ferreira@example.net,01632 960321,1985-11-02,Hollins Green,Landline only',
    'ross mcintyre,ross.mcintyre@example.com,07700-900-111,12/25/1983,"Ashby, Upper",',
    'Rhiannon Price,rhiannon@price.example,+33 6 12 34 56 78,March 9 1990,Lyon,Moved to France',
    'SUNITA RAO-BELL,sunita.raobell@example.org,12345,31/02/1990,Fenwick Cross,',
    'Liam Oakes-Hart,liam.oakeshart@example,07700 900222,05/06/91,Lowbridge,',
    'Jane Whitlock,jane.whitlock@example.org,+44 7700 900123,1988-03-14,,Second copy from old phone',
    'Sam Okafor,sam.okafor@example.com,07700 900333,22/08/1995,Hollins Green,',
    'Beth Arrowsmith,beth@arrowsmith.example,07700 900444,1979-07-30,Lowbridge,',
    'beth arrowsmith,BETH@arrowsmith.example,07700 900445,,Lowbridge,Newer number?',
    'Sam Okafor,sam.o@example.net,07700 900334,22/08/1995,Hollins Green,Work address',
    'Priyanka  Shah\t,priyanka.shah@example.co.uk,+44 (0)20 7946 0018,2nd Sept 1986,Ashby,',
    'DeShawn MacLeod,deshawn@macleod.example,07700 900555,10.10.1990,Fenwick Cross,Capitals as he types them',
  ].join('\n');

  function bigSample(n = 3000) {
    const first = ['ada', 'ben', 'CLARA', 'dev', 'Edith', 'farid', 'GRACE', 'hamza', 'ines', 'jonas', 'kemi', 'lars', 'mira', 'NOEL', 'olu', 'pia'];
    const last = ['ashby', 'BRENNAN', 'castell', "o'hara", 'dunmore', 'van lier', 'eldridge', 'FAIRWEATHER', 'mcbride', 'gale'];
    // Ofcom's drama ranges, 1,000 numbers each, so no generated number belongs to anyone
    const ranges = ['07700 900', '0113 496 0', '0114 496 0', '0115 496 0', '0116 496 0', '0117 496 0', '0118 496 0', '0121 496 0', '0131 496 0', '0141 496 0', '0151 496 0', '0161 496 0', '01632 960'];
    const lines = ['First name;Last name;E-mail;Phone;Date joined;Notes'];
    for (let i = 0; i < n; i++) {
      const dup = i % 97 === 5 ? i - 1 : i;
      const given = first[dup % 16], initial = String.fromCharCode(65 + (Math.floor(dup / 160) % 26));
      const f = `${given} ${given === given.toLowerCase() ? initial.toLowerCase() : initial}.`, l = last[(dup >> 4) % last.length];
      const phone = ranges[Math.floor(dup / 1000) % ranges.length] + String(dup % 1000).padStart(3, '0');
      const d = (i % 28) + 1, m = (i % 12) + 1;
      const date = i % 3 === 0 ? `${d}/${m}/20${10 + (i % 15)}` : i % 3 === 1 ? `20${10 + (i % 15)}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` : `${d} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]} 20${10 + (i % 15)}`;
      lines.push([` ${f} `, l, `${first[dup % 16].toLowerCase()}.${dup}@example.org`, phone, date, i % 11 === 0 ? '"Paid; by card, in person"' : ''].join(';'));
    }
    return lines.join('\n');
  }

  const els = {
    text: $('#csv-text'), drop: $('#drop'), file: $('#file'), delim: $('#delim'), status: $('#input-status'),
    out: $('#out'), totals: $('#totals'), cols: $('#cols'), rules: $('#rules'), table: $('#table'), pager: $('#pager'),
    dlSub: $('#dl-sub'), notesCol: $('#notes-col'),
  };
  const on = Object.fromEntries(Object.keys(T.KINDS).map((k) => [k, true]));
  let parsed = null; // {header, rows, lines, delim, warnings}
  let roles = [];
  let result = null;
  let view = 'changed';
  let page = 0;
  const PAGE = 50;
  const DELIM_NAME = { ',': 'commas', ';': 'semicolons', '\t': 'tabs', '|': 'pipes' };

  // ---------- input ----------
  function status(msg, kind) {
    els.status.textContent = msg;
    els.status.className = 'input-status' + (kind ? ' is-' + kind : '');
  }
  function load(text, label) {
    els.text.value = text;
    tidy(label);
  }
  $('#sample-btn').addEventListener('click', () => load(SAMPLE, 'the messy sample'));
  $('#big-btn').addEventListener('click', () => load(bigSample(), '3,000 generated rows'));
  $('#run-btn').addEventListener('click', () => tidy());
  els.delim.addEventListener('change', () => { if (els.text.value.trim()) tidy(); });

  async function readFile(f) {
    if (!f) return;
    if (f.size > 25_000_000) { status(`${f.name} is ${(f.size / 1e6).toFixed(0)} MB. This page handles files up to 25 MB.`, 'error'); return; }
    try {
      const text = await f.text();
      if (/\u0000/.test(text.slice(0, 2000))) { status(`${f.name} looks like a spreadsheet file, not text. Save it as CSV first.`, 'error'); return; }
      load(text, f.name);
    } catch (e) {
      status(`Could not read ${f.name}.`, 'error');
    }
  }
  els.file.addEventListener('change', () => { readFile(els.file.files[0]); els.file.value = ''; });
  ['dragenter', 'dragover'].forEach((t) => els.drop.addEventListener(t, (e) => { e.preventDefault(); els.drop.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach((t) => els.drop.addEventListener(t, (e) => { e.preventDefault(); if (t === 'drop' || !els.drop.contains(e.relatedTarget)) els.drop.classList.remove('is-over'); }));
  els.drop.addEventListener('drop', (e) => readFile(e.dataTransfer.files[0]));

  function tidy(label) {
    const text = els.text.value;
    if (!text.trim()) {
      els.out.hidden = true;
      status('There is nothing to tidy yet. Paste a list, choose a file or load the sample.', 'error');
      els.text.focus();
      return;
    }
    const t0 = performance.now();
    const chosen = els.delim.value === 'auto' ? T.sniff(text) : els.delim.value;
    const p = T.parse(text, chosen);
    if (p.rows.length < 2) {
      els.out.hidden = true;
      status('That is only one line. The first line should be the column names and the rest the contacts.', 'error');
      return;
    }
    const header = p.rows[0].map((h) => T.fixSpace(h));
    parsed = { header, rows: p.rows.slice(1), lines: p.lines.slice(1), delim: chosen, warnings: p.warnings };
    roles = header.map(T.roleOf);
    page = 0;
    compute();
    const ms = Math.round(performance.now() - t0);
    let msg = `Read ${parsed.rows.length.toLocaleString('en-GB')} row${parsed.rows.length === 1 ? '' : 's'} from ${label || 'the text'}, separated by ${DELIM_NAME[chosen]}${els.delim.value === 'auto' ? ' (worked out from the first lines)' : ''}, in ${ms} ms.`;
    // wrong separator: one column, but another separator would give more
    if (header.length === 1) {
      const other = [',', ';', '\t', '|'].find((d) => d !== chosen && T.parse(text.slice(0, 5000), d).rows[0]?.length > 1);
      if (other) msg += ` Only one column came out. The file looks separated by ${DELIM_NAME[other]}: choose that under Separator.`;
      status(msg + (p.warnings.length ? ' ' + p.warnings.join(' ') : ''), 'error');
    } else {
      status(msg + (p.warnings.length ? ' ' + p.warnings.join(' ') : ''), p.warnings.length ? 'error' : 'ok');
    }
    els.out.hidden = false;
  }

  function compute() {
    result = T.run({ ...parsed, roles, on });
    renderCols();
    renderRules();
    renderTable();
    renderDownload();
  }

  // ---------- columns and rules ----------
  const ROLE_NAME = { name: 'Name', email: 'Email', phone: 'Phone', date: 'Date', other: 'Leave as text' };
  function renderCols() {
    els.cols.replaceChildren(...parsed.header.map((h, c) => {
      const wrap = document.createElement('label');
      wrap.className = 'col';
      const span = document.createElement('span');
      span.className = 'col-name';
      span.textContent = h || `Column ${c + 1}`;
      const sel = document.createElement('select');
      sel.setAttribute('aria-label', `Read “${h || 'column ' + (c + 1)}” as`);
      for (const [v, t] of Object.entries(ROLE_NAME)) {
        const o = document.createElement('option'); o.value = v; o.textContent = t; if (roles[c] === v) o.selected = true; sel.append(o);
      }
      sel.addEventListener('change', () => { roles[c] = sel.value; page = 0; compute(); sel.focus(); });
      wrap.append(span, sel);
      return wrap;
    }));
  }
  function renderRules() {
    const items = Object.entries(T.KINDS).map(([k, def]) => {
      const n = result.counts[k];
      const lab = document.createElement('label');
      lab.className = 'rule' + (n === 0 ? ' is-none' : '') + (on[k] ? '' : ' is-off');
      lab.dataset.kind = k;
      lab.innerHTML = '<input type="checkbox"><span class="rule-top"><span class="rule-label"></span><span class="rule-n"></span></span><span class="rule-what"></span>';
      const cb = lab.querySelector('input');
      cb.checked = on[k];
      cb.addEventListener('change', () => { on[k] = cb.checked; compute(); els.rules.querySelector(`[data-kind="${k}"] input`).focus(); });
      lab.querySelector('.rule-label').textContent = def.label;
      lab.querySelector('.rule-n').textContent = n === 0 ? 'none' : k === 'merge' ? `${n} row${n === 1 ? '' : 's'}` : `${n.toLocaleString('en-GB')}`;
      lab.querySelector('.rule-what').textContent = def.what;
      return lab;
    });
    const legend = els.rules.querySelector('legend');
    els.rules.replaceChildren(legend, ...items);
    const r = result;
    els.totals.textContent = `${r.inCount.toLocaleString('en-GB')} rows in, ${r.rows.length.toLocaleString('en-GB')} out · ${r.flagged.toLocaleString('en-GB')} to check`;
  }

  // ---------- table ----------
  document.querySelectorAll('input[name="view"]').forEach((r) => r.addEventListener('change', () => { view = r.value; page = 0; renderTable(); }));

  function renderTable() {
    const rows = result.rows.filter((r) => view === 'all' || (view === 'changed' ? r.changed : r.flags.length));
    $('#n-changed').textContent = result.changed.toLocaleString('en-GB');
    $('#n-flagged').textContent = result.flagged.toLocaleString('en-GB');
    $('#n-all').textContent = result.rows.length.toLocaleString('en-GB');
    const pages = Math.max(1, Math.ceil(rows.length / PAGE));
    page = Math.min(page, pages - 1);
    const slice = rows.slice(page * PAGE, page * PAGE + PAGE);

    const t = els.table;
    t.replaceChildren();
    const thead = t.createTHead().insertRow();
    const th0 = document.createElement('th'); th0.scope = 'col'; th0.textContent = 'Line'; thead.append(th0);
    parsed.header.forEach((h, c) => { const th = document.createElement('th'); th.scope = 'col'; th.textContent = h || `Column ${c + 1}`; thead.append(th); });
    if (!slice.length) {
      const tr = t.createTBody().insertRow(); const td = tr.insertCell(); td.colSpan = parsed.header.length + 1; td.className = 'none';
      td.textContent = view === 'flagged' ? 'Nothing to check. Every row was clear enough to tidy without a guess.' : view === 'changed' ? 'Nothing needed changing with the rules that are switched on.' : 'No rows.';
    }
    // one tbody per contact: the values, then a full-width line saying what happened
    for (const row of slice) {
      const tb = t.createTBody();
      if (row.flags.length) tb.className = 'flagged';
      const tr = tb.insertRow();
      const th = document.createElement('th'); th.scope = 'row'; th.textContent = row.src.join(' + '); tr.append(th);
      const why = [];
      row.cells.forEach((cell, c) => {
        const td = tr.insertCell();
        td.dataset.label = parsed.header[c] || `Column ${c + 1}`;
        if (cell.v.length > 40 || cell.orig.length > 40) td.classList.add('long');
        const nv = document.createElement('span'); nv.className = 'v'; nv.textContent = cell.v;
        if (cell.changes.length) {
          td.classList.add('chg', 'chg-' + cell.changes[cell.changes.length - 1].kind);
          const old = document.createElement('del'); old.textContent = cell.orig === '' ? '(empty)' : visible(cell.orig);
          const lab = document.createElement('span'); lab.className = 'visually-hidden'; lab.textContent = ', was ';
          td.append(nv, lab, old);
          why.push(`${parsed.header[c] || 'Column ' + (c + 1)}: ${cell.changes.map((x) => x.why).join(', ')}.`);
        } else td.append(nv);
      });
      if (!row.flags.length && !row.notes.length && !why.length) continue;
      const trN = tb.insertRow(); trN.className = 'notes-row';
      const tdN = trN.insertCell(); tdN.className = 'notes'; tdN.colSpan = parsed.header.length + 1;
      const box = document.createElement('div'); tdN.append(box);
      for (const f of row.flags) { const p = document.createElement('p'); p.className = 'flag'; p.textContent = f; box.append(p); }
      for (const n of row.notes) { const p = document.createElement('p'); p.className = 'note-merge'; p.textContent = n.text; box.append(p); }
      for (const w of why) { const p = document.createElement('p'); p.textContent = w; box.append(p); }
    }

    els.pager.replaceChildren();
    if (pages > 1) {
      const prev = button('Previous', () => { page--; renderTable(); els.pager.querySelector('[data-p=prev]').focus(); });
      prev.dataset.p = 'prev'; prev.disabled = page === 0;
      const next = button('Next', () => { page++; renderTable(); els.pager.querySelector('[data-p=next]').focus(); });
      next.dataset.p = 'next'; next.disabled = page >= pages - 1;
      const where = document.createElement('span');
      where.textContent = `Rows ${(page * PAGE + 1).toLocaleString('en-GB')}–${Math.min(rows.length, page * PAGE + PAGE).toLocaleString('en-GB')} of ${rows.length.toLocaleString('en-GB')}`;
      els.pager.append(prev, where, next);
    }
  }
  // show invisible whitespace in the "before" value so the change is visible
  function visible(s) { return s.replace(/\t/g, '⇥').replace(/ /g, '⍽').replace(/^ +| +$/g, (m) => '·'.repeat(m.length)).replace(/ {2,}/g, (m) => '·'.repeat(m.length)); }
  function button(text, fn) { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = text; b.addEventListener('click', fn); return b; }

  // ---------- download ----------
  function renderDownload() {
    const kept = Object.entries(on).filter(([k, v]) => v && result.counts[k]).map(([k]) => T.KINDS[k].label.toLowerCase());
    els.dlSub.textContent = `${result.rows.length.toLocaleString('en-GB')} rows, comma-separated, with ${kept.length ? kept.join(', ') : 'no changes'} applied. ${result.flagged ? `${result.flagged.toLocaleString('en-GB')} flagged row${result.flagged === 1 ? '' : 's'} are left as they were in the fields it was unsure about.` : 'Nothing was flagged.'}`;
  }
  $('#dl-btn').addEventListener('click', () => {
    const withNotes = els.notesCol.checked;
    const head = [...parsed.header, ...(withNotes ? ['needs_checking'] : [])];
    const body = result.rows.map((r) => [...r.cells.map((c) => c.v), ...(withNotes ? [r.flags.join(' ')] : [])]);
    const blob = new Blob(['﻿' + T.toCsv([head, ...body])], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'contacts-tidied.csv';
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  window.__tidyPage = { SAMPLE, bigSample };
})();
