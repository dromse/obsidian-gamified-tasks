import { SortOrderOptions } from "@core/consts";
import { SortOrder } from "@core/types";
import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	const sortOrderRecords: Record<string, string> = {};

	SortOrderOptions.forEach((option) => {
		sortOrderRecords[option] = option;
	});

	new Setting(containerEl)
		.setName("Set sorting order on open")
		.addDropdown((dropDown) =>
			dropDown
				.addOptions(sortOrderRecords)
				.setValue(context.plugin.settings.sortByOrder)
				.onChange(async (value) => {
					context.plugin.settings.sortByOrder = value as SortOrder;
					await context.plugin.saveSettings();
				}),
		);
};
