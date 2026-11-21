// Fig. 33, a second model catches what the first cannot see. Twelve mistakes a builder made, and
// how many each kind of check catches, from the lab's assumptions (../team-lab/model.ts).
import { CATCH, SAME_MODEL, personCatch } from '../team-lab/model';

export const MISTAKES = 12;
/** The person's review time for the last option, in minutes. */
export const YOUR_REVIEW = 8;

export const OPTIONS = [
  { name: 'No reviewer', rate: 0, says: 'Nothing checks the work, so all twelve reach the end.' },
  { name: 'Same model again', rate: CATCH.middle * SAME_MODEL, says: 'A fresh copy of the builder has not seen its reasoning, but it shares its blind spots.' },
  { name: 'Another lab’s model', rate: CATCH.middle, says: 'A model trained differently misses different things, so more of these surface.' },
  { name: 'Another lab, then you', rate: 1 - (1 - CATCH.middle) * (1 - personCatch(YOUR_REVIEW)), says: `Two different readers, the second of them you for ${YOUR_REVIEW} minutes, leave little through.` },
];

export const caught = (i: number) => Math.round(OPTIONS[i]!.rate * MISTAKES);
