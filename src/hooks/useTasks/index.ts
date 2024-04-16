import { GrindConsts } from "@consts";
import { TFile } from "obsidian";
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
	const [triggerUI, setTriggerUI] = useState(false);
	const [limit, setLimit] = useState(0);
	const [statusFilter, setStatusFilter] = useState<StatusFilterOption>("all");
	const [isRecur, setIsRecur] = useState(false);
	const [searchFilter, setSearchFilter] = useState("");
	const [tagFilter, setTagFilter] = useState("");
	const [onlyThisTags, setOnlyThisTags] = useState(false);
	const [noteFilter, setNoteFilter] = useState("");
	const [fromCurrentNote, setFromCurrentNote] = useState(false);
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
		onlyThisTags,
		setOnlyThisTags,
		noteFilter,
		setNoteFilter,
		fromCurrentNote,
		setFromCurrentNote,
	};

	const app = useApp();
	const { history } = useHistory();
	const settings = useSettings();

	if (!app) {
		setIsTasksParsed("error");

		return { tasks, isTasksParsed, updateTask, filters };
	}

	const { vault, workspace } = app;

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

	const filterByNote = (task: Task): boolean => {
		if (fromCurrentNote) {
			const activeNote = workspace.getActiveFile();

			if (activeNote) {
				return task.path === activeNote.path;
			}

			return false;
		}

		if (noteFilter === "") {
			return true;
		}

		return task.path === noteFilter + ".md";
	};

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

	const filterTaskList = (taskList: Task[]) =>
		taskList
			.filter(filterByNote)
			.filter(filterByStatus)
			.filter(filterByTag)
			.filter(filterBySearch)
			.slice(0, limit);

	const handleActiveFile = () => {
		const tFile = workspace.getActiveFile();
		setActiveFile(tFile);
	};
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

				const filteredList = filterTaskList(todayTasks);

				setTasks(filteredList);
			} else {
				const filteredList = filterTaskList(tasks);

				setTasks(filteredList);
			}
		}

		workspace.on("active-leaf-change", handleActiveFile);
		return () => workspace.off("active-leaf-change", handleActiveFile);
	}, [
		limit,
		searchFilter,
		isRecur,
		statusFilter,
		tagFilter,
		onlyThisTags,
		noteFilter,
		fromCurrentNote,
		activeFile,
		triggerUI,
	]);

	/**
	 * Fetch tasks from vault on trigger call.
	 */
	useEffect(() => {
		fetchTasks();

		vault.on("modify", fetchTasks);
		return () => vault.off("modify", fetchTasks);
	}, []);

	/**
	 * Apply default settings on mount.
	 */
	useEffect(() => {
		if (!settings) {
			return;
		}

		const { limit, statusFilter, isRecurTasks, tagFilter, onlyThisTags, noteFilter, fromCurrentNote } =
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

		if (noteFilter) {
			setNoteFilter(noteFilter);
		}

		if (fromCurrentNote) {
			setFromCurrentNote(fromCurrentNote);
		}
	}, []);

	return { tasks, isTasksParsed, updateTask, filters };
}
