import { UI } from "@components/UI";
import { GamifiedTasksSettings } from "@types";
import { ItemView, WorkspaceLeaf } from "obsidian";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { AppContext, SettingsContext } from "./context";

export const PLUGIN_VIEW_TYPE = "gamified-tasks-view";

export class PluginView extends ItemView {
	root: Root | null = null;
	pluginSettings: GamifiedTasksSettings;

	constructor(leaf: WorkspaceLeaf, settings: GamifiedTasksSettings) {
		super(leaf);
		this.pluginSettings = settings;
		this.icon = "list-todo";
	}

	getViewType(): string {
		return PLUGIN_VIEW_TYPE;
	}

	getDisplayText(): string {
		return "Gamified Tasks";
	}

	async onOpen(): Promise<void> {
		this.root = createRoot(this.containerEl.children[1]);

		this.root.render(
			<AppContext.Provider value={this.app}>
				<SettingsContext.Provider value={this.pluginSettings}>
					<UI />
				</SettingsContext.Provider>
			</AppContext.Provider>,
		);
	}

	async onClose(): Promise<void> {
		this.root?.unmount();
	}
}
