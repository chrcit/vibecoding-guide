import { picture, poster, type SceneState, type Block } from '../../../site/src/journey/picture';
import { team, lab } from '../../../site/src/journey/presets';
const frame = { w: 1000, h: 500 };
const b = (t: any, h: number): Block => ({ t, h });
function base(): SceneState {
  const s = team(3, { trees: true, mgate: true, lead: [] }); s.zoomMax = 4;
  return s;
}
const beats: { s: SceneState; notes: [string, string, string?][] }[] = [];
const mk = (f: (s: SceneState) => void, notes: [string, string, string?][]) => { const s = base(); f(s); s.labels = notes.map(([at, text, place]) => lab(at as any, text, (place as any) ?? 'top')); beats.push({ s, notes }); };
const A = (s: SceneState, id: string) => s.agents.find((a) => a.id === id)!;
mk((s) => { A(s, 'a0').blocks = [b('you', 6)]; }, [['you', 'you', 'left'], ['a0', 'the lead', 'bottom'], ['tank:a0', 'its window: your request', 'left']]);
mk((s) => { A(s, 'a0').blocks = [b('you', 6), b('tool', 8), b('model', 6)]; A(s, 'a0').busy = true; }, [['a0', 'the lead plans', 'bottom'], ['tank:a0', 'read the spreadsheet, wrote a plan', 'left']]);
mk((s) => { A(s, 'a0').blocks = [b('you', 6), b('tool', 8), b('model', 6)]; for (const id of ['w0', 'w1', 'w2']) { A(s, id).blocks = [b('model', 5)]; A(s, id).lamp = 'work'; A(s, id).busy = true; } }, [['w1', 'three helpers, one brief each', 'top'], ['a0', 'the lead waits', 'bottom']]);
mk((s) => { A(s, 'a0').blocks = [b('you', 6), b('tool', 8), b('model', 6)]; [['w0', 30], ['w1', 44], ['w2', 22]].forEach(([id, h]: any) => { A(s, id).blocks = [b('model', 5), b('tool', h * 0.5), b('model', 4), b('tool', h * 0.5)]; A(s, id).lamp = 'work'; A(s, id).busy = true; }); }, [['tank:w1', 'each fills its own window', 'top'], ['tank:a0', 'the lead: still small', 'left']]);
mk((s) => { A(s, 'a0').blocks = [b('you', 6), b('tool', 8), b('model', 6), b('sum', 3), b('sum', 3), b('sum', 3)]; [['w0', 30], ['w1', 44], ['w2', 22]].forEach(([id, h]: any) => { A(s, id).blocks = [b('model', 5), b('tool', h * 0.5), b('model', 4), b('tool', h * 0.5)]; A(s, id).lamp = 'ok'; }); s.gates![0].lamp = 'work'; }, [['tank:a0', 'three short reports', 'left'], ['mgate', 'the check runs', 'top']]);
mk((s) => { A(s, 'a0').blocks = [b('you', 6), b('tool', 8), b('model', 6), b('sum', 3), b('sum', 3), b('sum', 3), b('model', 5)]; [['w0', 30], ['w1', 44], ['w2', 22]].forEach(([id, h]: any) => { A(s, id).blocks = [b('model', 5), b('tool', h * 0.5), b('model', 4), b('tool', h * 0.5)]; A(s, id).lamp = 'ok'; }); s.gates![0].lamp = 'ok'; s.project!.commits = ['ok', 'ok', 'ok']; }, [['main', 'three changes on main', 'top'], ['mgate', 'passed', 'top'], ['you', 'you read one summary', 'left']]);
const out = beats.map(({ s }) => { const p = picture(s, frame); return { svg: poster(s, frame), labels: p.labels.map((l) => ({ text: l.text, x: +(l.x / frame.w * 100).toFixed(2), y: +(l.y / frame.h * 100).toFixed(2), place: l.place })) }; });
console.log(JSON.stringify(out));
