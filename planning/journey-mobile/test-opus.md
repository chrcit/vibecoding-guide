# Journey lessons on a phone: tester opus

Lessons 1 ai, 2 providers, 3 stack, 4 first, 5 chat, 6 loop, 7 window, and `/journey/foundations/`.

Setup: Playwright 1.65.1 from `site/`, 390×844, `deviceScaleFactor: 2`, `isMobile`, `hasTouch`, light and dark, against the dev server on `127.0.0.1:4826` (route `agentic-coding-guide-site`). Each step was scrolled so its top sat just under the sticky view; text of `.j-screen`, `.j-say` and `.j-stats` was read at 0.8, 2.5, 5 and 8 s; screenshots at 5 s and 8 s. A second pass clicked every non-default control of every step and read the same three places 7 s later. Level: plain (Vibe coding). Screenshots and raw JSON: `~/.local/state/agent-artifacts/vibecoding-guide/journey-mobile/opus/` (`<lesson>-<nn>-<step>-{5s,light,dark}.png`, `alt-<lesson>-<step>-<control>.png`, `data-*.json`, `alt-*.json`).

Picture part names below are from `site/src/journey/picture.ts`: the pawn (`you`), the cap (the model), the tank / glass column (the window, with its slabs), the tool cubes on the bench (`tools`), the plate of file tiles (`project`), the green tile (`rules`), the gate with its lamp (`check` / `gates`), the meter, gear (laptop, desktop, phone, server, db), people (coach, treasurer, colleague), zones.

## What the sticky view costs on a phone (all seven lessons)

Measured at 390×844 with the site header (57 px) on top:

| Part | Height |
| --- | --- |
| rail | 40 px (plus padding, ~53) |
| `.j-screen` | 104 px, fixed: shows one to two bubbles, the rest cut off by a fade at its top |
| `.j-stage` (picture) | 228 px |
| `.j-cap` (`.j-say` + `.j-stats`) | 135–230 px, grows with the readout |
| whole `.j-view` | 530–640 px |
| left for the step text | **170–258 px** of 844 |

- The caption grows while a step plays (stats wrap to two lines, the say line fills in). Because the view is sticky, every pixel it grows is taken from the step under it: the step heading I had parked just under the view was hidden a few seconds later on most steps (e.g. `providers-03-where-light.png`, `stack-04-hosting-light.png`, `first-02-job-light.png` start mid-sentence).
- The caption reserves its full height even when `.j-say` is empty (first seconds of each step, `ai-00-top.png`, `first-03-loop-5s.png`): a ~45 px blank band above the readout.
- On a hosting or server step the screen is an empty 104 px box with "New thread" or no title (`stack-04`, `stack-05`).
- The readout uses monospace bold at ~15 px CSS; long values wrap under their own label ("round 1 · 1 of 4: / you ask", "Fable 5.2, Opus 5.5, Sonnet / 5.5, Haiku 5.5").
- A first-visit level picker (Vibe coding / Technical / Engineer, with ×) covers the rail and the top of the screen on every fresh load and again after taps (`ai-00-top.png`, `alt-providers-reach-T3_Code.png`). On a phone it sits on top of the very thing a reader is trying to see.
- In this dev build a "Review 0" pill and the Astro dev toolbar sit over the bottom-right of the step text; they are dev-only and ignored below, but they cover the lower ~90 px of the already small text area.

---

## Lesson 1 · ai (What an AI model does)

Readout, every step: `in its window` · `it can reach` · `what comes back`.

