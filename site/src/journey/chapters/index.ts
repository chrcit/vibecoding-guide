import type { Chapter } from '../chapter';
import { foundations } from './foundations';
import { aiCh } from './ai';
import { providersCh } from './providers';
import { stackCh } from './stack';
import { firstCh } from './first';
import { whole } from './whole';
import { chat } from './chat';
import { loop } from './loop';
import { windowCh } from './window';
import { memory } from './memory';
import { check } from './check';
import { handoff } from './handoff';
import { parallel, leadCh, fleetCh } from './team';
import { week } from './week';
import { meter } from './meter';
import { review } from './review';
import { proof } from './proof';
import { turn } from './turn';
import { jobsCh } from './jobs';
import { grow } from './grow';
import { people } from './people';
import { where } from './where';

export const chapters: Record<string, Chapter> = {
  foundations, ai: aiCh, providers: providersCh, stack: stackCh, first: firstCh,
  whole, chat, loop, window: windowCh, memory, check, handoff, parallel, lead: leadCh, fleet: fleetCh,
  week, meter, review, proof, turn, jobs: jobsCh, grow, people, where,
};
