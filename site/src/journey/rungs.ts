// The nine steps of the journey, in order. Each adds one thing to the same picture.
export interface Rung { id: string; n: number; title: string; short: string; line: string }

export const rungs: Rung[] = [
  { id: 'chat', n: 1, title: 'One chat', short: 'Chat', line: 'You type, it answers. The window is all it knows.' },
  { id: 'loop', n: 2, title: 'It gets hands', short: 'Loop', line: 'With tools it keeps going by itself until the job is done.' },
  { id: 'window', n: 3, title: 'The window fills', short: 'Window', line: 'Everything it reads piles up. When the window is full, something has to go.' },
  { id: 'memory', n: 4, title: 'Write it down', short: 'Memory', line: 'A file it reads at the start of every session outlives the window.' },
  { id: 'check', n: 5, title: 'Make it prove it', short: 'Check', line: 'Nothing counts as done until a check has passed.' },
  { id: 'handoff', n: 6, title: 'A second agent', short: 'Handoff', line: 'It hands a piece to a helper with an empty window and gets a short report back.' },
  { id: 'parallel', n: 7, title: 'Side by side', short: 'Parallel', line: 'Several at once, each in its own copy of the project.' },
  { id: 'lead', n: 8, title: 'A lead', short: 'Lead', line: 'One agent plans, briefs, reviews and merges. The others build.' },
  { id: 'fleet', n: 9, title: 'Twenty in a loop', short: 'Fleet', line: 'A queue, a fleet and a gate. You watch the gate.' },
];
export const rung = (id: string) => rungs.find((r) => r.id === id)!;
export const after = (id: string) => rungs[rungs.findIndex((r) => r.id === id) + 1];
