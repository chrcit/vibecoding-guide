/*
 * The screen: a schematic of the app the reader types into, beside the picture of what happens
 * behind it. The concept is in site/JOURNEY.md ("The screen").
 *
 * One rule keeps it honest: the screen shows only what someone in the run said, and what the
 * picture is doing at that moment. It never makes up a line.
 *   say(who, text)   a line a chapter script speaks (run.ts forwards ctx.say). Your messages,
 *                    replies, tool results and check runs land here; narration and other people
 *                    (a colleague, a client, users) stay in the caption under the picture.
 *   draw(state)      every scene the picture draws (Scene.onDraw): the app's form, the thread list
 *                    (one row per station, its status read off the station's lamp), a work-log row
 *                    when a tool cube lights, "Working" while the model works. An empty window is an
 *                    empty thread: when the window you talk to is emptied, the screen clears.
 *   ctx.screen       what a chapter may add: the form, a work-log row with the real file name, the
 *                    lines already in the thread, the permission mode, which side to look at.
 * Labels on the T3 Code form come from src/data/t3code.ts (the composer, the thread states, the
 * work log, the permission modes), so they match the app and carry a source.
 */
import type { SceneState, Agent } from './picture';
import { t3code } from '../data/t3code';

/** chat: a chat app (part one, lesson 5). t3: T3 Code, once the model has tools and a project.
 *  term: a coding tool in a terminal. off: no screen; everything is said in the caption. */
export type ScreenForm = 'chat' | 't3' | 'term' | 'off';
/** A row in the work log. `tool` is a tool cube's result, `check` a check's run. */
export type RowKind = 'search' | 'read' | 'edit' | 'run' | 'check';
export interface ScreenSetup {
  form?: ScreenForm;
  /** The app's name in the bar: "Chat", "T3 Code", "Claude Code". */
  app?: string;
  /** The project, on the T3 Code form. */
  project?: string;
  /** Chips on the composer: a model name, a connected drive, a permission mode. */
  chips?: string[];
  /** Threads beside yours, by name, when the picture does not draw them. */
  threads?: { name: string; status?: Status }[];
}
export type Status = 'work' | 'wait' | 'ok' | 'bad' | 'plan' | 'idle' | 'off';
export interface ScreenApi {
  /** Set the form and chrome for this step. Lasts until the reader moves to another step. */
  setup(o: ScreenSetup): void;
  /** A work-log row with the real names in it: row('read', 'Read members.ts', '84 lines'). Once a
   *  chapter adds its own rows, the screen stops making generic ones from the tool cubes. */
  row(kind: RowKind, label: string, detail?: string, state?: 'ok' | 'bad'): void;
  /** What the last row's tool gave back, on that row: result('1 of 12 tests fails', 'bad'). */
  result(text: string, state?: 'ok' | 'bad'): void;
  /** Lines already in the thread when a step starts part-way into a conversation. */
  history(lines: [who: string, text: string][]): void;
  /** Which side to look at: the screen alone (the picture dims), or both. */
  focus(on: 'screen' | 'both'): void;
}

const D = t3code.screen;
const [WORKING, COMPLETED, , AWAITING_INPUT, PLAN_READY] = D.statuses.value;
const [SEARCHED, READ, CHANGED, RAN] = D.workLog.value;
/** What the sidebar says for each state, from T3 Code's own sidebar. A failed station has no word there. */
const STATUS_WORD: Partial<Record<Status, string>> = { work: WORKING, wait: AWAITING_INPUT, ok: COMPLETED, plan: PLAN_READY };
/** A lit tool cube, as the work log names it when the chapter has not named the file. */
const TOOL_ROW: Record<string, string> = { search: SEARCHED, read: READ, edit: CHANGED, write: CHANGED, run: RAN };
/** Speakers who are not in your app: they stay in the caption. */
const ELSEWHERE = /^(a colleague|a client|a user|users?|coach|treasurer|server)$/i;
const CHECK = /^(the )?check\b|^test run$|^judge$/i;
const TOOLISH = /^(tool|progress)$/i;
/** Speakers who are just "the model": no name above their reply. */
const PLAIN_MODEL = /^(the )?(model|agent)$/i;
const MAX_ROWS = 40;

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, text?: string) => {
  const e = document.createElement(tag);
  e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};

/** "[a photo of the sheet] Type this up." → attachments ['a photo of the sheet'], text 'Type this up.' */
function attachments(text: string) {
  const files: string[] = [];
  const rest = text.replace(/\[([^\]]+)\]/g, (_, f: string) => { files.push(f.trim()); return ''; }).replace(/\s{2,}/g, ' ').trim();
  return { files, text: rest };
}

