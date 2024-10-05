import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl)
		.setName("Toggle negative counter")
		.setDesc("Useful for tracking Bad Habits.")
		.addToggle((toggle) =>
			toggle
				.setValue(context.plugin.settings.negativeCounter)
				.onChange(async (value) => {
					context.plugin.settings.negativeCounter = value;
					await context.plugin.saveSettings();
				}),
		);
};
