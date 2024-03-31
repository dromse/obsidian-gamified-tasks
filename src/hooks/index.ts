import { GrindPluginSettings } from "@types";
import { App } from "obsidian";
import { useContext } from "react";
import { AppContext, SettingsContext } from "../context";
import { default as useHistory } from "./useHistory";
import { default as useRewards } from "./useRewards";
import { default as useTasks } from "./useTasks";

/** Access `app` from different components through `useContext` */
export const useApp = (): App | undefined => {
	return useContext(AppContext);
};

/** Access `settings` from different components through `useContext` */
export const useSettings = (): GrindPluginSettings | undefined => {
	return useContext(SettingsContext);
};

export { useRewards, useTasks, useHistory };