/** A thread's title, the way an app names a thread after its first message. */
function titleOf(text: string) {
  const t = attachments(text).text || attachments(text).files[0] || '';
  if (t.length <= 30) return t.replace(/[.?!]$/, '');
  const cut = t.slice(0, 30);
  return cut.slice(0, cut.lastIndexOf(' ') > 12 ? cut.lastIndexOf(' ') : 30) + '…';
}

export function statusOf(a: Agent): Status {
  if (a.off) return 'off';
  if (a.lamp === 'bad') return 'bad';
  if (a.busy || a.lamp === 'work') return 'work';
  if (a.lamp === 'wait') return 'wait';
  if (a.lamp === 'ok') return 'ok';
  return 'idle';
}

export class Screen implements ScreenApi {
  private log: HTMLElement;
  private side: HTMLElement;
  private appEl: HTMLElement;
  private titleEl: HTMLElement;
  private chipsEl: HTMLElement;
  private phEl: HTMLElement;
  private working: HTMLElement;
  private conf: ScreenSetup = {};
  private form: ScreenForm = 'chat';
  private title = '';
  /** Your station's label in the picture, which names your thread until your first message does. */
  private mainName = '';
  private threadsOnly = false;
  private ownRows = false;
  private toolOn: string | null = null;
  private filled = 0;
  private last?: SceneState;

  constructor(private root: HTMLElement, private stage: { focus(on: 'screen' | 'both'): void }) {
    this.log = root.querySelector('[data-scr-log]')!;
    this.side = root.querySelector('[data-scr-side]')!;
    this.appEl = root.querySelector('[data-scr-app]')!;
    this.titleEl = root.querySelector('[data-scr-title]')!;
    this.chipsEl = root.querySelector('[data-scr-chips]')!;
    this.phEl = root.querySelector('[data-scr-ph]')!;
    this.working = el('li', 'j-scr-working', WORKING);
    this.working.dataset.b = 'busy';
    // A list drawn for one size is cut for another: on a resize, draw it again and fit it again.
    new ResizeObserver(() => { delete this.side.dataset.sig; if (this.last) this.drawThreads(this.last, mainOf(this.last)); }).observe(this.side);
  }

  get on() { return this.form !== 'off'; }

  /** A new step: an empty thread, the chrome back to what the picture implies. */
  reset() {
    this.conf = {};
    this.ownRows = false;
    // The scene redrawn below is the last step's: a tool lit there is not a row in this thread.
    this.toolOn = this.last?.tools?.on ?? null;
    this.clear();
    this.stage.focus('both');
    if (this.last) this.draw(this.last);
  }

  /** An empty thread. */
  clear() {
    this.log.replaceChildren();
    this.title = '';
    this.renderTitle();
    this.markEmpty();
  }

  /** A script started. A thread with nothing in its window has nothing on screen either. */
  runStarted(s: SceneState) {
    // A run that replaced one looking at the screen alone starts with both in view.
    this.stage.focus('both');
    const main = mainOf(s);
    if (main && !(main.blocks ?? []).length) this.clear();
  }

  setup(o: ScreenSetup) {
    this.conf = { ...this.conf, ...o };
    if (this.last) this.draw(this.last);
  }

  focus(on: 'screen' | 'both') { this.stage.focus(on); }

  history(lines: [string, string][]) {
    for (const [who, text] of lines) this.say(who, text, true);
  }

  row(kind: RowKind, label: string, detail?: string, state?: 'ok' | 'bad') {
    this.ownRows = true;
    if (!this.on) return;
    this.push(this.workRow(kind, label, detail, state));
  }

  result(text: string, state?: 'ok' | 'bad', quiet = false) {
    if (!this.on) return;
    // The result of the tool that just ran goes on that tool's row.
    const last = (this.log.lastElementChild === this.working ? this.working.previousElementSibling : this.log.lastElementChild) as HTMLElement | null;
    if (last?.classList.contains('j-scr-row') && last.dataset.kind !== 'check' && last.querySelectorAll('.j-scr-detail').length < 2) {
      last.append(el('span', 'j-scr-detail', text));
      if (state === 'bad') last.dataset.b = 'bad';
      this.scroll();
      return;
    }
    this.push(this.workRow('read', text, undefined, state), quiet);
  }

