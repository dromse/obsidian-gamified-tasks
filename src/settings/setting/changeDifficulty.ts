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
						.onChange(async (newName) => {
							const index = context.plugin.settings.difficulties.findIndex(
								(settingDiff) => settingDiff.name === diff.name,
							);

							context.plugin.settings.difficulties[index].name = newName;

							await context.plugin.saveSettings();
						}),
				)
				.addText((t) =>
					t
						.setPlaceholder("price")
						.setValue(String(diff.price))
						.onChange(async (newPrice) => {
                            const index = context.plugin.settings.difficulties.findIndex(
                                (settingDiff) => settingDiff.name === diff.name,
                            );
                        
                            context.plugin.settings.difficulties[index].price = Number(newPrice);
                        
                            await context.plugin.saveSettings();
                        })
                        .inputEl.addEventListener("blur", async () => {
                            // Sort and re-render when input lose focus
                            context.plugin.settings.difficulties.sort((a, b) => a.price - b.price);
                            difficultyList.empty();
                            refreshDifficulty();
                            await context.plugin.saveSettings();
                             
                        })
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

	// add a selection for a default difficulty
	new Setting(containerEl)
		.setName("Default difficulty")
		.setDesc("The default difficulty for new tasks")
		.addDropdown((d) => {
			// add all difficulties and "none"
			context.plugin.settings.difficulties.forEach((diff) => {
				d.addOption(diff.name, `${diff.name} (${diff.price} coins)`);
			});
			d.addOption("none", "none");
			d.setValue(context.plugin.settings.defaultDifficulty);

			d.onChange(async (newDiff) => {
				context.plugin.settings.defaultDifficulty = newDiff;
				await context.plugin.saveSettings();
			});
		});
};
