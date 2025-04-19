import { DEFAULT_SETTINGS, GamifiedTasksConstants } from "@consts";
import { PluginView, PLUGIN_VIEW_TYPE } from "@view";
import { GamifiedTasksSettings } from "@types";
import { logger } from "@utils/logger";
import { Plugin, WorkspaceLeaf } from "obsidian";
import GamifiedTasksSettingTab from "./settings";
import { Status } from "@core/types";

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
        const loaded = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded);
    
        // Backward compatibility: convert string to array for statusFilter
        if (typeof this.settings.statusFilter === "string") {
            // Adjust this split logic if your old string format is different
            this.settings.statusFilter = this.settings.statusFilter
                .split(",")
                .map(s => s.trim())
                .filter(Boolean) as Array<Status>;
            // Optionally, save the updated settings to persist the migration
            await this.saveSettings();
        }
    }
	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
