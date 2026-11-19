// Fig. 65, one request through the six layers. The holiday hours bug, sent by you, travelling
// through the interface, the context, the harness and the model, past the permission gate and
// the check, and back to you. Four scenarios change the route. The drawing, the sentence and
// the numbers all read from the steps built here, so they cannot disagree.
//
// Every number here is an assumption made for the picture, not a measurement. They are listed
// in the long read under "How the model works" (src/pages/read.astro). Change them there too.

/** Tokens the harness loads before you type: instructions file, tool list, skill descriptions. */
export const STARTUP_TOKENS = 12_000;
/** Your request, a few sentences. */
export const REQUEST_TOKENS = 150;
/** The hours page, read in full. */
export const FILE_TOKENS = 2_400;
/** One edit: the model's change plus the harness's confirmation. */
export const EDIT_TOKENS = 600;
/** The output of one test run. */
export const TEST_TOKENS = 900;
/** Your answer when the harness asks before an action. */
export const APPROVAL_TOKENS = 20;
/** The model's closing summary. */
export const SUMMARY_TOKENS = 250;
/** Threads running beside this one in the "Three at once" scenario. */
export const OTHER_THREADS = 2;

export type Spot = 'you' | 'context' | 'harness' | 'model' | 'gate' | 'check';
export type LayerId = 'interface' | 'context' | 'harness' | 'model' | 'governance' | 'emergence';
export type Lamp = 'off' | 'fail' | 'pass';
export type Scenario = 'test' | 'none' | 'ask' | 'three';

export const SCENARIOS: { id: Scenario; name: string }[] = [
  { id: 'test', name: 'With a test' },
  { id: 'none', name: 'No test' },
  { id: 'ask', name: 'Asks first' },
  { id: 'three', name: 'Three at once' },
];

export const LAYERS: { id: LayerId; name: string }[] = [
  { id: 'interface', name: 'Interface' },
  { id: 'context', name: 'Context' },
  { id: 'harness', name: 'Harness' },
  { id: 'model', name: 'Model' },
  { id: 'governance', name: 'Governance' },
  { id: 'emergence', name: 'Emergence' },
];

/** Which layer each spot belongs to, for the label that lights up. */
export const LAYER_OF: Record<Spot, LayerId> = {
  you: 'interface', context: 'context', harness: 'harness', model: 'model', gate: 'governance', check: 'governance',
};

export interface Step {
  at: Spot;
  says: string;
  lamp: Lamp;
  /** The permission gate is open. */
  gate: boolean;
  /** The model is writing. */
  core: boolean;
  /** Blocks in the window, oldest first. */
  blocks: number;
  /** Tokens in the window now. */
  tokens: number;
  /** Model calls so far. Each one sends the whole window. */
  calls: number;
  /** Tool calls the harness has run. */
  tools: number;
  /** Times the work stopped for you: approvals and the final review. */
  waits: number;
  /** Other threads' results waiting for you. */
  others: number;
  /** The light under the check: 'none' when nothing has been checked. */
  checked: 'none' | 'fail' | 'pass';
}

