import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl)
		.setName("Show all filters by default?")
		.addToggle((toggle) =>
			toggle
				.setValue(context.plugin.settings.shouldShowAllFilters)
				.onChange(async (value) => {
					context.plugin.settings.shouldShowAllFilters = value;
					await context.plugin.saveSettings();
				}),
		);
};