| Step | What the screen and caption say | What the reader needs | Minimal version in the picture | Moves to the step text |
| --- | --- | --- | --- | --- |
| predict, default "List not pasted" | Screen: you "Who in my club has not paid this season?", reply "Ana Ruiz, Ben Okafor and Clara Novak have not paid yet." Say: "Behind the screen: its window, holding your question and nothing else." then "Three names that sound right. It never saw your club, so it made them up." Stats: your question / nothing else / 3 names, made up | You asked; the window held only the question; the answer is invented. | Short bubble at the pawn: "Who hasn't paid?" Then a bubble at the cap: "Ana, Ben, Clara" with the slab in the tank turning accent (it already does) and a lamp-word "made up" on the slab. The tank label already reads "its window: your question": keep it. | "It never saw your club, so it made them up." and the readout line "in its window: your question · reaches: nothing else". |
| predict, "List pasted in" | Screen: "the member list, 40 rows, pasted below / Who has not paid…", reply "7 have not paid: Ana Ruiz, Ben Okafor, Dev Patel and 4 more." Say: "Every name came from the list in its window." Stats: your question and the list / 7 names, from your list | Same question, but the list is now in the window, so the answer is real. | Tank label "its window: question + list" (two slabs, one taller). Cap bubble: "7 names". | "Every name came from the list in its window." |
| inputs, Voice note (default) | Screen: "a 2-minute voice note, recorded on the walk home", reply "Six to-dos: book the hall for 12 March, chase 7 unpaid members, order 10 boards…" Stats: the note as text / a to-do list | Anything you give it becomes text in the window. | Pawn bubble with an icon word: "voice note"; the slab drops into the tank labelled "as text"; cap bubble "6 to-dos". | The full to-do list and "Talking is the quickest way…". |
| inputs, Photo | Reply: "14 rows: name, date joined, paid or not. Row 9 is hard to read: is it “Lena” or “Lina”?" Stats: the photo / 14 rows and one question | It can misread; a good answer asks. This is the one point of the step. | Cap bubble: "Lena or Lina?" (a question back to the pawn). One word is enough. | "It can misread a photo, so a good answer asks." |
| inputs, Screen recording | Reply: "You do the same 5 steps each week. Steps 2 to 4 could be one button." | It can read a recording too. | Cap bubble: "5 steps → 1 button". | Rest of the reply. |
| inputs, A decision | You: "A spreadsheet or a small app for 40 members? Give me the trade-offs." Reply ends "One question: who else needs to see it?" | It can help you choose, and it asks back. | Pawn bubble "sheet or app?"; cap bubble "who else sees it?". | The trade-offs sentence. |
| modes, Chat (default) | You: "Make the member list show who has not paid." Reply: "Here is the code. Paste it into your file and tell me if anything breaks." Say: "You carry the code to the file, open it, and carry any error back." Stats: your message / nothing else / code you copy and try | In chat, you are the courier. | The picture already has a card "code to copy" next to the pawn. Add a short pawn-to-card arrow or a bubble at the pawn "paste, run, report back". | "You carry the code…" and the readout. |
| modes, Work | You: "…The list is members.xlsx in my Drive." Work log: Read members.xlsx, Changed members.xlsx. Reply: "I added an “Unpaid” column…" Say: "It reached your file and wrote to it. It ran nothing, and nothing checked it." Stats: your message, the sheet / the web, files you connect / a changed spreadsheet | At work it can open and change a connected file, but nothing tries it. | A tool cube lights, the one file tile turns amber then plain; a word on the tile "members.xlsx". No lamp (no check), which is the point. | "It ran nothing, and nothing checked it." |
| modes, Coding agent | Log: Read members.ts, Changed members.ts, Ran command "opened the page and tried it". Reply: "…I tried it: 7 of 40 show." Stats: message, 2 files, the test run / your project folder / the page, changed and tried | It works in the folder and tries what it made. | Tool cubes light in turn; a tile goes amber; cap bubble "tried it: 7 of 40". | The readout's full values. |
| code, The member list page (default) | Log: check "Tried it: the page says 8 unpaid, the list has 7." then check "Tried again: 7 unpaid, matches the list." Say: "The wrong count never reached you. The check caught it and sent it back." Stats: the list, the code / your project, a test run / the page, count checked: 7 | Code can be tried; the check catches 8 ≠ 7 before you see it. | On the check's lamp: accent with "8 ≠ 7", then green with "7 ✓". That is the whole step. | "The wrong count never reached you." and the readout. |
| code, A letter to members | Log: check "Nothing to run. A letter goes straight through." Reply: "Dear member, our records show 8 of you have not yet paid…" Say: "The list says 7. The letter says 8. Only you can notice." Stats: the list / nothing else / a letter: you are the check | A letter cannot be run, so the check lets it through and the error reaches you. | Lamp stays dark with the word "nothing to run"; bubble at the pawn: "8? the list says 7". | "Only you can notice." |

Other phone problems, lesson 1:

- The first screen a phone reader sees (`ai-00-top.png`) is the level picker over the rail, a chat with one bubble, a faded picture (stage at reduced opacity before the first step activates) and an empty caption. The lesson title is the only step text visible.
- Step `code` is 766 px tall with the `<Next>` card inside it; with ~237 px visible the reader scrolls three screens through a step whose picture never changes.
- Term buttons in the text ("model", "window", "check") are 25 px tall: too small to tap reliably, and they sit inline in body text.
- `<More>` summaries ("Talking instead of typing", "Where you find each") are 44 px, fine to tap; but opened they add 100–200 px to a step that already scrolls under the view.
- At the end of the page (`ai-99-end.png`) the sticky view rides up and the `<Next>` card has already scrolled away under it; the last thing on screen is the picture, then blank, then the footer.

## Lesson 2 · providers (Providers and where AI runs)

Readout, every step: `model` · `runs on` · `your files` · `you pay`. Its tallest form (labs) makes the view 575 px and leaves 191 px for text.

