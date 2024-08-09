import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl)
		.setName("Show tasks from current note by default?")
		.addToggle((toggle) =>
			toggle
				.setValue(context.plugin.settings.isFromCurrentNote)
				.onChange(async (value) => {
					context.plugin.settings.isFromCurrentNote = value;
					await context.plugin.saveSettings();
				}),
		);
};
