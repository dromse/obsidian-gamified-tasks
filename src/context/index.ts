import { GrindPluginSettings } from "@types";
import { App } from "obsidian";
import { createContext } from "react";

export const AppContext = createContext<App | undefined>(undefined);
export const SettingsContext = createContext<GrindPluginSettings | undefined>(
	undefined,
);
