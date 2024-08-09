import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl).setName("Default tag filter").addText((text) =>
		text
			.setPlaceholder("Input tags without # (use comma to separate)")
			.setValue(context.plugin.settings.tagFilter)
			.onChange(async (value) => {
				context.plugin.settings.tagFilter = value;

				await context.plugin.saveSettings();
			}),
	);
};
