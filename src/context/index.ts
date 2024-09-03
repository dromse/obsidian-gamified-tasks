import { TaskFilters } from "@hooks/useWatchTasks/types";
import { GamifiedTasksSettings } from "@types";
import { App } from "obsidian";
import { createContext } from "react";

export const AppContext = createContext<App | undefined>(undefined);
export const SettingsContext = createContext<
	GamifiedTasksSettings | undefined
>(undefined);
export const FiltersContext = createContext<TaskFilters | undefined>(
	undefined,
);
