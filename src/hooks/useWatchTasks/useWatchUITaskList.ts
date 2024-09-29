import { GamifiedTasksConstants } from "@consts";
import { Task } from "@core/types";
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

type Result = {
	tasks: Array<Task>;
	watchUITaskList: () => void;
	forceUpdateUITaskList: () => void
};

export default function useWatchUITaskList(): Result {
	const [activeFile, setActiveFile] = React.useState<TFile | null>(null);
	const [tasks, setTasks] = React.useState<Array<Task>>([]);
	const [shouldUpdateUI, setShouldUpdateUI] = React.useState(false)

	const sorting = useSorting();
	const filters = useFilters();
	const settings = useSettings()!;
	const { historyRows } = useHistory();

	const { workspace } = useApp()!;
	const { resetRecurringTask } = useEditTasks();

	const forceUpdateUITaskList = (): void => setShouldUpdateUI(prev=>!prev)

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
	function watchUITaskList(): void {
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
			shouldUpdateUI
		]);
	}

	return { tasks, watchUITaskList, forceUpdateUITaskList };
}
