import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl)
		.setName("Show tasks from a specific note (without .md)")
		.addText((text) =>
			text
				.setPlaceholder("Input path to note (without '.md')")
				.setValue(context.plugin.settings.noteFilter)
				.onChange(async (value) => {
					context.plugin.settings.noteFilter = value.trim();

					await context.plugin.saveSettings();
				}),
		);
};
