// Copper Lane Wanderers FC: season subs. Everything stays in this browser's localStorage.
(() => {
  'use strict';

  const KEY = 'clw-subs-2026-27';
  const SQUADS = { Seniors: 12000, Veterans: 9000, Juniors: 6000 }; // fees in pence
  const TODAY = isoDate(new Date());

  const SAMPLE = [
    ['Priya Raman', 'Seniors', 12000, '2026-08-14'],
    ['Tomasz Wiśniak', 'Seniors', 12000, '2026-08-21'],
    ['Callum Byrne', 'Seniors', 6000, '2026-09-03'],
    ['Hattie Greenslade', 'Seniors', 12000, '2026-08-30'],
    ['Marcus Adeyemi-Lowe', 'Seniors', 0, null],
    ['Ruth Pennock', 'Veterans', 9000, '2026-09-12'],
    ['Graham Tillotson', 'Veterans', 9000, '2026-08-17'],
    ['Siobhan Treacy', 'Seniors', 12000, '2026-10-02'],
    ['Ibrahim Saleh', 'Seniors', 0, null],
    ['Jonah Kessler-Wade', 'Veterans', 4500, '2026-10-19'],
    ['Ellis Moorcroft', 'Juniors', 6000, '2026-09-06'],
    ['Noor Haddad', 'Juniors', 6000, '2026-11-02'],
  ];

  const $ = (s) => document.querySelector(s);
  const els = {
    members: $('#members'), empty: $('#empty'), tpl: $('#member-tpl'), sheet: $('#sheet'),
    paidCount: $('#paid-count'), memberCount: $('#member-count'), owing: $('#owing-total'), paidTotal: $('#paid-total'),
    nAll: $('#n-all'), nPaid: $('#n-paid'), nOwing: $('#n-owing'), q: $('#q'), status: $('#result-status'),
    memberDialog: $('#member-dialog'), memberForm: $('#member-form'), pay: $('#pay-dialog'), payForm: $('#pay-form'),
    toasts: $('#toasts'), importErr: $('#import-error'), file: $('#import-file'), storageWarn: $('#storage-warning'),
  };

  let members = load();
  let filter = 'all';
  let query = '';
  let editingId = null;
  let payingId = null;
  let freshId = null;

  // ---------- helpers ----------
  function isoDate(d) {
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }
  function newId() {
    return (crypto.randomUUID && crypto.randomUUID()) || Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
  function gbp(pence) {
    const s = money.format(pence / 100);
    return s.endsWith('.00') ? s.slice(0, -3) : s;
  }
  function shortDate(iso) {
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
  }
  function parsePounds(text) {
    const t = String(text).trim().replace(/^£/, '').replace(/,/g, '');
    if (!/^\d+(\.\d{1,2})?$/.test(t)) return NaN;
    return Math.round(parseFloat(t) * 100);
  }
  function poundsField(pence) { return pence % 100 ? (pence / 100).toFixed(2) : String(pence / 100); }
  function validIso(s) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const d = new Date(s + 'T12:00:00');
    return !isNaN(d) && isoDate(d) === s;
  }
  function surname(n) { const parts = n.trim().split(/\s+/); return parts[parts.length - 1].toLowerCase(); }
  function initials(n) {
    const parts = n.trim().split(/\s+/).filter(Boolean);
    const first = parts[0] ? parts[0][0] : '?';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }
  function status(m) {
    const paid = m.paid ? m.paid.amount : 0;
    if (paid >= m.fee) return 'paid';
    return paid > 0 ? 'part' : 'owing';
  }
  function fold(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }

  // ---------- storage ----------
  function sample() {
    return SAMPLE.map(([name, squad, amount, date]) => ({
      id: newId(), name, squad, fee: SQUADS[squad], paid: amount ? { amount, date } : null,
    }));
  }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw === null) return sample();
      const data = JSON.parse(raw);
      if (Array.isArray(data.members)) return data.members;
    } catch (e) { /* fall through */ }
    return sample();
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ version: 1, members }));
      els.storageWarn.hidden = true;
    } catch (e) {
      els.storageWarn.hidden = false;
    }
  }
  function commit(next) { members = next; save(); render(); }

  // ---------- render ----------
  function render() {
    const sorted = [...members].sort((a, b) => surname(a.name).localeCompare(surname(b.name), 'en-GB') || a.name.localeCompare(b.name, 'en-GB'));
    const counts = { paid: 0, owing: 0 };
    let owe = 0, got = 0;
    for (const m of members) {
      const s = status(m);
      if (s === 'paid') counts.paid++; else counts.owing++;
      const paid = m.paid ? m.paid.amount : 0;
      got += paid;
      owe += Math.max(0, m.fee - paid);
    }
    els.paidCount.textContent = counts.paid;
    els.memberCount.textContent = members.length;
    els.owing.textContent = gbp(owe);
    els.paidTotal.textContent = gbp(got);
    els.nAll.textContent = members.length;
    els.nPaid.textContent = counts.paid;
    els.nOwing.textContent = counts.owing;

    // squad sheet: one block per member, paid first
    const order = { paid: 0, part: 1, owing: 2 };
    els.sheet.replaceChildren(...[...members].sort((a, b) => order[status(a)] - order[status(b)]).map((m) => {
      const s = document.createElement('span');
      s.className = status(m);
      return s;
    }));

    const q = fold(query.trim());
    const shown = sorted.filter((m) => {
      const s = status(m);
      if (filter === 'paid' && s !== 'paid') return false;
      if (filter === 'owing' && s === 'paid') return false;
      return !q || fold(m.name).includes(q);
    });

    els.members.replaceChildren(...shown.map(row));
    renderEmpty(shown.length, q);
    els.status.textContent = members.length ? `Showing ${shown.length} of ${members.length} members` : 'The list is empty';
    freshId = null;
  }

  function row(m) {
    const li = els.tpl.content.firstElementChild.cloneNode(true);
    const s = status(m);
    li.dataset.status = s;
    li.dataset.id = m.id;
    if (m.id === freshId) li.classList.add('fresh');
    li.querySelector('.badge').textContent = initials(m.name);
    li.querySelector('.name').textContent = m.name;
    li.querySelector('.squad').textContent = `${m.squad} · ${gbp(m.fee)}`;
    const pill = li.querySelector('.pill');
    const detail = li.querySelector('.detail');
    const paid = m.paid ? m.paid.amount : 0;
    if (s === 'paid' && !m.paid) {
      pill.textContent = 'Nothing due';
      detail.textContent = 'Free this season';
    } else if (s === 'paid') {
      pill.textContent = 'Paid';
      detail.textContent = `${gbp(paid)} on ${shortDate(m.paid.date)}`;
    } else if (s === 'part') {
      pill.textContent = `Owes ${gbp(m.fee - paid)}`;
      detail.textContent = `${gbp(paid)} paid on ${shortDate(m.paid.date)}`;
    } else {
      pill.textContent = `Owes ${gbp(m.fee)}`;
      detail.textContent = 'Nothing paid yet';
    }
    const pay = li.querySelector('[data-act="pay"]');
    pay.textContent = m.paid ? 'Change payment' : 'Record payment';
    pay.setAttribute('aria-label', `${pay.textContent} for ${m.name}`);
    li.querySelector('[data-act="edit"]').setAttribute('aria-label', `Edit ${m.name}`);
    li.querySelector('[data-act="remove"]').setAttribute('aria-label', `Remove ${m.name}`);
    return li;
  }

  function renderEmpty(shownCount, q) {
    if (shownCount > 0) { els.empty.hidden = true; return; }
    els.empty.hidden = false;
    const net = '<svg viewBox="0 0 120 64" width="120" height="64" aria-hidden="true"><path d="M6 60V8h108v52" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M6 8l14 12h80l14-12M20 20v40M40 20v40M60 20v40M80 20v40M100 20v40M20 34h80M20 48h80" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
    if (members.length === 0) {
      els.empty.innerHTML = `${net}<h3>No members on the list</h3><p>Add the first member, import a CSV, or bring back the sample club to have a look around.</p><div class="row"><button type="button" class="btn btn-primary" data-empty="add">Add a member</button><button type="button" class="btn" data-empty="sample">Bring back the sample club</button></div>`;
      return;
    }
    const where = filter === 'paid' ? ' among those who have paid' : filter === 'owing' ? ' among those still owing' : '';
    if (q) {
      els.empty.innerHTML = `${net}<h3>Nobody matches</h3><p></p><div class="row"><button type="button" class="btn" data-empty="clear-search">Clear the search</button></div>`;
      els.empty.querySelector('p').textContent = `No one called “${query.trim()}”${where}.`;
    } else if (filter === 'owing') {
      els.empty.innerHTML = `${net}<h3>Everyone has paid</h3><p>Every member on the list has paid in full this season.</p><div class="row"><button type="button" class="btn" data-empty="show-all">Show everyone</button></div>`;
    } else {
      els.empty.innerHTML = `${net}<h3>Nobody has paid yet</h3><p>Record a payment and it shows up here.</p><div class="row"><button type="button" class="btn" data-empty="show-all">Show everyone</button></div>`;
    }
  }

  // ---------- toasts with undo ----------
  let toastTimer = null;
  function toast(message, undo) {
    clearTimeout(toastTimer);
    els.toasts.replaceChildren();
    const t = document.createElement('div');
    t.className = 'toast';
    const p = document.createElement('p');
    p.textContent = message;
    t.append(p);
    if (undo) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'btn'; b.textContent = 'Undo';
      b.addEventListener('click', () => { undo(); dismiss(t); });
      t.append(b);
    }
    els.toasts.append(t);
    const start = () => { clearTimeout(toastTimer); toastTimer = setTimeout(() => dismiss(t), undo ? 8000 : 4000); };
    t.addEventListener('pointerenter', () => clearTimeout(toastTimer));
    t.addEventListener('pointerleave', start);
    t.addEventListener('focusin', () => clearTimeout(toastTimer));
    t.addEventListener('focusout', start);
    start();
  }
  function dismiss(t) {
    t.classList.add('leaving');
    setTimeout(() => t.remove(), 220);
  }
  function withUndo(next, message) {
    const before = members;
    commit(next);
    toast(message, () => { commit(before); toast('Undone.'); document.getElementById('list').focus(); });
  }

  // ---------- member dialog ----------
  const mName = $('#m-name'), mSquad = $('#m-squad'), mFee = $('#m-fee');
  let feeTouched = false;
  function setErr(input, msg) {
    const err = document.getElementById(input.id + '-err');
    err.textContent = msg || '';
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }
  function openMember(m) {
    editingId = m ? m.id : null;
    $('#member-dialog-h').textContent = m ? 'Edit member' : 'Add a member';
    $('#member-submit').textContent = m ? 'Save changes' : 'Add member';
    mName.value = m ? m.name : '';
    mSquad.value = m ? m.squad : 'Seniors';
    mFee.value = poundsField(m ? m.fee : SQUADS.Seniors);
    feeTouched = !!m && m.fee !== SQUADS[m.squad];
    setErr(mName); setErr(mFee);
    els.memberDialog.showModal();
    mName.focus();
  }
  mSquad.addEventListener('change', () => { if (!feeTouched) mFee.value = poundsField(SQUADS[mSquad.value]); });
  mFee.addEventListener('input', () => { feeTouched = true; });
  els.memberForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = mName.value.trim().replace(/\s+/g, ' ');
    const fee = parsePounds(mFee.value);
    let bad = null;
    if (!name) { setErr(mName, 'Give the member a name.'); bad = bad || mName; }
    else if (members.some((x) => x.id !== editingId && fold(x.name) === fold(name))) { setErr(mName, `${members.find((x) => x.id !== editingId && fold(x.name) === fold(name)).name} is already on the list.`); bad = bad || mName; }
    else setErr(mName);
    if (isNaN(fee)) { setErr(mFee, 'Enter the fee in pounds, like 120 or 92.50.'); bad = bad || mFee; }
    else if (fee > 100000) { setErr(mFee, 'That is more than £1,000. Check the fee.'); bad = bad || mFee; }
    else setErr(mFee);
    if (bad) { bad.focus(); return; }
    if (editingId) {
      commit(members.map((x) => (x.id === editingId ? { ...x, name, squad: mSquad.value, fee } : x)));
      freshId = null;
      toast(`Saved ${name}.`);
      els.memberDialog.close();
      focusRow(editingId, 'edit');
    } else {
      const m = { id: newId(), name, squad: mSquad.value, fee, paid: null };
      freshId = m.id;
      if (filter === 'paid' && fee > 0) setFilter('all');
      query = ''; els.q.value = '';
      commit([...members, m]);
      toast(`Added ${name}.`);
      els.memberDialog.close();
      focusRow(m.id, 'pay');
    }
  });

  // ---------- payment dialog ----------
  const pAmount = $('#p-amount'), pDate = $('#p-date'), pClear = $('#pay-clear');
  function openPay(m) {
    payingId = m.id;
    $('#pay-dialog-h').textContent = m.paid ? 'Change the payment' : 'Record a payment';
    $('#pay-who').textContent = `${m.name}, ${m.squad.toLowerCase()}, season fee ${gbp(m.fee)}`;
    pAmount.value = poundsField(m.paid ? m.paid.amount : m.fee);
    pDate.value = m.paid ? m.paid.date : TODAY;
    pDate.max = TODAY;
    pClear.hidden = !m.paid;
    setErr(pAmount); setErr(pDate);
    els.pay.showModal();
    pAmount.focus();
    pAmount.select();
  }
  els.payForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parsePounds(pAmount.value);
    const date = pDate.value;
    let bad = null;
    if (isNaN(amount) || amount <= 0) { setErr(pAmount, 'Enter an amount in pounds, like 120 or 60.50.'); bad = pAmount; }
    else if (amount > 100000) { setErr(pAmount, 'That is more than £1,000. Check the amount.'); bad = pAmount; }
    else setErr(pAmount);
    if (!validIso(date)) { setErr(pDate, 'Pick the date it was paid.'); bad = bad || pDate; }
    else if (date > TODAY) { setErr(pDate, 'That date has not happened yet.'); bad = bad || pDate; }
    else setErr(pDate);
    if (bad) { bad.focus(); return; }
    const m = members.find((x) => x.id === payingId);
    els.pay.close();
    withUndo(members.map((x) => (x.id === payingId ? { ...x, paid: { amount, date } } : x)),
      amount >= m.fee ? `${m.name} has paid.` : `${m.name} has paid ${gbp(amount)} of ${gbp(m.fee)}.`);
    focusRow(payingId, 'pay');
  });
  pClear.addEventListener('click', () => {
    const m = members.find((x) => x.id === payingId);
    els.pay.close();
    withUndo(members.map((x) => (x.id === payingId ? { ...x, paid: null } : x)), `Removed ${m.name}’s payment.`);
    focusRow(payingId, 'pay');
  });

  document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach((d) => d.addEventListener('click', (e) => { if (e.target === d) d.close(); }));

  function focusRow(id, act) {
    const li = els.members.querySelector(`[data-id="${CSS.escape(id)}"]`);
    const target = li && li.querySelector(`[data-act="${act}"]`);
    if (target) { target.focus(); li.scrollIntoView({ block: 'nearest' }); }
    else $('#add-btn').focus();
  }

  // ---------- list actions ----------
  els.members.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    const id = b.closest('.member').dataset.id;
    const m = members.find((x) => x.id === id);
    if (!m) return;
    if (b.dataset.act === 'pay') openPay(m);
    else if (b.dataset.act === 'edit') openMember(m);
    else if (b.dataset.act === 'remove') {
      const li = b.closest('.member');
      const next = li.nextElementSibling || li.previousElementSibling;
      const nextId = next && next.dataset.id;
      withUndo(members.filter((x) => x.id !== id), `Removed ${m.name}.`);
      if (nextId) focusRow(nextId, 'remove'); else $('#add-btn').focus();
    }
  });
  els.empty.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-empty]');
    if (!b) return;
    const a = b.dataset.empty;
    if (a === 'add') openMember(null);
    else if (a === 'sample') restoreSample();
    else if (a === 'clear-search') { query = ''; els.q.value = ''; render(); els.q.focus(); }
    else if (a === 'show-all') { setFilter('all'); render(); }
  });

  $('#add-btn').addEventListener('click', () => openMember(null));
  els.q.addEventListener('input', () => { query = els.q.value; render(); });
  function setFilter(f) {
    filter = f;
    document.querySelector(`input[name="filter"][value="${f}"]`).checked = true;
  }
  document.querySelectorAll('input[name="filter"]').forEach((r) => r.addEventListener('change', () => { filter = r.value; render(); }));

  $('#clear-btn').addEventListener('click', () => {
    if (!members.length) { toast('The list is already empty.'); return; }
    withUndo([], `Cleared ${members.length} member${members.length === 1 ? '' : 's'}.`);
  });
  function restoreSample() {
    setFilter('all'); query = ''; els.q.value = '';
    withUndo(sample(), 'Brought back the sample club.');
  }
  $('#sample-btn').addEventListener('click', restoreSample);

  // ---------- CSV ----------
  const COLUMNS = ['name', 'squad', 'fee', 'paid_amount', 'paid_date'];
  function csvCell(v) {
    let s = String(v ?? '');
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // keep spreadsheets from running it as a formula
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }
  function toCsv() {
    const lines = [COLUMNS.join(',')];
    for (const m of [...members].sort((a, b) => surname(a.name).localeCompare(surname(b.name), 'en-GB'))) {
      lines.push([m.name, m.squad, poundsField(m.fee), m.paid ? poundsField(m.paid.amount) : '', m.paid ? m.paid.date : ''].map(csvCell).join(','));
    }
    return lines.join('\r\n') + '\r\n';
  }
  function parseCsv(text) {
    const rows = [];
    let row = [], cell = '', i = 0, quoted = false;
    text = text.replace(/^﻿/, '');
    while (i < text.length) {
      const c = text[i];
      if (quoted) {
        if (c === '"') {
          if (text[i + 1] === '"') { cell += '"'; i += 2; continue; }
          quoted = false; i++; continue;
        }
        cell += c; i++; continue;
      }
      if (c === '"' && cell === '') { quoted = true; i++; continue; }
      if (c === ',') { row.push(cell); cell = ''; i++; continue; }
      if (c === '\r' || c === '\n') {
        row.push(cell); rows.push(row); row = []; cell = '';
        if (c === '\r' && text[i + 1] === '\n') i++;
        i++; continue;
      }
      cell += c; i++;
    }
    if (quoted) throw new Error('A quoted field is never closed. The file may be cut short.');
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows.filter((r) => r.some((c) => c.trim() !== ''));
  }
  function importCsv(text) {
    const rows = parseCsv(text);
    if (!rows.length) throw new Error('The file is empty.');
    const head = rows[0].map((h) => h.trim().toLowerCase().replace(/[\s-]+/g, '_'));
    const col = Object.fromEntries(COLUMNS.map((c) => [c, head.indexOf(c)]));
    if (col.name < 0) {
      throw new Error(head.length === 1 && /;|\t/.test(rows[0][0])
        ? 'The columns look separated by semicolons or tabs. Save it as a comma-separated CSV and try again.'
        : 'There is no “name” column in the first row, so this does not look like a member list.');
    }
    const problems = [];
    const out = [];
    const seen = new Set();
    rows.slice(1).forEach((r, n) => {
      const line = n + 2;
      const get = (c) => (col[c] >= 0 ? (r[col[c]] ?? '').trim() : '');
      const name = get('name').replace(/^'(?=[=+\-@])/, '').replace(/\s+/g, ' ');
      if (!name) { problems.push(`Line ${line}: no name.`); return; }
      if (seen.has(fold(name))) { problems.push(`Line ${line}: ${name} appears twice.`); return; }
      seen.add(fold(name));
      let squad = get('squad');
      const known = Object.keys(SQUADS).find((s) => s.toLowerCase() === squad.toLowerCase());
      if (squad && !known) { problems.push(`Line ${line}: “${squad}” is not a squad (use Seniors, Veterans or Juniors).`); return; }
      squad = known || 'Seniors';
      const feeText = get('fee');
      const fee = feeText ? parsePounds(feeText) : SQUADS[squad];
      if (isNaN(fee)) { problems.push(`Line ${line}: fee “${feeText}” is not an amount in pounds.`); return; }
      const amtText = get('paid_amount'), date = get('paid_date');
      let paid = null;
      if (amtText || date) {
        const amount = parsePounds(amtText);
        if (isNaN(amount)) { problems.push(`Line ${line}: paid amount “${amtText}” is not an amount in pounds.`); return; }
        if (!validIso(date)) { problems.push(`Line ${line}: paid date “${date}” should look like 2026-09-14.`); return; }
        if (amount > 0) paid = { amount, date };
      }
      out.push({ id: newId(), name, squad, fee, paid });
    });
    return { out, problems };
  }
  function showImportError(title, list) {
    const box = els.importErr;
    box.replaceChildren();
    const s = document.createElement('strong');
    s.textContent = title;
    box.append(s);
    if (list && list.length) {
      const ul = document.createElement('ul');
      list.slice(0, 6).forEach((p) => { const li = document.createElement('li'); li.textContent = p; ul.append(li); });
      if (list.length > 6) { const li = document.createElement('li'); li.textContent = `and ${list.length - 6} more.`; ul.append(li); }
      box.append(ul);
    }
    const p = document.createElement('p');
    p.textContent = 'Nothing was changed. Fix the file and import it again.';
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn btn-quiet'; b.textContent = 'Dismiss';
    b.addEventListener('click', () => { box.hidden = true; $('#import-btn').focus(); });
    box.append(p, b);
    box.hidden = false;
    box.scrollIntoView({ block: 'nearest' });
  }

  $('#export-btn').addEventListener('click', () => {
    if (!members.length) { toast('The list is empty, so there is nothing to export.'); return; }
    const blob = new Blob([toCsv()], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `copper-lane-subs-2026-27-${TODAY}.csv`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(`Exported ${members.length} members.`);
  });
  $('#import-btn').addEventListener('click', () => els.file.click());
  els.file.addEventListener('change', async () => {
    const f = els.file.files[0];
    els.file.value = '';
    if (!f) return;
    els.importErr.hidden = true;
    if (f.size > 2_000_000) { showImportError(`${f.name} is too large for a member list (over 2 MB).`); return; }
    try {
      const { out, problems } = importCsv(await f.text());
      if (problems.length) { showImportError(`${f.name} has ${problems.length} problem${problems.length === 1 ? '' : 's'}:`, problems); return; }
      if (!out.length) { showImportError(`${f.name} has a header row but no members.`); return; }
      setFilter('all'); query = ''; els.q.value = '';
      withUndo(out, `Imported ${out.length} member${out.length === 1 ? '' : 's'}, replacing the old list.`);
    } catch (err) {
      showImportError(`Could not read ${f.name}. ${err.message}`);
    }
  });

  save();
  render();
})();
