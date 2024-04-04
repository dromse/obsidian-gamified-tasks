import { GrindPluginSettings } from "@types";
import { Plugin, WorkspaceLeaf } from "obsidian";
import { MyView, MY_VIEW_TYPE } from "./MyView";
import GrindSettingTab from "./SettingTab";

export const DEFAULT_SETTINGS: GrindPluginSettings = {
	limit: 10,
	statusFilter: "all",
	isRecurTasks: false,
	pathToRewards: "rewards.md",
	pathToHistory: "history.md",
	pathToDaily: "",
	dailyFormat: "YYYY-MM-DD",
	useMarkdownLinks: true,
};

export default class GrindPlugin extends Plugin {
	settings: GrindPluginSettings;

	async onload() {
		await this.loadSettings();

		this.app.workspace.onLayoutReady(() => {
			// @ts-ignore
			this.settings.useMarkdownLinks = this.app.vault.config.useMarkdownLinks;

			const dailyPlugin =
				// @ts-ignore
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

		this.addSettingTab(new GrindSettingTab(this.app, this));

		this.registerView(MY_VIEW_TYPE, (leaf) => new MyView(leaf, this.settings));

		this.addRibbonIcon("list-todo", "Show grind manager", () => {
			this.activateView();
		});
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(MY_VIEW_TYPE);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({ type: MY_VIEW_TYPE, active: true });
		}

		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