  /** A line someone said. True when the screen showed it, so the caption need not. */
  say(who: string, text: string, quiet = false): boolean {
    if (!this.on || !text) return false;
    // Several jobs, each its own thread: what one job says belongs in that job's thread, which the
    // screen does not open. The screen keeps the thread list; the lines go to the caption.
    if (this.threadsOnly) return false;
    const name = who.trim();
    if (ELSEWHERE.test(name)) return false;
    if (name === 'you') {
      const { files, text: t } = attachments(text);
      const li = el('li', 'j-scr-you');
      li.dataset.b = 'you';
      if (files.length) {
        const f = el('span', 'j-scr-files');
        f.append(...files.map((x) => el('span', 'j-scr-file', x)));
        li.append(f);
      }
      if (t) li.append(el('span', 'j-scr-text', t));
      if (!this.title) { this.title = titleOf(text); this.renderTitle(); }
      this.push(li, quiet);
      return true;
    }
    if (CHECK.test(name)) {
      const gate = this.last?.gates?.[0]?.lamp;
      const state = gate === 'ok' ? 'ok' : gate === 'bad' ? 'bad' : undefined;
      this.push(this.workRow('check', name.replace(/^the /, ''), text, state), quiet);
      return true;
    }
    if (TOOLISH.test(name)) { this.result(text, undefined, quiet); return true; }
    const li = el('li', 'j-scr-reply');
    li.dataset.b = 'model';
    if (!PLAIN_MODEL.test(name)) li.append(el('b', 'j-scr-who', name));
    li.append(el('span', 'j-scr-text', text));
    this.push(li, quiet);
    return true;
  }

  /** Every scene the picture draws. */
  draw(s: SceneState) {
    const main = mainOf(s);
    this.threadsOnly = !s.agents.some((a) => a.id === 'a0') && s.agents.length > 1;
    if (this.threadsOnly && this.log.children.length) { this.log.replaceChildren(); this.markEmpty(); }
    const filled = (main?.blocks ?? []).length;
    if (this.last && this.filled > 0 && filled === 0) this.clear();
    this.filled = filled;
    this.last = s;

    const form = this.conf.form ?? (s.tools || s.project || s.projects?.length ? 't3' : 'chat');
    if (form !== this.form) { this.form = form; this.root.dataset.form = form; }
    this.root.hidden = form === 'off';
    const app = this.conf.app ?? (form === 't3' ? 'T3 Code' : form === 'term' ? 'Terminal' : 'Chat');
    if (this.appEl.textContent !== app) this.appEl.textContent = app;
    this.renderTitle();
    // T3 Code's composer says "Ask anything..."; a chat app is drawn with a plain one.
    const ph = form === 't3' ? D.composer.value : form === 'term' ? '>' : 'Message';
    if (this.phEl.textContent !== ph) this.phEl.textContent = ph;
    const chips = this.conf.chips ?? [];
    if (this.chipsEl.dataset.chips !== chips.join('|')) {
      this.chipsEl.dataset.chips = chips.join('|');
      this.chipsEl.replaceChildren(...chips.map((c) => el('span', 'j-scr-chip', c)));
    }
    this.drawThreads(s, main);

    // A tool cube that lights is a row in the work log, unless the chapter writes its own: it may
    // name the file in the same tick, so the generic row waits for that tick to end.
    const on = s.tools?.on ?? null;
    if (on && on !== this.toolOn && !this.ownRows && this.on) {
      queueMicrotask(() => { if (!this.ownRows && this.on) this.push(this.workRow(on as RowKind, TOOL_ROW[on] ?? on)); });
    }
    this.toolOn = on;

    const busy = !!main && main.agentBusy;
    if (busy && this.on && !this.threadsOnly) { if (this.log.lastElementChild !== this.working) { this.log.append(this.working); this.scroll(); } }
    else this.working.remove();
  }

  private renderTitle() {
    const t = this.form === 't3' ? [this.conf.project, this.title || this.mainName || D.newThread.value].filter(Boolean).join(' · ') : this.title;
    if (this.titleEl.textContent !== t) this.titleEl.textContent = t ?? '';
  }

