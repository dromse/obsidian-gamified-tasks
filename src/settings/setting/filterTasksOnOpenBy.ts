import { TaskFilterOptions } from "@core/consts";
import { TaskFilterOptionsType } from "@core/types";
import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	const taskFilterRecords: Record<string, string> = {};

	TaskFilterOptions.forEach((f) => {
		taskFilterRecords[f] = f;
	});

	new Setting(containerEl)
		.setName("Filter tasks on open by?")
		.addDropdown((dropDown) =>
			dropDown
				.addOptions(taskFilterRecords)
				.setValue(context.plugin.settings.filterTasksOnOpen)
				.onChange(async (value) => {
					context.plugin.settings.filterTasksOnOpen = value as TaskFilterOptionsType;
					await context.plugin.saveSettings();
				}),
		);
};
