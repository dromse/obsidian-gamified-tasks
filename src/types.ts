import {
	SortOrder,
	SortType,
	StatusFilterOption,
	TaskFilterOptionsType
} from "@core/types";

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
	completedAtFormat: string;
	difficulties: Array<DifficultySetting>;
	pathToSaveNewTask: string;
	shouldShowByCondition: boolean;
	filterTasksOnOpen: TaskFilterOptionsType;
	sortByType: SortType;
	sortByOrder: SortOrder;
	shouldSortAfterLimit: boolean;
	creditMode: boolean;
};

export type DifficultySetting = { name: string; price: number };
