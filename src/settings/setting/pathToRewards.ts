import { DEFAULT_SETTINGS } from "@consts";
import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl).setName("Path to rewards file").addText((text) =>
		text
			.setPlaceholder("path/to/rewards.md")
			.setValue(String(context.plugin.settings.pathToRewards))
			.onChange(async (value) => {
				const trimmedValue = value.trim();

				context.plugin.settings.pathToRewards = trimmedValue
					? trimmedValue
					: DEFAULT_SETTINGS.pathToRewards;

				await context.plugin.saveSettings();
			}),
	);
};
