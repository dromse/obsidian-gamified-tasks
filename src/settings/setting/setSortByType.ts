import { SortTypeOptions } from "@core/consts";
import { SortType } from "@core/types";
import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	const sortTypeRecords: Record<string, string> = {};

	SortTypeOptions.forEach((option) => {
		sortTypeRecords[option] = option;
	});

	new Setting(containerEl)
		.setName("Set sorting type on open")
		.addDropdown((dropDown) =>
			dropDown
				.addOptions(sortTypeRecords)
				.setValue(context.plugin.settings.sortByType)
				.onChange(async (value) => {
					context.plugin.settings.sortByType = value as SortType;
					await context.plugin.saveSettings();
				}),
		);
};
