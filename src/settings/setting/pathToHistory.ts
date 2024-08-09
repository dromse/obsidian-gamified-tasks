import { DEFAULT_SETTINGS } from "@consts";
import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (containerEl: HTMLElement, context: GamifiedTasksSettingTab): void => {
	new Setting(containerEl).setName("Path to history file").addText((text) =>
		text
			.setPlaceholder("path/to/history.md")
			.setValue(String(context.plugin.settings.pathToHistory))
			.onChange(async (value) => {
				const trimmedValue = value.trim();

				context.plugin.settings.pathToHistory = trimmedValue
					? trimmedValue
					: DEFAULT_SETTINGS.pathToHistory;

				await context.plugin.saveSettings();
			}),
	);
}
