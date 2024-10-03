import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl)
		.setName("Toggle credit mode")
		.addToggle((toggle) =>
			toggle
				.setValue(context.plugin.settings.creditMode)
				.onChange(async (value) => {
					context.plugin.settings.creditMode = value;
					await context.plugin.saveSettings();
				}),
		);
};
