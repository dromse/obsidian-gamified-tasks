import { StatusKeys } from "@core/consts";
import { Status } from "@core/types";
import GamifiedTasksSettingTab from "@settings";
import { Setting } from "obsidian";

export default (
	containerEl: HTMLElement,
	context: GamifiedTasksSettingTab,
): void => {
	const statusFilterOptions: Record<string, string> = {};

	StatusKeys.forEach((status) => (statusFilterOptions[status] = status));

	// Checkbox group for multi-select
	new Setting(containerEl)
		.setName("Default status filter")
		.setDesc("Select one or more statuses as filter")
		.setClass("gamified-tasks__status-checkbox-group")
		.addExtraButton((btn) => {
			btn.setIcon("checkmark")
			.setTooltip("Save selected statuses")
			.onClick(async () => {
				await context.plugin.saveSettings();
			});
		});

	const checkboxContainer = containerEl.createDiv();
	StatusKeys.forEach((status) => {
		const label = document.createElement("label");
		label.style.marginRight = "1em";
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.value = status;
		checkbox.checked = context.plugin.settings.statusFilter.includes(status as Status);
		checkbox.onchange = async (e): Promise<void> => {
			const isChecked = (e.target as HTMLInputElement).checked;
			const filter = context.plugin.settings.statusFilter as Array<Status>;
			if (isChecked) {
				if (!filter.includes(status as Status)) {
					filter.push(status as Status);
				}
			} else {
				const idx = filter.indexOf(status as Status);
				if (idx > -1) {
					filter.splice(idx, 1);
				}
			}
			context.plugin.settings.statusFilter = [...filter];
			await context.plugin.saveSettings();
		};
		label.appendChild(checkbox);
		label.appendChild(document.createTextNode(status));
		checkboxContainer.appendChild(label);
	});
};
