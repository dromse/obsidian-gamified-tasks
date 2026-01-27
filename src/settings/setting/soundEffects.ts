import { DEFAULT_SETTINGS } from "@consts";
import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
    containerEl: HTMLElement,
    context: GamifiedTasksSettingTab,
): void => {
    new Setting(containerEl)
        .setName("Play sound effects?")
        .addToggle((toggle) =>
            toggle
                .setValue(context.plugin.settings.enableSoundEffects)
                .onChange(async (value) => {
                    context.plugin.settings.enableSoundEffects = value;
                    await context.plugin.saveSettings();
                }),
        );

    new Setting(containerEl).setName("Path to reward sound").addText((text) =>
        text
            .setPlaceholder("path/to/reward.mp3")
            .setValue(String(context.plugin.settings.pathToRewardSound))
            .onChange(async (value) => {
                const trimmedValue = value.trim();

                context.plugin.settings.pathToRewardSound = trimmedValue
                    ? trimmedValue
                    : DEFAULT_SETTINGS.pathToRewardSound;

                await context.plugin.saveSettings();
            }),
    );

    new Setting(containerEl)
        .setName("Path to task completion sound")
        .addText((text) =>
            text
                .setPlaceholder("path/to/completion.mp3")
                .setValue(
                    String(context.plugin.settings.pathToTaskCompletionSound),
                )
                .onChange(async (value) => {
                    const trimmedValue = value.trim();

                    context.plugin.settings.pathToTaskCompletionSound =
                        trimmedValue
                            ? trimmedValue
                            : DEFAULT_SETTINGS.pathToTaskCompletionSound;

                    await context.plugin.saveSettings();
                }),
        );

    new Setting(containerEl)
        .setName("Path to counter plus sound")
        .addText((text) =>
            text
                .setPlaceholder("path/to/plus.mp3")
                .setValue(
                    String(context.plugin.settings.pathToCounterPlusSound),
                )
                .onChange(async (value) => {
                    const trimmedValue = value.trim();

                    context.plugin.settings.pathToCounterPlusSound =
                        trimmedValue
                            ? trimmedValue
                            : DEFAULT_SETTINGS.pathToCounterPlusSound;

                    await context.plugin.saveSettings();
                }),
        );

    new Setting(containerEl)
        .setName("Path to counter minus sound")
        .addText((text) =>
            text
                .setPlaceholder("path/to/minus.mp3")
                .setValue(
                    String(context.plugin.settings.pathToCounterMinusSound),
                )
                .onChange(async (value) => {
                    const trimmedValue = value.trim();

                    context.plugin.settings.pathToCounterMinusSound =
                        trimmedValue
                            ? trimmedValue
                            : DEFAULT_SETTINGS.pathToCounterMinusSound;

                    await context.plugin.saveSettings();
                }),
        );
};
