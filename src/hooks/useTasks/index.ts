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
	stringifyMiddlewares,
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
	const [triggerUI, setTriggerUI] = useState<boolean>(false);
	const [limit, setLimit] = useState<number>(0);
	const [statusFilter, setStatusFilter] = useState<StatusFilterOption>("all");
	const [isRecur, setIsRecur] = useState<boolean>(false);
	const [searchFilter, setSearchFilter] = useState<string>("");
	const [tagFilter, setTagFilter] = useState<string>("");
	const [onlyThisTags, setOnlyThisTags] = useState<boolean>(false);

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
		onlyThisTags,
		setOnlyThisTags,
	};

	const app = useApp();
	const { history } = useHistory();

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

	const filterByRecurrance = (task: Task): boolean =>
		task.every ? true : false;

	function resetReccuringTask(task: Task) {
		const newTask = { ...task };
		if (task.status === "done") {
			newTask.status = "todo";
		}

		if (task.counter) {
			if (task.counter.current === task.counter.goal) {
				const { goal } = task.counter;

				newTask.counter = { current: 0, goal };
			}
		}

		updateTask(task, newTask);
	}

	function toShowTodayFilter(task: Task): boolean {
		if (!task.every) {
			return false;
		}

		let amountOfDaysToShowAgain = getAmountOfPastDays(task.every);

		if (!amountOfDaysToShowAgain) {
			return false;
		}

		const pastDaysList = generatePastDaysArray(amountOfDaysToShowAgain);

		const historyRows = history
			.filter((row) => pastDaysList.includes(row.date.split(" ")[0]))
			.map((row) => row.title);

		const isTaskNotAppearInPastDays = !historyRows.includes(task.body);

		if (task.counter && task.counter.current !== task.counter.goal) {
			return true;
		}

		return isTaskNotAppearInPastDays;
	}

	function getTodayTasks(tasks: Task[]): Task[] {
		const toShowTodayTasks = tasks.filter(toShowTodayFilter);
		toShowTodayTasks.map((task) => resetReccuringTask(task));

		return toShowTodayTasks;
	}

	function filterByTag(task: Task): boolean {
		if (tagFilter.length === 0) {
			return true;
		}

		const tags = tagFilter
			.split(",")
			.map((tag) => tag.trim())
			.filter((trimmedTag) => trimmedTag !== "")
			.map((tag) => "#" + tag);

		if (onlyThisTags) {
			return tags.every((tag) => task.lineContent.includes(tag));
		} else {
			return tags.some((tag) => task.lineContent.includes(tag));
		}
	}

	async function fetchTasks() {
		try {
			const files = await getRawFiles(vault, settings);

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

		const { limit, statusFilter, isRecurTasks, tagFilter, onlyThisTags } =
			settings;

		if (limit) {
			setLimit(limit);
		}

		if (statusFilter) {
			setStatusFilter(statusFilter);
		}

		if (isRecurTasks) {
			setIsRecur(isRecurTasks);
		}

		if (tagFilter) {
			setTagFilter(tagFilter);
		}

		if (onlyThisTags) {
			setOnlyThisTags(onlyThisTags);
		}
	}, []);

	/**
	 * Load tasks from sessionStorage and apply filters.
	 */
	useEffect(() => {
		const tasksJSON = sessionStorage.getItem(GrindConsts.sessionTasks);

		if (tasksJSON) {
			const tasks: Task[] = JSON.parse(tasksJSON);

			if (isRecur) {
				const allRecurringTasks = tasks.filter(filterByRecurrance);

				const todayTasks = getTodayTasks(allRecurringTasks);

				setTasks(
					todayTasks
						.filter(filterByStatus)
						.filter(filterByTag)
						.filter(filterBySearch)
						.slice(0, limit),
				);
			} else {
				setTasks(
					tasks
						.filter(filterByStatus)
						.filter(filterByTag)
						.filter(filterBySearch)
						.slice(0, limit),
				);
			}
		}
	}, [limit, searchFilter, isRecur, statusFilter, tagFilter, onlyThisTags, triggerUI]);

	/**
	 * Fetch tasks from vault on trigger call.
	 */
	useEffect(() => {
		fetchTasks();

		vault.on("modify", fetchTasks);
		return () => vault.off("modify", fetchTasks);
	}, []);

	return { tasks, isTasksParsed, updateTask, filters };
}