  /** The thread list: yours, then one per other station, its state read off the picture. */
  private drawThreads(s: SceneState, main: (Agent & { agentBusy: boolean }) | undefined) {
    const rows: { name: string; status: Status; me: boolean; quiet?: boolean }[] = [];
    this.mainName = '';
    const others = s.agents.filter((a) => a.id !== main?.id);
    if (this.form === 't3' && (others.length || this.conf.threads?.length)) {
      const labelOf = (id: string) => s.labels?.find((l) => l.at === id && l.text)?.text;
      // Your thread is named after your first message; before that, after its station's label.
      this.mainName = (main && labelOf(main.id)) || '';
      this.renderTitle();
      rows.push({ name: this.title || this.mainName || D.newThread.value, status: main ? statusOf(main) : 'idle', me: true });
      let helper = 0, job = 1;
      for (const a of others) {
        const name = a.id === 'r0' ? (labelOf('r0') ?? 'reviewer')
          : a.id.startsWith('j') ? (labelOf(a.id) ?? `job ${++job}`)
          : (labelOf(a.id) ?? `helper ${++helper}`);
        // A helper whose lamp waits has handed its work in and waits for the lead, not for you:
        // the dot stays blue, as in the picture, but T3 Code's "Awaiting Input" would be wrong.
        rows.push({ name, status: statusOf(a), me: false, quiet: a.id.startsWith('w') && statusOf(a) === 'wait' });
      }
      for (const t of this.conf.threads ?? []) rows.push({ name: t.name, status: t.status ?? 'idle', me: false });
    }
    // With nothing in your thread to read, the thread list has the whole screen.
    const cap = this.root.hasAttribute('data-empty') ? 24 : 7;
    const sig = cap + rows.map((r) => `${r.name}:${r.status}`).join('|');
    if (this.side.dataset.sig === sig) return;
    this.side.dataset.sig = sig;
    this.side.hidden = !rows.length;
    this.root.toggleAttribute('data-threads', rows.length > 0);
    const shown = rows.slice(0, rows.length > cap ? cap - 1 : cap);
    const items = shown.map((r) => {
      const li = el('li', 'j-scr-thread');
      li.dataset.s = r.status;
      if (r.me) li.setAttribute('aria-current', 'true');
      li.append(el('span', 'j-scr-tname', r.name));
      const word = r.quiet ? undefined : STATUS_WORD[r.status];
      if (word) li.append(el('span', 'j-scr-status', word));
      return li;
    });
    if (rows.length > shown.length) items.push(el('li', 'j-scr-thread j-scr-more', `+${rows.length - shown.length} more`));
    this.side.replaceChildren(...items);
    this.fitThreads(rows.length);
  }

  /** Fewer threads fit than the cap allows (a phone, a short frame): drop the last ones until the
   *  list fits, and say how many are not shown rather than cut a row in half. */
  private fitThreads(total: number) {
    const side = this.side;
    if (side.hidden || !side.clientHeight) return;
    let more = side.querySelector<HTMLElement>('.j-scr-more');
    while (side.scrollHeight > side.clientHeight + 1) {
      const last = [...side.querySelectorAll<HTMLElement>('.j-scr-thread:not(.j-scr-more):not([aria-current])')].at(-1);
      if (!last) break;
      last.remove();
      if (!more) { more = el('li', 'j-scr-thread j-scr-more'); side.append(more); }
      more.textContent = `+${total - side.querySelectorAll('.j-scr-thread:not(.j-scr-more)').length} more`;
    }
  }

  private workRow(kind: RowKind, label: string, detail?: string, state?: 'ok' | 'bad') {
    const li = el('li', 'j-scr-row');
    li.dataset.kind = kind;
    li.dataset.b = state === 'bad' ? 'bad' : kind === 'check' && state === 'ok' ? 'rules' : 'tool';
    li.append(el('span', 'j-scr-label', label));
    if (detail) li.append(el('span', 'j-scr-detail', detail));
    return li;
  }

  private push(li: HTMLElement, quiet = false) {
    if (quiet) li.dataset.quiet = '';
    const busy = this.working.isConnected;
    this.working.remove();
    this.log.append(li);
    if (busy) this.log.append(this.working);
    while (this.log.children.length > MAX_ROWS) this.log.firstElementChild!.remove();
    this.scroll();
  }

  /** Marks a thread with nothing in it yet, so the layout can give the room to the thread list. */
  private markEmpty() {
    const empty = ![...this.log.children].some((c) => c !== this.working);
    if (empty === this.root.hasAttribute('data-empty')) return;
    this.root.toggleAttribute('data-empty', empty);
    if (this.last) this.drawThreads(this.last, mainOf(this.last));
  }

  private scroll() {
    this.markEmpty();
    const box = this.log.parentElement!;
    box.scrollTop = box.scrollHeight;
  }
}

/** The window you talk to: the agent `a0`, or the first job. */
function mainOf(s: SceneState): (Agent & { agentBusy: boolean }) | undefined {
  const a = s.agents.find((x) => x.id === 'a0') ?? s.agents[0];
  return a ? { ...a, agentBusy: !!(a.busy || a.lamp === 'work') } : undefined;
}
