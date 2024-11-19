import { GroupMetadata } from "@core/types";
import GamifiedTasksSettingTab from "@settings";
import { ColorComponent, Setting, TextComponent } from "obsidian";

export default (
    containerEl: HTMLElement,
    context: GamifiedTasksSettingTab,
): void => {
    const groupList = containerEl.createEl("ul", {
        cls: "gamified-tasks__group-setting",
    });

    const refresh = (): void => {
        context.plugin.settings.customGroups.forEach((metadata) => {
            const groupItem = containerEl.createEl("li", {
                cls: "gamified-tasks__group-entry",
            });

            groupList.appendChild(groupItem);

            const generateMetadataInput =
                (metadataField: keyof GroupMetadata) => (t: TextComponent) =>
                    t
                        .setPlaceholder(metadataField)
                        .setValue(String(metadata[metadataField]))
                        .onChange(async (newValue) => {
                            const index =
                                context.plugin.settings.customGroups.findIndex(
                                    (setting) =>
                                        setting[metadataField] ===
                                        metadata[metadataField],
                                );

                            if (metadataField === "priority") {
                                context.plugin.settings.customGroups[index][
                                    metadataField
                                ] = Number(newValue);
                            } else {
                                context.plugin.settings.customGroups[index][
                                    metadataField
                                ] = newValue;
                            }

                            await context.plugin.saveSettings();
                        });

            const handleColor = (c: ColorComponent): ColorComponent =>
                c.setValue(metadata['color']).onChange(async (newValue) => {
                    const index =
                        context.plugin.settings.customGroups.findIndex(
                            (setting) =>
                                setting["color"] === metadata["color"],
                        );

                    context.plugin.settings.customGroups[index]["color"] =
                        newValue;

                    await context.plugin.saveSettings();
                });

            new Setting(groupItem)
                .addText(generateMetadataInput("id"))
                .addText(generateMetadataInput("title"))
                .addText(generateMetadataInput("color"))
                .addColorPicker(handleColor)
                .addText(generateMetadataInput("priority"))
                .addButton((b) =>
                    b.setButtonText("x").onClick(async () => {
                        const newGroups =
                            context.plugin.settings.customGroups.filter(
                                (d) => d.id !== metadata.id,
                            );
                        context.plugin.settings.customGroups = newGroups;
                        groupItem.detach();

                        await context.plugin.saveSettings();
                    }),
                );
        });
    };

    refresh();

    new Setting(containerEl).addButton((b) =>
        b.setButtonText("Add custom group").onClick(async () => {
            context.plugin.settings.customGroups.push({
                id: "",
                title: "",
                color: "",
                priority: 0,
            });

            groupList.empty();

            refresh();

            await context.plugin.saveSettings();
        }),
    );
};
