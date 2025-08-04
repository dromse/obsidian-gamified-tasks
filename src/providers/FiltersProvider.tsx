import { Status, StatusFilterOption, TaskFilters } from "@core/types";
import React from "react";

export const FiltersContext = React.createContext<TaskFilters | undefined>(
	undefined,
);

export function useFilters(): TaskFilters {
	const context = React.useContext(FiltersContext);

	if (context === undefined) {
		throw new Error("useSorting must be used inside of a SortingProvider!");
	}

	return context;
}

export default function FiltersProvider({
	children,
}: React.PropsWithChildren): React.JSX.Element {
	const [limit, setLimit] = React.useState(0);
	const [status, setStatus] = React.useState<Array<Status>>([]);
	const [isRecur, setIsRecur] = React.useState(false);
	const [shouldShowByCondition, setShouldShowByCondition] = React.useState(false);
	const [search, setSearch] = React.useState("");
	const [tagsFilter, setTagsFilter] = React.useState("");
	const [hasOnlyThisTags, setHasOnlyThisTags] = React.useState(false);
	const [noteFilter, setNoteFilter] = React.useState("");
	const [isFromCurrentNote, setIsFromCurrentNote] = React.useState(false);

	const filters = {
		limit: { value: limit, setValue: setLimit },
		search: { value: search, setValue: setSearch },
		status: { value: status, setValue: setStatus },
		recur: { value: isRecur, setValue: setIsRecur },
		tags: { value: tagsFilter, setValue: setTagsFilter },
		onlyThisTags: { value: hasOnlyThisTags, setValue: setHasOnlyThisTags },
		note: { value: noteFilter, setValue: setNoteFilter },
		shouldShowCurrentNoteTasks: {
			value: isFromCurrentNote,
			setValue: setIsFromCurrentNote,
		},
		showByCondition: {
			value: shouldShowByCondition,
			setValue: setShouldShowByCondition,
		},
	};

	return (
		<FiltersContext.Provider value={filters}>
			{children}
		</FiltersContext.Provider>
	);
}