| Step | What the screen and caption say | What the reader needs | Minimal version in the picture | Moves to the step text |
| --- | --- | --- | --- | --- |
| labs, Anthropic (default) | Screen: "list pasted / Who has not paid this season?", Opus 5.5 "7 have not paid: Ana Ruiz, Ben Okafor, Dev Patel and 4 more." Say: "Same question, same window, same kind of answer. Only the maker and the machines changed." Stats: Fable 5.2, Opus 5.5, Sonnet 5.5, Haiku 5.5 / Anthropic's computers / your laptop / a plan or per token | Which company, whose computers, same behaviour. | Already there: the cap label "Opus 5.5, on Anthropic's computers". Add a short bubble at the cap "7 haven't paid". Nothing else. | The model list ("Fable 5.2, Opus 5.5, Sonnet 5.5, Haiku 5.5"), "you pay: a plan or per token", and the closing sentence. |
| labs, OpenAI | Name above reply: GPT-6.2 Sol. Stats: GPT-6.2 Astra, GPT-6.2 Sol, GPT-6.1 Terra, GPT-6 Luna / OpenAI's computers | Same as above with another maker. | Cap label swaps to "GPT-6.2 Sol, on OpenAI's computers". Same bubble. | The four model names. |
| labs, A model you download | "an open model" answers. Say: "The model runs on your own machine, which needs a lot of memory." Stats: many, free to download / your own computer / nothing per message | It moves onto your machine; costs memory, not money. | The cap moves onto the laptop gear (it should, if it does not); label "open model, on your laptop". | "needs a lot of memory", "nothing per message". |
| reach, An app (default) | Title "Claude app". You: "photo of the paper list / Who has not paid?" Opus 5.5: "7 have not paid. You will have to copy this into your spreadsheet yourself." Say: "The app is the quickest way in. It cannot touch your files." Stats: Opus 5.5 / providers' computers / none: you paste / Claude Free $0 or Pro $20 a month | The app can't reach files; you paste. | Label on the pawn's side "the Claude app"; cap bubble "copy this yourself". | Prices ("Free $0 or Pro $20 a month") and "It cannot touch your files." |
| reach, A coding tool | Opus 5.5: "Done. The list has an “Unpaid” button; I tried it." Say: "Same plan as the app, now working on a folder on your laptop." Stats: you pay Claude Pro $20 (includes Claude Code); Codex from ChatGPT Free | Same plan, but now it reaches the folder. | Tool cubes and project light; label "Claude Code" on the bench side. | Price line. |
| reach, The API | Same reply. Say: "Every token went on the bill: more work, a bigger bill." Stats: Opus 5.5: $4 in, $20 out, per million tokens | Pay per token. | A meter beside the cap ticking up, one word "$ per token" on it. | "$4 in, $20 out, per million tokens". |
| reach, T3 Code | Screen shows a thread list ("Make the member list show who…", "GPT-6.2 Sol · Codex") and "both: Two answers to the same job, one from each maker, side by side." Say: "One window on your screen, two providers behind it, each on your own login." Stats: Opus 5.5 and GPT-6.2 Sol / … / T3 Code is free; your plans as before | One app drives two providers on your own logins. | Two caps with labels "Opus 5.5 · Claude Code" and "GPT-6.2 Sol · Codex" (already there); pawn label "you, in T3 Code". | "T3 Code is free; your plans as before." |
| where, Online (default) | Screen log: Read file, Changed files, Ran command, Opus 5.5 "Done. members.ts has an “unpaid” filter; I tried it." Say lines: "Up: “read members.ts”. Down: the file's text." → "The page runs on your laptop. Down: what it showed." → "The thinking happened far away. Every file it read or changed stayed on your laptop." Stats: … / your laptop: 1 read, 1 changed | Request goes up, file text comes down, edits happen locally. | Small word on the puck travelling up: "read members.ts"; on the one coming down: "file text". The edited tile goes amber. The zone label "your laptop: the files" already exists. | "1 read, 1 changed" and the closing sentence. |
| where, Offline | Screen: only your message. Say: "Your files are all still on the laptop, as you left them." Stats: runs on out of reach | Offline: the model is gone, files stay. | Cap greys out with one word "offline" on the line between; tiles stay. | The say line. |
| devices, Laptop (default) | You: "Add a “paid on” date to each member." Say: "You close the lid to catch a train. The job on the laptop stops until you open it again." Stats: your files on the laptop, lid closed / you pay – | Work stops when the laptop sleeps. | Laptop gear lid closes; lamp on it "paused". | Say line. Drop "you pay –": a dash adds nothing. |
| devices, Desktop PC | You: "Overnight: add a “paid on” date and try it on every page." Say: "The desktop stays on, so the job keeps going while you sleep." | Desktop keeps going. | Desktop gear lamp amber "working, overnight". | Say line. |
| devices, Phone | Screen: "on the bus: Looks good, go ahead." / desktop PC: "Done: “paid on” dates added. Screenshot attached." Say: "The phone only shows and steers. The desktop at home does the work, so it has to stay on." | Phone steers, desktop works. | Phone gear bubble "go ahead"; desktop gear lamp green "done". | Say line. |

Other phone problems, lesson 2:

- The readout is the largest on any of my lessons: four rows, two of which wrap. The view reaches 575–620 px; step headings are hidden under it within a second or two of a step activating (`providers-03-where-light.png`, `providers-04-devices-5s.png` start mid-paragraph).
- In `reach` with T3 Code (`alt-providers-reach-T3_Code.png`) four labels crowd the left third of the picture: "GPT-6.2 Sol · Codex", "plan", "you, in T3 Code" overlap each other and the pawn. On a phone the picture needs fewer labels, not more.
- `reach` → "What each costs" `<More>` opens a table of ~10 links (18 px tall each); on a phone those links are hard to tap and the table pushes the step to ~900 px.
- `you pay –` on `where` and `devices` is a dash on four steps: a meaningless row the reader still has to read past.

## Lesson 3 · stack (Git, GitHub and hosting)

