import { DEFAULT_SETTINGS } from "@consts";
import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl).setName("Path to save new task").addText((text) =>
		text
			.setPlaceholder("path/to/tasks.md")
			.setValue(String(context.plugin.settings.pathToSaveNewTask))
			.onChange(async (value) => {
				const trimmedValue = value.trim();

				context.plugin.settings.pathToSaveNewTask = trimmedValue
					? trimmedValue
					: DEFAULT_SETTINGS.pathToSaveNewTask;

				await context.plugin.saveSettings();
			}),
	);
};
