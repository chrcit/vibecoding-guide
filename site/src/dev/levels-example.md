## Tidying the contact list

The club secretary has a spreadsheet of members exported from three places over the years. Some people appear twice, birthdays are written three different ways, and half the names have stray spaces. You ask the agent to clean it and give you back a new file, leaving the original as it was.

Ask for the new file and a short list of what changed: how many duplicates it merged and which rows it was unsure about. Open the new file and check a handful of the rows it was unsure about yourself.

> [!technical] Keep the original and review the change
> Put the export in a folder under Git before the agent touches it, and commit it as it is. The agent's script then writes a new file next to it. `git diff --stat` tells you how much moved, and you can always go back.
>
> Ask for the cleaning as a script you can run again. Next season's export will have the same problems.
>
> > [!engineer] Make the merge rules explicit
> > Duplicate detection is where the judgement hides. Ask the agent to write the rules down as data (same email, or same name and birthday after normalising) and to emit every merge as a row in a review file: the two source rows, the rule that matched, and the kept values. You can read and test the rules, and every individual decision is in the review file where you can see it.

> An ordinary quote stays an ordinary quote. Nothing about it changes with the level.

> [!NOTE]
> GitHub alerts like this one are left alone too.

> [!engineer]
> A block with no title gets a default one. Dates in the export come as `03/04/1990`, `1990-04-03` and `3 April 1990`; the first is ambiguous, so the script should refuse to guess and list those rows instead.
