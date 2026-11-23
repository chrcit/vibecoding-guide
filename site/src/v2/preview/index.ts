/*
 * Guide v2's Preview tab: the app the agent is building in the lesson, as a working page inside the
 * drawing of T3 Code's browser panel. The lesson data (v2/content.ts) says which app and which
 * stage each point shows (`Point.preview`); the player (v2/player.ts) mounts it.
 *
 * Contract (keep it stable; each app is one file here, see below):
 *   - An app is a function (el, stage) => PreviewApp. It renders into `el`, which fills the
 *     browser panel's viewport, and keeps its own state (who has been checked in) across stage
 *     changes so the reader can try something, step on, and see the same data.
 *   - `set(stage)` moves it to another stage in place; `destroy()` removes listeners and timers.
 *   - It works at every stage: the reader can type and tap. It follows the site's light/dark theme
 *     only if the app's own design calls for it; a door app at night may well be dark always.
 *   - Everything in it is made up: the club, the guests, the numbers.
 */
export type DoorStage =
  /** Nothing at the address yet. */
  | 'none'
  /** First version: search and check-in work, nothing has been tried yet. */
  | 'first'
  /** The bug the lesson is about: a second tap checks a guest in twice. */
  | 'buggy'
  /** The three "done when" cases run at phone size; one fails. */
  | 'testing'
  /** Fixed: a second tap shows when they arrived; all three cases pass. */
  | 'fixed'
  // Lessons 7 and 8 (door/late.ts): Rico Vance is on Noor's list, then marked do-not-admit.
  /** Rico Vance is on Noor's list tonight, not marked yet: he could still be tapped in (lesson 7, part 1). */
  | 'listed'
  /** Do-not-admit guests show in red with no tap-in (lesson 7, part 2). */
  | 'dna'
  /** Tapping one says what to do: the reason and who to call (lesson 7, part 4). */
  | 'dnaFull'
  /** The agent tries four cases in the shared browser at phone size (lesson 8, part 2). */
  | 'proof'
  /** Practice mode: made-up guests that never reach tonight's list, tried by the reader (lesson 8, part 4). */
  | 'practice'
  /** Lesson 3: the first promoter version, which left the promoters' guests off the door. */
  | 'promo-missing'
  /** Lessons 3–4: Kai's and Noor's lists are the guests they added through their own links. */
  | 'promo';

export interface PreviewApp { set(stage: string): void; destroy(): void }
export type MountApp = (el: HTMLElement, stage: string) => PreviewApp;

/**
 * An app is a file in this folder (not index.ts) that exports `app: MountApp` and `url`, the address
 * shown in the browser's bar. Its id is the file name: door.ts is { app: 'door' }. Add an app by
 * adding its file; nothing else needs registering.
 */
export interface Preview { app: string; stage: string; /** The address shown in the browser's bar, when not the app's own. */ url?: string }

type AppModule = { app: MountApp; url: string };
const files = import.meta.glob<AppModule>(['./*.ts', '!./index.ts']);
const load = (id: string) => files[`./${id}.ts`]?.();

export async function mountPreview(el: HTMLElement, p: Preview): Promise<PreviewApp> {
  const m = await load(p.app);
  if (!m) throw new Error(`v2 preview: no app ${p.app}`);
  return m.app(el, p.stage);
}
export async function defaultUrl(id: string): Promise<string> {
  return (await load(id))?.url ?? '';
}
