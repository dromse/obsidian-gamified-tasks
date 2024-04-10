import { GrindConsts } from "@consts";
import { useEffect, useState } from "react";
import { useApp, useHistory, useSettings } from "..";
import { ParseState } from "../types";
import { middlewares } from "./consts";
import { StatusFilterOption, Task, TaskFilters } from "./types";
import {
	generatePastDaysArray,
	getAmountOfPastDays,
	getRawFiles,
	parseMiddlewares,
	parseTasks,
	stringifyMiddlewares
} from "./utils";

type UseTasksResult = {
	tasks: Task[];
	isTasksParsed: ParseState;
	updateTask: (task: Task, newTask: Task) => void;
	filters: TaskFilters;
};

/**
 * Hook for interaction with tasks in current vault
 */
export default function useTasks(): UseTasksResult {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isTasksParsed, setIsTasksParsed] = useState<ParseState>("parsing");
	const [trigger, setTrigger] = useState(false);
	const [triggerUI, setTriggerUI] = useState<boolean>(false);
	const [limit, setLimit] = useState<number>(0);
	const [statusFilter, setStatusFilter] = useState<StatusFilterOption>("all");
	const [isRecur, setIsRecur] = useState<boolean>(false);
	const [searchFilter, setSearchFilter] = useState<string>("");

	const filters = {
		limit,
		setLimit,
		searchFilter,
		setSearchFilter,
		statusFilter,
		setStatusFilter,
		isRecur,
		setIsRecur,
	};

	const app = useApp();
	const { history, syncHistory } = useHistory();

	if (!app) {
		setIsTasksParsed("error");

		return { tasks, isTasksParsed, updateTask, filters };
	}

	const { vault } = app;

	/** Update task props and save to vault */
	async function updateTask(
		task: Task,
		newTask: Task,
	): Promise<"updated" | "error"> {
		const newStr = stringifyMiddlewares(newTask, middlewares, settings);

		const tFile = vault.getFileByPath(task.path);

		if (!tFile) {
			return "error";
		}

		const result = await vault.process(tFile, (data) =>
			data.replace(task.lineContent, newStr),
		);

		if (result) {
			setTrigger((prev) => !prev);

			return "updated";
		}

		return "error";
	}

	const filterBySearch = (task: Task): boolean =>
		task.body
			? task.body.toLowerCase().includes(searchFilter.toLowerCase())
			: true;

	const filterByStatus = (task: Task): boolean => {
		if (statusFilter === "all") {
			return true;
		}

		if (!task.status) {
			return false;
		}

		if (statusFilter === task.status) {
			return true;
		}

		return false;
	};

	const filterByRecurrance = (task: Task): boolean => {
		if (!isRecur) {
			return true;
		}

		if (!task.every) {
			return false;
		}

		let amountOfDaysToShowAgain = getAmountOfPastDays(task.every);
		let isTaskNotAppearInPastDays = false;

		if (!amountOfDaysToShowAgain) {
			return false;
		}

		const pastDays = generatePastDaysArray(amountOfDaysToShowAgain);

		syncHistory();

		const historyRows = history
			.filter((row) => pastDays.includes(row.date.split(" ")[0]))
			.map((row) => row.title);

		isTaskNotAppearInPastDays = !historyRows.includes(task.body);

		if (isTaskNotAppearInPastDays) {
			if (task.status === "done") {
				updateTask(task, { ...task, status: "todo" });
			}

			if (!task.counter) {
				return true;
			}

			if (task.counter.current === task.counter.goal) {
				const { goal } = task.counter;

				updateTask(task, {
					...task,
					status: "todo",
					counter: { current: 0, goal },
				});
			}
		}

		if (task.status === "done") {
			return false;
		}

		if (!task.counter || task.counter.current !== task.counter.goal) {
			return true;
		}

		return isTaskNotAppearInPastDays;
	};

	async function fetchTasks() {
		try {
			const files = await getRawFiles(vault);

			const parsedTasks = parseTasks(files);
			const parsedTaskswithMiddlewares = parseMiddlewares(
				parsedTasks,
				middlewares,
				settings,
			);

			sessionStorage.setItem(
				GrindConsts.sessionTasks,
				JSON.stringify(parsedTaskswithMiddlewares),
			);

			setIsTasksParsed("parsed");
			setTriggerUI((prev) => !prev);
		} catch (err) {
			setIsTasksParsed("error");
		}
	}

	const settings = useSettings();

	/**
	 * Apply default settings on mount.
	 */
	useEffect(() => {
		if (!settings) {
			return;
		}

		const { limit, statusFilter, isRecurTasks } = settings;

		if (limit) {
			setLimit(limit);
		}

		if (statusFilter) {
			setStatusFilter(statusFilter);
		}

		if (isRecurTasks) {
			setIsRecur(isRecurTasks);
		}
	}, []);

	/**
	 * Load tasks from sessionStorage and apply filters.
	 */
	useEffect(() => {
		const tasksJSON = sessionStorage.getItem(GrindConsts.sessionTasks);

		if (tasksJSON) {
			const tasks = JSON.parse(tasksJSON);

			setTasks(
				tasks
					.filter(filterByRecurrance)
					.filter(filterByStatus)
					.filter(filterBySearch)
					.slice(0, limit),
			);
		}
	}, [limit, searchFilter, isRecur, statusFilter, triggerUI]);

	/**
	 * Fetch tasks from vault on trigger call.
	 */
	useEffect(() => {
		fetchTasks();
	}, [trigger]);

	return { tasks, isTasksParsed, updateTask, filters };
}
