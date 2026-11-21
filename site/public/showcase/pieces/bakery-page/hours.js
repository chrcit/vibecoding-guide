// Fennick's Bakehouse: every opening hour lives in this file.
// Times are wall-clock times in the bakery's own time zone, whatever the
// visitor's computer is set to.

export const BAKERY_TZ = 'Europe/London';

// The regular week. Each day lists its sessions as [open, close, label?].
// A close at or before the open means the session runs past midnight and
// belongs to the day it started on.
export const WEEK = {
  mon: [],
  tue: [['07:30', '15:00']],
  wed: [['07:30', '15:00']],
  thu: [['07:30', '15:00']],
  fri: [['07:30', '15:00'], ['22:00', '01:00', 'Night hatch']],
  sat: [['08:00', '14:00'], ['22:00', '01:00', 'Night hatch']],
  sun: [['09:00', '12:30']],
};

// Public holidays that fall on the same date every year (month-day).
// Their hours replace the regular day.
export const HOLIDAYS = [
  { md: '01-01', name: "New Year's Day", hours: [] },
  { md: '12-25', name: 'Christmas Day', hours: [] },
  { md: '12-26', name: 'Boxing Day', hours: [['09:00', '13:00']], note: 'Leftover-bread pudding by the slice.' },
];

// One-off days. These win over both the regular week and the holidays.
// `to` makes a range of days, inclusive.
export const SPECIAL = [
  { date: '2026-11-28', name: 'Oven service', hours: [['10:00', '14:00']], note: 'Late start while the deck oven is serviced. No night hatch.' },
  { date: '2026-12-24', name: 'Christmas Eve', hours: [['07:00', '14:00']], note: 'Pre-ordered stollen and pies collected until 13:00.' },
  { date: '2026-12-31', name: "New Year's Eve", hours: [['07:30', '15:00'], ['22:00', '02:00', 'Night hatch']], note: 'The hatch opens for the new year and stays open until 02:00.' },
  { date: '2027-01-02', to: '2027-01-05', name: 'Staff holiday', hours: [], note: 'Back on Wednesday 6 January.' },
  { date: '2027-05-15', name: 'Ferrisby street fair', hours: [['07:00', '18:00']], note: 'A stall on Tanner Steps all day. No night hatch.' },
];

// ---------------------------------------------------------------------------
// Calendar helpers. A civil date is {y, m, d} with m from 1 to 12.

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const pad = (n) => String(n).padStart(2, '0');
export const isoDate = ({ y, m, d }) => `${String(y).padStart(4, '0')}-${pad(m)}-${pad(d)}`;
export const parseIsoDate = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  if (!m) return null;
  const date = { y: +m[1], m: +m[2], d: +m[3] };
  return isoDate(addDays(date, 0)) === s ? date : null; // rejects 2026-02-30
};
export function addDays({ y, m, d }, n) {
  const t = new Date(Date.UTC(2000, 0, 1));
  t.setUTCFullYear(y, m - 1, d + n);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}
export function weekday({ y, m, d }) {
  const t = new Date(Date.UTC(2000, 0, 1));
  t.setUTCFullYear(y, m - 1, d);
  return t.getUTCDay();
}
const toMin = (hm) => {
  const [h, mi] = hm.split(':').map(Number);
  return h * 60 + mi;
};

// ---------------------------------------------------------------------------
// Time zones. Everything is computed in real instants (ms since 1970), so that
// "closes in 40 minutes" stays right across midnight and clock changes.

const partsCache = new Map();
function formatter(tz) {
  if (!partsCache.has(tz)) {
    partsCache.set(tz, new Intl.DateTimeFormat('en-GB', {
      timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
    }));
  }
  return partsCache.get(tz);
}

/** The wall clock in `tz` at instant `ms`: {y, m, d, h, min}. */
export function wallClock(ms, tz = BAKERY_TZ) {
  const p = {};
  for (const { type, value } of formatter(tz).formatToParts(new Date(ms))) p[type] = +value;
  return { y: p.year, m: p.month, d: p.day, h: p.hour, min: p.minute, s: p.second };
}

