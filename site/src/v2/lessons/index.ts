/*
 * Guide v2's lessons: every file v2/lessons/l<N>.ts default-exports one Lesson whose id matches its
 * row in the table of contents (TOC in v2/content.ts). A lesson with a file plays; the rest show in
 * the sidebar as rows to come. Add a lesson by adding its file; nothing else needs registering.
 */
import { TOC, type Lesson, type Ui } from '../content';

// l<N>.ts for the numbered lessons, s-<name>.ts for the Set up threads (ids s-providers etc.).
const files = import.meta.glob<{ default: Lesson }>(['./l*.ts', './s-*.ts'], { eager: true });
export const LESSONS: Record<string, Lesson> = {};
for (const m of Object.values(files)) LESSONS[m.default.id] = m.default;
for (const c of TOC) for (const l of c.lessons) l.plays = !!LESSONS[l.id];

/** The order lessons are taught in, for features that stay once taught. */
export const ORDER = TOC.flatMap((c) => c.lessons.map((l) => l.id));

/** What the app shows at a point: everything taught up to and including it. */
export function uiAt(lessonId: string, part: number, point: number): Ui {
  const ui: Ui = {};
  for (const id of ORDER) {
    const lesson = LESSONS[id];
    if (!lesson) { if (id === lessonId) return ui; continue; }
    for (let p = 0; p < lesson.parts.length; p++) {
      const pts = lesson.parts[p]!.points;
      for (let i = 0; i < pts.length; i++) {
        if (id === lessonId && (p > part || (p === part && i > point))) return ui;
        Object.assign(ui, pts[i]!.ui);
      }
    }
    if (id === lessonId) return ui;
  }
  return ui;
}

