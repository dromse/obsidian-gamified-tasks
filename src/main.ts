import { DEFAULT_SETTINGS, GamifiedTasksConstants } from "@consts";
import { PluginView, PLUGIN_VIEW_TYPE } from "@PluginView";
import { GamifiedTasksSettings } from "@types";
import { logger } from "@utils/logger";
import { Plugin, WorkspaceLeaf } from "obsidian";
import GamifiedTasksSettingTab from "./settings";

export default class GamifiedTasksPlugin extends Plugin {
	settings: GamifiedTasksSettings;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.app.workspace.onLayoutReady(() => {
			// @ts-expect-error: Obsidian Private API.
			this.settings.useMarkdownLinks = this.app.vault.config.useMarkdownLinks;

			const dailyPlugin =
				// @ts-expect-error: Obsidian Private API.
				this.app.internalPlugins.getEnabledPluginById("daily-notes");

			if (dailyPlugin) {
				const folder = dailyPlugin.options.folder;
				if (folder) {
					this.settings.pathToDaily = folder;
				}

				const format = dailyPlugin.options.format;
				if (format) {
					this.settings.dailyFormat = format;
				}
			}
		});

		this.addSettingTab(new GamifiedTasksSettingTab(this.app, this));

		this.registerView(
			PLUGIN_VIEW_TYPE,
			(leaf) => new PluginView(leaf, this.settings),
		);

		this.addRibbonIcon("list-todo", "Show gamified tasks", () => {
			this.activateView();
		});

		logger(`v${this.manifest.version} is loaded.`);
	}

	async activateView(): Promise<void> {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(PLUGIN_VIEW_TYPE);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({ type: PLUGIN_VIEW_TYPE, active: true });
		}

		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	onunload(): void {
		sessionStorage.removeItem(GamifiedTasksConstants.sessionTasks);

		logger(`v${this.manifest.version} is unloaded.`);
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
