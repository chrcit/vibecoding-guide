import { BAKERY_TZ, statusAt, daysFrom, upcoming, wallClock, offsetAt, instantOf, parseIsoDate, isoDate, weekday } from './hours.js';

const $ = (id) => document.getElementById(id);
const visitorTz = (() => {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || BAKERY_TZ; } catch { return BAKERY_TZ; }
})();

const pad = (n) => String(n).padStart(2, '0');
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dow = weekday;
const dayIndex = (date) => { const t = new Date(Date.UTC(2000, 0, 1)); t.setUTCFullYear(date.y, date.m - 1, date.d); return Math.round(t.getTime() / 86400000); };

const timeIn = (ms, tz) => {
  const w = wallClock(ms, tz);
  return `${pad(w.h)}:${pad(w.min)}`;
};
const longDate = (date, withYear = true) => `${DAYS[dow(date)]} ${date.d} ${MONTHS[date.m - 1]}${withYear ? ' ' + date.y : ''}`;

function relDay(target, ref) {
  const diff = dayIndex(target) - dayIndex(ref);
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff > 1 && diff < 7) return `on ${DAYS[dow(target)]}`;
  return `on ${longDate(target, target.y !== ref.y)}`;
}

function duration(ms) {
  const mins = Math.max(1, Math.round(ms / 60000));
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h < 24) return m ? `${h} h ${m} min` : `${h} h`;
  const d = Math.floor(h / 24), rh = h % 24;
  if (d < 3) return `${d} day${d > 1 ? 's' : ''}${rh ? ` ${rh} h` : ''}`;
  return `${Math.round(mins / 1440)} days`;
}

// The visitor's own clock, when it differs from the bakery's at that instant.
function yourTime(ms, refMs) {
  if (visitorTz === BAKERY_TZ || offsetAt(ms, visitorTz) === offsetAt(ms, BAKERY_TZ)) return '';
  const vw = wallClock(ms, visitorTz), bw = wallClock(ms, BAKERY_TZ);
  const sameDay = vw.y === bw.y && vw.m === bw.m && vw.d === bw.d;
  return `${pad(vw.h)}:${pad(vw.min)}${sameDay ? '' : ' on ' + DAYS[dow(vw)]} where you are`;
}

function sessionText(s) {
  return `${s.open} to ${s.close}`;
}

// ---------------------------------------------------------------------------
const state = { at: null }; // null means "now"

function readUrl() {
  const p = new URLSearchParams(location.search).get('at');
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/.exec(p || '');
  if (!m) return;
  const date = parseIsoDate(m[1]);
  if (!date || +m[2] > 23 || +m[3] > 59) return;
  state.at = instantOf(date, +m[2] * 60 + +m[3]);
  state.asked = { date, h: +m[2], min: +m[3] };
}

function writeUrl() {
  let q = '';
  if (state.at != null) { const w = wallClock(state.at); q = `?at=${isoDate(w)}T${pad(w.h)}:${pad(w.min)}`; }
  try { history.replaceState(null, '', location.pathname + q + location.hash); } catch { /* sandboxed frames may refuse */ }
}

