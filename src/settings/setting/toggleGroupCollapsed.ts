import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl)
		.setName("Show groups collapsed by default?")
		.addToggle((toggle) =>
			toggle
				.setValue(context.plugin.settings.isGroupCollapsed)
				.onChange(async (value) => {
					context.plugin.settings.isGroupCollapsed = value;
					await context.plugin.saveSettings();
				}),
		);
};