Readout, every step: `commits, on your laptop` · `commits, on GitHub` · `the member list page` · `server`.

| Step | What the screen and caption say | What the reader needs | Minimal version in the picture | Moves to the step text |
| --- | --- | --- | --- | --- |
| commit, Saved first (default) | Screen (7 messages, only the last two visible): "It works. Save this version." / "Saved: “Member list works”." / "Make the list look nicer on a phone." / Changed files / "Done. The list is responsive now." / "It is worse. Go back to how it was." / "Back to the save point “Member list works”." Say: "One save point, and the bad change cost you a minute." Stats: laptop 1 / GitHub – / works again (earlier "broken: names cut off") / server – | Save, break, go back. | A dot on the project plate labelled "commits: 1" (the picture already has a "commits" label under the plate). The plate's tiles flash accent ("broken") then return. Pawn bubble "go back" at the moment of undo. | "One save point, and the bad change cost you a minute." |
| commit, Not saved | Reply: "There is no saved version to go back to. I can try to undo it by hand." Say: "Without a save point, “go back” is a guess." Stats: laptop 0 / still broken | No commit, no undo. | Tiles stay accent; cap bubble "no save point". | Say line. |
| github, Pushed (default) | "Sending the 3 save points to GitHub." → "New laptop. Get the club list back from GitHub." Say: "The laptop is left on a train." → "Everything up to the last push came back, with every save point." Stats: laptop 3 → 0 → 3 / GitHub 0 → 3 | Pushed copy survives losing the laptop. | Counter on the laptop gear "3", counter on the GitHub plate "3"; laptop drops away, new laptop gets "3". Two numbers, both on parts. | Closing sentence. |
| github, Never pushed | Screen empty. Say: "Nothing was pushed, so there is nothing to get back." Stats: 0 / 0 / gone | Nothing comes back. | GitHub plate "0"; new laptop empty. | Say line. |
| branch, On a branch (default) | "Add a “paid on” date to each member." / check "Tried the page: the dates are blank." / check "Passed. Waiting for you to look." / you "Looks right. Merge it." Stats: 3 → 4 commits; page "works (main untouched)" → "works, with dates" | Work on a branch, the check runs, you merge. | Lamp at the pull request: accent "dates blank" → green; then blue (waits for you) with "your look". Main label keeps "the version people use". | The two check messages in full. |
| branch, Straight to main | "Done, it is on main." Say: "The change went straight to the version people use, mistake and all." Stats: page "broken for everyone: the dates are blank" | Skipping the branch breaks main. | Main tiles go accent with the word "broken for everyone". | Say line. |
| hosting, Static (default) | Screen empty ("New thread"). Say: "The finished pages go to the phone. The tick stays in that browser." → "treasurer Sam: not paid." → "Static pages cannot share what people save. Cheap, fast, and fine for a page everyone only reads." Stats: page "Sam paid on one phone only" / server none | The coach's tick does not reach the treasurer. | Bubble at coach "Sam ✓"; bubble at treasurer "Sam: not paid". That is the step. | The closing sentence and "server: none". |
| hosting, Server and database | Screen empty. Say: "The server keeps one list for everyone. It runs all day, so it costs more and needs looking after." Stats: "Sam paid, for everyone" / "yes, always on" | Server shares the tick. | Treasurer bubble "Sam ✓"; server gear lamp amber "always on". | Say line, cost note. |
| specs (slider, 40 members default) | Screen empty, titled "Chat". Say: "The smallest server is asleep most of the day. A bigger one would be money for nothing." Stats: page "0.13 views a second on match day [example]" / server "1 core · 1 GB · 1% busy" | How busy the smallest server is for N members. | One counter on the server gear: "1% busy". Members label "40 members" already there. | "0.13 views a second on match day (example)", "1 core · 1 GB", and the say line. |

Other phone problems, lesson 3:

- `hosting` and `specs` show an empty chat screen (104 px of nothing, `stack-04-hosting-light.png`, `stack-05-specs-light.png`). The people who speak there (coach, treasurer) are outside the app, so their lines are in the caption instead. Good evidence that on a phone the screen does not earn its place.
- `commit` puts seven messages into a 104 px screen; the reader sees the last two and never the "Saved" moment, which is the point of the step.
- `specs`: the "Members" slider is the step's only control and sits below the fold: with the view at 640 px only the slider label is visible, the track is under the dev pill / bottom of the screen (`stack-05-specs-light.png`). Dragging it means the reader cannot see the step text at the same time, and the picture only, not the readout, changes visibly.
- The readout "the member list page" value runs to two lines ("Sam paid on one / phone only", "0.13 views a second / on match day / example") and grows the view mid-step.

## Lesson 4 · first (Your first real loop)

Readout, every step: `working on` · `beat, this round` · `files in your project` · `checked by`.

