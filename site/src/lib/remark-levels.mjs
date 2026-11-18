// Turns markdown blockquotes that start with a level tag into deeper blocks:
//
//   > [!technical] What a token is
//   > A token is a piece of a word…
//   >
//   > > [!engineer] Why counts differ between models
//   > > Each maker trains its own tokenizer…
//
// The output is the same markup <Deeper> renders (src/components/level/Deeper.astro),
// so levels.css and deeper-client.ts handle both. Ordinary blockquotes, and GitHub
// alerts such as [!NOTE], are left alone. On GitHub the tagged ones read as quotes.
//
// This file is loaded by the Astro config and cannot import levels.ts, so it
// repeats the labels and the glyph. Keep them in step.

const LABELS = { technical: 'Technical', engineer: 'Engineer' };
const DEFAULT_TITLES = { technical: 'More detail', engineer: 'The full detail' };
const RANK = { technical: 2, engineer: 3 };
const TAG = /^\s*\[!(technical|engineer)\][ \t]*/i;

const el = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });
const txt = (value) => ({ type: 'text', value });

function glyph(level) {
  const bars = [
    { x: 1, y: 8, h: 5 },
    { x: 5.5, y: 4.5, h: 8.5 },
    { x: 10, y: 1, h: 12 },
  ];
  return el(
    'svg',
    { className: ['level-glyph'], viewBox: '0 0 14 14', ariaHidden: 'true', focusable: 'false' },
    bars.map((b, i) => el('rect', { className: i < RANK[level] ? undefined : ['off'], x: b.x, y: b.y, width: 3, height: b.h, rx: 1 })),
  );
}

function chevron() {
  return el(
    'svg',
    {
      className: ['deeper-chevron'], viewBox: '0 0 14 14', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6',
      strokeLinecap: 'round', strokeLinejoin: 'round', ariaHidden: 'true', focusable: 'false',
    },
    [el('path', { d: 'M3.5 5.5 7 9l3.5-3.5' })],
  );
}

/** Plain text of an mdast node, with blocks separated by spaces. */
function toText(node) {
  if (!node) return '';
  if (node.type === 'html') return node.value.replace(/<[^>]+>/g, ' ');
  if (typeof node.value === 'string') return node.value;
  if (Array.isArray(node.children)) return node.children.map(toText).join(node.type === 'paragraph' ? '' : ' ');
  return '';
}

function clip(text, max = 320) {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max).replace(/\s+\S*$/, '') + '…' : t;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * If `node` is a tagged blockquote, return { level, title, children } with the
 * tag line removed. The title is whatever follows the tag on its first line.
 */
function parseTagged(node) {
  if (node.type !== 'blockquote') return null;
  const first = node.children[0];
  if (!first || first.type !== 'paragraph') return null;
  const lead = first.children[0];
  if (!lead || lead.type !== 'text') return null;
  const match = lead.value.match(TAG);
  if (!match) return null;

  const level = match[1].toLowerCase();
  const inline = [{ ...lead, value: lead.value.slice(match[0].length) }, ...first.children.slice(1)];
  // Everything up to the first line break is the title; the rest is content.
  const titleNodes = [];
  let rest = [];
  for (let i = 0; i < inline.length; i++) {
    const n = inline[i];
    if (n.type === 'break') { rest = inline.slice(i + 1); break; }
    if (n.type === 'text' && n.value.includes('\n')) {
      const at = n.value.indexOf('\n');
      titleNodes.push({ ...n, value: n.value.slice(0, at) });
      const after = n.value.slice(at + 1);
      rest = [...(after ? [{ ...n, value: after }] : []), ...inline.slice(i + 1)];
      break;
    }
    titleNodes.push(n);
  }
  const title = titleNodes.map(toText).join('').trim();
  const children = [...(rest.length ? [{ ...first, children: rest }] : []), ...node.children.slice(1)];
  return { level, title, children };
}

function build({ level, title, children }, id) {
  const label = LABELS[level];
  const name = title || DEFAULT_TITLES[level];
  const head = () => [glyph(level), el('span', { className: ['deeper-name'] }, [txt(`${label}: `), el('span', { className: ['deeper-title'] }, [txt(name)])])];
  const part = (hName, hProperties, hChildren) => ({ type: 'deeperPart', data: { hName, hProperties, hChildren }, children: [] });
  return {
    type: 'deeperBlock',
    data: { hName: 'div', hProperties: { className: ['deeper'], dataDeeper: level, id } },
    children: [
      part('p', { className: ['deeper-mark'] }, head()),
      part('button', { className: ['deeper-toggle'], type: 'button', ariaExpanded: 'false', ariaControls: `${id}-body` }, [...head(), chevron()]),
      part('div', { className: ['deeper-extract'], ariaHidden: 'true' }, [txt(clip(children.map(toText).join(' ')))]),
      { type: 'deeperBody', data: { hName: 'div', hProperties: { className: ['deeper-body'], id: `${id}-body` } }, children },
    ],
  };
}

export function remarkLevels() {
  return (tree) => {
    const used = new Map();
    const uniqueId = (base) => {
      const n = (used.get(base) ?? 0) + 1;
      used.set(base, n);
      return n === 1 ? base : `${base}-${n}`;
    };
    const walk = (parent) => {
      if (!Array.isArray(parent.children)) return;
      parent.children = parent.children.map((child) => {
        const tagged = parseTagged(child);
        if (!tagged) {
          walk(child);
          return child;
        }
        const id = uniqueId(`deeper-${slugify(tagged.title) || tagged.level}`);
        const block = build(tagged, id);
        walk(block.children[3]);
        return block;
      });
    };
    walk(tree);
  };
}
