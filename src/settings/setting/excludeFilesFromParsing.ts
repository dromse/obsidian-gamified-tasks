import { DEFAULT_SETTINGS } from "@consts";
import GamifiedTasksSettingTab from "@settings";
import { getFileLines } from "@utils/file";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	new Setting(containerEl)
		.setName("Ignore")
		.setDesc("Exclude files or folders from parsing tasks")
		.addTextArea((text) => {
			text.inputEl.style.width = "100%";
			text.inputEl.style.height = "auto";
			text.inputEl.style.resize = "vertical";

			text.inputEl.style.height = "1px";
			text.inputEl.style.height = 25 + text.inputEl.scrollHeight + "px";

			text
				.setPlaceholder("Input to ignore Folder/, Note or Path/to/Note")
				.setValue(context.plugin.settings.ignoreList.join("\n"))
				.onChange(async (value) => {
					const filesToIgnore = getFileLines(value).reduce<Array<string>>(
						(acc, str) => {
							const trimmedLine = str.trim();

							if (trimmedLine) {
								acc.push(trimmedLine);
							}

							return acc;
						},
						[],
					);

					context.plugin.settings.ignoreList =
						filesToIgnore || DEFAULT_SETTINGS.ignoreList;

					await context.plugin.saveSettings();
				});
		});
};
