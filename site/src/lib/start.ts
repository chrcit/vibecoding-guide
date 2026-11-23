// The first hour: what a reader can build, and every prompt on the start page.
// One place, so the start page, the samples catalog (lib/samples.ts) and the
// prompts page all use the same words.

export type BuildId = '3d' | 'app' | 'site';

export const builds: { id: BuildId; label: string; piece: string; alt: string }[] = [
  { id: '3d', label: 'A 3D thing', piece: 'terrain-table', alt: 'A small low-poly island on a wooden table, with hills, trees and water.' },
  { id: 'app', label: 'A mini app', piece: 'club-list', alt: 'A football club’s list of members, showing who has paid and who still owes.' },
  { id: 'site', label: 'A website', piece: 'bakery-page', alt: 'A bakery’s web page that says in large letters that it is open until 14:00.' },
];
export const DEFAULT_BUILD: BuildId = 'app';

/** How the reader describes themselves to the agent, by reader level. */
export const who = {
  placeholder: 'a football coach who also keeps the club’s books',
  empty: '[say what you do]',
  plain: 'I have never written code. Use plain words and explain one thing at a time. When you need a technical word, say what it means in the same sentence. Ask me before you install anything or do something that cannot be undone.',
  technical: 'I am comfortable with a terminal, Git and basic deployment, but I do not write code for a living. Skip the basics. Tell me what you decided and why, and show me the commands you run.',
  engineer: 'I am a software engineer. Be brief. Show me diffs, commands and test output instead of summaries. Name the trade-offs you considered, and tell me when you think I am wrong.',
} as const;

export const first = {
  before: 'Before we build anything, here is who you are working with.\n\nI am ',
  after: `

Write this down in a file called AGENTS.md in this folder, in a few short lines, so that every new conversation here starts with it. If you are Claude Code, also create a CLAUDE.md that contains only the line @AGENTS.md.

From now on, when I correct you or tell you how I like to work, add it to AGENTS.md without being asked.`,
};

const ending = 'Ask me anything you need to know first. Then build it and tell me how to open it.';

export const describe: Record<BuildId, string> = {
  '3d': `I want a small 3D scene that runs in the browser: a little landscape on a table, with hills, water and trees, that I can turn with the mouse.

Add three sliders: how high the water is, how rough the hills are, and the time of day.

Nothing online and no accounts. ${ending}`,
  app: `I want a small web app for a neighbourhood football club to track who has paid this season.

It needs a list of members with their name, their team and whether they have paid, a form to add a member, and a way to mark someone as paid. Keep the data on this computer, so it is still there when I come back.

No login and nothing online. ${ending}`,
  site: `I want a one-page website for a small bakery I made up: what they bake, where they are and when they are open.

The top of the page should say whether the bakery is open right now, and when it next opens or closes. Make up the name, the address and the opening hours.

Nothing online yet. ${ending}`,
};

export const look = 'Start it so I can try it in the browser here. Tell me what to click first.';

export const change: Record<BuildId, string> = {
  '3d': `Three changes:
- Make the water move a little.
- Add a button that makes a new landscape.
- Let the scene turn slowly by itself until I touch it.

Show me when it is done.`,
  app: `Three changes:
- Sort the list by team, then by name.
- Make the members who have not paid easy to spot.
- At the top, show how many have paid out of the total, like "18 of 25 paid".

Show me when it is done.`,
  site: `Three changes:
- Show the opening hours for the next seven days.
- The bakery is closed on 25 December. Make the page know that.
- Make it look good on a phone.

Show me when it is done.`,
};

export const ask = `Explain what you built, at my level.
- What the parts are and how they fit together.
- What you decided for me, and what else you could have done.
- The one thing I should understand before we go on.

Then ask me one question to check I followed.`;

export const check = `How do we know this works?
1. Add checks that run on their own for the things that matter most. Run them and show me the result.
2. Tell me what they cover and what they do not.
3. Give me three things to try by hand, including one that might break it.`;

export const save = `Save this version with Git, and tell me how I would get back to it.

Then update AGENTS.md with what you learned today: how to start and check this project, what I asked you to change, and how I like things explained. Keep it short, and remove anything that is no longer true.`;

/** Short things to send as they are. */
export const say = {
  approval: 'What does this do, and why do you need it?',
  remember: 'Add that to AGENTS.md.',
  simpler: 'Explain that more simply.',
  where: 'Show me where that is in the files.',
  proof: 'Show me the output that proves it.',
};

