import GamifiedTasksPlugin from "@main";
import { App, PluginSettingTab, Setting } from "obsidian";
import changeCompletedAtFormat from "./setting/changeCompletedAtFormat";
import changeDifficulty from "./setting/changeDifficulty";
import customizeGroups from "./setting/customizeGroups";

import excludeFilesFromParsing from "./setting/excludeFilesFromParsing";
import filterTasksOnOpenBy from "./setting/filterTasksOnOpenBy";
import limitTasks from "./setting/limitTasks";
import onlyThisTags from "./setting/onlyThisTags";
import pathToConditions from "./setting/pathToConditions";
import pathToHistory from "./setting/pathToHistory";
import pathToRewards from "./setting/pathToRewards";
import pathToSaveNewTask from "./setting/pathToSaveNewTask";
import soundEffects from "./setting/soundEffects";
import setShouldSortAfterLimit from "./setting/setShouldSortAfterLimit";
import setSortByOrder from "./setting/setSortByOrder";
import setSortByType from "./setting/setSortByType";
import showAllFilters from "./setting/showAllFilters";
import showByStatus from "./setting/showByStatus";
import showByTags from "./setting/showByTags";
import showDoneDate from "./setting/showCompletedAtDate";
import showFromCurrentNote from "./setting/showFromCurrentNote";
import showTasksFromNote from "./setting/showTasksFromNote";
import toggleCreditMode from "./setting/toggleCreditMode";
import toggleGroupCollapsed from "./setting/toggleGroupCollapsed";
import toggleNegativeCounter from "./setting/toggleNegativeCounter";
import openOnLayout from "./setting/openOnLayout";

/** Class for Setting Tab where user can set default filtering settings for `Grind Manager` */
export default class GamifiedTasksSettingTab extends PluginSettingTab {
    plugin: GamifiedTasksPlugin;

    constructor(app: App, plugin: GamifiedTasksPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        openOnLayout(containerEl, this);

        pathToRewards(containerEl, this);
        pathToHistory(containerEl, this);
        pathToSaveNewTask(containerEl, this);
        pathToConditions(containerEl, this);
        excludeFilesFromParsing(containerEl, this);
        showDoneDate(containerEl, this);
        changeCompletedAtFormat(containerEl, this);
        showAllFilters(containerEl, this);

        new Setting(containerEl).setName("Filters").setHeading();
        limitTasks(containerEl, this);
        showByStatus(containerEl, this);
        showByTags(containerEl, this);
        onlyThisTags(containerEl, this);
        showTasksFromNote(containerEl, this);
        showFromCurrentNote(containerEl, this);
        filterTasksOnOpenBy(containerEl, this);

        new Setting(containerEl).setName("Sorting").setHeading();
        setSortByType(containerEl, this);
        setSortByOrder(containerEl, this);
        setShouldSortAfterLimit(containerEl, this);

        new Setting(containerEl)
            .setName("Difficulty")
            .setHeading()
            .setDesc("Change or add new difficulty");
        changeDifficulty(containerEl, this);

        new Setting(containerEl).setName("Rewards").setHeading();
        toggleCreditMode(containerEl, this);

        new Setting(containerEl).setName("Tasks").setHeading();
        toggleNegativeCounter(containerEl, this);

        new Setting(containerEl).setName("Groups").setHeading();
        toggleGroupCollapsed(containerEl, this);
        new Setting(containerEl).setName("Custom Groups");
        customizeGroups(containerEl, this);

        new Setting(containerEl).setName("Sound Effects").setHeading();
        soundEffects(containerEl, this);
    }
}
