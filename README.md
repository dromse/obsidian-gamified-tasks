# Gamified Tasks

<a href="https://github.com/dromse/obsidian-grind-manager/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/dromse/obsidian-grind-manager?style=for-the-badge&logo=starship&logoColor=D9E0EE&labelColor=302D41&&color=d9b3ff&include_prerelease&sort=semver" /></a>
<a href="https://github.com/dromse/obsidian-grind-manager/pulse"><img alt="Last commit" src="https://img.shields.io/github/last-commit/dromse/obsidian-grind-manager?style=for-the-badge&logo=github&logoColor=D9E0EE&labelColor=302D41&color=9fdf9f"/></a>

- Unleash the magic of Gamified Tasks, merging task management with rewards system to your Obsidian workspace!  
- Earn coins by completing tasks and acquire epic rewards!  
- It's your ticket to excitement and adventure in your digital domain!

<img  src="https://github.com/dromse/obsidian-grind-manager/assets/57846319/1c19ad65-356c-463b-8d9d-761161ebe6d8" width="400">
<img  src="https://github.com/dromse/obsidian-grind-manager/assets/57846319/11039bad-4e80-429e-95c1-464f095ff446" width="400">

## Features

- **Tasks**: View all tasks in your vault.
- **Filters**: Filter tasks by completion status, recurring or search by within content.
- **Rewards**: Purchase rewards with earned coins.
- **History**: View history of earnings and spending.
- **Recurrence**: Instead of repeating the same tasks, recurring tasks are saved to history and reappear in the task list when their time arrives.
- **Counters**: Utilize counters to break down a task into smaller segments for easier completion.
- **Difficulty**: Set difficulty level to earn coins based on it.

## Task Tracking

### Available Tags

In plugin `#tags` is used for metadata. Currently list of tags in using:

- counter: `#count/current/goal` (e.g. `#count/1/4`)
- recurrence: `#every/recurrence` (e.g. `#every/day` | `#every/week`)
- difficulty: `#diff/difficulty` (e.g. `#diff/trivial` | `#diff/easy` | `#diff/medium` | `#diff/hard`)

### CompletedAt

Also for completed date is used link on daily note

- WikiLink `✅ [[2024-03-13|2024-03-13 | 21:46]]`
- Markdown Link `✅ [2024-03-13 | 21:46](Everyday/2024-03-13.md)`

### Statuses

You can use this statuses (compatable with Obsidian Tasks statuses):

- `- [ ] todo` - planned for execution.
- `- [/] doing` - currently in progress.
- `- [x] done` - completed
- `- [-] denied` - not of interest or for other reasons.
- `- [?] delay` - in progress but paused, on review or deligated.

```markdown
# Uncompleted task

- [ ] watch video about optimization #diff/easy

# Task in progress

- [/] watch video about optimization #diff/easy

# Completed task

- [x] watch video about optimization #diff/easy ✅ [[2024-03-13|2024-03-13 | 21:46]]
```

### Difficulty

By default difficulty earnings is (you can change it in settings):

- trivial - 0.1
- easy - 1
- medium - 2.5
- hard - 5

### Counters

You can use counters in common and recurring tasks.
If counter has a goal and it reaches it, the task automatically became done.

#### With `#diff`

If task has `#diff` and `#count` on every counter increase you earned coins based on difficulty level.

> [!NOTE]
> If you click on decrease counter it will take coins back.

```markdown
<!-- Difficulty usage -->

- [/] challange code everyday for 4 hours! #count/3/4 #diff/hard

<!-- In history file -->

5 | challange code everyday for 4 hours! | 2024-03-13 21:46
5 | challange code everyday for 4 hours! | 2024-03-13 21:46
5 | challange code everyday for 4 hours! | 2024-03-13 21:46

<!-- If you click decrease one time -->

-5 | challange code everyday for 4 hours! | 2024-03-13 21:50
5 | challange code everyday for 4 hours! | 2024-03-13 21:46
5 | challange code everyday for 4 hours! | 2024-03-13 21:46
5 | challange code everyday for 4 hours! | 2024-03-13 21:46
```

#### With `#every`

In recurring tasks when you reach goal and the day to show it arrives, the counter resets to zero.

```markdown
<!-- You're clicking on increase counter in UI -->

- [/] challange code everyday for 4 hours! #count/3/4 #every/day #diff/hard

<!-- It saves to history -->

5 | challange code everyday for 4 hours! | 2024-03-13 21:46
5 | challange code everyday for 4 hours! | 2024-03-13 21:46
5 | challange code everyday for 4 hours! | 2024-03-13 21:46

<!-- Or without #diff -->

0 | challange code everyday for 4 hours! | 2024-03-13 21:46
0 | challange code everyday for 4 hours! | 2024-03-13 21:46
0 | challange code everyday for 4 hours! | 2024-03-13 21:46

<!-- When you reach counter goal, counter set to completed -->

- [x] challange code everyday for 4 hours! #count/4/4 #every/day #diff/hard

<!-- Task resets to zeros and appears in UI when its time arrives -->

- [ ] challange code everyday for 4 hours! #count/0/4 #every/day #diff/hard
```

### Recurrence

For recurrence you need to use #every tag, a recurring task appears again based on history file. 
List of recurrence durations (instead of 1 you can use another number)

- Daily - day, 1day, 2day ... etc.
- Weekly - week, 1week, 2week ... etc.

If a task doesn't have `#diff` tag in history, it saves with `0` balance change.

```markdown
<!-- Create recurring task -->

- [ ] coding for 4 hours #every/day

<!-- Set in progress -->

- [/] coding for 4 hours #every/day

<!-- Complete task -->

- [x] coding for 4 hours #every/day

<!-- It saves in history and resets when the time arrives -->

- [ ] coding for 4 hours #every/day
```

#### How does it work?

- You create task with #every tag, it shows in UI.
- You complete your recurring task.
- Task body saves to history.
- Task counter sets to zero value when its time arrives.

## Rewards

- You can buy rewards on earned coins.
- You need to create rewards file to add rewards.
- By default rewards file is `rewards.md` but you can change it in settings.
- You need to define your rewards in rewards file.  
- Format of reward row `rewards name | price | description` in rewards file.  
- If you have a desire to add a comment use `|` symbol e.g. `| my favorite rewards`.

> [!NOTE]
> Markdown comments `<!-- comment -->` don't work in rewards file.

```markdown
| shows `📺️ watch an episode` for 1 coin
📺️ watch an episode

| shows `🍦 Ice cream` for 10 coins
🍦 Ice cream | 10

| shows `🍬 candy` with desc `earn and eat it.` for 1 coin
🍬 candy | earn and eat it.

| shows `🌴 relax one day` with desc `you work hard you deserve it.` for 1500 coins
🌴 relax one day | 1500 | you worked hard you deserve it.
```

## History

- History file stores all your earnings and spendings.  
- Task is earning one if it has #diff or #every.  
- By default history file is `history.md` but you can change it in settings.  
- By default you don't need to do anything with this file.  
- But if you want to correct some data or cheat sometimes, you're welcome... cheater \*bruh\*.  
- Format of history row: `balance change | task body | date`

It saves to history only if:

- Task with `#diff`.
- Task with `#every`.
- Reward

## Inspiration

- [obsidian-tasks](https://github.com/obsidian-tasks-group/obsidian-tasks)
- [obsidian-pomodoro-timer](https://github.com/eatgrass/obsidian-pomodoro-timer)
- [Habitica](https://habitica.com/)

## Can I contribute?

Yes, of course!
