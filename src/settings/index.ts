import GamifiedTasksPlugin from "@main";
import { App, PluginSettingTab, Setting } from "obsidian";
import changeDifficulty from "./setting/changeDifficulty";

import excludeFilesFromParsing from "./setting/excludeFilesFromParsing";
import limitTasks from "./setting/limitTasks";
import onlyThisTags from "./setting/onlyThisTags";
import pathToHistory from "./setting/pathToHistory";
import pathToRewards from "./setting/pathToRewards";
import showAllFilters from "./setting/showAllFilters";
import showByStatus from "./setting/showByStatus";
import showByTags from "./setting/showByTags";
import showDoneDate from "./setting/showDoneDate";
import showFromCurrentNote from "./setting/showFromCurrentNote";
import showRecurringTasks from "./setting/showRecurringTasks";
import showTasksFromNote from "./setting/showTasksFromNote";

/** Class for Setting Tab where user can set default filtering settings for `Grind Manager` */
export default class GamifiedTasksSettingTab extends PluginSettingTab {
	plugin: GamifiedTasksPlugin;

	constructor(app: App, plugin: GamifiedTasksPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		pathToRewards(containerEl, this);
		pathToHistory(containerEl, this);
		excludeFilesFromParsing(containerEl, this);
		showDoneDate(containerEl, this);
		showAllFilters(containerEl, this);

		new Setting(containerEl).setName("Filters").setHeading();
		limitTasks(containerEl, this);
		showByStatus(containerEl, this);
		showByTags(containerEl, this);
		onlyThisTags(containerEl, this);
		showTasksFromNote(containerEl, this);
		showFromCurrentNote(containerEl, this);
		showRecurringTasks(containerEl, this);

		new Setting(containerEl)
			.setName("Difficulty")
			.setHeading()
			.setDesc("Change or add new difficulty");
		changeDifficulty(containerEl, this);
	}
}