/** Builds a scenario's steps, carrying the running totals from one step to the next. */
function build(scenario: Scenario): Step[] {
  const out: Step[] = [];
  let s: Step = { at: 'you', says: '', lamp: 'off', gate: false, core: false, blocks: 0, tokens: 0, calls: 0, tools: 0, waits: 0, others: 0, checked: 'none' };
  /** `add` tokens arrive as a new block in the window, or join the last one with `block: false`. */
  const put = (patch: Partial<Step>, add = 0, block = true) => {
    s = { ...s, lamp: 'off', gate: false, core: false, ...patch };
    if (add) { s.blocks += block ? 1 : 0; s.tokens += add; }
    out.push(s);
  };
  const ask = scenario === 'ask';
  const approve = (what: string) => {
    if (!ask) return;
    put({ at: 'you', says: `The mode asks first. The harness stops and asks you: ${what}`, waits: s.waits + 1 }, APPROVAL_TOKENS, false);
  };

  put({ at: 'you', says: 'You ask: the bakery’s site shows normal hours on 25 December. Fix it.' });
  put({ at: 'context', says: 'Your message joins the window, after the instructions and tool list the harness loaded at the start.', tokens: STARTUP_TOKENS, blocks: 1 }, REQUEST_TOKENS);
  put({ at: 'model', core: true, calls: s.calls + 1, says: 'The harness sends the whole window to the model. It answers with a tool call: read the hours page.' });
  approve('may it read the hours page?');
  put({ at: 'gate', gate: true, tools: s.tools + 1, says: ask ? 'You said yes. The harness reads the file.' : 'The permission mode allows reading, so the harness runs the call without asking you.' });
  put({ at: 'context', says: 'The page’s code goes into the window.' }, FILE_TOKENS);
  put({ at: 'model', core: true, calls: s.calls + 1, says: 'Second call, the whole window again. The model writes an edit: check today against the holiday list.' });
  approve('may it edit the hours page?');
  put({ at: 'gate', gate: true, tools: s.tools + 1, says: 'The edit passes the gate and lands in the project.' }, EDIT_TOKENS);

  if (scenario === 'none') {
    put({ at: 'model', core: true, calls: s.calls + 1, says: 'Third call. Nothing told the model to test, so it writes a summary: fixed.' });
    put({ at: 'you', waits: s.waits + 1, says: 'It says fixed. Nothing opened the page on 25 December, and the two date formats still do not match.' }, SUMMARY_TOKENS);
    return out;
  }

  approve('may it run the tests?');
  put({ at: 'check', lamp: 'fail', checked: 'fail', tools: s.tools + 1, says: 'The test for 25 December fails: the list writes 25/12/2026, the page looks for 2026-12-25.' }, TEST_TOKENS);
  put({ at: 'model', core: true, calls: s.calls + 1, says: 'Third call. The failure is in the window now, so the model can see what went wrong. It makes both dates match.' });
  approve('may it edit the hours page again?');
  put({ at: 'gate', gate: true, tools: s.tools + 1, says: 'The second edit passes the gate.' }, EDIT_TOKENS);
  approve('may it run the tests again?');
  put({ at: 'check', lamp: 'pass', checked: 'pass', tools: s.tools + 1, says: 'The test passes: Closed on 25 December, the usual hours on an ordinary Tuesday.' }, TEST_TOKENS);
  put({ at: 'model', core: true, calls: s.calls + 1, says: 'Last call. The model writes a summary of what it changed and why.' });

  if (scenario === 'three') {
    put({
      at: 'you', waits: s.waits + 1, others: OTHER_THREADS, checked: 'pass',
      says: 'Two other threads finish in the same minute. Three diffs wait for one reviewer: you.',
    }, SUMMARY_TOKENS);
    return out;
  }
  put({
    at: 'you', waits: s.waits + 1, checked: 'pass',
    says: ask
      ? `Back to you with a summary and the diff. The same fix stopped ${s.waits} times for your answer; while you were away, it waited.`
      : 'Back to you with a summary and the diff. Your review is the last check, and the only one that knows what you meant.',
  }, SUMMARY_TOKENS);
  return out;
}

export const STEPS: Record<Scenario, Step[]> = {
  test: build('test'),
  none: build('none'),
  ask: build('ask'),
  three: build('three'),
};

export const MAX_BLOCKS = Math.max(...Object.values(STEPS).flat().map((s) => s.blocks));

/** Readable token count: 15.3K. */
export const ktok = (n: number) => (n >= 1000 ? `${(Math.round(n / 100) / 10).toLocaleString('en-GB')}K` : String(n));

/** The numbers under the drawing, as text. */
export function stats(s: Step) {
  return {
    calls: String(s.calls),
    tools: String(s.tools),
    tokens: s.tokens ? ktok(s.tokens) : '0',
    waits: String(s.waits + s.others),
    checked: s.checked === 'pass' ? 'Passed' : s.checked === 'fail' ? 'Failed' : 'No',
  };
}

/**
 * Fig. 67: what each model call sends. Every call sends the whole window; the part the previous
 * call already sent is what a prompt cache can serve.
 */
export function callsOf(scenario: Scenario): { repeat: number; fresh: number }[] {
  const out: { repeat: number; fresh: number }[] = [];
  let last = 0;
  for (const s of STEPS[scenario]) {
    if (s.at === 'model' && s.core) {
      out.push({ repeat: last, fresh: s.tokens - last });
      last = s.tokens;
    }
  }
  return out;
}
