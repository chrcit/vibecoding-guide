// Fig. 16, how a skill loads: four installed skills, one request (the contact tidy), and what sits in
// the agent's context at each step. The drawing and the readout both read from this file.

export interface Card {
  id: string;
  /** The skill's name, as its folder and the label show it. */
  name: string;
  /** Its one-line description: the only part the agent sees until the skill is opened. */
  description: string;
}

/** The shelf, back left to front right. All fictional, from the guide's running examples. */
export const CARDS: Card[] = [
  { id: 'club-emails', name: 'club-emails', description: 'Use when writing to the football club’s members.' },
  { id: 'tidy-contacts', name: 'tidy-contacts', description: 'Use when cleaning an exported contact list or spreadsheet.' },
  { id: 'write-tests', name: 'write-tests', description: 'Use when adding or fixing a test.' },
  { id: 'bakery-deploy', name: 'bakery-deploy', description: 'Use when publishing the bakery website.' },
];

/** The card the request matches. */
export const MATCH = 1;

export const REQUEST = 'Tidy contacts.csv: remove the duplicates and use one date format.';

export type Stage = 'idle' | 'request' | 'match' | 'open';

export interface Step {
  stage: Stage;
  /** What is in context, in order, for the readout and the alt text. */
  context: string[];
  says: string;
}

const card = CARDS[MATCH]!;

export const STEPS: Step[] = [
  {
    stage: 'idle',
    context: ['the project’s instruction file', 'the skill list'],
    says: `Four skills sit on the shelf, closed. In context: the project’s instruction file and the skill list, which holds only each skill’s name and one-line description. None of the four skills’ instructions are loaded.`,
  },
  {
    stage: 'request',
    context: ['the project’s instruction file', 'the skill list', 'your request'],
    says: `Your request arrives: “${REQUEST}” In context: the instruction file, the skill list and the request. Still no skill has been opened.`,
  },
  {
    stage: 'match',
    context: ['the project’s instruction file', 'the skill list', 'your request'],
    says: `The agent compares the request with the four descriptions. ${card.name} says “${card.description}” That matches. The other three describe other jobs, so they stay shut.`,
  },
  {
    stage: 'open',
    context: ['the project’s instruction file', 'the skill list', 'your request', `the whole ${card.name} skill`],
    says: `The agent reads the whole ${card.name} file into context: its checklist, the one date format to use, and a pointer to a script in the skill’s folder. The other three skills still cost one line each.`,
  },
];

export function describe(step: Step): string {
  return step.says;
}
