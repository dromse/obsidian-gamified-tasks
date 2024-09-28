import { MenuOption } from "@components/tabs/Tasks/Menu";
import { DAY_FORMAT } from "@consts";
import { RawFile } from "@hooks/types";
import { Status, Task } from "@core/types";
import { GamifiedTasksSettings } from "@types";
import { App, moment, Notice, Vault } from "obsidian";
import { isOutOfScope } from "./check";
import { logger } from "./logger";
import { coins } from "./string";

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

export type UpdateTaskPayloadProps<TPayload> = {
	task: Task;
	payload: TPayload;
	updateTask: Function;
	addHistoryRow: Function;
	settings: GamifiedTasksSettings;
};

export const updateCounter = async (
	props: UpdateTaskPayloadProps<{ change: number }>,
): Promise<void> => {
	const { task, payload, updateTask, addHistoryRow, settings } = props;
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

	const difficulty = settings.difficulties.find(
		(diff) => diff.name === task.difficulty,
	);
	let price = 0;

	if (difficulty) {
		price = difficulty.price;
	}

	const getEarningString = (): string =>
		task.difficulty
			? `You ${change > 0 ? "earned" : "returned"}: ${coins(price)}`
			: "";

	new Notice(getEarningString());

	if (goal && newCurrent === goal) {
		new Notice(`You completed task: '${task.body}'`);
	}

	if (task.difficulty) {
		await addHistoryRow({
			title: task.body,
			change: price * change,
		});
	}
};

export const handleResetCounter = async (
	task: Task,
	updateTask: Function,
): Promise<void> => {
	await updateTask(
		task,
		{
			...task,
			counter: { ...task.counter, current: 0 },
		},
		{ ignore: { bind: true } },
	);
};

export const getStatusOptionsWithHandlers = (
	StatusKeys: Array<Status>,
	buildUpdateStatusProps: (
		status: Status,
	) => UpdateTaskPayloadProps<{ status: Status }>,
): Array<MenuOption> =>
	StatusKeys.reduce<Array<MenuOption>>((acc, key) => {
		acc.push({
			title: key,
			handler: () => updateStatus(buildUpdateStatusProps(key)),
		});

		return acc;
	}, []);

export const handleUpdateCheckbox = (
	task: Task,
	buildUpdateStatusProps: (
		status: Status,
	) => UpdateTaskPayloadProps<{ status: Status }>,
): void => {
	const isDone = task.status === "done";
	const isDenied = task.status === "denied";

	isDone || isDenied
		? updateStatus(buildUpdateStatusProps("todo"))
		: updateStatus(buildUpdateStatusProps("done"));
};

export async function updateStatus(
	props: UpdateTaskPayloadProps<{ status: Status }>,
): Promise<void> {
	const { task, payload, updateTask, addHistoryRow, settings } = props;
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

	const difficulty = settings.difficulties.find(
		(diff) => diff.name === task.difficulty,
	);
	let price = 0;

	if (difficulty) {
		price = difficulty.price;
	}

	if (isNewStatusDone) {
		await addHistoryRow({
			title: task.body,
			change: price,
		});

		new Notice(`You earned: ${coins(price)}`);
		new Notice(`You completed task: '${task.body}'`);
	}

	const isOldStatusDone = task.status === "done";
	const shouldReturnCoins = isOldStatusDone && !isNewStatusDone;

	if (shouldReturnCoins) {
		await addHistoryRow({
			title: task.body,
			change: -price,
		});

		new Notice(`You returned: ${coins(price)}`);
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
	} else {
		new Notice(
			`'${dailyNotePath}' was not found for binding property '${task.bind}'`,
		);
	}

	if (task.counter && previousTaskState.counter) {
		const { current } = task.counter;
		const change = task.counter.current - previousTaskState.counter.current;

		if (current !== undefined) {
			yamlProperty += `${Number(yamlPropertyValue) + change}`;
		}
	} else {
		yamlProperty +=
			task.status === "done"
				? String(Number(yamlPropertyValue) + 1)
				: String(Number(yamlPropertyValue) - 1);
	}

	if (todayTFile) {
		await vault.process(todayTFile, (data: string) => {
			const oldLine = new RegExp(`${task.bind}:.*`);
			return data.replace(oldLine, yamlProperty);
		});
	}
}

export const executeCondition = async (task: Task): Promise<boolean> => {
	if (task.condition) {
		// Ignore caching of module by browser.
		const timestamp = new Date().getTime();

		const pathToModule = task.condition.file + `?t=${timestamp}`;

		try {
			const result = await (
				await import(pathToModule)
			).default(task.condition.arg);

			return result;
		} catch (err) {
			const msg = "Error while execute script: " + task.condition.name + ".js";
			new Notice(msg);

			logger(msg + "\n" + err);

			return false;
		}
	}

	return false;
};
