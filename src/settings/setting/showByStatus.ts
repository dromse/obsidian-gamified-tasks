import { StatusKeys } from "@hooks/useTasks/consts";
import { StatusFilterOption } from "@hooks/useTasks/types";
import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	const statusFilterOptions: Record<string, string> = {};

	StatusKeys.forEach((status) => (statusFilterOptions[status] = status));

	new Setting(containerEl)
		.setName("Default status filter")
		.addDropdown((dropDown) =>
			dropDown
				.addOption("all", "all")
				.addOptions(statusFilterOptions)
				.setValue(context.plugin.settings.statusFilter)
				.onChange(async (value) => {
					context.plugin.settings.statusFilter = value as StatusFilterOption;
					await context.plugin.saveSettings();
				}),
		);
};
