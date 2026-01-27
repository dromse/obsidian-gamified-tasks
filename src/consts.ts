import { GamifiedTasksSettings } from "@types";

export const GamifiedTasksConstants = {
    sessionTasks: "gamified-tasks__tasks",
};

const DefaultDifficulties = [
    { name: "trivial", price: 0.1 },
    { name: "easy", price: 1 },
    { name: "medium", price: 2.5 },
    { name: "hard", price: 5 },
];

export const DEFAULT_SETTINGS: GamifiedTasksSettings = {
    limit: 10,
    statusFilter: [],
    isRecurTasks: false,
    pathToRewards: "rewards.md",
    pathToHistory: "history.md",
    pathToConditions: "Conditions/",
    pathToDaily: "",
    dailyFormat: "YYYY-MM-DD",
    useMarkdownLinks: true,
    ignoreList: [],
    tagFilter: "",
    hasOnlyThisTags: false,
    noteFilter: "",
    isFromCurrentNote: false,
    shouldShowAllFilters: false,
    isCompletedAtEnabled: true,
    completedAtFormat: "",
    difficulties: DefaultDifficulties,
    defaultDifficulty: "none",
    shouldShowByCondition: false,
    pathToSaveNewTask: "tasks.md",
    filterTasksOnOpen: "all",
    sortByType: "any",
    sortByOrder: "any",
    shouldSortAfterLimit: false,
    creditMode: false,
    negativeCounter: false,
    isGroupCollapsed: false,
    customGroups: [],
    enableSoundEffects: false,
    pathToRewardSound: "",
    pathToCounterMinusSound: "",
    pathToCounterPlusSound: "",
    pathToTaskCompletionSound: "",
    openOnLayout: "right",
};

export const DAY_FORMAT = "YYYY-MM-DD" as const;
export const DATE_FORMAT = `${DAY_FORMAT} HH:mm` as const;
