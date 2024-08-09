import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	const difficultyList = containerEl.createEl("ul", {
		cls: "gamified-tasks__difficulty-setting",
	});

	const refreshDifficulty = (): void => {
		context.plugin.settings.difficulties.forEach((diff) => {
			const difficultyItem = containerEl.createEl("li", {
				cls: "gamified-tasks__difficulty-entry",
			});

			difficultyList.appendChild(difficultyItem);

			new Setting(difficultyItem)
				.addText((t) =>
					t
						.setPlaceholder("alias")
						.setValue(diff.name)
						.onChange((newName) => {
							const index = context.plugin.settings.difficulties.findIndex(
								(settingDiff) => settingDiff.name === diff.name,
							);

							context.plugin.settings.difficulties[index].name = newName;
						}),
				)
				.addText((t) =>
					t
						.setPlaceholder("price")
						.setValue(String(diff.price))
						.onChange((newPrice) => {
							const index = context.plugin.settings.difficulties.findIndex(
								(settingDiff) => settingDiff.name === diff.name,
							);

							context.plugin.settings.difficulties[index].price =
								Number(newPrice);
						}),
				)
				.addButton((b) =>
					b.setButtonText("x").onClick(async () => {
						const newDifficulties =
							context.plugin.settings.difficulties.filter(
								(d) => d.name !== diff.name,
							);
						context.plugin.settings.difficulties = newDifficulties;
						difficultyItem.detach();
						await context.plugin.saveSettings();
					}),
				);
		});
	};

	refreshDifficulty();

	new Setting(containerEl).addButton((b) =>
		b.setButtonText("Add new difficulty").onClick(async () => {
			context.plugin.settings.difficulties.push({
				name: "custom",
				price: 0,
			});

			difficultyList.empty();

			refreshDifficulty();

			await context.plugin.saveSettings();
		}),
	);
};
