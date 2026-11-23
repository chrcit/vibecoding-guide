# Round 2: fix plan (draft for advice)

Round 2 is the last round that may change design. After it, only bugs get fixed. Sources: [review-sol.md](../round-1/review-sol.md) (two real learner runs in the lab) and [review-critique.md](../round-1/review-critique.md) (Neon's content review). Both learners on Codex got a correct inline result on reply 2 and changed it with one sentence, and a consented preference carried into a fresh thread. **Keep all of that.**

## Fix (in order)

1. **Safety wording.** Remove the claim that the practice project confines Full access to one folder. Say plainly what Full access allows. Say where Supervised mode is switched (the permission control under the composer) and that the agent cannot switch it for them. *(Neon 1.1; verify the UI location against T3 docs for 0.1.9 before stating it.)*
2. **Inline page recipe.** `html_render` requires `title` and `height` (80–2000). The recipe gives a height rule of thumb and uses `html_preview` only when the height is uncertain, since a preview returns an image that costs context. No `height: 100%` or `vh` on html or body. The layers figure is read as a template and passed inline; no file is written to the project. *(Neon 1.2, 2.4; height requirement checked by the lead against the live tool schema.)*
3. **Fresh threads keep the guide.** When the agent sends the learner to a fresh thread, the opener it hands over starts with `$agentic-guide`, or the agent says in one line that the fresh thread is plain and how to call the guide back. The steps that must happen in the fresh thread are written so they still work there: proving that the preference carried over, and the reminder sentence. A new project folder needs the global install; offer it as a move at that moment. *(Neon 1.3, Sol: handover close.)*
4. **Turn pacing.** Number the first session by reply: reply 1 opens, reply 2 gives the result, reply 3 names what happened and asks one question, and so on. One inline page per reply at most; the layers figure is offered, never stacked onto the first result. *(Neon 2.1.)*
5. **Show capability by doing.** Replace "invite more than they asked for" with: go one useful step past the bare ask, without asking first, so the first reply shows what a plain sentence produces. *(Neon 2.2.)*
6. **Make the AGENTS.md moment fire.** Ask about the result *and* how it was explained ("shorter, another language, bigger text, a table"), so a preference about style comes up even when the learner only gives feedback on the content. State the inferred level once, at reply 2, and include it in the consented paragraph. *(Neon 2.3, 2.4; Sol: depth calibration.)*
7. **No hardcoded providers.** At the plain level, say "the company that runs the model you picked", or name the provider the agent can actually see. Never write "Codex" or "OpenAI" into a script. *(Neon 2.4.)*
8. **Small reference fixes.** The section name in moves.md; "one inline page"; which files a clean practice folder is expected to hold, so the agent doesn't warn about its own install; and explain which call did the computation versus the hand-written text. *(Neon 2.5, Sol: execution explanation.)*
9. **Install flow.**
   - The prompt-link draft opens without a project: say so plainly and show how to pick `practice`.
   - The install prompt has the agent read SKILL.md and summarise it **before** copying anything, and wait for "yes".
   - It describes the install as "copy this folder into these two places", so the agent can do it with whatever the machine has. No bash-only commands.
   - `install.sh` stays for the terminal route and states macOS and Linux.
   - It replaces only its own earlier installs and reports any other symlink as a conflict.
   - Help lists every flag, and the "check it worked" lines appear only for places it actually wrote to.
   - The terminal one-liner cleans up its temp clone.

   *(Neon 1.4, 4; Sol: installer collision and output.)*
10. **Git is a safety net, described honestly.** Git can undo changes to files it has a snapshot of. So the agent commits once before the first task, and the guide says "anything after this snapshot can be undone". *(Sol: undo safety.)*
11. **/start/ for a non-technical scientist:**
    - "Get ChatGPT" goes to the consumer plan page, from the site's data facts.
    - Warn Claude Code users about the terminal window they will see.
    - Drop `~/.t3/projects`.
    - Name the command palette when it is first used.
    - Show what the install reply looks like.
    - Say that `$` opens a list: pick the guide, then press Enter.

    *(Neon 5.)*

## Not doing

- **Pinning the install to a tag.** The site page goes live only when it's merged to `main`, and `main` then holds the skill. A release tag comes when the owner ships.
- **Native Windows support for `install.sh`.** The agent-driven install covers Windows. The script says macOS and Linux.
- **New features.** No more modules, no progress file, no new figures.

## After advice (lead's decisions, these win over the list above)

- **Item 1:** state the 0.1.9 wording. In a thread on your default mode, open the model picker and choose Permissions at its bottom, or press `mod+shift+a`. Learners re-check the mode when they open a fresh thread. *(Sol, from the v0.1.9 docs.)*
- **Item 2:** `html_preview` before `html_render` is **mandatory**. That matches T3's own tool description ("use the contentHeight from html_preview") and catches broken or clipped pages before the learner sees them. The cost is one image per page, and there is at most one page per reply. *(Neon; the lead's cost concern is overruled.)*
- **Item 3:** the fresh thread is a **plain, preference-free** test. The agent finishes the check and the handover inside thread 1 and gives a plain opener with a small invented task and no hint of the saved rule. It gives the `$agentic-guide` sentence separately, for later. A global install makes the guide available in other projects, but the saved preference stays with this project. *(Sol, Neon.)*
- **Items 4–6:** reply numbers are checkpoints, not a script. A content request like "put Sedge first" gets the revised result straight away. Any extra step stays reversible and tied to the ask. Ask about explanation style once if it hasn't come up. Confirm an inferred level before putting it in the paragraph offered for saving. *(Sol.)*
- **Item 9:** reuse an existing `practice` project, or tell the learner to pick it. Never create a second one. *(Neon.)*
- **Item 10:** no automatic commit. After the first result, the agent offers a snapshot, with consent and a list of the files it covers. It says honestly that Git restores tracked files to the snapshot and that brand-new files need separate handling. *(Sol.)*
- **Picker check:** whether the `$` picker shows the skill in the web UI right after install, or needs a fresh thread or a restart, is tested in round 2's review. The recovery that actually works gets documented. *(Sol.)*
- **Launch note for the owner:** pin the install to a release tag before the page goes public. *(Neon.)*
