# Prior art for the T3 Code course

Checked 21 November 2026 against project documentation and listings.

1. **Discord’s Claude Code Tutorial** is an installable course that starts by asking what real task you want to do and teaches agent workflows on that task. Its lessons are delivered as terminal dialogue and exercises. [Project README](https://github.com/discord/claude-code-tutorial#the-tutorial)
2. **cc-self-train** uses Claude Code skills to run an adaptive course in the session, including a bring-your-own-project track. Every project follows the same ten-module sequence from setup to orchestration. [Project README](https://github.com/zainnab-sparq/cc-self-train)
3. **Academy Coach** turns Claude Academy material into an installable tutor with exercises in your repository and session reviews. It follows Academy units and checks understanding through conversational quizzes. [Project README](https://github.com/MrMarudi/academy-coach#what-each-skill-does)
4. **teach-me** is a Claude Code plugin that turns a learner’s real diff or PR into a short lesson with an interactive diagram and quiz. Its output is a standalone Claude Artifact or HTML file for reviewing a change. [Project README](https://github.com/sshah03/teach-me#use)
5. **CodeSensei** watches ordinary Claude Code sessions and quizzes learners using what they just built. It teaches programming concepts through short explanations and belt progression. [Project README](https://github.com/DojoCodingLabs/code-sensei)
6. **Learning Output Style** is Anthropic’s plugin for teaching during everyday work by explaining design decisions and asking learners to write selected code. It changes how Claude collaborates across a session. [Anthropic marketplace](https://claude.com/marketplace/plugins/learning-output-style)
7. **VibeTour** bundles a Codex and Claude Code skill that builds interactive walkthroughs of live source or recent edits. Learners play them in a VS Code panel and follow highlighted lines through the codebase. [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=vibetour.vibe-tour)
8. **Guided Learning Skill** runs a conversational curriculum with recall checks and generated interactive HTML. Its workflow centres on studying a topic or source in a knowledge vault. [Project README](https://github.com/WSE-research/guided-learning-skill)

## Verdict

The core idea already exists. Discord’s tutorial starts with a task you choose, and cc-self-train takes your real project through a full course. The closest thing to a new combination I found is a course that uses interactive figures in the same T3 thread to explain the agent workflow as you use it, for example showing the actual delegation tree just after you’ve sent work to child agents. T3 already supports inline HTML. [T3 Code documentation](https://github.com/pingdotgg/t3code/blob/main/docs/user/html-renders.md)

The biggest risk is timing. If the tutor pauses for a lesson when someone is trying to finish a task, they’ll turn it off. A lesson earns that pause when it helps the learner make the decision already in front of them.
