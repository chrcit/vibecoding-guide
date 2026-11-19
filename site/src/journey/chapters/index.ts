import type { Chapter } from '../chapter';
import { whole } from './whole';
import { chat } from './chat';
import { loop } from './loop';
import { windowCh } from './window';
import { memory } from './memory';
import { check } from './check';
import { handoff } from './handoff';
import { parallel, leadCh, fleetCh } from './team';

export const chapters: Record<string, Chapter> = { whole, chat, loop, window: windowCh, memory, check, handoff, parallel, lead: leadCh, fleet: fleetCh };