/** Offset of `tz` from UTC at instant `ms`, in ms. */
export function offsetAt(ms, tz = BAKERY_TZ) {
  const w = wallClock(ms, tz);
  const asUtc = new Date(Date.UTC(2000, 0, 1, w.h, w.min, w.s));
  asUtc.setUTCFullYear(w.y, w.m - 1, w.d);
  return asUtc.getTime() - Math.floor(ms / 1000) * 1000;
}

/**
 * The instant at which the wall clock in `tz` shows `minutes` past midnight on
 * `date` (minutes may run past 1440 into the next day). When the clocks go back
 * and a time happens twice, the first one wins. When they go forward and a time
 * never happens, it maps to the moment the clocks jump.
 */
export function instantOf(date, minutes, tz = BAKERY_TZ) {
  const t = new Date(Date.UTC(2000, 0, 1));
  t.setUTCFullYear(date.y, date.m - 1, date.d);
  const naive = t.getTime() + minutes * 60000;
  const DAY = 86400000;
  const offsets = new Set([offsetAt(naive - DAY, tz), offsetAt(naive, tz), offsetAt(naive + DAY, tz)]);
  const fits = [...offsets].map((o) => naive - o).filter((ms) => offsetAt(ms, tz) === naive - ms);
  if (fits.length) return Math.min(...fits);
  // In the gap: use the offset from before the jump, which lands just after it.
  return naive - offsetAt(naive - DAY, tz);
}

// ---------------------------------------------------------------------------
// The schedule.

function specialFor(iso) {
  return SPECIAL.find((s) => (s.to ? iso >= s.date && iso <= s.to : iso === s.date));
}

/** What the bakery does on a civil date, in its own time zone. */
export function daySchedule(date) {
  const iso = isoDate(date);
  const special = specialFor(iso);
  const holiday = HOLIDAYS.find((h) => h.md === iso.slice(5));
  const source = special || holiday;
  const hours = source ? source.hours : WEEK[DAY_KEYS[weekday(date)]];
  const sessions = hours.map(([open, close, label]) => {
    const start = toMin(open);
    let end = toMin(close);
    if (end <= start) end += 1440;
    return { open, close, start, end, label: label || null, overnight: end > 1440 };
  });
  return {
    date,
    iso,
    kind: special ? 'special' : holiday ? 'holiday' : 'regular',
    name: source ? source.name : null,
    note: source ? source.note || null : null,
    sessions,
  };
}

function sessionInstants(day, s) {
  return { ...s, day, startMs: instantOf(day.date, s.start), endMs: instantOf(day.date, s.end) };
}

/**
 * Open or closed at instant `ms`, which session, and the next opening.
 * Yesterday is checked too, because a night session may still be running.
 */
export function statusAt(ms) {
  const here = wallClock(ms);
  const todayDate = { y: here.y, m: here.m, d: here.d };
  const today = daySchedule(todayDate);
  let current = null;
  for (const offset of [-1, 0]) {
    const day = offset ? daySchedule(addDays(todayDate, offset)) : today;
    for (const s of day.sessions) {
      const si = sessionInstants(day, s);
      if (si.startMs <= ms && ms < si.endMs) current = si;
    }
  }
  let next = null;
  for (let i = 0; i <= 400 && !next; i++) {
    const day = i ? daySchedule(addDays(todayDate, i)) : today;
    for (const s of day.sessions) {
      const si = sessionInstants(day, s);
      if (si.startMs > ms && (!next || si.startMs < next.startMs)) next = si;
    }
  }
  return { at: ms, here, today, open: !!current, current, next };
}

/** `n` consecutive days of schedule from `date`. */
export function daysFrom(date, n = 7) {
  return Array.from({ length: n }, (_, i) => daySchedule(addDays(date, i)));
}

/**
 * Holidays and special days from `date` on, up to `count` of them, within a
 * year. A run of days from one entry is listed once, with `until` set.
 */
export function upcoming(date, count = 5) {
  const out = [];
  let prev = null;
  for (let i = 0; i < 366; i++) {
    const day = daySchedule(addDays(date, i));
    if (day.kind === 'regular') { prev = null; continue; }
    if (prev && prev.name === day.name) { prev.until = day.date; continue; }
    if (out.length === count) break;
    prev = { ...day, until: null };
    out.push(prev);
  }
  return out;
}
