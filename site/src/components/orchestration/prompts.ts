// A prompt that starts each way of running a team, on the guide's running examples.
// Shown on the orchestration board in a CopyPrompt, one at a time.
import type { PatternId } from '../fig/team-lab/model';

export const PROMPTS: Record<PatternId, { title: string; text: string }> = {
  solo: {
    title: 'One agent, checked at each step',
    text: `The bakery site shows the normal opening hours on 25 December. Find out why.

Write a test for 25 December that fails first, then fix the code until it passes. Show me the diff and the test output, and stop there so I can review it.`,
  },
  review: {
    title: 'Build, then a fresh reviewer',
    text: `Add a "paid this season" column to the club list's members page.

When the change works, start a subagent that has not seen this conversation and give it only the diff. Ask it to report problems that affect correctness, each with file and line, and to skip style. Fix what it finds, then show me the diff and its report.`,
  },
  plan: {
    title: 'Plan first, then builders and a reviewer',
    text: `We are adding payment status to the club list.

First write a plan that splits the work into pieces that touch separate files, each with what done looks like. Stop and show me the plan.

Once I approve it, build each piece with its own subagent. Have a reviewer subagent check each piece against the plan before anything comes back to me. No more than two review rounds per piece.`,
  },
  parallel: {
    title: 'One of several threads, each in its own worktree',
    text: `This thread works only on the contact tidy's date formats, in its own worktree. Another thread owns duplicate detection: do not touch it.

When the tests pass, stop and tell me the branch name, the files you changed, and anything you were unsure about.`,
  },
  lead: {
    title: 'A lead that hands out pieces',
    text: `Clean up the exported contacts: duplicates, mixed date formats, stray whitespace.

Split the file into five parts and give each part to a subagent with these same rules. Each subagent reports the row numbers it changed and the rows it was unsure about, not a summary. Subagents may not start subagents.

Merge the results yourself and show me the unsure rows first.`,
  },
  best: {
    title: 'The same prompt to two models',
    text: `The bakery site shows the normal opening hours on 25 December.

Write a failing test for 25 December first, then the fix. End with the diff, the test output, and one sentence on what you changed and why.`,
  },
};
