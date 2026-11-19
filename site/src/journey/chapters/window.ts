// Chapter 7 (Part 2): The window fills — and rots long before it hits 100%.
// Shows behind-the-scenes attention dilution when unrelated files, old tasks and giant logs pile up.
import type { Chapter, Ctx } from '../chapter';
import { byLevel } from '../chapter';
import { solo, lab, worked } from '../presets';
import type { Block, Kind } from '../picture';

const CHUNK = 25; // one slab is 25k tokens
const KINDS: Kind[] = ['you', 'model', 'tool', 'tool', 'model', 'tool', 'tool', 'model'];
const pile = (usedK: number): Block[] => Array.from({ length: Math.round(usedK / CHUNK) }, (_, i) => ({ t: KINDS[i % KINDS.length]!, h: CHUNK }));
const fmt = (k: number) => (k >= 1000 ? `${(k / 1000).toFixed(k % 1000 ? 1 : 0)}M` : `${Math.round(k)}k`);

const view = (blocks: Block[], cap: number) => {
  const s = solo({
    tools: true,
    project: true,
    blocks,
    focus: ['a0'],
    zoomMax: 6.5,
    labels: [lab('a0', 'the model', 'top', 'wiki/model/'), lab('tank:a0', 'its window', 'left', 'wiki/context-window/')],
  });
  s.agents[0]!.cap = cap;
  return s;
};

type RotMix = 'focused' | 'cluttered' | 'rotted';

function showRot(ctx: Ctx, mix: RotMix) {
  const cap = 1000;
  const blocks: Block[] =
    mix === 'focused'
      ? [{ t: 'rules', h: 25 }, { t: 'you', h: 25 }, { t: 'tool', h: 50 }, { t: 'model', h: 25 }]
      : mix === 'cluttered'
        ? [
            { t: 'rules', h: 25 }, { t: 'you', h: 25 }, { t: 'tool', h: 75 }, { t: 'bad', h: 75 },
            { t: 'model', h: 50 }, { t: 'tool', h: 100 }, { t: 'bad', h: 75 }, { t: 'you', h: 25 },
          ]
        : [
            { t: 'rules', h: 25 }, { t: 'bad', h: 125 }, { t: 'tool', h: 125 }, { t: 'bad', h: 125 },
            { t: 'model', h: 50 }, { t: 'bad', h: 125 }, { t: 'tool', h: 100 }, { t: 'you', h: 25 },
          ];
  const used = blocks.reduce((n, b) => n + b.h, 0);
  const relevant = mix === 'focused' ? 92 : mix === 'cluttered' ? 28 : 11;
  const quality = mix === 'focused' ? 'Sharp & accurate' : mix === 'cluttered' ? 'Misses rules, drifts' : 'Rotted — ignores earlier rules';
  ctx.scene.change((s) => {
    const a = s.agents[0]!;
    a.cap = cap;
    a.blocks = blocks;
    a.lamp = mix === 'focused' ? 'ok' : mix === 'cluttered' ? 'work' : 'bad';
  });
  ctx.stat([
    ['window used', `${fmt(used)} of 1M (${Math.round((used / cap) * 100)}%)`],
    ['relevant to this job', `${relevant}%`],
    ['output quality', quality],
  ]);
  ctx.say(
    null,
    mix === 'focused'
      ? byLevel(ctx.level, {
          plain: 'Only the rules and files for today’s task sit in the window. The answer is fast and spot-on.',
          technical: '125k focused tokens (spec + 3 relevant files + failing test). Attention stays locked on your constraints and types.',
          engineer: 'High signal-to-noise prefix: every token attends cleanly to the task spec, target module and verification contract.',
        })
      : mix === 'cluttered'
        ? byLevel(ctx.level, {
            plain: 'Not even half full—yet half the window is old tasks and pasted error logs. The agent starts forgetting your earlier rules.',
            technical: 'Only 45% of the 1M cap, but stale debugging traces and unrelated files crowd out your spec. Expect missed edge cases and drifting conventions.',
            engineer: '45% utilization with 72% distractor tokens: attention weights smear across contradictory stale diffs, silently degrading instruction following.',
          })
        : byLevel(ctx.level, {
            plain: 'Still 30% room left in a huge window, yet quality has collapsed—old dead-ends and unrelated code pull the model off track.',
            technical: '70% full of unrelated logs and three earlier features. Even though the API accepts the prompt, context rot causes broken imports, skipped tests and hallucinated fixes.',
            engineer: 'Severe context rot well below the 1M ceiling: lost-in-the-middle attenuation + conflicting prior hypotheses poison next-token sampling. Start a fresh thread.',
          }),
  );
  ctx.model(
    'Context rot (behind the scenes).',
    byLevel(ctx.level, {
      plain: 'A bigger window is NOT free extra smarts. Filling it with old tasks and unrelated text makes the AI foggy long before it hits 100%—start a fresh thread for each new job.',
      technical: 'Attention spreads across every token in the window. Unrelated files, failed attempts and old features act as distractors that degrade code quality well below the token limit.',
      engineer: 'Effective context length is much smaller than nominal window size when distractor density rises. Treat context as working memory, not an archive—reset between tasks.',
    }),
  );
}

