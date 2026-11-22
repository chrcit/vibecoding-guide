/*
 * The chat screen that used to stand beside the picture is gone (planning/journey-mobile/SPEC.md):
 * what people say is now a speech bubble on the picture (overlay.ts). Chapters still call
 * ctx.screen; every call does nothing until the chapters drop them. Keep the types so they compile.
 */

export type ScreenForm = 'chat' | 't3' | 'term' | 'off';
export type RowKind = 'search' | 'read' | 'edit' | 'run' | 'check';
export type Status = 'work' | 'wait' | 'ok' | 'bad' | 'plan' | 'idle' | 'off';
export interface ScreenSetup {
  form?: ScreenForm;
  app?: string;
  project?: string;
  chips?: string[];
  threads?: { name: string; status?: Status }[];
}
/** Does nothing. Kept so chapter scripts that still call it keep working. */
export interface ScreenApi {
  setup(o: ScreenSetup): void;
  row(kind: RowKind, label: string, detail?: string, state?: 'ok' | 'bad'): void;
  result(text: string, state?: 'ok' | 'bad'): void;
  history(lines: [who: string, text: string][]): void;
  focus(on: 'screen' | 'both'): void;
}

export const noScreen: ScreenApi = { setup() {}, row() {}, result() {}, history() {}, focus() {} };
