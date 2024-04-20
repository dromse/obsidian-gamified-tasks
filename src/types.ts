import { StatusFilterOption } from "@hooks/useTasks/types";

export type GrindPluginSettings = {
	limit: number | undefined;
	statusFilter: StatusFilterOption;
	isRecurTasks: boolean;
	pathToRewards: string;
	pathToHistory: string;
	pathToDaily: string;
	dailyFormat: string;
	useMarkdownLinks: boolean;
	ignoreList: Array<string>;
	tagFilter: string;
	hasOnlyThisTags: boolean;
	noteFilter: string;
	isFromCurrentNote: boolean;
};
