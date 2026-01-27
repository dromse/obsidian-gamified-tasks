import GamifiedTasksSettingTab from "@settings";
import { SplitLayout } from "@types";
import { Setting } from "obsidian";

export default (
    containerEl: HTMLElement,
    context: GamifiedTasksSettingTab,
): void => {
    const layouts = { main: "main", right: "right", left: "left" };

    new Setting(containerEl)
        .setName("Open plugin view on layout")
        .addDropdown((dropDown) =>
            dropDown
                .addOptions(layouts)
                .setValue(context.plugin.settings.openOnLayout)
                .onChange(async (value) => {
                    context.plugin.settings.openOnLayout = value as SplitLayout;
                    await context.plugin.saveSettings();
                }),
        );
};
