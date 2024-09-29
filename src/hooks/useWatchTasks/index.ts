import { useApp } from "@hooks/useApp";
import React from "react";
import { Task } from "../../core/types";
import { ParseState } from "../types";
import useDefaultSettings from "./useDefaultSettings";
import { useFetchTasks } from "./useFetchTasks";
import useWatchUITaskList from "./useWatchUITaskList";

type UseTasksResult = {
	tasks: Array<Task>;
	isTasksParsed: ParseState;
	watchTasks: () => void;
};

/**
 * Hook for interaction with tasks in current vault
 */
export default function useWatchTasks(): UseTasksResult {
	const [isTasksParsed, setIsTasksParsed] =
		React.useState<ParseState>("parsing");

	const app = useApp()!;
	const { vault } = app;

	const fetchTasksInCache = useFetchTasks();
	const setupDefaultSettings = useDefaultSettings();
	const { tasks, watchUITaskList, forceUpdateUITaskList } =
		useWatchUITaskList();

	/**
	 * Apply default settings on mount.
	 * Fetch tasks when vault is modified.
	 */
	function watchTasks(): void {
		React.useEffect(() => {
			setupDefaultSettings();

			const syncTasksForUI = (): void => {
				fetchTasksInCache().then((isParsed) => {
					setIsTasksParsed(isParsed);

					forceUpdateUITaskList();
				});
			};

			syncTasksForUI();

			vault.on("modify", syncTasksForUI);
			return () => vault.off("modify", syncTasksForUI);
		}, []);

		watchUITaskList();
	}

	return {
		tasks,
		isTasksParsed,
		watchTasks,
	};
}
