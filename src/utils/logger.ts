import { moment } from "obsidian";

export const loggerMsg = (msg: string): string =>
	`[gamified-tasks][${moment().format("YYYY-MM-DD|HH:mm")}]: ${msg}`;

export const logger = (msg: string): void => console.log(loggerMsg(msg));
