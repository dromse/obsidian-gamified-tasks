import { GamifiedTasksConstants } from "@consts";
import { useApp } from "@hooks/useApp";
import useEditTasks from "@hooks/useEditTasks";
import useHistory from "@hooks/useHistory";
import { useSettings } from "@hooks/useSettings";
import { useFilters } from "@providers/FiltersProvider";
import { useSorting } from "@providers/SortingProvider";
import {
	byIgnore,
	byNote,
	byRecurrance,
	bySearch,
	byStatus,
	byTag,
	byToday,
	filterBySuccessCondition
} from "@utils/filter";
import { sortBy } from "@utils/sort";
import { TFile } from "obsidian";
import React from "react";
import { State, Task } from "../../core/types";
import { ParseState } from "../types";
import { useFetchTasks } from "./useFetchTasks";

type UseTasksResult = {
	tasks: Array<Task>;
	isTasksParsed: ParseState;
	watchFiltersAndSorting: () => void;
	watchTasks: () => void;
};

/**
 * Hook for interaction with tasks in current vault
 */
export default function useWatchTasks(): UseTasksResult {
	const [tasks, setTasks] = React.useState<Array<Task>>([]);
	const [shouldUpdateUI, setShouldUpdateUI] = React.useState(false);
	const [activeFile, setActiveFile] = React.useState<TFile | null>(null);
	const { historyRows } = useHistory();

	const [isTasksParsed, setIsTasksParsed] =
		React.useState<ParseState>("parsing");

	const app = useApp();
	const settings = useSettings();

	if (!app || !settings) {
		setIsTasksParsed("error");

		return {
			tasks,
			isTasksParsed,
			watchFiltersAndSorting,
			watchTasks,
		};
	}

	const sorting = useSorting();
	const filters = useFilters();

	const { vault, workspace } = app;
	const { resetRecurringTask } = useEditTasks();

	function getTodayTasks(tasks: ReadonlyArray<Task>): Array<Task> {
		const toShowTodayTasks = tasks.filter(byToday(historyRows));
		toShowTodayTasks.map((task) => resetRecurringTask(task));

		return toShowTodayTasks;
	}

	const filterAndSortTasks = (tasks: ReadonlyArray<Task>): Array<Task> => {
		let tasksCopy: Array<Task> = tasks.concat();

		const shouldIgnore =
			!filters.note.value && !filters.shouldShowCurrentNoteTasks.value;

		if (shouldIgnore) {
			tasksCopy = tasksCopy.filter(byIgnore(settings));
		}

		const filteredTasks = tasksCopy
			.filter(
				byNote(
					filters.note.value,
					filters.shouldShowCurrentNoteTasks.value,
					workspace,
				),
			)
			.filter(byStatus(filters.status.value))
			.filter(byTag(filters.tags.value, filters.onlyThisTags.value))
			.filter(bySearch(filters.search.value));

		const { sortByType, sortByOrder, shouldSortAfterLimit } = sorting;

		const isDescendingAny =
			sortByType.value === "any" && sortByOrder.value === "descending";

		const sortAndLimit = (list: Array<Task>): Array<Task> =>
			isDescendingAny
				? list.reverse().slice(0, filters.limit.value)
				: list
					.sort(sortBy(sortByType.value, sortByOrder.value))
					.slice(0, filters.limit.value);

		const limitAndSort = (list: Array<Task>): Array<Task> =>
			isDescendingAny
				? list.slice(0, filters.limit.value).reverse()
				: list
					.slice(0, filters.limit.value)
					.sort(sortBy(sortByType.value, sortByOrder.value));

		const filteredAndSortedTasks = shouldSortAfterLimit.value
			? limitAndSort(filteredTasks)
			: sortAndLimit(filteredTasks);

		return filteredAndSortedTasks;
	};

	/**
	 * Load tasks from sessionStorage and apply filters and sorting.
	 */
	function watchFiltersAndSorting(): void {
		React.useEffect(() => {
			const tasksJSON = sessionStorage.getItem(
				GamifiedTasksConstants.sessionTasks,
			);

			if (tasksJSON) {
				const tasksInVanilla: Array<Task> = JSON.parse(tasksJSON);

				if (filters.recur.value) {
					const allRecurringTasks = tasksInVanilla.filter(byRecurrance);

					const todayTasks = getTodayTasks(allRecurringTasks);

					const filteredList = filterAndSortTasks(todayTasks);

					setTasks(filteredList);
				} else if (filters?.showByCondition.value) {
					filterBySuccessCondition(tasksInVanilla).then(
						(tasksBySuccessCondition) => {
							const filteredTasks = filterAndSortTasks(
								tasksBySuccessCondition,
							);

							setTasks(filteredTasks);
						},
					);
				} else {
					const filteredList = filterAndSortTasks(tasksInVanilla);

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
			...Object.values(filters).map(({ value }) => value),
			...Object.values(sorting).map(({ value }) => value),
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
			state: State<unknown>;
		};

		const bindedSettingsToState: ReadonlyArray<SettingSetter> = [
			// filters
			{ setting: settings.limit, state: filters.limit },
			{ setting: settings.statusFilter, state: filters.status },
			{ setting: settings.isRecurTasks, state: filters.recur },
			{ setting: settings.tagFilter, state: filters.tags },
			{ setting: settings.hasOnlyThisTags, state: filters.onlyThisTags },
			{ setting: settings.noteFilter, state: filters.note },
			{
				setting: settings.isFromCurrentNote,
				state: filters.shouldShowCurrentNoteTasks,
			},

			// sorting
			{ setting: settings.sortByOrder, state: sorting.sortByOrder },
			{ setting: settings.sortByType, state: sorting.sortByType },
			{
				setting: settings.shouldSortAfterLimit,
				state: sorting.shouldSortAfterLimit,
			},
		];

		bindedSettingsToState.forEach(
			(binded) => binded.setting && binded.state.setValue(binded.setting),
		);
	};

	const fetchTasksInCache = useFetchTasks();

	/**
	 * Apply default settings on mount.
	 * Fetch tasks when vault is modified.
	 */
	function watchTasks(): void {
		React.useEffect(() => {
			setupDefaultSettings();

			const syncTasksForUI = (): void => {
				fetchTasksInCache().then((isParsed) => {
					if (isParsed) {
						setIsTasksParsed(isParsed), setShouldUpdateUI((p) => !p);
					}
				});
			};

			syncTasksForUI();

			vault.on("modify", syncTasksForUI);
			return () => vault.off("modify", syncTasksForUI);
		}, []);
	}

	return {
		tasks,
		isTasksParsed,
		watchFiltersAndSorting: watchFiltersAndSorting,
		watchTasks,
	};
}
