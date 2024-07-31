import { moment } from "obsidian";

export const loggerMsg = (msg: string): string =>
	`[gamified-tasks][${moment().format("YYYY-MM-DD|HH:mm")}]: ${msg}`;

/* eslint-disable-next-line no-console */
export const logger = (msg: string): void => console.log(loggerMsg(msg));
