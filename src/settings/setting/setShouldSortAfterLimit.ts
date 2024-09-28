import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl)
		.setName("Set sort after limit on open")
		.addToggle((toggle) =>
			toggle
				.setValue(context.plugin.settings.shouldSortAfterLimit)
				.onChange(async (value) => {
					context.plugin.settings.shouldSortAfterLimit = value;
					await context.plugin.saveSettings();
				}),
		);
};