function render() {
  const now = Date.now();
  const at = state.at ?? now;
  const s = statusAt(at);
  const ref = { y: s.here.y, m: s.here.m, d: s.here.d };
  const hero = document.querySelector('.hero');
  hero.dataset.state = s.open ? 'open' : 'closed';
  hero.dataset.hatch = s.open && s.current.label === 'Night hatch' ? 'on' : 'off';
  $('plaque').textContent = s.open ? 'OPEN' : 'CLOSED';

  // What moment we are showing.
  const viewing = $('viewing');
  if (state.at != null) {
    let txt = `Showing ${longDate(ref)} at ${pad(s.here.h)}:${pad(s.here.min)}, Ferrisby time.`;
    const a = state.asked;
    if (a && (a.h !== s.here.h || a.min !== s.here.min) && isoDate(a.date) === isoDate(ref)) {
      txt += ` ${pad(a.h)}:${pad(a.min)} does not exist that night: the clocks go forward.`;
    }
    viewing.textContent = txt;
    viewing.hidden = false;
  } else viewing.hidden = true;

  $('status-word').textContent = s.open ? 'Open' : 'Closed';
  let line, sub;
  if (s.open) {
    const c = s.current;
    const endDay = wallClock(c.endMs);
    const afterMidnight = endDay.d !== ref.d;
    line = `${c.label ? c.label + ', until ' : 'Until '}${c.close}${afterMidnight && c.day.iso === s.today.iso ? ' tonight' : ''}`;
    const yt = yourTime(c.endMs);
    sub = `Closes in ${duration(c.endMs - at)}.`;
    if (yt) sub += ` That is ${yt}.`;
  } else if (s.next) {
    const n = s.next;
    const nd = n.day.date;
    const nowMin = s.here.h * 60 + s.here.min;
    const word = dayIndex(nd) === dayIndex(ref) && s.today.sessions.some((x) => x.end <= nowMin) ? 'again ' : '';
    line = `Opens ${word}${relDay(nd, ref)} at ${n.open}${n.label ? ', ' + n.label.toLowerCase() : ''}`;
    const yt = yourTime(n.startMs);
    sub = `In ${duration(n.startMs - at)}.`;
    if (yt) sub += ` That is ${yt}.`;
  } else {
    line = 'No opening in the next year';
    sub = '';
  }
  $('status-line').textContent = line;
  $('status-sub').textContent = sub;

  // A note when today is not an ordinary day.
  const note = $('status-note');
  const t = s.today;
  if (t.kind !== 'regular') {
    const hours = t.sessions.length ? t.sessions.map(sessionText).join(' and ') : 'closed all day';
    note.innerHTML = '';
    const b = document.createElement('strong');
    b.textContent = `${t.name}: ${hours}.`;
    note.append(b);
    let extra = t.note || '';
    if (s.open && s.current.day.iso !== t.iso) {
      const from = s.current.day.name || `${DAYS[dow(s.current.day.date)]} night`;
      extra = `The ${s.current.label ? s.current.label.toLowerCase() : 'late session'} from ${from} is still open until ${s.current.close}. ${extra}`;
    }
    if (extra) note.append(' ' + extra.trim());
    note.hidden = false;
  } else note.hidden = true;

  // Time zone line.
  const tz = $('tz-note');
  if (visitorTz !== BAKERY_TZ && offsetAt(at, visitorTz) !== offsetAt(at, BAKERY_TZ)) {
    const diffH = (offsetAt(at, visitorTz) - offsetAt(at, BAKERY_TZ)) / 3600000;
    const abs = Math.abs(diffH);
    const n = Number.isInteger(abs) ? abs : abs.toFixed(1).replace(/\.0$/, '');
    tz.textContent = `All times are Ferrisby time (UK). Your device is set to ${visitorTz.replace(/_/g, ' ')}, ${n} hour${abs === 1 ? '' : 's'} ${diffH > 0 ? 'ahead' : 'behind'}.`;
  } else tz.textContent = 'All times are Ferrisby time (UK).';

  // The week.
  const week = $('week');
  week.replaceChildren(...daysFrom(ref, 7).map((day, i) => {
    const li = document.createElement('li');
    li.className = 'day';
    if (i === 0) li.classList.add('is-today');
    if (day.kind !== 'regular') li.classList.add('is-changed');
    const name = document.createElement('span'); name.className = 'day-name'; name.textContent = DAYS[dow(day.date)];
    const date = document.createElement('span'); date.className = 'day-date'; date.textContent = `${day.date.d} ${MONTHS[day.date.m - 1].slice(0, 3)}${day.date.y !== ref.y ? ' ' + day.date.y : ''}`;
    li.append(name, date);
    if (i === 0) { const mark = document.createElement('span'); mark.className = 'day-mark'; mark.textContent = state.at == null ? 'Today' : 'Chosen day'; li.append(mark); }
    if (day.sessions.length) {
      const ul = document.createElement('ul'); ul.className = 'day-hours';
      for (const sess of day.sessions) {
        const it = document.createElement('li');
        it.textContent = sessionText(sess);
        if (sess.label) { const lab = document.createElement('span'); lab.className = 'lab'; lab.textContent = sess.label; it.append(lab); }
        ul.append(it);
      }
      li.append(ul);
    } else {
      const c = document.createElement('span'); c.className = 'day-closed'; c.textContent = 'Closed'; li.append(c);
    }
    if (day.name) { const tag = document.createElement('span'); tag.className = 'day-tag'; tag.textContent = day.name; li.append(tag); }
    return li;
  }));
  $('hours-h').textContent = state.at == null ? 'The next seven days' : `Seven days from ${DAYS[dow(ref)]} ${ref.d} ${MONTHS[ref.m - 1]}`;

  // Holidays and changes.
  const list = upcoming(ref, 5);
  const sp = $('special');
  sp.replaceChildren(...list.map((day) => {
    const li = document.createElement('li');
    const d = document.createElement('span'); d.className = 'sp-date';
    const short = (x) => `${x.d} ${MONTHS[x.m - 1].slice(0, 3)}${x.y !== ref.y ? ' ' + x.y : ''}`;
    d.textContent = day.until ? `${short(day.date)} to ${short(day.until)}` : short(day.date);
    const body = document.createElement('span');
    const nm = document.createElement('span'); nm.className = 'sp-name'; nm.textContent = day.name;
    const hrs = document.createElement('span'); hrs.className = 'sp-hours';
    hrs.textContent = day.sessions.length ? day.sessions.map((x) => sessionText(x) + (x.label ? ` (${x.label.toLowerCase()})` : '')).join(', ') : 'Closed';
    body.append(nm, hrs);
    li.append(d, body);
    return li;
  }));
  if (!list.length) sp.innerHTML = '<li>No holidays or changes in the next year.</li>';

  $('check-now').disabled = state.at == null;
  if (state.at == null) {
    // Keep the form showing "now" until the visitor touches it.
    const f = $('check');
    if (!f.dataset.touched) {
      $('check-date').value = isoDate(ref);
      $('check-time').value = `${pad(s.here.h)}:${pad(s.here.min)}`;
    }
  }
}

