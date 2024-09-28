import { State } from "@core/types";
import { useSettings } from "@hooks/useSettings";
import { useFilters } from "@providers/FiltersProvider";
import { useSorting } from "@providers/SortingProvider";

type SettingSetter = {
	setting: unknown;
	state: State<unknown>;
};

export default function useDefaultSettings(): () => void {
	const settings = useSettings()!;
	const filters = useFilters();
	const sorting = useSorting();

	const bindedSettingsToState: ReadonlyArray<SettingSetter> = [
		// filters
		{ setting: settings.limit, state: filters.limit },
		{ setting: settings.statusFilter, state: filters.status },
		{ setting: settings.isRecurTasks, state: filters.recur },
		{ setting: settings.tagFilter, state: filters.tags },
		{ setting: settings.hasOnlyThisTags, state: filters.onlyThisTags },
		{ setting: settings.noteFilter, state: filters.note },
		{
			setting: settings.isFromCurrentNote,
			state: filters.shouldShowCurrentNoteTasks,
		},

		// sorting
		{ setting: settings.sortByOrder, state: sorting.sortByOrder },
		{ setting: settings.sortByType, state: sorting.sortByType },
		{
			setting: settings.shouldSortAfterLimit,
			state: sorting.shouldSortAfterLimit,
		},
	];

	return (): void => {
		bindedSettingsToState.forEach(
			(binded) => binded.state.setValue(binded.setting),
		);
	};
}
