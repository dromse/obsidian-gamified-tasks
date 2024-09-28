import {
	bind,
	body,
	completedAt, condition, counter,
	difficulty,
	every,
	indention,
	status
} from "@core/middleware";
import { Middleware, Status } from "./types";

/**
 * Statuses for tasks with markdown values
 * Inspired by obsidian-tasks: {@link https://publish.obsidian.md/tasks/Getting+Started/Statuses}
 */
export const StatusMarkdown: Record<Status, string> = {
	/**
	 * Represents a task that is to be done.
	 */
	todo: " ",

	/**
	 * Represents a task that is currently being worked on.
	 */
	doing: "/",

	/**
	 * Represents a task that has been completed.
	 */
	done: "x",

	/**
	 * Represents a task that has been denied or rejected.
	 */
	denied: "-",

	/**
	 * Represents a task that has been delayed.
	 */
	delay: "?",
};

/**
 * Array of status keys.
 */
export const StatusKeys = Object.keys(StatusMarkdown) as Array<Status>;

/**
 * Gamified Tasks uses middlewares for parsing tasks metadata (tags) and stringifying back to markdown line.
 *
 * These middlewares handle various aspects of task parsing and stringification,
 * including indention, task status, body content, counters, bindings, difficulty level,
 * recurrence and completion timestamps.
 *
 * Note: The `body` middleware is not necessary for parsing but is included for
 * correct stringification.
 */
export const middlewares: Array<Middleware> = [
	indention, // Middleware for handling indention
	status, // Middleware for handling task status
	body, // Middleware for handling task body content
	counter, // Middleware for handling task counters
	difficulty, // Middleware for handling task difficulty
	bind, // Middleware for handling binding to YAML properties in daily notes
	condition, // Middleware for handling conditions
	every, // Middleware for handling task recurrence
	completedAt, // Middleware for handling task completion timestamps
];

export const TaskFilterOptions = ["all", "condition", "recurring"] as const;
export const SortTypeOptions = ["any", "alphabetical", "numerical"] as const;
export const SortOrderOptions = ["any", "ascending", "descending"] as const;
