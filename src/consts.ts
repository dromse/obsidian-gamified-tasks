import { GrindPluginSettings } from "@types";

export const GrindConsts = {
	sessionTasks: "grind-manager__tasks",
};

export const DEFAULT_SETTINGS: GrindPluginSettings = {
	limit: 10,
	statusFilter: "all",
	isRecurTasks: false,
	pathToRewards: "rewards.md",
	pathToHistory: "history.md",
	pathToDaily: "",
	dailyFormat: "YYYY-MM-DD",
	useMarkdownLinks: true,
	ignoreList: [],
	tagFilter: "",
	hasOnlyThisTags: false,
	noteFilter: "",
	isFromCurrentNote: false,
	shouldShowAllFilters: false,
	isCompletedAtEnabled: true
};

export const DATE_FORMAT = "YYYY-MM-DD HH:mm" as const;