export const testFirst = 'Before you change how it behaves, write a test for the change that fails now. Run it and show me the failure. Then make it pass, run all the checks, and show me the output.';

export const review = `Review the changes on this branch against the base branch. You did not write them.

List problems in order of importance: bugs, then missing tests, then anything that will be hard to maintain. Name the file and line for each. Do not edit any files.`;

export const permissions = `{
  "permissions": {
    "allow": ["Bash(npm run *)", "Bash(git commit *)"],
    "deny": ["Bash(git push *)"]
  }
}`;

/**
 * The club-list prompt with more on top for readers who want it: the checks to run (technical),
 * and a stack decision to make before building (engineer). Used by the lesson "Your first real loop".
 */
export const describeChecked = `${describe.app.replace(ending, '')}Use TypeScript. Keep the rules (who has paid, the counts) in their own file with tests.

Before you tell me it is done, run the tests and the type check (npm test, npx tsc --noEmit) and show me the output. Then save the version with Git.

${ending}`;

export const describeEngineer = `${describe.app.replace(ending, '')}Before you write code, propose the stack in three lines: framework, where the data lives, how it is tested. Name one alternative and why not, and wait for my OK.

Then: strict TypeScript, the rules in a pure module with unit tests (empty list, a member with two seasons), npm test and npx tsc --noEmit green before you report, one commit per working step, and an AGENTS.md with the commands to run and check it.

${ending}`;

/*
 * The guide skill (skills/agentic-guide) and how the getting-started page installs it.
 * The repository and branch are the owner's default: this repo's public GitHub path.
 * Until the skill is merged to main, a clone of main does not contain it.
 */
export const skill = {
  name: 'agentic-guide',
  repo: 'chrcit/vibecoding-guide',
  branch: 'main',
  path: 'skills/agentic-guide',
  project: 'practice',
};
const repoUrl = `https://github.com/${skill.repo}`;
export const skillUrl = `${repoUrl}/tree/${skill.branch}/${skill.path}`;

/**
 * What the install button drafts in T3 Code, and what the copy fallback copies.
 * Two turns: the agent reads and summarises the skill, then waits for "yes" before copying.
 * The copy is described as "this folder into these two places", so the agent can do it with
 * whatever the machine has (macOS, Linux or Windows); no bash-only commands.
 */
export const installPrompt = `Install the ${skill.name} skill into this project, so I can start the guide here.

1. Check where this thread works. It should be my T3 Code project called "${skill.project}", not a folder under a "scratch" folder. If it is not, stop and tell me to pick ${skill.project} at the top of a new draft and send this message again there. If I have no ${skill.project} project yet, tell me to make one (Cmd/Ctrl+K, New project, "${skill.project}"). Never create a second one.
2. Get the folder ${skill.path} from ${repoUrl} (branch ${skill.branch}) into a new temporary folder, with whatever this computer has.
3. Read its SKILL.md and tell me in two plain sentences what it will make you do. Then stop and wait until I say yes. Copy nothing before that. If I say no, delete the temporary folder and stop.
4. When I say yes, copy the whole ${skill.name} folder, with all its files and subfolders, into two places in this project: .claude/skills/${skill.name} and .agents/skills/${skill.name}. If a place already holds an earlier ${skill.name}, delete that one first and then copy, so the new copy replaces it instead of landing inside it. If a place holds anything else, delete the temporary folder, then stop and tell me. Change nothing else on my computer.
5. Delete the temporary folder. Show me that both places now hold SKILL.md, moves.md and the folders mechanisms and figures.
6. Finish with one short line: start a new thread in this project, type $, pick ${skill.name} from the list and press Enter.`;

/** A T3 Code prompt link: opens a draft, never runs anything (docs/user/prompt-links.md). */
export const promptLink = (prompt: string) => `https://app.t3.codes/new?prompt=${encodeURIComponent(prompt)}`;

/**
 * The terminal route, for macOS and Linux. Run it inside the project folder. It clones into a
 * temporary folder and removes that folder afterwards, whatever happens. `flags` go to install.sh.
 */
export const installTerminalFor = (flags = '') =>
  `(d="$(mktemp -d)" && trap 'rm -rf "$d"' EXIT && git clone --depth 1 --branch ${skill.branch} ${repoUrl}.git "$d/guide" && bash "$d/guide/${skill.path}/install.sh"${flags ? ` ${flags}` : ''})`;
export const installTerminal = installTerminalFor();
export const installTerminalGlobal = installTerminalFor('--global');