// ---------------------------------------------------------------------------
const form = $('check');
form.addEventListener('input', () => { form.dataset.touched = '1'; });
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const dateEl = $('check-date'), timeEl = $('check-time'), err = $('check-error');
  dateEl.removeAttribute('aria-invalid'); timeEl.removeAttribute('aria-invalid');
  err.textContent = '';
  const date = parseIsoDate(dateEl.value);
  if (!date) {
    err.textContent = dateEl.value ? 'That is not a real date.' : 'Pick a date first.';
    dateEl.setAttribute('aria-invalid', 'true');
    dateEl.focus();
    return;
  }
  if (date.y < 1900 || date.y > 2199) {
    err.textContent = 'Pick a date between the years 1900 and 2199.';
    dateEl.setAttribute('aria-invalid', 'true');
    dateEl.focus();
    return;
  }
  let h = 12, min = 0;
  if (timeEl.value) {
    const m = /^(\d{2}):(\d{2})/.exec(timeEl.value);
    if (!m || +m[1] > 23 || +m[2] > 59) {
      err.textContent = 'That time does not look right. Use hours and minutes, like 07:30.';
      timeEl.setAttribute('aria-invalid', 'true');
      timeEl.focus();
      return;
    }
    h = +m[1]; min = +m[2];
  } else timeEl.value = '12:00';
  state.at = instantOf(date, h * 60 + min);
  state.asked = { date, h, min };
  writeUrl();
  render();
  const heading = $('status-h');
  heading.setAttribute('tabindex', '-1');
  heading.focus();
});
$('check-now').addEventListener('click', () => {
  state.at = null; state.asked = null;
  delete form.dataset.touched;
  $('check-error').textContent = '';
  writeUrl();
  render();
  $('check-date').focus();
});

readUrl();
render();
if (state.at != null) {
  form.dataset.touched = '1';
  const w = wallClock(state.at);
  $('check-date').value = isoDate(w);
  $('check-time').value = `${pad(w.h)}:${pad(w.min)}`;
}
setInterval(() => { if (state.at == null && !document.hidden) render(); }, 20000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && state.at == null) render(); });
