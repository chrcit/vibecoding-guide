/*
 * Guide v2's Preview tab: the app the agent is building in the lesson, as a working page inside the
 * drawing of T3 Code's browser panel. The lesson data (v2/content.ts) says which app and which
 * stage each point shows (`Point.preview`); the player (v2/player.ts) mounts it.
 *
 * Contract (shared by three builders working in parallel, keep it stable):
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
  | 'fixed';

export interface PreviewApp { set(stage: string): void; destroy(): void }
export type AppId = 'door';
export interface Preview { app: AppId; stage: DoorStage; /** The address shown in the browser's bar. */ url?: string }

export type MountApp = (el: HTMLElement, stage: string) => PreviewApp;
const registry: Partial<Record<AppId, () => Promise<MountApp>>> = {
  door: () => import('./door').then((m) => m.door as MountApp),
};
export async function mountPreview(el: HTMLElement, p: Preview): Promise<PreviewApp> {
  const load = registry[p.app];
  if (!load) throw new Error(`v2 preview: no app ${p.app}`);
  return (await load())(el, p.stage);
}
export const DEFAULT_URL: Record<AppId, string> = { door: 'localhost:4321/door' };
