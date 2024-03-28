import { StatusKeys } from "@hooks/useTasks/consts";
import { StatusFilterOption } from "@hooks/useTasks/types";
import { App, PluginSettingTab, Setting } from "obsidian";
import GrindPlugin, { DEFAULT_SETTINGS } from "./main";

/** Class for Setting Tab where user can set default filtering settings for `Grind Manager` */
export default class GrindSettingTab extends PluginSettingTab {
	plugin: GrindPlugin;

	constructor(app: App, plugin: GrindPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl).setName("Default limit").addText((text) =>
			text
				.setPlaceholder("Only number")
				.setValue(String(this.plugin.settings.limit))
				.onChange(async (value) => {
					this.plugin.settings.limit = Number(value.replace(/\D/g, ""));
					await this.plugin.saveSettings();
				}),
		);

		const statusFilterOptions: Record<string, string> = {};

		StatusKeys.forEach((status) => (statusFilterOptions[status] = status));

		new Setting(containerEl)
			.setName("Default status filter")
			.addDropdown((dropDown) =>
				dropDown
					.addOption("all", "all")
					.addOptions(statusFilterOptions)
					.setValue(this.plugin.settings.statusFilter)
					.onChange(async (value) => {
						this.plugin.settings.statusFilter = value as StatusFilterOption;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Show recurring tasks by default?")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.isRecurTasks)
					.onChange(async (value) => {
						this.plugin.settings.isRecurTasks = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl).setName("Path to rewards file").addText((text) =>
			text
				.setPlaceholder("path/to/rewards.md")
				.setValue(String(this.plugin.settings.pathToRewards))
				.onChange(async (value) => {
					const trimmedValue = value.trim();

					this.plugin.settings.pathToRewards = trimmedValue
						? trimmedValue
						: DEFAULT_SETTINGS.pathToRewards;

					await this.plugin.saveSettings();
				}),
		);

		new Setting(containerEl).setName("Path to history file").addText((text) =>
			text
				.setPlaceholder("path/to/history.md")
				.setValue(String(this.plugin.settings.pathToHistory))
				.onChange(async (value) => {
					const trimmedValue = value.trim();

					this.plugin.settings.pathToHistory = trimmedValue
						? trimmedValue
						: DEFAULT_SETTINGS.pathToHistory;

					await this.plugin.saveSettings();
				}),
		);

		new Setting(containerEl).setName("Path to daily notes").addText((text) =>
			text
				.setPlaceholder("path/to/Daily/")
				.setValue(String(this.plugin.settings.pathToDaily))
				.onChange(async (value) => {
					const trimmedValue = value.trim();

					this.plugin.settings.pathToDaily = trimmedValue
						? trimmedValue
						: DEFAULT_SETTINGS.pathToDaily;

					await this.plugin.saveSettings();
				}),
		);
	}
}
