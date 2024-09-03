import { TaskFilterOptions } from "@consts";
import { StatusFilterOption } from "@hooks/useWatchTasks/types";

export type TaskFilterOptionsType = (typeof TaskFilterOptions)[number];

export type GamifiedTasksSettings = {
	limit: number | undefined;
	statusFilter: StatusFilterOption;
	isRecurTasks: boolean;
	pathToRewards: string;
	pathToHistory: string;
	pathToConditions: string;
	pathToDaily: string;
	dailyFormat: string;
	useMarkdownLinks: boolean;
	ignoreList: Array<string>;
	tagFilter: string;
	hasOnlyThisTags: boolean;
	noteFilter: string;
	isFromCurrentNote: boolean;
	shouldShowAllFilters: boolean;
	isCompletedAtEnabled: boolean;
	difficulties: Array<DifficultySetting>;
	pathToSaveNewTask: string;
	shouldShowByCondition: boolean;
	filterTasksOnOpen: TaskFilterOptionsType;
};

export type DifficultySetting = { name: string; price: number };
