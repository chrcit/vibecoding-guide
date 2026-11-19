// The brief and the worktree commands shown on the orchestration board and at the top of the long
// read. The underscore keeps Astro from routing this file.
//
// The commands were run as written, with git 2.50, in a throwaway repo with two branches that edit
// the same line: the second merge stops with a conflict, the rebase stops on it, and after the fix
// both merges fast-forward and the tests pass. Keep them that way: change a command only after
// running the new sequence.

export const BRIEF = `Goal: add a "paid this season" column to the members page of the club list.

Work only in this folder (club-list-paid, branch paid-column). Another agent owns member search: do not touch src/search/.

Do not change the database schema. Do not merge, push or delete anything.

Done when: npm test passes, and the members page shows the column for one paid and one unpaid member.

Report back: the files you changed, the test command and its output, and anything you were unsure about. No summary of the codebase.

If you are stuck after two tries, stop and tell me what is in the way.`;

export const FOLDERS = `projects/
  club-list/         main, the copy you trust
  club-list-paid/    paid-column, agent 1
  club-list-search/  member-search, agent 2`;

export const COMMANDS = `# in club-list/: one folder and branch per agent
git worktree add -b paid-column ../club-list-paid
git worktree add -b member-search ../club-list-search
git worktree list

# the gate: run the checks in the agent's folder
cd ../club-list-paid && npm test

# merge one branch at a time, test after each
cd ../club-list
git merge paid-column
npm test

# a clash: back out, bring the branch up to date
git merge member-search    # CONFLICT in members.js
git merge --abort
cd ../club-list-search
git rebase main            # fix the file, git add it,
git rebase --continue      # then continue
npm test
cd ../club-list
git merge member-search
npm test

# tidy up when a branch is in
git worktree remove ../club-list-paid
git branch -d paid-column`;
