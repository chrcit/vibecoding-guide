// Chapter 3: the window fills. The pile is drawn to scale against the window you pick.
import type { Chapter, Ctx } from '../chapter';
import { solo, lab, worked } from '../presets';
import type { Block, Kind } from '../picture';

const CHUNK = 25; // one slab is 25k tokens
const KINDS: Kind[] = ['you', 'model', 'tool', 'tool', 'model', 'tool', 'tool', 'model'];
const pile = (usedK: number): Block[] => Array.from({ length: Math.round(usedK / CHUNK) }, (_, i) => ({ t: KINDS[i % KINDS.length]!, h: CHUNK }));
const fmt = (k: number) => (k >= 1000 ? `${(k / 1000).toFixed(k % 1000 ? 1 : 0)}M` : `${Math.round(k)}k`);

const view = (blocks: Block[], cap: number) => {
  const s = solo({ tools: true, project: true, blocks, focus: ['a0'], zoomMax: 6.5, labels: [lab('a0', 'the model', 'top', 'wiki/model/'), lab('tank:a0', 'its window', 'left', 'wiki/context-window/')] });
  s.agents[0]!.cap = cap;
  return s;
};

function show(ctx: Ctx) {
  const cap: number = ctx.keep.cap ?? 1000;
  const blocks: Block[] = ctx.mem.blocks ?? pile(ctx.mem.used ?? 0);
  const used = blocks.reduce((n, b) => n + b.h, 0);
  const over = used > cap;
  ctx.scene.change((s) => { const a = s.agents[0]!; a.cap = cap; a.blocks = blocks; a.lamp = over ? 'bad' : 'off'; });
  ctx.stat([['window', `${fmt(cap)} tokens`], ['in it', `${fmt(used)}`], ['full', `${Math.min(999, Math.round((used / cap) * 100))}%`]]);
  if (over) ctx.say(null, 'Over the limit. The next turn does not fit until something is dropped.');
  else if (ctx.mem.note) ctx.say(null, ctx.mem.note);
  else ctx.say(null, used ? 'Every turn, the model reads all of this again from the bottom up.' : 'An empty window.');
}
const scan = (ctx: Ctx) => void ctx.scene.run(async (h) => {
  h.set((s) => { s.agents[0]!.scan = true; s.agents[0]!.busy = true; });
  await h.wait(1300);
  h.set((s) => { s.agents[0]!.scan = false; s.agents[0]!.busy = false; });
});

export const windowCh: Chapter = {
  steps: {
    pile: {
      scene: () => { const s = view(worked(14), 60); return s; },
      enter: (ctx) => { ctx.say(null, 'Your message, each file it read, each test run: all still here.'); scan(ctx); },
    },
    long: {
      scene: (ctx) => view(pile(150), ctx.keep.cap ?? 1000),
      enter: (ctx) => { ctx.mem.used = 150; show(ctx); },
    },
    full: {
      scene: (ctx) => view(pile(ctx.keep.cap ?? 1000), ctx.keep.cap ?? 1000),
      enter: (ctx) => { ctx.mem.used = (ctx.keep.cap ?? 1000) + CHUNK; show(ctx); },
    },
    compact: {
      scene: (ctx) => view(pile((ctx.keep.cap ?? 1000) * 0.9), ctx.keep.cap ?? 1000),
      enter: (ctx) => { ctx.mem.used = Math.round(((ctx.keep.cap ?? 1000) * 0.9) / CHUNK) * CHUNK; show(ctx); },
    },
    paste: {
      scene: (ctx) => view(pile(100), ctx.keep.cap ?? 1000),
      enter: (ctx) => { ctx.mem.used = 100; show(ctx); },
    },
  },
  inputs: {
    used: (ctx, val) => { ctx.mem.blocks = null; ctx.mem.note = ''; ctx.mem.used = Number(val); show(ctx); },
    cap: (ctx, val) => { ctx.keep.cap = Number(val); show(ctx); },
  },
  actions: {
    compact: (ctx) => {
      const cap: number = ctx.keep.cap ?? 1000;
      const now: Block[] = ctx.mem.blocks ?? pile(ctx.mem.used ?? 0);
      ctx.mem.blocks = [{ t: 'sum', h: Math.max(CHUNK, Math.round(cap * 0.04)) }, ...now.slice(-3)];
      ctx.mem.note = 'The model wrote a summary of its own window. The summary and the last few turns stay; the rest is gone.';
      show(ctx);
    },
    fresh: (ctx) => {
      ctx.mem.blocks = [{ t: 'you', h: CHUNK }];
      ctx.mem.note = 'A new thread. The only thing in the window is the note you wrote for it.';
      show(ctx);
    },
    paste: (ctx) => {
      const now: Block[] = ctx.mem.blocks ?? pile(ctx.mem.used ?? 0);
      ctx.mem.blocks = [...now, { t: 'tool', h: 200 }];
      ctx.mem.note = 'One pasted log file: 200k tokens, read again on every turn from now on.';
      show(ctx);
    },
    reset: (ctx) => { ctx.mem.blocks = null; ctx.mem.note = ''; show(ctx); },
  },
};
