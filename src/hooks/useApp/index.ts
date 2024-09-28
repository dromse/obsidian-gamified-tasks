import { AppContext } from "@context";
import { App } from "obsidian";
import React from "react";

/** Access `app` from different components through `useContext` */
export const useApp = (): App | undefined => {
	return React.useContext(AppContext);
};
