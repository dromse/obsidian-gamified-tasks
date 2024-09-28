import { SettingsContext } from "@context";
import { GamifiedTasksSettings } from "@types";
import React from "react";

/** Access `settings` from different components through `useContext` */
export const useSettings = (): GamifiedTasksSettings | undefined => {
	return React.useContext(SettingsContext);
};
