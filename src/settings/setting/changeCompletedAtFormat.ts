import { DEFAULT_SETTINGS } from "@consts";
import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl)
		.setName("Change format for completedAt")
		.setDesc(
			"Customize the date format using Moment.js for completed tasks. The format starts with an emoji or word, which gets removed to show in the UI display. For more details, check the plugin wiki on Github.",
		)
		.addText((text) =>
			text
				.setPlaceholder("[marker] YYYY-MM-DD")
				.setValue(String(context.plugin.settings.completedAtFormat))
				.onChange(async (value) => {
					const trimmedValue = value.trim();

					context.plugin.settings.completedAtFormat = trimmedValue
						? trimmedValue
						: DEFAULT_SETTINGS.completedAtFormat;

					await context.plugin.saveSettings();
				}),
		);
};
