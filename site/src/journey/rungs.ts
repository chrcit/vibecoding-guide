// The steps of the journey, in order. Each adds one thing to the same picture. Part one grows the
// agents, from one chat to twenty in a loop. Part two grows the work around them.
export interface Rung { id: string; n: number; part: 1 | 2; title: string; short: string; line: string }
export interface Part { n: 1 | 2; title: string; short: string; href: string; chapter: string }

export const parts: Part[] = [
  { n: 1, title: 'From one chat to twenty agents', short: 'Part one', href: '', chapter: 'whole' },
  { n: 2, title: 'From one job to a working week', short: 'Part two', href: 'journey/week/', chapter: 'week' },
];

export const rungs: Rung[] = [
  { id: 'chat', n: 1, part: 1, title: 'One chat', short: 'Chat', line: 'You type, it answers. The window is all it knows.' },
  { id: 'loop', n: 2, part: 1, title: 'It gets hands', short: 'Loop', line: 'With tools it keeps going by itself until the job is done.' },
  { id: 'window', n: 3, part: 1, title: 'The window fills', short: 'Window', line: 'Everything it reads piles up. When the window is full, something has to go.' },
  { id: 'memory', n: 4, part: 1, title: 'Write it down', short: 'Memory', line: 'A file it reads at the start of every session outlives the window.' },
  { id: 'check', n: 5, part: 1, title: 'Make it prove it', short: 'Check', line: 'Nothing counts as done until a check has passed.' },
  { id: 'handoff', n: 6, part: 1, title: 'A second agent', short: 'Handoff', line: 'It hands a piece to a helper with an empty window and gets a short report back.' },
  { id: 'parallel', n: 7, part: 1, title: 'Side by side', short: 'Parallel', line: 'Several at once, each in its own copy of the project.' },
  { id: 'lead', n: 8, part: 1, title: 'A lead', short: 'Lead', line: 'One agent plans, briefs, reviews and merges. The others build.' },
  { id: 'fleet', n: 9, part: 1, title: 'Twenty in a loop', short: 'Fleet', line: 'A queue, a fleet and a check before main. You read what gets through.' },
  { id: 'meter', n: 10, part: 2, title: 'What it draws from', short: 'Meter', line: 'Every turn is counted, against a plan’s allowance or on a bill per token.' },
  { id: 'review', n: 11, part: 2, title: 'A second model', short: 'Review', line: 'One model builds, another looks for what is wrong, and the work goes round until nothing is found.' },
  { id: 'proof', n: 12, part: 2, title: 'Proof you can read', short: 'Proof', line: 'The work comes back with a screenshot, a test run and a short summary.' },
  { id: 'turn', n: 13, part: 2, title: 'Your turn', short: 'Your turn', line: 'Doors for your input before, during and after the build.' },
  { id: 'jobs', n: 14, part: 2, title: 'Several jobs', short: 'Jobs', line: 'Several jobs at once, in one project or in different ones. There is still one of you.' },
  { id: 'grow', n: 15, part: 2, title: 'The project grows', short: 'Growth', line: 'Every job adds something. Clean-ups and refactors are jobs too.' },
  { id: 'people', n: 16, part: 2, title: 'Other people', short: 'People', line: 'A pull request, a colleague, a client, users. What they say becomes the next job.' },
  { id: 'where', n: 17, part: 2, title: 'Other machines', short: 'Machines', line: 'Your laptop, a computer that stays on, a machine in the cloud.' },
];
export const rung = (id: string) => rungs.find((r) => r.id === id)!;
export const after = (id: string) => rungs[rungs.findIndex((r) => r.id === id) + 1];
export const partOf = (chapter: string): Part => parts.find((p) => p.chapter === chapter) ?? parts[(rungs.find((r) => r.id === chapter)?.part ?? 1) - 1]!;