function show(ctx: Ctx) {
  const cap: number = ctx.keep.cap ?? 1000;
  const blocks: Block[] = ctx.mem.blocks ?? pile(ctx.mem.used ?? 0);
  const used = blocks.reduce((n, b) => n + b.h, 0);
  const pct = Math.min(999, Math.round((used / cap) * 100));
  const over = used > cap;
  ctx.scene.change((s) => {
    const a = s.agents[0]!;
    a.cap = cap;
    a.blocks = blocks;
    a.lamp = over ? 'bad' : pct >= 60 ? 'work' : 'off';
  });
  ctx.stat([
    ['window', `${fmt(cap)} tokens`],
    ['in it', `${fmt(used)}`],
    ['full', `${pct}%`],
    ['attention health', over ? 'overflow' : pct >= 60 ? 'rot risk rising' : 'healthy'],
  ]);
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
      scene: () => view(worked(14), 60),
      enter: (ctx) => {
        ctx.say(null, 'Your message, each file it read, each test run: all still here.');
        ctx.model(
          'Append-only transcript.',
          byLevel(ctx.level, {
            plain: 'Nothing quietly disappears while you keep chatting—every earlier file, error and reply stays in the stack and gets re-read on every turn.',
            technical: 'Every tool output (file reads, test logs, diffs) stays appended to the prompt history and is re-processed on every subsequent turn.',
            engineer: 'The prompt is a monotonically growing token log; every unpruned tool dump increases both per-turn attention load and input token cost.',
          }),
        );
        scan(ctx);
      },
    },
    rot: {
      scene: () => view([{ t: 'rules', h: 25 }, { t: 'you', h: 25 }, { t: 'tool', h: 50 }, { t: 'model', h: 25 }], 1000),
      enter: (ctx) => showRot(ctx, 'focused'),
    },
    long: {
      scene: (ctx) => view(pile(150), ctx.keep.cap ?? 1000),
      enter: (ctx) => {
        ctx.mem.used = 150;
        ctx.model(
          'Window size vs effective focus.',
          byLevel(ctx.level, {
            plain: 'Drag the slider up: even with a huge 1M window, you rarely want to fill it—quality drops well before the top.',
            technical: 'Compare how fast the same session fills a 200k vs 1M window, and notice rot risk rising long before the hard 100% cap.',
            engineer: 'Nominal context limits (200k–1M) define a hard overflow wall, not a quality plateau—keep working sets small even on large-window models.',
          }),
        );
        show(ctx);
      },
    },
    compact: {
      scene: (ctx) => view(pile((ctx.keep.cap ?? 1000) * 0.9), ctx.keep.cap ?? 1000),
      enter: (ctx) => {
        ctx.mem.used = Math.round(((ctx.keep.cap ?? 1000) * 0.9) / CHUNK) * CHUNK;
        ctx.model(
          'Compact vs new thread.',
          byLevel(ctx.level, {
            plain: 'Compaction keeps the same thread going with a shorter summary; starting a new thread with a 3-line brief gives the cleanest, sharpest results when switching jobs.',
            technical: 'Auto-compaction rescues an active debugging thread but loses subtle detail; a fresh thread + clean git commit + explicit brief eliminates accumulated context rot.',
            engineer: 'Prefer explicit task-boundary resets (clean commit + concise handoff spec) over repeated lossy compactions that accumulate summary drift.',
          }),
        );
        show(ctx);
      },
    },
    paste: {
      scene: (ctx) => view(pile(100), ctx.keep.cap ?? 1000),
      enter: (ctx) => {
        ctx.mem.used = 100;
        ctx.model(
          'Unfiltered pastes poison the window.',
          byLevel(ctx.level, {
            plain: 'Pasting a giant log or whole file you don’t need crowds out what matters on every single turn afterwards. Paste just the error lines.',
            technical: 'One 200k raw log dump sits in the window forever, inflating every turn’s input tokens and adding noise. Pipe test output to the failing lines only.',
            engineer: 'Bound tool output verbosity (filter stdout/stack traces, target line ranges) so noisy logs never permanently occupy active attention.',
          }),
        );
        show(ctx);
      },
    },
  },
  inputs: {
    used: (ctx, val) => { ctx.mem.blocks = null; ctx.mem.note = ''; ctx.mem.used = Number(val); show(ctx); },
    cap: (ctx, val) => { ctx.keep.cap = Number(val); show(ctx); },
  },
  actions: {
    rot: (ctx, val) => showRot(ctx, val as RotMix),
    compact: (ctx) => {
      const cap: number = ctx.keep.cap ?? 1000;
      const now: Block[] = ctx.mem.blocks ?? pile(ctx.mem.used ?? 0);
      ctx.mem.blocks = [{ t: 'sum', h: Math.max(CHUNK, Math.round(cap * 0.04)) }, ...now.slice(-3)];
      ctx.mem.note = 'Compacted: the model replaced the old pile with a summary plus the last few turns. Useful mid-job, though some nuance is lost.';
      show(ctx);
    },
    fresh: (ctx) => {
      ctx.mem.blocks = [{ t: 'rules', h: CHUNK }, { t: 'you', h: CHUNK }];
      ctx.mem.note = 'A fresh thread: only AGENTS.md and your new brief sit in the window. Zero rot, sharp attention.';
      show(ctx);
    },
    paste: (ctx) => {
      const now: Block[] = ctx.mem.blocks ?? pile(ctx.mem.used ?? 0);
      ctx.mem.blocks = [...now, { t: 'bad', h: 200 }];
      ctx.mem.note = 'One raw 200k-token log pasted in: now re-read and diluting attention on every single turn from here on.';
      show(ctx);
    },
    reset: (ctx) => { ctx.mem.blocks = null; ctx.mem.note = ''; show(ctx); },
  },
};
