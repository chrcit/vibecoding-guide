// Chapter 1: one chat. A model, a window, and nothing else.
import type { Chapter, Ctx } from '../chapter';
import { solo, lab } from '../presets';
import { termLabel } from '../terms';
import { route, reverse } from '../picture';

// Each line is a bubble on the picture: about 38 characters at most.
export const LINES: [string, string][] = [
  ['I’m Sam. I keep our club’s member list.', 'Hello Sam. What does the list need?'],
  ['To show who has paid this season.', 'I can sketch that. How do they pay?'],
  ['What is my name?', 'Sam.'],
];
/** The window's label says how many messages it holds, so the picture reads without the chip. */
const tankLabel = (n: number) => termLabel('tank:a0', 'window', 'left', n ? `its window: ${msgs(n)}` : 'its window: empty');
const labels = (n: number) => [lab('you', 'you', 'left'), termLabel('a0', 'model', 'top', 'the model'), tankLabel(n)];
const base = (blocks = [] as { t: 'you' | 'model'; h: number }[]) => solo({ blocks, labels: labels(blocks.length) });
const said = (n: number) => LINES.slice(0, n).flatMap(() => [{ t: 'you' as const, h: 3 }, { t: 'model' as const, h: 3 }]);
const msgs = (n: number) => `${n} message${n === 1 ? '' : 's'}`;
const count = (ctx: Ctx) => (ctx.scene.agent('a0').blocks ?? []).length;

const READ_AGAIN = 'It read every message again and found your name in the first one.';

/** One exchange: your words go in, the model reads everything, its answer goes in too. */
async function exchange(ctx: Ctx, you: string, model: string, after?: string) {
  const { scene } = ctx;
  await scene.run(async (h) => {
    ctx.say(null, '');
    ctx.say('you', you);
    await h.send(route.youToAgent(), 'you');
    h.set((s) => { const a = s.agents[0]!; a.blocks!.push({ t: 'you', h: 3 }); a.busy = true; a.scan = true; s.labels![2] = tankLabel(a.blocks!.length); });
    ctx.stat([['in the window', msgs(count(ctx))]]);
    await h.wait(900);
    h.set((s) => { const a = s.agents[0]!; a.blocks!.push({ t: 'model', h: 3 }); a.busy = false; a.scan = false; s.labels![2] = tankLabel(a.blocks!.length); });
    ctx.say('model', model);
    await h.send(reverse(route.youToAgent()), 'model');
    ctx.stat([['in the window', msgs(count(ctx))]]);
    if (after) { await h.wait(900); ctx.say(null, after); }
  });
}

export const chat: Chapter = {
  steps: {
    two: { scene: () => base(), enter: (ctx) => { ctx.say(null, 'An empty window. The model can see nothing yet.'); ctx.stat([['in the window', '0 messages']]); } },
    send: {
      scene: () => base(),
      enter: (ctx) => { ctx.mem.i = 1; void exchange(ctx, ...LINES[0]!); },
    },
    reread: {
      scene: () => base(said(2)),
      enter: (ctx) => { ctx.stat([['in the window', '4 messages']]); void exchange(ctx, ...LINES[2]!, READ_AGAIN); },
    },
    fresh: {
      scene: () => base(said(3)),
      enter: (ctx) => { ctx.say(null, 'Three exchanges, six slabs in the window. Press New chat, then ask.'); ctx.stat([['in the window', '6 messages']]); },
    },
  },
  actions: {
    send: (ctx) => {
      const i = ctx.mem.i ?? 0;
      ctx.mem.i = i + 1;
      void exchange(ctx, ...LINES[i % LINES.length]!);
    },
    newchat: (ctx) => {
      ctx.scene.stop();
      ctx.scene.change((s) => { s.agents[0]!.blocks = []; s.agents[0]!.busy = false; s.agents[0]!.scan = false; s.labels![2] = tankLabel(0); });
      // Your press is the line on the picture: it replaces the old answer, which this window no longer holds.
      ctx.say('model', '');
      ctx.say(null, 'A new chat: an empty window.');
      ctx.stat([['in the window', '0 messages']]);
    },
    ask: (ctx) => {
      const knows = count(ctx) > 0;
      void exchange(ctx, 'What is my name?', knows ? 'Sam.' : 'I can’t tell. Nothing here says.',
        knows ? READ_AGAIN : 'Your name was in the old chat, not in this window. Anything worth keeping has to be written down and given to it again.');
    },
  },
};
