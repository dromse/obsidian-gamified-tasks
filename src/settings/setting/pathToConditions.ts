import { DEFAULT_SETTINGS } from "@consts";
import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl).setName("Path to conditions").addText((text) =>
		text
			.setPlaceholder("path/to/scripts")
			.setValue(String(context.plugin.settings.pathToConditions))
			.onChange(async (value) => {
				const trimmedValue = value.trim();

				context.plugin.settings.pathToConditions = trimmedValue
					? trimmedValue
					: DEFAULT_SETTINGS.pathToConditions;

				await context.plugin.saveSettings();
			}),
	);
};
