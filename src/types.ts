import {
    GroupMetadata,
    SortOrder,
    SortType,
    Status,
    TaskFilterOptionsType
} from "@core/types";

export type GamifiedTasksSettings = {
    pathToRewards: string;
    pathToHistory: string;
    pathToConditions: string;
    pathToDaily: string;
    pathToSaveNewTask: string;

    limit: number | undefined;
    statusFilter: Array<Status>;
    isRecurTasks: boolean;
    tagFilter: string;
    hasOnlyThisTags: boolean;
    noteFilter: string;
    isFromCurrentNote: boolean;
    shouldShowByCondition: boolean;

    sortByType: SortType;
    sortByOrder: SortOrder;
    shouldSortAfterLimit: boolean;

    dailyFormat: string;
    useMarkdownLinks: boolean;
    ignoreList: Array<string>;
    shouldShowAllFilters: boolean;
    isCompletedAtEnabled: boolean;
    completedAtFormat: string;
    difficulties: Array<DifficultySetting>;
    filterTasksOnOpen: TaskFilterOptionsType;

    creditMode: boolean;
    negativeCounter: boolean;

    isGroupCollapsed: boolean;
    customGroups: Array<GroupMetadata>;
};

export type DifficultySetting = { name: string; price: number };
