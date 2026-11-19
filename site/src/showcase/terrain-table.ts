import type { Piece } from '../lib/showcase';

export const piece: Piece = {
  slug: 'terrain-table',
  title: 'The terrain table',
  category: '3d',
  summary: 'A small low-poly landscape on a table that you can turn, flood, roughen and light from dawn to midnight.',
  path: 'showcase/play/terrain-table/',
  height: 640,
  built: '2026-11-18',
  builtWith: 'Claude Opus 5.5 in Claude Code',
  prompt: `A 3D playground: a small low-poly landscape on a table that the visitor can turn and reshape. Controls for sea level, roughness and time of day; drag to orbit, scroll or pinch to zoom, and the same from the keyboard; a "new landscape" button that changes the seed, with the seed kept in the URL so a landscape can be shared. Generated from seeded noise written by hand. It renders a first frame quickly, loads three only when the scene is about to be shown, pauses rendering when nothing changes or the tab is hidden, does not auto-rotate under reduced motion, and shows a designed fallback with an explanation when WebGL is unavailable. Controls are real form controls with labels. It should be beautiful: considered light, colour and fog, not a default scene.

Self-contained: no network requests, no remote fonts, works at 390px wide, from the keyboard, with reduced motion, in light and dark. Fictional content only.`,
  story: [
    'The agent built the piece as a single Astro page, with all the scene code in its own client script and three imported dynamically, because a helper file under the pages folder would have become a route. The page has the landscape seed in the URL, sliders for sea level, roughness and time of day, a switch for slow turning that starts off under reduced motion, a new-landscape button and a copy-link button. The noise is hand-written and seeded, and there is a designed fallback panel for browsers without WebGL.',
    'The first screenshot showed the fallback explanation ("This table needs 3D graphics") in the page text next to the controls. The panel had the hidden attribute, but the page\\\'s own display rules overrode it; a rule making hidden elements stay hidden fixed that, and a check two seconds after a reload found the panel hidden and the scene counting frames. The agent also removed some unused code, then changed the look: lighter soil and tree colours, a paler, more transparent sea, a camera pulled back from a radius of 19 to 23, and a view offset to centre the table in the space left of the controls on wide screens.',
    'The session was cut off in the middle of that adjustment. A further edit to pull the camera back to 27 and raise the zoom limit was rejected and is not in the file. By then the page had been looked at only in the preview browser at 1280px in light mode, with one seed. It had not been checked at 390px, in dark mode, with the keyboard controls, under reduced motion, or with WebGL actually unavailable, and it was not viewed inside the showcase page. The site\\\'s judge was not run on it and nothing was committed.',
    'A later session finished those checks. At 390px the table was cut off at the left edge, so the camera now starts further back in a narrow window. In dark mode the page showed no sideways scroll, every control could be reached with the Tab key, and under reduced motion the slow turning started switched off. The page with WebGL unavailable has still not been looked at in a browser.',
  ],
  order: 1,
};
