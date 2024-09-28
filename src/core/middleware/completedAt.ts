import { GamifiedTasksSettings } from "@types";
import { cleanBody, findByRegex } from "@utils/middleware";
import { moment } from "obsidian";
import { Middleware, Task } from "../types";

const parse = (task: Task, settings: GamifiedTasksSettings): Task => {
	let completedAt = "";
	let newBody = task.body;

	if (!settings) {
		return task;
	}

	if (settings.completedAtFormat) {
		const firstWord = settings.completedAtFormat
			.replace(/[\[\]]/g, "")
			.split(" ")[0];

		const lastIndex = task.body.lastIndexOf(firstWord);

		if (lastIndex !== -1) {
			completedAt = task.body.slice(lastIndex).trim();
			newBody = task.body.slice(0, lastIndex).trim();
		}
	} else {
		let regex =
			/✅ \[\[(\d{4}-\d{2}-\d{2})\|(\d{4}-\d{2}-\d{2} \| \d{2}:\d{2})\]\]/;

		if (settings.useMarkdownLinks) {
			regex = RegExp(
				`✅ \\[\\d{4}-\\d{2}-\\d{2} \\| \\d{2}:\\d{2}\\]\\(${settings.pathToDaily}\\/\\d{4}-\\d{2}-\\d{2}\\.md\\)`,
			);
		}

		const match = findByRegex(regex, task);

		if (!match) {
			return task;
		}

		newBody = cleanBody(regex, task);

		completedAt = match[0];
	}

	return { ...task, completedAt, body: newBody };
};

const stringify = (task: Task, settings: GamifiedTasksSettings): string => {
	if (settings.isCompletedAtEnabled === false) {
		return "";
	}

	let completedAt = "";

	if (settings.completedAtFormat) {
		completedAt = moment().format(settings.completedAtFormat);
	} else {
		let completedAtDate = moment().format(settings.dailyFormat);
		let completedAtTime = moment().format("HH:mm");

		if (settings.useMarkdownLinks) {
			completedAt = `✅ [${completedAtDate} | ${completedAtTime}](${settings.pathToDaily}/${completedAtDate}.md)`;
		} else {
			completedAt = `✅ [[${completedAtDate}|${completedAtDate} | ${completedAtTime}]]`;
		}
	}

	return task.status === "done" ? " " + completedAt : "";
};

export default { parse, stringify } as Middleware;
