import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl)
		.setName("Show only with these tags by default?")
		.addToggle((toggle) =>
			toggle
				.setValue(context.plugin.settings.hasOnlyThisTags)
				.onChange(async (value) => {
					context.plugin.settings.hasOnlyThisTags = value;
					await context.plugin.saveSettings();
				}),
		);
};
