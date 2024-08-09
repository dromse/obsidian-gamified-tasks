import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl)
		.setName("Show done date in completed task")
		.setDesc(
			"Add Markdown or Wiki link to the current daily note when you complete a task ✅",
		)
		.addToggle((toggle) =>
			toggle
				.setValue(context.plugin.settings.isCompletedAtEnabled)
				.onChange(async (value) => {
					context.plugin.settings.isCompletedAtEnabled = value;
					await context.plugin.saveSettings();
				}),
		);
};
