// Fig. 4, same prompt, with and without context: the holiday hours bug sent twice with the same
// one-line request. Once the agent has only that line and the code; once it also has what the
// guide says to give it. The two outcomes are written to illustrate the difference, not recorded
// from a run, and the figure says so.

export type Mode = 'bare' | 'context';

export const PROMPT = 'The opening hours are wrong on holidays. Fix it.';

/** What the agent could see on top of the prompt and the code, in the order they appear. */
export const CONTEXT_ITEMS = [
  { id: 'list', name: 'the holiday list' },
  { id: 'shot', name: 'a screenshot of the wrong page' },
  { id: 'agents', name: 'AGENTS.md with the test command' },
  { id: 'done', name: 'a note of what done looks like' },
] as const;

export const MODES: Record<Mode, { label: string; sheets: number; lamp: 'off' | 'pass'; says: string }> = {
  bare: {
    label: 'Bare prompt',
    sheets: 1,
    lamp: 'off',
    says: `The agent has the request, “${PROMPT}”, and the code. It guesses that holidays means Christmas, adds 25 December to the page as closed, and reports the bug fixed. Easter Monday still shows the normal hours, and nothing was run to check.`,
  },
  context: {
    label: 'With context',
    sheets: 3,
    lamp: 'pass',
    says: `Same request. This time the agent can also see ${CONTEXT_ITEMS.map((c) => c.name).slice(0, -1).join(', ')} and ${CONTEXT_ITEMS.at(-1)!.name}. It finds that the list and the page write dates differently, fixes the lookup, adds tests for 25 December, Easter Monday and an ordinary Tuesday, and shows them passing.`,
  },
};

export const ALT =
  'A workbench. On it: a box of code, a card with the one-line request, an empty orange tray for anything else it is given, and on the right a tray holding one changed sheet beside an unlit check lamp.';
