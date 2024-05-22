import { DAY_FORMAT } from "@consts";
import { RawFile } from "@hooks/types";
import { DifficultyPrice } from "@hooks/useTasks/consts";
import { Status, Task } from "@hooks/useTasks/types";
import { App, Notice, Vault, moment } from "obsidian";
import { coins } from "./string";
import { isOutOfScope } from "./check";
import { GamifiedTasksSettings } from "@types";

/** Parse all occurance of task line in `file` content and then returns task list */
export function parseTasksFromFile(file: RawFile): Array<Task> {
	const tasks = file.content.reduce<Array<Task>>((acc, lineContent, index) => {
		const regex = /- \[.\]/;

		if (lineContent.match(regex)) {
			acc.push({
				path: file.path,
				lineContent,
				lineNumber: index,
				body: lineContent,
			});
		}

		return acc;
	}, []);

	return tasks;
}

/** Iterates through all files, parse tasks from files and return all found tasks in `files`
 * @param {RawFile[]} files - list of RawFile[]
 *
 * @returns {Task[]} all tasks in files
 *
 * @example
 * const files = [{ tFile: {...}: TFile, content: ['- [ ] one simple task'] }]
 *
 * const tasks = parseTasks(files)
 * -> [{ tFile: {...}, completed: false, lineNumber: 0, lineContent: '- [ ] one simple task', body: '- [ ] one simple task' }]
 */
export function parseTasks(files: Array<RawFile>): Array<Task> {
	const tasks = files.reduce(
		(acc, file) => [...acc, ...parseTasksFromFile(file)],
		[],
	);

	return tasks;
}

type UpdateTaskProps<TPayload> = {
	task: Task;
	payload: TPayload;
	updateTask: Function;
	addHistoryRow: Function;
};

export const updateCounter = async (
	props: UpdateTaskProps<{ change: number }>,
): Promise<void> => {
	const { task, payload, updateTask, addHistoryRow } = props;
	const { change } = payload;

	const current = Number(task.counter?.current);
	const goal = Number(task.counter?.goal);

	const newCurrent = current + change;

	if (isOutOfScope(newCurrent, goal)) {
		return;
	}

	await updateTask(task, {
		...task,
		status: goal && newCurrent === goal ? "done" : "doing",
		counter: { current: newCurrent, goal },
	});

	const getEarningString = (): string =>
		task.difficulty
			? `You ${change > 0 ? "earned" : "returned"}: ${coins(
				DifficultyPrice[task.difficulty],
			)}`
			: "";

	new Notice(getEarningString());

	if (goal && newCurrent === goal) {
		new Notice(`You completed task: '${task.body}'`);
	}

	if (task.difficulty) {
		await addHistoryRow({
			title: task.body,
			change: DifficultyPrice[task.difficulty] * change,
		});
	}
};

export async function updateStatus(
	props: UpdateTaskProps<{ status: Status }>,
): Promise<void> {
	const { task, payload, updateTask, addHistoryRow } = props;
	const { status } = payload;

	await updateTask(task, { ...task, status });

	const isNewStatusDone = status === "done";

	if (task.counter) {
		const isCurrentNotZero = task.counter.current !== 0;
		const isGoalNotSet = !task.counter.goal;

		if (isNewStatusDone && isCurrentNotZero && isGoalNotSet) {
			new Notice(`You completed task: '${task.body}'`);
		}

		return;
	}

	if (!task.difficulty) {
		return;
	}

	if (isNewStatusDone) {
		await addHistoryRow({
			title: task.body,
			change: DifficultyPrice[task.difficulty],
		});

		new Notice(`You earned: ${coins(DifficultyPrice[task.difficulty])}`);
		new Notice(`You completed task: '${task.body}'`);
	}

	const isOldStatusDone = task.status === "done";
	const shouldReturnCoins = isOldStatusDone && !isNewStatusDone;

	if (shouldReturnCoins) {
		await addHistoryRow({
			title: task.body,
			change: -DifficultyPrice[task.difficulty],
		});

		new Notice(`You returned: ${coins(DifficultyPrice[task.difficulty])}`);
	}
}

type OperateYAMLBindingProps = {
	task: Task;
	previousTaskState: Task;
	app: App;
	vault: Vault;
	settings: GamifiedTasksSettings;
};
export async function operateYAMLBinding(
	props: OperateYAMLBindingProps,
): Promise<void> {
	const { task, app, vault, settings, previousTaskState } = props;

	const dailyNotePath = moment().format(
		`[${settings?.pathToDaily}/]${DAY_FORMAT}[.md]`,
	);
	const todayTFile = vault.getFileByPath(dailyNotePath);

	let yamlProperty = `${task.bind}: `;
	let yamlPropertyValue: unknown = "";

	if (todayTFile) {
		const cache = app.metadataCache.getFileCache(todayTFile);

		if (cache && task.bind && cache.frontmatter) {
			yamlPropertyValue = cache.frontmatter[task.bind];
		}

		console.log(yamlPropertyValue);
	}

	if (task.counter && previousTaskState.counter) {
		const { current } = task.counter;
		const change = task.counter.current - previousTaskState.counter.current;

		if (current !== undefined) {
			yamlProperty += `${Number(yamlPropertyValue) + change}`;
		}
	} else {
		yamlProperty += task.status === "done" ? "1" : "";
	}

	if (todayTFile) {
		await vault.process(todayTFile, (data: string) => {
			const oldLine = new RegExp(`${task.bind}:.*`);
			return data.replace(oldLine, yamlProperty);
		});
	}
}
