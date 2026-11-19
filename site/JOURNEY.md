# The journey

The spine of the site. One drawn scene that grows through nine steps, from a single chat to twenty
agents in a loop. The home page plays all nine; each step has its own page at `/journey/<id>/`.

The owner's brief, in their words: "interactive scrolling explainers which keep some key visual
main", where "the visuals should also interlock and build an entire whole so you build up from the
first chat ... to high level stuff like orchestrating 10-20 agents at once in a loop and managing
context, outputs and verification."

## The idea

Six nouns, drawn once, never redrawn:

| Noun | Drawn as | Enters at |
| --- | --- | --- |
| you | a pawn | 1 |
| the model | the cap on a glass column; lit while it is working | 1 |
| the window | the glass column; everything the model can see is a slab in it | 1 |
| tools | four cubes on a bench | 2 |
| the project | a plate of file tiles; AGENTS.md is the green one, skills stand on a shelf | 2 |
| a check | a gate with a lamp | 5 |

An agent is a model, a window and tools in a loop. From step 6 the same unit is drawn smaller and
repeated; nothing new is invented for teams.

Each step adds one thing to the picture or multiplies one that is there:

1. **One chat.** A model and a window. A new chat is an empty window.
2. **It gets hands.** Tools and a project. One message from you, many turns of its own.
3. **The window fills.** Same picture, closer. The pile, the limit, compaction, a new thread.
4. **Write it down.** A file loaded at the start of every session. Skills stay on the shelf.
5. **Make it prove it.** A gate between the agent and "done".
6. **A second agent.** A helper with an empty window; a brief goes in, a report comes back.
7. **Side by side.** Several helpers, each with its own copy of the project, merged into main.
8. **A lead.** The agent you talk to stops building. A gate in front of main. Short reports.
9. **Twenty in a loop.** A queue, a fleet and a gate. You read what gets through the gate.

A slab and a puck share colours: what travels across the floor is what lands in a window. Dark is
you, pale is the model, blue is a tool result, green is instructions, hatched grey is a summary,
the accent is something that went wrong.

## Rules for a chapter

- The picture carries the idea. A step is a heading, at most two short sentences and at most one
  control. If a step needs a paragraph, the picture is missing something: fix the picture.
- Every chapter lets the reader break the thing it teaches: take a tool away, drop the gate, send a
  thin brief, share one folder. Show what happens; do not warn about it.
- A part keeps its place and its meaning in every chapter. New parts go into `picture.ts` with a
  place on the floor plan, never into one chapter.
- What is said under the picture is what the people and programs in it said. Numbers under it are
  counted from what just happened.
- Made-up jobs are fine and are called made-up. Token counts, window sizes, prices and limits come
  from `src/data` through the page (`data` prop), with `<Verified>` in the foot.
- A term the reader might not know is a label on the picture that opens its wiki page in the side
  view. Deeper play lives on a board (`/explain/...`, `/models/`) linked from the chapter's end.

## Files

- `src/journey/picture.ts`: the floor plan, the parts, and `picture(state)`: state in, parts,
  labels and camera out. Pure; also draws the first frame at build time.
- `src/journey/scene.ts`: the browser engine. Keeps the drawing in step with the state, moves pucks,
  runs scripts that stop when the reader scrolls on.
- `src/journey/presets.ts`: `solo()` and `team(n)`, the two standing arrangements.
- `src/journey/sim.ts`: the fleet simulation used by steps 7 to 9 and the home page.
- `src/journey/chapters/*.ts`: one file per chapter: a scene and a script per step, plus the
  actions its buttons and sliders call.
- `src/journey/run.ts`: picks the step on show from the scroll position and wires the controls.
- `src/layouts/Journey.astro`, `src/components/journey/Step.astro`, `Next.astro`,
  `src/styles/journey.css`.

A step in a page:

```astro
<Step id="norun" title="Take one tool away">
  <p>If it cannot run anything, it cannot check. It still says “fixed”.</p>
  <div class="pick">
    <button type="button" data-do="run" data-val="off" data-default aria-pressed="true">Without run</button>
    <button type="button" data-do="run" data-val="on" aria-pressed="false">With run</button>
  </div>
</Step>
```

`id` names a key of the chapter's `steps`. `data-do` calls one of its `actions`, `data-bind` one of
its `inputs`. `level="technical"` or `"engineer"` on a `<Step>` adds a step for those readers.

## Checks

Open the page at 1440 and 390 wide, light and dark, and scroll every step. With reduced motion
pucks do not travel and each script jumps to its result. `pnpm judge` both ways as usual.