| Step | What the screen and caption say | What the reader needs | Minimal version in the picture | Moves to the step text |
| --- | --- | --- | --- | --- |
| device, Laptop (default) | You: "Hello. Here is who I am and what I want to build." Agent: "Got it. What should I call the folder, and is the data only on this computer?" Say: "Set up once. Every job after this starts in this folder." Stats: your laptop / – / an empty folder, club-list / – | One app, one plan, one folder. | Label on the plate "club-list (empty)". Cap bubble "what's the folder called?". | Say line. Remove the two dash rows. |
| device, Desktop PC | Same, "working on your desktop PC". | Same on a desktop. | Gear swaps to desktop. | — |
| device, Phone | You: "A list of my club's members and who has paid." Reply: "Here is a first version. Tap Preview to try it." Say: "Quickest start of all. The files live on their site, not on a computer of yours." Stats: a builder in the phone's browser / on the builder's site | Phone = browser builder, files on their site. | Plate moves into a cloud zone labelled "their site". | Say line. |
| job (copy prompt) | You: "I want a small web app for a neighbourhood football club…" Agent: "Two questions first: how many teams, and do you want to record how much each member paid, or only paid / not paid?" You: "Three teams. Only paid or not." Say: "It asked before building, because the prompt told it to. Two answers saved a wrong guess." Stats: round 1 · 1 of 4: you ask / empty / – | It asks before it builds. | Already a card "two questions" by the pawn. Cap bubble "2 questions first"; pawn bubble "3 teams, paid / not". | Say line, "round 1 · 1 of 4: you ask". |
| loop (Play it again) | You: "A list of members, a form to add one, a way to mark them paid." Log: Changed index.html, members.ts, members.test.ts, style.css (each "new file"), Ran command "opened the page and tried the form", "Done. Open http://localhost:5173 and add a member first.", you "The paid tick works. Unpaid people should stand out more." Say: "Then round again. Every round is these four beats." Stats: beat 2 of 4 it builds → 3 of 4 you look → 4 of 4 you say what to change; files "writing 4 new files" → "4 new files"; checked by "it opened the page" | The four beats, and which two are yours. | **One counter in the picture: "beat 2 of 4" near the active part** (on the cap while it builds, on the pawn for "you look" / "you say"). Tiles fill green one by one ("4 new files" can be read off the tiles). Card label "the page, open" exists. | "Your two beats…" and the full readout. |
| change, Three clear changes (default) | You: "Three changes: sort by team, then name. Make unpaid members easy to spot. At the top, show “18 of 25 paid”." Log: Changed members.ts, style.css. "Done: sorted, unpaid in red, “18 of 25 paid” at the top." Say: "Each change is something you can look for in ten seconds." Stats: round 2 · 3 of 4 / 4 files, 2 changed | Precise ask → two changed tiles → quick to check. | Card "3 changes" by the pawn (exists); two tiles amber. | "Each change is something you can look for in ten seconds." |
| change, "Make it better" | You: "Make it better and more modern, add stats, fix it on phones, maybe like a real app." Log: 6 changed files incl. 2 new. Say: "It guessed what “better” means and touched every file. Now you have to look at everything." Stats: 6 files: 4 changed, 2 new / checked by "passes, but is it right?" | Vague ask → every tile touched. | All tiles amber + two new ones; on the lamp "passes — right?" (blue: waits for you). | Say line. |

Other phone problems, lesson 4:

- `job` is 784 px tall: the copy prompt is a long monospace block (~6 lines at 390 px, wraps hard), plus the Copy button. With 215 px visible the reader scrolls nearly four screens through one step while the picture loops its two questions.
- `loop`: the "Play it again" button is half under the view's bottom edge when the step is in reading position (`first-03-loop-5s.png`). It is the step's only control.
- `loop`: seven screen entries for one round; the 104 px screen shows the last two. The work log ("Changed index.html new file" × 4) scrolls by unread.
- The caption is blank for the first ~4 s of `loop` (`first-03-loop-5s.png`): the readout carries the beat counter alone, under 45 px of nothing.
- `change` ends with the Part 2 `<Next>` card (216 px tall) inside the step; the page end (`first-99-end.png`) again leaves the view and blank space, the card is gone under the view.

## Lesson 5 · chat (One chat)

Readout: `in the window` (messages). The smallest readout of my lessons; the view is 456–482 px and leaves ~306 px for text. Still the most text-light lesson, and the one where the screen and the picture say the same thing twice.

| Step | What the screen and caption say | What the reader needs | Minimal version in the picture | Moves to the step text |
| --- | --- | --- | --- | --- |
| two | Screen empty. Say: "An empty window. The model can see nothing yet." Stats: 0 messages | Two parts: a model and its (empty) window. | Labels "the model" and "its window" exist; add "empty" to the tank label ("its window: empty"). | Nothing else needed. |
| send (Send the next message) | You: "My name is Sam. I keep our football club's member list." Model: "Hello Sam. What does the list need?" Next press: "To show who has paid this season." / "I can sketch that. How do members pay?" Stats: 2 → 4 messages | Both sides become slabs in the window. | Bubble at the pawn for the line as its dark slab travels ("I'm Sam…"), bubble at the cap for the reply as its pale slab lands ("Hello Sam"). Counter on the tank: "2 messages". | Full message text if wanted. |
| reread (Ask again) | You: "What is my name?" Model: "Sam." Stats: 6 messages | It knows the name only because message 1 is still in the window, re-read every turn. | Pawn bubble "my name?"; the bottom slab (message 1) glows as the cap reads down the stack; cap bubble "Sam." Counter "6 messages". | "Read again, every turn." |
| fresh, before pressing | Say: "Three exchanges on the screen, six slabs in the window. Press New chat, then ask." | Prompt to act. | — | The instruction belongs in the step (it already is). |
| fresh, New chat | Screen empties. Say: "A new chat: an empty screen, an empty window." Stats: 0 messages | New chat = empty window. | Slabs drop out of the tank; tank label "empty". | — |
| fresh, Ask "What is my name?" | You: "What is my name?" Model: "I can't tell. Nothing in this chat says." Stats: 2 messages | Without message 1 it cannot know. | Pawn bubble "my name?"; cap bubble "can't tell". | "Anything worth keeping has to be written down…" |

