import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl)
		.setName("Show tasks by conditions on open?")
		.addToggle((toggle) =>
			toggle
				.setValue(context.plugin.settings.shouldShowByCondition)
				.onChange(async (value) => {
					context.plugin.settings.shouldShowByCondition = value;
					await context.plugin.saveSettings();
				}),
		);
};
