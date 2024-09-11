import { GamifiedTasksConstants } from "@consts";
import useEditTasks from "@hooks/useEditTasks";
import { getRawFiles } from "@utils/file";
import {
	byNote,
	byRecurrance,
	bySearch,
	byStatus,
	byTag,
	byToday,
	filterBySuccessCondition
} from "@utils/filter";
import { parseMiddlewares } from "@utils/middleware";
import { parseTasks } from "@utils/task";
import { TFile } from "obsidian";
import React from "react";
import { useApp, useFilters, useHistory, useSettings } from "..";
import { ParseState } from "../types";
import { middlewares } from "./consts";
import { FilterState, Task } from "./types";

type UseTasksResult = {
	tasks: Array<Task>;
	isTasksParsed: ParseState;
	watchFilters: () => void;
	watchTasks: () => void;
};

/**
 * Hook for interaction with tasks in current vault
 */
export default function useWatchTasks(): UseTasksResult {
	const [isTasksParsed, setIsTasksParsed] =
		React.useState<ParseState>("parsing");
	const [tasks, setTasks] = React.useState<Array<Task>>([]);
	const [shouldUpdateUI, setShouldUpdateUI] = React.useState(false);
	const [activeFile, setActiveFile] = React.useState<TFile | null>(null);
	const { historyRows } = useHistory();

	const app = useApp();
	const settings = useSettings();
	const filters = useFilters();
	if (!app || !settings || !filters) {
		setIsTasksParsed("error");

		return {
			tasks,
			isTasksParsed,
			watchFilters,
			watchTasks,
		};
	}

	const { vault, workspace } = app;
	const { resetRecurringTask } = useEditTasks();

	function getTodayTasks(tasks: ReadonlyArray<Task>): Array<Task> {
		const toShowTodayTasks = tasks.filter(byToday(historyRows));
		toShowTodayTasks.map((task) => resetRecurringTask(task));

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

			// cache tasks
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
			.filter(
				byNote(
					filters.note.value,
					filters.shouldShowCurrentNoteTasks.value,
					workspace,
				),
			)
			.filter(byStatus(filters.status.value))
			.filter(byTag(filters.tags.value, filters.onlyThisTags.value))
			.filter(bySearch(filters.search.value))
			.slice(0, filters.limit.value);

	/**
	 * Load tasks from sessionStorage and apply filters.
	 */
	function watchFilters(): void {
		React.useEffect(() => {
			const tasksJSON = sessionStorage.getItem(
				GamifiedTasksConstants.sessionTasks,
			);

			if (tasksJSON) {
				const tasksInVanilla: Array<Task> = JSON.parse(tasksJSON);

				if (filters?.recur.value) {
					const allRecurringTasks = tasksInVanilla.filter(byRecurrance);

					const todayTasks = getTodayTasks(allRecurringTasks);

					const filteredList = filterTaskList(todayTasks);

					setTasks(filteredList);
				} else if (filters?.showByCondition.value) {
					filterBySuccessCondition(tasksInVanilla).then(
						(tasksBySuccessCondition) => {
							const filteredTasks = filterTaskList(tasksBySuccessCondition);

							setTasks(filteredTasks);
						},
					);
				} else {
					const filteredList = filterTaskList(tasksInVanilla);

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
			...Object.values(filters!).map(({ value }) => value),
			activeFile,
			shouldUpdateUI,
		]);
	}

	const setupDefaultSettings = (): void => {
		if (!settings) {
			return;
		}

		type SettingSetter = {
			setting: unknown;
			filter: FilterState<unknown>;
		};

		const settingSetters: ReadonlyArray<SettingSetter> = [
			{ setting: settings.limit, filter: filters.limit },
			{ setting: settings.statusFilter, filter: filters.status },
			{ setting: settings.isRecurTasks, filter: filters.recur },
			{ setting: settings.tagFilter, filter: filters.tags },
			{ setting: settings.hasOnlyThisTags, filter: filters.onlyThisTags },
			{ setting: settings.noteFilter, filter: filters.note },
			{
				setting: settings.isFromCurrentNote,
				filter: filters.shouldShowCurrentNoteTasks,
			},
		];

		settingSetters.forEach(
			(obj) => obj.setting && obj.filter.setValue(obj.setting),
		);
	};

	/**
	 * Apply default settings on mount.
	 * Fetch tasks when vault is modified.
	 */
	function watchTasks(): void {
		React.useEffect(() => {
			setupDefaultSettings();

			fetchTasks();
			vault.on("modify", fetchTasks);
			return () => vault.off("modify", fetchTasks);
		}, []);
	}

	return {
		tasks,
		isTasksParsed,
		watchFilters,
		watchTasks,
	};
}
