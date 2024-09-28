import { GamifiedTasksSettings } from "@types";
import { App } from "obsidian";
import { useContext } from "react";
import { AppContext, FiltersContext, SettingsContext } from "../context";
import { default as useHistory } from "./useHistory";
import { default as useRewards } from "./useRewards";
import { default as useTasks } from "./useWatchTasks";
import { TaskFilters } from "../core/types";

/** Access `app` from different components through `useContext` */
export const useApp = (): App | undefined => {
	return useContext(AppContext);
};

/** Access `settings` from different components through `useContext` */
export const useSettings = (): GamifiedTasksSettings | undefined => {
	return useContext(SettingsContext);
};

export const useFilters = (): TaskFilters | undefined => {
	return useContext(FiltersContext);
};

export { useRewards, useTasks, useHistory };
