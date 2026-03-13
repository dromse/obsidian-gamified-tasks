import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl)
		.setName("Show filters and sortings options on start?")
		.addToggle((toggle) =>
			toggle
				.setValue(context.plugin.settings.isShowAllTaskSearchOptions)
				.onChange(async (value) => {
					context.plugin.settings.isShowAllTaskSearchOptions = value;
					await context.plugin.saveSettings();
				}),
		);
};
