import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl)
		.setName("Show recurring tasks by default?")
		.addToggle((toggle) =>
			toggle
				.setValue(context.plugin.settings.isRecurTasks)
				.onChange(async (value) => {
					context.plugin.settings.isRecurTasks = value;
					await context.plugin.saveSettings();
				}),
		);
};
