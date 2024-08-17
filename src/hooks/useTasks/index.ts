import { GamifiedTasksConstants } from "@consts";
import { getRawFiles } from "@utils/file";
import {
	byNote,
	byRecurrance,
	bySearch,
	byStatus,
	byTag,
	byToday,
} from "@utils/filter";
import { parseMiddlewares, stringifyMiddlewares } from "@utils/middleware";
import { operateYAMLBinding, parseTasks } from "@utils/task";
import { TFile } from "obsidian";
import { useEffect, useState } from "react";
import { useApp, useHistory, useSettings } from "..";
import { ParseState } from "../types";
import { middlewares } from "./consts";
import { StatusFilterOption, Task, TaskFilters } from "./types";

export type UpdateTaskOpts = {
	ignore: {
		bind: boolean;
	};
};

export type UpdateTaskFunctionType = (
	task: Task,
	newTask: Task,
	opts?: UpdateTaskOpts,
) => Promise<string | undefined>;

type UseTasksResult = {
	tasks: Array<Task>;
	isTasksParsed: ParseState;
	updateTask: UpdateTaskFunctionType;
	addTask: (task: Task) => void;
	filters: TaskFilters;
};

/**
 * Hook for interaction with tasks in current vault
 */
export default function useTasks(): UseTasksResult {
	const [tasks, setTasks] = useState<Array<Task>>([]);
	const [isTasksParsed, setIsTasksParsed] = useState<ParseState>("parsing");
	const [shouldUpdateUI, setShouldUpdateUI] = useState(false);
	const [limit, setLimit] = useState(0);
	const [statusFilter, setStatusFilter] = useState<StatusFilterOption>("all");
	const [isRecur, setIsRecur] = useState(false);
	const [searchFilter, setSearchFilter] = useState("");
	const [tagFilter, setTagFilter] = useState("");
	const [hasOnlyThisTags, setHasOnlyThisTags] = useState(false);
	const [noteFilter, setNoteFilter] = useState("");
	const [isFromCurrentNote, setIsFromCurrentNote] = useState(false);
	const [activeFile, setActiveFile] = useState<TFile | null>(null);

	const filters = {
		limit,
		setLimit,
		searchFilter,
		setSearchFilter,
		statusFilter,
		setStatusFilter,
		isRecur,
		setIsRecur,
		tagFilter,
		setTagFilter,
		hasOnlyThisTags,
		setHasOnlyThisTags,
		noteFilter,
		setNoteFilter,
		isFromCurrentNote,
		setIsFromCurrentNote,
	};

	const app = useApp();
	const { historyRows } = useHistory();
	const settings = useSettings();

	if (!app) {
		setIsTasksParsed("error");

		return { tasks, isTasksParsed, updateTask, filters, addTask };
	}

	const { vault, workspace } = app;

	async function addTask(taskToAdd: Task): Promise<string | undefined> {
		const newLineContent = stringifyMiddlewares(
			taskToAdd,
			middlewares,
			settings,
		);

		const tFile = vault.getFileByPath(taskToAdd.path);

		if (!tFile) {
			return;
		}

		return await vault.process(tFile, (fileContent) =>
			fileContent.concat("\n", newLineContent),
		);
	}

	/**
	 * Update task props and save to vault
	 * @returns new string on success, undefined on failure.
	 * */
	async function updateTask(
		task: Task,
		newTask: Task,
		opts?: UpdateTaskOpts,
	): Promise<string | undefined> {
		const newLineContent = stringifyMiddlewares(
			newTask,
			middlewares,
			settings,
		);

		const tFile = vault.getFileByPath(task.path);

		if (!tFile) {
			return;
		}

		if (!opts?.ignore.bind) {
			if (task.bind && app && settings) {
				await operateYAMLBinding({
					task: newTask,
					previousTaskState: task,
					app,
					vault,
					settings,
				});
			}
		}

		return await vault.process(tFile, (data) =>
			data.replace(task.lineContent, newLineContent),
		);
	}

	function getTodayTasks(tasks: ReadonlyArray<Task>): Array<Task> {
		const toShowTodayTasks = tasks.filter(byToday(historyRows));
		toShowTodayTasks.map((task) => resetReccuringTask(task, updateTask));

		return toShowTodayTasks;
	}

	async function fetchTasks(): Promise<void> {
		try {
			const files = await getRawFiles(vault, settings);

			const parsedTasks = parseTasks(files);
			const parsedTaskswithMiddlewares = parseMiddlewares(
				parsedTasks,
				middlewares,
				{
					settings,
					app,
				},
			);

			sessionStorage.setItem(
				GamifiedTasksConstants.sessionTasks,
				JSON.stringify(parsedTaskswithMiddlewares),
			);

			setIsTasksParsed("parsed");
			setShouldUpdateUI((prev) => !prev);
		} catch (err) {
			setIsTasksParsed("error");
		}
	}

	const filterTaskList = (taskList: ReadonlyArray<Task>): Array<Task> =>
		taskList
			.filter(byNote(noteFilter, isFromCurrentNote, workspace))
			.filter(byStatus(statusFilter))
			.filter(byTag(tagFilter, hasOnlyThisTags))
			.filter(bySearch(searchFilter))
			.slice(0, limit);

	/**
	 * Load tasks from sessionStorage and apply filters.
	 */
	useEffect(() => {
		const tasksJSON = sessionStorage.getItem(
			GamifiedTasksConstants.sessionTasks,
		);

		/**
		 * Skips recurring tasks, filter tasks with condition by success condition.
		 */
		const filterBySuccessCondition = async (
			allRecurringTasks: Array<Task>,
		): Promise<Array<Task>> => {
			// Ignore caching of module by browser.
			const timestamp = new Date().getTime();

			const tasksToShow = await allRecurringTasks.reduce<Promise<Array<Task>>>(
				async (promiseAcc, task) => {
					const acc = await promiseAcc;

					if (task.condition) {
						const pathToModule =
							vault.adapter.getResourcePath(task.condition.name + ".js") +
							`?t=${timestamp}`;

						const result = await (
							await import(pathToModule)
						).default(task.condition.arg);

						if (result) {
							acc.push(task);
						}

						return acc;
					}

					acc.push(task);

					return acc;
				},
				Promise.resolve([]),
			);

			return tasksToShow;
		};

		if (tasksJSON) {
			const tasks: Array<Task> = JSON.parse(tasksJSON);

			if (isRecur) {
				const allRecurringTasks = tasks.filter(byRecurrance);

				const todayTasks = getTodayTasks(allRecurringTasks);

				filterBySuccessCondition(todayTasks).then((tasksToShow) => {
					const filteredList = filterTaskList(tasksToShow);

					setTasks(filteredList);
				});
			} else {
				const filteredList = filterTaskList(tasks);

				setTasks(filteredList);
			}
		}

		const handleActiveFile = (): void => {
			const tFile = workspace.getActiveFile();
			setActiveFile(tFile);
		};

		workspace.on("active-leaf-change", handleActiveFile);
		return () => workspace.off("active-leaf-change", handleActiveFile);
	}, [
		limit,
		searchFilter,
		isRecur,
		statusFilter,
		tagFilter,
		hasOnlyThisTags,
		noteFilter,
		isFromCurrentNote,
		activeFile,
		shouldUpdateUI,
	]);

	const setupDefaultSettings = (): void => {
		if (!settings) {
			return;
		}

		type SettingSetter = {
			setting: unknown;
			setter: React.Dispatch<React.SetStateAction<unknown>>;
		};

		const settingSetters: ReadonlyArray<SettingSetter> = [
			{ setting: settings.limit, setter: setLimit },
			{ setting: settings.statusFilter, setter: setStatusFilter },
			{ setting: settings.isRecurTasks, setter: setIsRecur },
			{ setting: settings.tagFilter, setter: setTagFilter },
			{ setting: settings.hasOnlyThisTags, setter: setHasOnlyThisTags },
			{ setting: settings.noteFilter, setter: setNoteFilter },
			{
				setting: settings.isFromCurrentNote,
				setter: setIsFromCurrentNote,
			},
		];

		settingSetters.forEach((obj) => obj.setting && obj.setter(obj.setting));
	};

	/**
	 * Apply default settings on mount.
	 * Fetch tasks when vault is modified.
	 */
	useEffect(() => {
		setupDefaultSettings();

		fetchTasks();
		vault.on("modify", fetchTasks);
		return () => vault.off("modify", fetchTasks);
	}, []);

	return { tasks, isTasksParsed, updateTask, filters, addTask };
}

function resetReccuringTask(
	task: Task,
	updateTask: UpdateTaskFunctionType
): void {
	const newTask = { ...task };

	const isNotDone = task.status !== "done";

	if (isNotDone) {
		return;
	}

	newTask.status = "todo";

	if (task.counter) {
		const isGoalNotSet = !task.counter.goal;
		const isReachedGoal = task.counter.current === task.counter.goal;

		if (isGoalNotSet || isReachedGoal) {
			const { goal } = task.counter;

			newTask.counter = { current: 0, goal };
		}
	}

	updateTask(task, newTask, {ignore: {bind: true}});
}
