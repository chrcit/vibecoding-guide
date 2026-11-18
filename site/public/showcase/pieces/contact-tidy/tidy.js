// Contact tidy: the cleaning rules. Pure functions, no DOM. Exposed as window.Tidy.
(() => {
  'use strict';

  // ---------- CSV ----------
  const DELIMS = [',', ';', '\t', '|'];

  /** Guess the separator from the first lines, counting only outside quotes. */
  function sniff(text) {
    const sample = text.slice(0, 20000);
    const lines = [];
    let cur = '', q = false;
    for (let i = 0; i < sample.length && lines.length < 12; i++) {
      const c = sample[i];
      if (c === '"') q = !q;
      if (!q && (c === '\n' || c === '\r')) { if (cur.trim()) lines.push(cur); cur = ''; continue; }
      cur += c;
    }
    if (cur.trim() && lines.length < 12) lines.push(cur);
    let best = ',', bestScore = -1;
    for (const d of DELIMS) {
      const counts = lines.map((l) => {
        let n = 0, inq = false;
        for (const c of l) { if (c === '"') inq = !inq; else if (c === d && !inq) n++; }
        return n;
      });
      if (!counts.length || counts[0] === 0) continue;
      const same = counts.filter((n) => n === counts[0]).length / counts.length;
      const score = same * 100 + counts[0];
      if (score > bestScore) { bestScore = score; best = d; }
    }
    return best;
  }

  /** RFC 4180-ish parser: quoted fields, doubled quotes, separators and line breaks inside quotes. */
  function parse(text, delim) {
    text = text.replace(/^﻿/, '');
    const rows = [], lines = [];
    let row = [], cell = '', i = 0, q = false, line = 1, rowLine = 1, unclosed = null;
    const n = text.length;
    while (i < n) {
      const c = text[i];
      if (q) {
        if (c === '"') {
          if (text[i + 1] === '"') { cell += '"'; i += 2; continue; }
          q = false; i++; continue;
        }
        if (c === '\n') line++;
        cell += c; i++; continue;
      }
      if (c === '"' && cell.trim() === '') { q = true; unclosed = line; cell = ''; i++; continue; }
      if (c === delim) { row.push(cell); cell = ''; i++; continue; }
      if (c === '\r' || c === '\n') {
        row.push(cell); rows.push(row); lines.push(rowLine);
        row = []; cell = '';
        if (c === '\r' && text[i + 1] === '\n') i++;
        i++; line++; rowLine = line; continue;
      }
      cell += c; i++;
    }
    const warnings = [];
    if (q) warnings.push(`A quote opened on line ${unclosed} is never closed, so everything after it was read as one field.`);
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); lines.push(rowLine); }
    const keep = [], keepLines = [];
    rows.forEach((r, k) => { if (r.some((x) => x.trim() !== '')) { keep.push(r); keepLines.push(lines[k]); } });
    return { rows: keep, lines: keepLines, warnings };
  }

  function toCsv(rows) {
    return rows.map((r) => r.map((v) => {
      let s = String(v ?? '');
      if (/^[=+\-@]/.test(s) && !/^\+\d/.test(s)) s = "'" + s;
      return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(',')).join('\r\n') + '\r\n';
  }

  // ---------- column roles ----------
  function roleOf(header) {
    const h = header.toLowerCase();
    if (/e-?mail/.test(h)) return 'email';
    if (/phone|mobile|tel\b|telephone|cell/.test(h)) return 'phone';
    if (/birth|dob|date|joined|since|anniversary|born/.test(h)) return 'date';
    if (/name|first|last|surname|given|forename/.test(h) && !/user|company|org|file/.test(h)) return 'name';
    return 'other';
  }

  // ---------- rules ----------
  const KINDS = {
    space: { label: 'Stray spaces', what: 'Spaces trimmed from the ends of a field and runs of spaces, tabs or non-breaking spaces inside it turned into one space.' },
    name: { label: 'Name capitals', what: 'Names typed all in capitals or all in lower case given ordinary capitals, keeping Mc, O’, hyphens and small words like van and de.' },
    email: { label: 'Email case', what: 'Email addresses put in lower case, so the same address typed two ways is seen as one.' },
    phone: { label: 'Phone format', what: 'UK numbers written as +44 with the usual spacing; other countries written as one international number.' },
    date: { label: 'Date format', what: 'Dates in any of the usual forms written as year-month-day (2026-03-14). Dates that could be read two ways are left alone and flagged.' },
    merge: { label: 'Merge duplicates', what: 'Rows that share an email address or a phone number combined into one, filling gaps from each other. Disagreements are flagged.' },
  };

  const SPACE_RE = /[\s  -​  　]+/g;
  function fixSpace(v) { return v.replace(SPACE_RE, ' ').trim(); }

  const PARTICLES = new Set(['van', 'von', 'der', 'den', 'de', 'da', 'das', 'dos', 'del', 'della', 'di', 'du', 'la', 'le', 'bin', 'ibn', 'al']);
  function capWord(w) {
    if (!w) return w;
    // handle hyphens and apostrophes inside a word
    return w.split('-').map((part) => part.split(/(['’])/).map((p, i, arr) => {
      if (p === "'" || p === '’' || !p) return p;
      const lower = p.toLocaleLowerCase('en-GB');
      let out = lower.charAt(0).toLocaleUpperCase('en-GB') + lower.slice(1);
      if (/^mc./.test(lower)) out = 'Mc' + lower.charAt(2).toLocaleUpperCase('en-GB') + lower.slice(3);
      // O'Brien, D'Arcy: capital after a one-letter prefix; but keep "Ma'am"-like endings lower
      if (i > 0 && arr[i - 2] && arr[i - 2].length > 1) out = lower;
      return out;
    }).join('')).join('-');
  }
  function fixName(v) {
    const letters = v.replace(/[^\p{L}]/gu, '');
    if (!letters) return v;
    const allLower = letters === letters.toLocaleLowerCase('en-GB');
    const allUpper = letters === letters.toLocaleUpperCase('en-GB');
    if (!allLower && !allUpper) return v; // mixed case was probably typed on purpose (DeShawn, MacLeod)
    let first = true;
    return v.replace(/[\p{L}'’.-]+/gu, (w) => {
      const lw = w.toLocaleLowerCase('en-GB');
      const out = !first && PARTICLES.has(lw) ? lw : capWord(w);
      first = false;
      return out;
    });
  }

  function fixEmail(v) {
    const t = v.trim();
    const lower = t.toLowerCase();
    const ok = /^[^\s@,;<>]+@[^\s@,;<>]+\.[a-z]{2,}$/i.test(t);
    return { v: v.replace(t, lower), flag: t && !ok ? `“${t}” does not look like a whole email address.` : null };
  }

  function fixPhone(v) {
    const raw = v.trim();
    if (!raw) return { v };
    if (/[a-wyz]/i.test(raw)) return { v, flag: `Phone “${raw}” has letters in it.` };
    const plus = /^\s*\+/.test(raw) || /^00/.test(raw.replace(/\D/g, ''));
    let d = raw.replace(/\(0\)/, '').replace(/\D/g, '');
    if (/^00/.test(d)) d = d.slice(2);
    let national = null;
    if (plus || (/^44/.test(d) && d.length === 12)) {
      if (/^44/.test(d)) national = d.slice(2).replace(/^0/, '');
      else {
        if (d.length < 8 || d.length > 15) return { v, flag: `Phone “${raw}” is too ${d.length < 8 ? 'short' : 'long'} for an international number.` };
        return { v: '+' + d, why: 'not a UK number, so written as one international number' };
      }
    } else if (/^0/.test(d)) national = d.slice(1);
    else return { v, flag: `Phone “${raw}” has no leading 0 or country code, so it could be from anywhere.` };
    if (national.length !== 10) return { v, flag: `Phone “${raw}” has ${national.length + 1} digits; UK numbers have 11.` };
    let out;
    if (/^7/.test(national)) out = `+44 ${national.slice(0, 4)} ${national.slice(4)}`;
    else if (/^2/.test(national)) out = `+44 ${national.slice(0, 2)} ${national.slice(2, 6)} ${national.slice(6)}`;
    else if (/^1(1\d|\d1)/.test(national)) out = `+44 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
    else out = `+44 ${national.slice(0, 4)} ${national.slice(4)}`;
    return { v: out, why: 'written as a UK number with +44' };
  }

  const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  function monthIndex(s) {
    const m = s.toLowerCase().replace(/\.$/, '');
    if (m.length < 3) return -1;
    const i = MONTHS.findIndex((x) => x.startsWith(m) || (m === 'sept' && x === 'september'));
    return i;
  }
  const pad = (n) => String(n).padStart(2, '0');
  function realDate(y, m, d) {
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
  }
  function spoken(y, m, d) { return `${d} ${MONTHS[m - 1][0].toUpperCase() + MONTHS[m - 1].slice(1)} ${y}`; }
  function fixDate(v) {
    const raw = v.trim();
    if (!raw) return { v };
    let y, m, d, why;
    let r;
    if ((r = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/))) {
      [y, m, d] = [+r[1], +r[2], +r[3]];
      why = 'year first already';
    } else if ((r = raw.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2}|\d{4})$/))) {
      const a = +r[1], b = +r[2];
      if (r[3].length === 2) return { v, flag: `Date “${raw}” has a two-digit year, so the century is a guess.` };
      y = +r[3];
      if (a > 12 && b <= 12) { d = a; m = b; why = `read day first, because ${a} cannot be a month`; }
      else if (b > 12 && a <= 12) { m = a; d = b; why = `read month first, because ${b} cannot be a month`; }
      else if (a === b) { d = a; m = b; why = 'day and month are the same number'; }
      else return { v, flag: `Date “${raw}” could be ${spoken(y, b, a)} or ${spoken(y, a, b)}.` };
    } else if ((r = raw.match(/^(\d{1,2})(?:st|nd|rd|th)?[\s-]+([a-z]+\.?),?[\s-]+(\d{4})$/i))) {
      d = +r[1]; m = monthIndex(r[2]) + 1; y = +r[3];
      why = 'month written as a word';
    } else if ((r = raw.match(/^([a-z]+\.?)[\s-]+(\d{1,2})(?:st|nd|rd|th)?,?[\s-]+(\d{4})$/i))) {
      m = monthIndex(r[1]) + 1; d = +r[2]; y = +r[3];
      why = 'month written as a word';
    } else {
      return { v, flag: `Date “${raw}” is in a form it does not recognise.` };
    }
    if (!m || !realDate(y, m, d)) return { v, flag: `Date “${raw}” is not a real date.` };
    if (y < 1900 || y > 2100) return { v, flag: `Date “${raw}” has an unlikely year.` };
    return { v: `${y}-${pad(m)}-${pad(d)}`, why };
  }

  /** Clean one cell. `on` says which kinds are kept. Returns the value, the changes kept, every change possible, and any flag. */
  function cleanCell(orig, role, on) {
    const possible = [];
    const changes = [];
    let v = orig;
    let flag = null;
    const spaced = fixSpace(orig);
    if (spaced !== orig) {
      possible.push('space');
      if (on.space) { v = spaced; changes.push({ kind: 'space', why: 'stray spaces removed' }); }
    }
    if (role === 'name') {
      const nv = fixName(v);
      if (nv !== v) { possible.push('name'); if (on.name) { v = nv; changes.push({ kind: 'name', why: 'capitals fixed' }); } }
    } else if (role === 'email') {
      const r = fixEmail(v);
      flag = r.flag;
      if (r.v !== v) { possible.push('email'); if (on.email) { v = r.v; changes.push({ kind: 'email', why: 'put in lower case' }); } }
    } else if (role === 'phone') {
      const r = fixPhone(v);
      flag = r.flag || null;
      if (!r.flag && r.v !== spaced) { possible.push('phone'); if (on.phone) { v = r.v; changes.push({ kind: 'phone', why: r.why }); } }
    } else if (role === 'date') {
      const r = fixDate(v);
      flag = r.flag || null;
      if (!r.flag && r.v !== spaced) { possible.push('date'); if (on.date) { v = r.v; changes.push({ kind: 'date', why: r.why }); } }
    }
    return { v, orig, changes, possible, flag };
  }

  /** Keys that identify the same person: normalised email and phone, whatever the toggles say. */
  function keysOf(row, roles) {
    const keys = [];
    row.forEach((v, c) => {
      const t = fixSpace(v);
      if (!t) return;
      if (roles[c] === 'email' && /@/.test(t)) keys.push('e:' + t.toLowerCase());
      if (roles[c] === 'phone') { const r = fixPhone(t); if (!r.flag) keys.push('p:' + r.v.replace(/\s/g, '')); }
    });
    return keys;
  }

  /**
   * Run every rule over a parsed table.
   * header: string[]; rows: string[][]; lines: number[] (source line of each row); roles: string[]; on: {kind: bool}
   */
  function run({ header, rows, lines, roles, on }) {
    const width = header.length;
    const counts = Object.fromEntries(Object.keys(KINDS).map((k) => [k, 0]));
    const out = rows.map((r, i) => {
      const flags = [];
      if (r.length !== width) flags.push(`Line ${lines[i]} has ${r.length} field${r.length === 1 ? '' : 's'} but the header has ${width}; check the separator or a stray quote.`);
      const cells = [];
      for (let c = 0; c < width; c++) {
        const cell = cleanCell(r[c] ?? '', roles[c], on);
        for (const k of cell.possible) counts[k]++;
        if (cell.flag) flags.push(cell.flag);
        cells.push(cell);
      }
      if (r.length > width) flags.push(`Extra fields dropped: ${r.slice(width).map((x) => `“${fixSpace(x)}”`).join(', ')}.`);
      return { cells, src: [lines[i]], flags, notes: [], keys: keysOf(r, roles) };
    });

    // duplicates: rows joined by a shared email or phone (union-find)
    const parent = out.map((_, i) => i);
    const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
    const byKey = new Map();
    out.forEach((row, i) => row.keys.forEach((k) => {
      if (byKey.has(k)) { const a = find(byKey.get(k)), b = find(i); if (a !== b) parent[Math.max(a, b)] = Math.min(a, b); }
      else byKey.set(k, i);
    }));
    const groups = new Map();
    out.forEach((_, i) => { const g = find(i); if (!groups.has(g)) groups.set(g, []); groups.get(g).push(i); });

    let result = [];
    for (const [, idx] of groups) {
      if (idx.length === 1) { result.push(out[idx[0]]); continue; }
      counts.merge += idx.length - 1;
      const why = sharedWhy(idx.map((i) => out[i].keys));
      if (!on.merge) {
        idx.forEach((i, n) => {
          const others = idx.filter((j) => j !== i).map((j) => out[j].src[0]);
          out[i].notes.push({ kind: 'merge', text: `Same ${why} as line ${others.join(', ')}; kept apart because merging is switched off.` });
          result.push(out[i]);
        });
        continue;
      }
      const base = out[idx[0]];
      const merged = { cells: base.cells.map((c) => ({ ...c, changes: [...c.changes] })), src: idx.map((i) => out[i].src[0]), flags: [], notes: [], keys: [] };
      idx.forEach((i) => merged.flags.push(...out[i].flags));
      for (const i of idx.slice(1)) {
        out[i].cells.forEach((cell, c) => {
          const mine = merged.cells[c];
          if (!cell.v.trim()) return;
          if (!mine.v.trim()) {
            merged.cells[c] = { ...cell, orig: mine.orig, changes: [...cell.changes, { kind: 'merge', why: `filled in from line ${out[i].src[0]}` }] };
          } else if (norm(mine.v, roles[c]) !== norm(cell.v, roles[c]) && roles[c] === 'other' && /note|comment|memo|remark/i.test(header[c])) {
            // free-text notes: keep both rather than choose
            merged.cells[c] = { ...mine, v: `${mine.v} / ${cell.v}`, changes: [...mine.changes, { kind: 'merge', why: `joined with the note from line ${out[i].src[0]}` }] };
          } else if (norm(mine.v, roles[c]) !== norm(cell.v, roles[c])) {
            merged.flags.push(`${header[c] || 'Column ' + (c + 1)} differs between the merged rows: “${mine.v}” (kept) and “${cell.v}” (line ${out[i].src[0]}).`);
          }
        });
      }
      merged.notes.push({ kind: 'merge', text: `Lines ${merged.src.join(' and ')} merged: same ${why}.` });
      result.push(merged);
    }
    result.sort((a, b) => a.src[0] - b.src[0]);

    // same name, nothing else shared: flag, never merge
    const nameCols = roles.map((r, c) => (r === 'name' ? c : -1)).filter((c) => c >= 0);
    if (nameCols.length) {
      const byName = new Map();
      result.forEach((row) => {
        const n = nameCols.map((c) => fixSpace(row.cells[c].v).toLowerCase()).join(' ').trim();
        if (!n) return;
        if (!byName.has(n)) byName.set(n, []);
        byName.get(n).push(row);
      });
      for (const [, rows2] of byName) if (rows2.length > 1) rows2.forEach((row) => {
        const others = rows2.filter((x) => x !== row).map((x) => x.src[0]);
        row.flags.push(`Same name as line ${others.join(', ')}, but a different email and phone. Possibly the same person; left as separate rows.`);
      });
    }

    let flagged = 0, changed = 0;
    for (const row of result) {
      row.flags = [...new Set(row.flags)];
      row.changed = row.notes.length > 0 || row.src.length > 1 || row.cells.some((c) => c.changes.length);
      if (row.changed) changed++;
      if (row.flags.length) flagged++;
    }
    return { rows: result, counts, flagged, changed, inCount: rows.length };
  }

  function sharedWhy(keyLists) {
    const seen = new Map();
    for (const ks of keyLists) for (const k of ks) seen.set(k, (seen.get(k) || 0) + 1);
    const shared = [...seen].filter(([, n]) => n > 1).map(([k]) => k[0]);
    const e = shared.includes('e'), p = shared.includes('p');
    return e && p ? 'email and phone' : e ? 'email address' : 'phone number';
  }
  function norm(v, role) {
    const t = fixSpace(v).toLowerCase();
    if (role === 'phone') { const r = fixPhone(t); return r.flag ? t : r.v; }
    if (role === 'date') { const r = fixDate(t); return r.flag ? t : r.v; }
    return t;
  }

  window.Tidy = { sniff, parse, toCsv, roleOf, run, KINDS, fixName, fixPhone, fixDate, fixEmail, fixSpace };
})();
