import { GamifiedTasksSettings } from "@types";
import { App } from "obsidian";
import { useContext } from "react";
import { AppContext, SettingsContext } from "../context";

/** Access `app` from different components through `useContext` */
export const useApp = (): App | undefined => {
	return useContext(AppContext);
};

/** Access `settings` from different components through `useContext` */
export const useSettings = (): GamifiedTasksSettings | undefined => {
	return useContext(SettingsContext);
};