Other phone problems, lesson 5:

- On this lesson the chat screen really is the subject ("three exchanges on the screen, six slabs in the window"), and at 104 px it shows only the last exchange. The fresh step's caption tells the reader to compare the screen and the window; on a phone the screen cannot be compared, its earlier messages are under the fade. Two-word bubbles on the pawn and cap say the same with no screen at all.
- The caption is empty and reserves ~45 px on `send` and `reread` (no `say` line at all, `chat-03-reread-light.png`).
- Pressing "Ask again" does not clear the screen: "What is my name?" appears twice in a row in the log (alt run). Same for `fresh`: the old messages stay until "New chat".
- The controls ("Send the next message", "Ask again", "New chat") are full 44 px buttons and well placed under the step text: the best controls of my lessons on a phone.

## Lesson 6 · loop (It gets hands)

Readout: `turns of its own` · `tool calls` · `times it asked you` · `proof it works`.

| Step | What the screen and caption say | What the reader needs | Minimal version in the picture | Moves to the step text |
| --- | --- | --- | --- | --- |
| hands | Screen empty ("New thread"). Caption empty. No readout. | The four tools and the project behind them. | Label each cube once, one short word: "search", "read", "edit", "run" (the text names them; the picture says only "tools"). | — |
| fix (Play it again) | You: "The dates on the member list are wrong." Log: Searched "date" → "2 files mention dates"; Read members.ts → "84 lines of members.ts"; Changed members.ts; Ran command the tests → "1 of 12 tests fails: 3 March reads as 3 December"; Changed members.ts; Ran command the tests again → "12 of 12 tests pass"; "Fixed. The day and month were swapped. All 12 tests pass." Stats climb to 7 turns / 6 tool calls / 0 asked / tests pass | One message, many turns; it caught its own failure. | As each cube lights, a one-word tag on it: "search", "read", "edit", "run". When the run result comes back, the accent slab gets "1 of 12 fails"; the second run "12 / 12". One counter on the cap: "turn 4". That replaces the entire work log. | The full log, the final reply, and all four readout values. |
| again | Same run replayed. Say: "One message from you, 7 turns of its own. Every row in the work log was a tool, and every result went back into the window." Stats: 7 / 6 / 0 / tests pass | Count: 1 message, 7 turns. | Pawn tag "1 message"; cap counter ending on "7 turns". | The say line (it refers to "the work log", which a phone reader will not have). |
| norun, Without run (default) | Log stops after "Changed members.ts"; reply "Fixed. It should work now." Say: "It could not run anything, so “fixed” is a guess. Nothing in the work log tried the fix." Stats: 4 / 3 / 0 / proof: none | No run tool → no proof, but it still says fixed. | Run cube greyed (exists). Cap bubble "fixed!" with the lamp-word / tag "no proof" on the window or next to the bubble. | "proof it works: none" and the say line. |
| norun, With run | As in `again`. | Contrast. | As in `fix`. | — |
| ask, Ask every time (default) | "May I search the project for “date”?" / "Yes." / "May I read members.ts?" / "Yes." / "May I change how the date is read?" … Stats: times it asked you 1 → 3 … | Every question stops the loop until you answer. | Blue lamp (waits for you) on the pawn with "May I read?"; the pawn answers "yes". One bubble at a time; a counter on the pawn "asked 3×". | The full list of questions. |
| ask, Ask before changes and commands | Only "May I change how the date is read?" / "Yes." Stats: asked 1 | Reads and searches go alone; only changes ask. | Same, once. | — |
| ask, Don't ask | No questions; loop runs as in `fix`. | No stops. | Counter on the pawn "asked 0". | Advice: let it read and run tests alone, keep questions for deleting or publishing. |

Other phone problems, lesson 6:

- `hands` on a phone (`loop-01-hands-light.png`): 104 px of empty screen plus ~120 px of empty caption, i.e. a quarter of the screen blank, around a picture whose four cubes are unlabelled.
- The work log is this lesson's real content on desktop (`desktop-loop-again.png`: the whole search → read → edit → run → fail → fix → run → pass sequence is readable). On a phone the 104 px screen shows at most two rows, faded at the top; the reader sees "Ran command / the tests" and the final reply and misses the failure. Without the screen, the cubes must carry it.
- The script for `fix` / `again` runs longer than 8 s; by the time it ends the reader has typically scrolled on. On a phone, the step should not move on before the run ends, or the run should be shorter.
- The readout's `tool calls` lags the log mid-run (log shows 3 tool rows while `tool calls` says 2; at the end 6 rows = 6, so only the in-between state is off).
- `ask` ends with a `<More>` "Where this is set" holding four 40–127 px links and then the `<Next>` card: the step is 780 px with ~280 px visible.

