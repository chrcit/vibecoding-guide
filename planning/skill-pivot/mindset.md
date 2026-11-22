# The mindset to pass on

Distilled from one long session on 2026-11-18 in which the owner helped a scientist new to agents get started. De-identified and paraphrased: no names, workplaces, research topics, data or quotes. Detailed notes stay outside the repo.

## The arching goal

The owner opened with a promise: after today you won't need coaching; try your own problems, be surprised how easily they fall, then go after bigger ones. The session made that true. Nothing about the tool was taught for its own sake. Every high point came from the learner's own material, and it ended with a handover: a project, a context file describing them, and the habit of just asking.

The goal to carry into the skill: the learner leaves convinced, by evidence from their own work, that they are now far more capable; that a few sentences stand between them and most results; and that their judgement is the part nobody else can supply.

## The mindset in seven lines

1. It's all text. A prompt, a skill, the model's thinking, a context file: words you can read, write and change.
2. Context is capability. Say who you are, what you know and what you want, the way you'd ramble to a colleague.
3. Never wait. Add information while it runs, queue the next question, start another thread, walk away.
4. Your job is to check, and you can ask the agent to build the checking: a view, a test, five tries before it comes back to you.
5. Ask for more than you need. The first result is a floor, and usually less than you are.
6. When something annoys you, say so and the workflow bends. Nobody has to show you a feature first.
7. Mistakes are cheap and changes cost nothing, as long as you look before anything leaves your hands.

## The moments that landed, and why

- **Their own problem, first.** The owner asked for two things the learner wanted done this month: one easy and personal, one hard from their field. In the prompt, the owner admitted they didn't understand the hard one, asked the agent to explain it while solving it, and told it to do more than asked because the learner didn't yet know what it could do. Wonder needs a reference point, and only their own work provides one.
- **From watching to handing over.** After a toy result in their field, the learner said they had a real problem and spoke it straight into the tool. Half an hour in, the demo had become their work. This is the moment to design for.
- **Recognition.** From a spoken description, the agent produced synthetic data with exactly the shape of the learner's real data, plus a working analysis around it. The learner compared it to work normally given far more time, and in the same breath called their own role checking it. Being understood at that scale did more than any explanation.
- **It's just a sentence.** Three small moments demystified the most. A skill turned out to be one markdown file. A two-sentence prompt kept in the clipboard fixed a whole layout. A list of questions became a clickable multiple-choice form because the owner was annoyed by plain text and said so. Each time, the feature was a sentence anyone could have written.
- **Verification in their language.** Telling the agent to review its own work and fix it in a loop was fine. Telling it to try five times before coming back landed hard, because it mapped onto statistics, which the learner knows well. Scepticism turned into a test they wanted to run.
- **Their expertise winning.** The learner caught a fabricated claim in a list of generated research questions, and also got a method suggestion they hadn't considered. Both mattered: the agent adds ideas, and the expert stays the filter.
- **Permission.** Near the end, the owner said nobody is better placed than the learner to solve what they care about, and no video teaches more than trying. The learner called it liberating.

## What overwhelmed, and why

- **Files and where output lives.** A download button, a file viewer, a separate editor, a browser: the learner didn't know where the data was or whether opening it was safe. Asking how to open the explanation page led to dev servers, previews and deploying. Their own fallback, download it and run it, was simpler.
- **Accounts.** Logging in to accept a shared repository (two-factor codes, passwords) took longer than any concept.
- **Names.** Tools, providers and models came fast; the learner asked to have them written down.
- **Leaking context.** One generated page pulled in the topic of the other task. The learner felt silly, and nobody explained the cause: both jobs shared one context.
- **Instructions not followed.** The agent rendered inline something meant for the browser. Small, but a newcomer can't tell a misread instruction from their own mistake.
- **Tangents while waiting.** Benchmarks, hosting, side projects; the owner apologised for the pace twice. This learner stayed engaged; a less technical one would have sunk.
- **Data and work.** Can I use the real data? Could my employer tell? Both came up and were handled on the fly (synthetic data, a private account). They deserve a planned place.

## Explanations that worked, by level

**Non-technical**
- Say it like you'd tell a colleague, out loud if you can. Rambling is fine.
- Look at the options and start with what you don't like.
- Changing it costs nothing. Publishing without looking is the only real risk.
- Ask for a page that shows what it's doing and how you could check it.
- Before you come back to me, try it five times.
- Tell it what annoys you and it changes.

**Medium**
- Three layers: the model writes; the harness gives it hands (files, commands, a browser); T3 Code sits on top as a viewer over threads from several providers.
- A thread is where the work lives. It can run on another machine, so closing the laptop doesn't stop it, and one thread can start and steer others.
- A skill is a markdown file the agent can load; you call it by name.
- Thinking is extra text the model writes before it answers; the effort setting decides how much.
- Synthetic data with the real shape lets you build the method without sharing the data.

**High**
- Output tokens drive cost, and effort levels scale them; the top setting can cost much more for a small gain.
- Aggregate benchmark scores don't map onto your task; your task is the test. (The learner's first question: who does the measuring?)
- What changed recently is coherence over long runs. Pipelines of role agents failed earlier because the models lost the thread, not because the idea was wrong.
- Models have temperaments: judgement over long context versus grinding through many quantitative variants.
- Cost-aware orchestration: an expensive lead, cheaper workers, an occasional second opinion.

## Implications for the first session of the skill

1. **Ask before teaching.** Two questions, answerable by voice: something personal and easy you'd like done this month, and something hard from your field. Infer the level from how they answer, then confirm it.
2. **Write the first prompt together, then name it.** Include who they are, what they know, and an invitation to do more than asked. When the result arrives, show the sentence that made it.
3. **Aim for the handover.** The session succeeds when the learner stops watching and hands over a real problem. Leave room for it; don't fill the wait with content.
4. **Keep files out of session one.** Results appear inline. If a file exists, the agent opens it for them and says in one line where it lives. No sidebars, dev servers or deploy talk unless they ask.
5. **One job, one thread.** Say it early. If context leaks anyway, stop and make it the lesson.
6. **Make checking theirs.** After the first result: what don't you like? After the second: how would you check this in your field? Then they write their own try-five-times rule.
7. **Raise the bar once.** After the first decent result, ask what would impress their peers, and request that.
8. **Let them bend the lesson itself.** The brief's AGENTS.md moment: they tell the agent to change how the lessons look or talk, and watch it happen.
9. **Say where data goes, early.** Offer synthetic data with the real shape, and suggest checking their workplace's rules before using work material.
10. **Depth on request.** Costs, tokens and benchmarks belong at the high level or when asked. Numbers come from `site/src/data`, never from this session.
11. **End with a handover.** A context file about them, the guide skill on call, a fresh thread for their own work, and one hour this week on a real problem.
