import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl).setName("Default limit").addText((text) =>
		text
			.setPlaceholder("Only number")
			.setValue(String(context.plugin.settings.limit))
			.onChange(async (value) => {
				context.plugin.settings.limit = Number(value.replace(/\D/g, ""));
				await context.plugin.saveSettings();
			}),
	);
};