## Lesson 7 · window (The window fills)

Readout varies per step here: `in the window` · `tokens` · `full` (pile); `in the window` · `file it edited` · `the card shows` (rot); `the window` · `in it` · `full` · `does not fit` (long); `in the window` · `kept` · `your rule from message 1` (compact); `you pasted` · `window` · `read again over the next 10 turns` (paste). That breaks the "one readout per chapter" rule in `JOURNEY.md`, and on a phone it means the caption changes height on every step.

| Step | What the screen and caption say | What the reader needs | Minimal version in the picture | Moves to the step text |
| --- | --- | --- | --- | --- |
| pile | Screen shows only "Always show dates as day.month.year." throughout. Say: "Then the date fix from lesson 6…" → "Then a CSV export. The model reads the whole pile again before every turn." → "A morning of work, all still in the window. Nothing has left it." Stats: first message + 1 → 3 jobs; tokens 21k → 106k → 218k of 1M; full 2% → 11% → 22% | The column grows; nothing leaves. | **One counter on the tank: "22% full"** (counting up). Optionally a word on the newest slab ("CSV export"). The rule slab at the bottom keeps a tag "your rule" so the next step can bury it. | "21k → 218k of 1M tokens", job names, closing sentence. |
| rot, Only this job (default) | You: "The date on the member card is wrong. Fix it." Reply: "Fixed in members.ts. The card shows 03.03.2026." Say: "Little in the window, and all of it about this job. Right file, rule kept." Stats: 9k of 1M · 1% full / members.ts, the right one / 03.03.2026, day.month.year as your rule says | Right file, rule kept. | Labels already present: "your rule: day.month.year" and "members.ts" on the tile. Add a green tick on the members.ts tile and a cap bubble "03.03.2026". | Full readout. |
| rot, After a morning | Reply: "Fixed in members.ts. The card shows 3/3/2026." Say: "Right file, but the rule from your first message was buried under 300k tokens of other work." Stats: 219k of 1M · 22% full / members.ts / "3/3/2026: your rule was lost" | Right file, rule lost. | Rule slab sinks under the pile (dimmed); cap bubble "3/3/2026" in accent. Tank counter "22% full". | Say line. **Bug: the say line says "300k tokens", the readout says 219k.** |
| rot, Plus a pasted log | Reply: "Fixed the date in export.ts." Say: "Wrong file: the pasted log and the CSV job pulled it towards export.ts. The card is still wrong." Stats: 309k · 31% full / export.ts, the CSV job's file / the same wrong date | Wrong file. | The wrong tile (export.ts) goes accent with its name; tank "31% full". | Say line. |
| long (slider, starts at 1020k) | Say: "102% full: 20k of tokens do not fit, shown on top. The model cannot read past its window, so before the next turn something has to go." Stats: 1M tokens / 1.02M / 102% / 20k | Hard limit. | Already in the picture: the overflow slab and the label "does not fit: 20k". Add "102%" on the tank. Nothing more. | Window sizes per tool (the select), the say line. |
| compact, The tool compacts it (default) | Say: "The window is full. The tool compacts it." Then you: "Now add the date to the export, too." Reply: "Added. The export shows 2026-03-03." Say: "The summary kept what was done, not the rule you said in passing. A rule you want every time belongs in a file: the next lesson." Stats: 814k → 49k → 51k of 1M / a summary and 5 recent files / your rule … lost in the summary | Compaction keeps the gist, loses the passing rule. | Pile collapses into one hatched slab labelled "a summary" (exists). Cap bubble "2026-03-03" in accent. Tank counter "5% full". | "814k → 49k", "kept a summary and 5 recent files", the closing sentence and the pointer to Memory. |
| compact, New thread, short brief | You: "Brief: add the member's joining date to the CSV export, as day.month.year. File: src/export.ts." Reply: "Added. The export shows 03.03.2026." Say: "A new thread holds only what you put in it. Short, and on one job." Stats: 3k / only your brief / in the brief, so kept | A brief keeps exactly what you put in. | One small slab tagged "brief"; cap bubble "03.03.2026" green. | The brief text (it is a good example prompt: could be a copy block in the step). |
| paste, The whole log (default) | Screen empty. Say: "The whole log: 200k tokens of passing tests around 30 lines that matter, read again on every turn from now on." Stats: 200k / 22% full / 2M tokens over next 10 turns | Big paste stays and is re-read. | Big slab tagged "whole log: 200k"; tank "22% full". | "read again over the next 10 turns: 2M tokens". |
| paste, The failing lines | Say: "Only the failing lines: the same information, a hundredth of the size." Stats: 2k / 2% / 20k | Same info, tiny. | Thin slab "30 lines: 2k"; tank "2% full". | Say line. |

Other phone problems, lesson 7:

