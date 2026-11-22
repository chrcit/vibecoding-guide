/*
 * The browser panel's Preview tab: the app the agent is building, mounted through v2/preview
 * (`mountPreview`). One app stays mounted while the lesson moves through its stages, so what the
 * reader typed or tapped survives a step. The registry and the apps load on demand; if one fails to
 * load (an app that isn't built yet), the tab shows an empty page instead.
 */
import type { Preview, PreviewApp } from '../preview';

export interface PreviewPane {
  /** Show this preview, or the empty page for null. Resolves with the address to show. */
  set(p: Preview | null): Promise<string>;
  destroy(): void;
}

export function previewPane(el: HTMLElement): PreviewPane {
  let app: PreviewApp | null = null;
  let appId: string | null = null;
  let host: HTMLElement | null = null;
  let want: Preview | null = null;
  let gen = 0;

  function teardown() {
    app?.destroy();
    host?.remove();
    app = null; appId = null; host = null;
  }
  function empty() {
    teardown();
    el.dataset.state = 'empty';
  }
  async function address(p: Preview): Promise<string> {
    if (p.url) return p.url;
    try { return (await import('../preview')).DEFAULT_URL[p.app] ?? ''; } catch { return ''; }
  }

  async function set(p: Preview | null): Promise<string> {
    want = p;
    if (!p) { gen++; empty(); return ''; }
    if (app && appId === p.app) { app.set(p.stage); return address(p); }
    teardown();
    const mine = ++gen;
    el.dataset.state = 'loading';
    host = document.createElement('div');
    host.className = 'v2-preview-host';
    el.append(host);
    try {
      const { mountPreview } = await import('../preview');
      const made = await mountPreview(host, p);
      if (mine !== gen) { made.destroy(); return ''; }
      app = made; appId = p.app;
      el.dataset.state = 'ready';
      // The lesson may have moved on while the app loaded.
      if (want && want.app === p.app && want.stage !== p.stage) made.set(want.stage);
    } catch {
      if (mine === gen) empty();
      return '';
    }
    return address(p);
  }

  return { set, destroy() { gen++; teardown(); } };
}
