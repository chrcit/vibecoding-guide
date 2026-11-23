/* Guide v2 lesson: see v2/content.ts for the words, types and helpers. */
import type { Block } from '../../journey/picture';
import { solo, lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import { t3code } from '../../data/t3code';
import { claims } from '../../data/claims';
import { A, FIRST, atYou, b, file, fill, points, push, type Lesson } from '../content';

// ---------- lesson 1: say what you want ----------
// Thursday 22:00 and Friday 09:00. No project and no tools in the picture: the model alone.

const chatLabels = (window: string) => [lab('you', 'you', 'left'), termLabel('a0', 'model'), termLabel('tank:a0', 'window', 'left', window)];
const chat = (window = 'its window', blocks: Block[] = [FIRST]) => solo({ labels: chatLabels(window), blocks });

const ASK = 'Who on Friday’s guest list hasn’t confirmed yet? Done when I have names I can text tonight.';
const GUESTS = 'Who hasn’t confirmed';

const lesson1: Lesson = {
  id: 'l1',
  parts: [
    {
      title: 'Only what’s in the window',
      thread: GUESTS,
      request: ASK,
      lede: 'You run the Lantern, a small club. Friday is two days away, and the guest list lives in the club’s little app. For this lesson, picture the model on its own: text goes in, text comes out. Lesson 2 gives it tools.',
      points: points(chat(), [
        { say: 'You send one sentence. It goes into the model’s window, after the instructions every thread starts with.', moves: [{ to: 'agent' }], ui: { model: true },
          edit: (s) => { push(s, b('you', 2.4)); s.labels = chatLabels('its window: instructions + your sentence'); } },
        { say: 'The model reads its whole window. Nothing in it is about your club.', think: 1100,
          edit: (s) => { A(s).busy = true; A(s).scan = true; s.labels = chatLabels('nothing about the Lantern'); } },
        { say: 'Here it asks for the list. It can’t answer from a list it never saw.', moves: [{ to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 2)); s.labels = chatLabels('its reply: “Can you share the list?”'); } },
        { say: 'Another run can fill the gap instead, with names that sound right and read as confidently as real ones. Only you can tell a real guest from a made-up one. Here, your “done when” is a check only you can make.', moves: [{ to: 'you', kind: 'bad' }],
          edit: (s) => { A(s).blocks = [FIRST, b('you', 2.4), b('bad', 3)]; s.labels = [...chatLabels('another run: three names it made up'), atYou('names to text?')]; } },
      ]),
      answer: [
        'I don’t have Friday’s guest list, so I can’t tell who hasn’t confirmed.',
        'Paste it here, or export it from the app, and I’ll pick out everyone who hasn’t replied.',
      ],
      deeper: { level: 'engineer', text: 'The model predicts the next tokens from what is in its window. Tuning pushes it to ask for input it lacks, and nothing guarantees that it will. With no list in the window, a few plausible names are still a possible output.' },
      tryIt: { prompt: 'Who hasn’t replied to my last group message?', t3: 'Start a New thread from the sidebar, send it, and see whether it asks or makes up an answer.' },
      sources: ['claims.lessons.missingInformation', 't3code.newThreadButton'],
    },
    {
      title: 'Paste the list',
      thread: GUESTS,
      request: 'Here’s the list, exported from the app. Don’t name anyone who isn’t on it.',
      attach: 'friday-list.csv · 60 rows',
      lede: 'It asked for the list, so you paste it into the same thread. Every guest here is made up.',
      points: points(chat('its window', [FIRST, b('you', 2.4), b('model', 2)]), [
        { say: 'The list goes into the window with your message. Whatever you paste also goes to the model’s provider.', moves: [{ to: 'agent' }],
          edit: (s) => { push(s, b('you', 9)); s.labels = chatLabels('its window: + 60 rows'); } },
        { say: 'It reads the whole window again: last night’s question, its own reply and every row.', think: 1300,
          edit: (s) => { A(s).busy = true; A(s).scan = true; s.labels = chatLabels('the whole thread, every time'); } },
        { say: 'Now the names come from the rows. You can check each one against the list.', moves: [{ to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 3)); s.labels = [...chatLabels('its reply: 7 names from your list'), atYou('names you can check')]; } },
      ]),
      answer: [
        'Seven of the 60 haven’t confirmed: Ada Brenner, Jonas Kim, Mira Osei, Paul Lenz, Rosa Varga, Tim Hale and Yusuf Demir. Ada and Paul each have a plus-one.',
        'A text you can send: “Hi! You’re on the list for Friday at the Lantern. Can you confirm by noon tomorrow, and tell me if you’re bringing someone?”',
      ],
      deeper: { level: 'engineer', text: 'Pasting is the simplest way to put data in the window. Sixty rows fit easily. With thousands, a tool that searches works better (lesson 2), and a full window has costs of its own (lesson 5). Rows in view don’t guarantee a correct count, so check the names.' },
      tryIt: { prompt: 'Here is the list: [paste a made-up list]. Who hasn’t replied? Don’t name anyone who isn’t on it.', t3: 'What you paste goes to your provider, not to T3. Use made-up data, or only what your plan and your employer allow.' },
      sources: ['t3code.codeNotToT3', 'claims.privacy.claudeConsumer', 'claims.privacy.openaiApi'],
    },
    {
      title: 'A new thread doesn’t know the last one',
      thread: 'Text unconfirmed guests',
      fresh: true,
      request: 'Text the ones who haven’t confirmed. Done when the text is ready to send.',
      lede: 'Friday, 09:00. You start a new thread for the texts.',
      points: points(chat('its window', []), [
        { say: 'A new thread. Last night’s conversation stays in the other one.',
          edit: (s) => { A(s).blocks = []; s.labels = chatLabels('a new thread'); } },
        { say: 'Some things come along: your model and permission mode, and the instructions every thread starts with. In a project, Claude Code and Codex also load its instruction file.',
          edit: (s) => { A(s).blocks = [FIRST]; s.labels = chatLabels('already there: its instructions'); } },
        { say: 'Your sentence goes in. The list doesn’t. It’s in last night’s thread.', moves: [{ to: 'agent' }],
          edit: (s) => { push(s, b('you', 2.4)); s.labels = chatLabels('no list'); } },
        { say: 'So it asks which guests you mean. Paste the list again, go back to that thread, or keep the list in a project where every thread can find it.', moves: [{ to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 2)); s.labels = chatLabels('its reply: “Which guests?”'); } },
      ]),
      answer: [
        'Happy to write it. Which guests do you mean? There’s no guest list in this conversation.',
        'Paste it here, or tell me where it’s kept, and I’ll draft the text.',
      ],
      deeper: { level: 'engineer', text: 'The window isn’t blank. The harness’s system prompt and tool definitions are there before your first word, and Claude Code and Codex add the project’s instruction file. Last night’s messages aren’t. Not every provider loads that file at the start: in the guide’s own test, Antigravity under T3 Code didn’t.' },
      tryIt: { prompt: 'Text the ones who haven’t confirmed.', t3: 'A new thread carries your model and mode, and it can read the project’s files. It doesn’t carry what you said in other threads.' },
      sources: ['t3code.newThreadCarries', 'lineup.cacheExactPrefix', 'harnesses.claudeCode.startupContext', 'harnesses.codex.contextFile', 'observations.experience.antigravityContextFiles'],
    },
  ],
};


export default lesson1;