- The picture is cropped on the right at phone width (`window-01-pile-light.png`, `window-03-long-light.png`): the project plate runs off the frame, and the pawn has lost its "you" label. The camera frames the tank, which is right for this lesson, but the cut-off plate looks like a rendering error.
- `rot` in dark (`window-02-rot-dark.png`): the "members.ts" label sits on top of the project's tiles and hides the tile it names; the tank (dark glass on dark) is hard to see at all.
- `pile`: the screen shows only the first message while the picture piles up three jobs. The screen and the picture disagree for the whole step, which on a phone (where the reader sees both at once) reads as a bug.
- `long`: the step's control (the token slider) and the window-size select are below the fold when the step is in reading position; dragging the slider hides the step text.
- `compact`: the step text opens on "What survives" and the view grows by ~50 px while the readout fills in; the heading is hidden.
- The step `paste` holds the copyable "Habits to copy" `<More>` plus a Copy button, and the `<Next>` card: 652 px tall with 260 visible.

## Overview · /journey/foundations/

The overview is one step per lesson (1–4). Each step has the lesson's title, a sentence, chips that link to each step of the lesson ("Only the window", "Voice, photo, video", …, 30 px tall), "Open lesson →", term links (19 px tall) and the lesson's closing note. The sticky view replays that lesson's scripts in turn (the stack step cycles Saved → broken → back → restart; I saw the commit counter go 0 → 1 → 0 as it looped).

- Same sticky view as the lessons: 530 px, ~258 px left. The overview's own content (chips, "Open lesson") is what a phone reader came for and is below the fold on every step (`foundations-03-stack-5s.png`: the chips start at y≈1500 of 1688 device px).
- The first screen (`foundations-00-top.png`) is the level picker over the rail, a chat, a faded picture and an empty caption, then the part title and a 2×2 grid of part cards. The part cards are useful; they are under the picture.
- What the overview needs from the picture on a phone: almost nothing. A small thumbnail per lesson (the lesson's end state, `thumbs.ts` already draws these) beside each step would serve better than a sticky view replaying four lessons' scripts. If the sticky view stays, its looping script should not reset counters while a reader is reading (the 0 → 1 → 0 loop looks like a bug).
- Term links at 19 px tall and chips at 30 px are below a 44 px touch target; the chips wrap onto three rows at 390 px.
- The rail centres the current lesson; with "Part 1 · 1 2 [3 Git & hosting] 4 · Part 2 · …" the rail is readable, but it is the only navigation and it scrolls sideways under a finger that is trying to scroll the page.

## Navigation on a phone

What I saw: the reader moves by scrolling the page. A step becomes active when its top passes a line 55 % of the way down the space under the sticky view (`run.ts` `pick()`); with ~200–260 px of space, a small scroll flips to the next step and restarts its script, and a scroll back flips it again. Steps are 440–790 px tall, so a reader scrolls one to three screens through text while the picture either sits finished or loops. The steps' opacity drops to 0.4 when not active, so half-visible text under the view is greyed. Controls that start a run ("Play it again", sliders) often sit at the bottom edge or below it.

Recommendation:

1. **On a phone, one step at a time, not a scrolling page.** Picture on top (it can then take ~45 % of the height instead of 27 %), the step's text below it in its own scroll container that holds only the current step. Forward and back change the step; they do not scroll the page.
2. **Two buttons, fixed at the bottom of the screen, thumb height (≥ 44 px):** "← Back" (left, smaller) and "Next →" (right, larger), with "3 / 4" between them. Next is the main action. On the last step Next becomes the `<Next>` lesson card's link ("Next: Providers →"), so the `<Next>` card stops being a 180–216 px block inside the last step.
3. **Swipe as a bonus, not the only way:** horizontal swipe on the picture only (not on the text, which scrolls vertically, and not on the rail, which scrolls sideways). Swiping must not fight the text panel's vertical scroll. Keyboard arrows for desktop testers.
4. **Changing the step restarts its script; Next while a script still runs should first finish it (or skip to its end) instead of moving on**, at least for long runs like `loop/fix` (> 8 s). A tap on the picture can replay ("Play it again" moves onto the picture as a small ↻ in its corner, freeing the step text).
5. **Controls of a step** (the `.pick` choices, sliders) stay in the step text panel, at its top, directly under the heading, so they are visible without scrolling the panel. Pressing one replays the picture; the step text's readout block updates.
6. **The readout moves into the step text** as a compact two-column `dl` under the controls, same names, same order, updated live (the flash on reset stays). On steps where the picture carries the one number that matters (the tank's "22% full", the cap's "turn 4", the commit counter), the readout repeats it, which is fine.
7. **The rail** becomes a compact "Lesson 6 of 21 · Loop" title in the header that opens the lesson list as a sheet, instead of a horizontally scrolling row competing with page scroll.
8. **`<More>` boxes** stay closed in the text panel; opened, they scroll within it. Copy prompts get a full-width Copy button at the top of the block, not at its end.
9. **The level picker** should not open itself over the view on a phone; put it in the menu, or show it once below the first step.
10. **Overview pages**: no sticky picture. A list of lessons, each with its end-state thumbnail, the one-line summary, and "Open lesson →" at 44 px. The step chips ("Save points", "The copy online") can deep-link into the lesson's step (`/journey/stack/#github`), which the one-step-at-a-time view should honour by opening at that step.
