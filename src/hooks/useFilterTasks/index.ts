import {
	StatusFilterOption, TaskFilters
} from "@hooks/useWatchTasks/types";
import React from "react";

type UseFilterTasks = {
	filters: TaskFilters;
};

export default function useFilterTasks(): UseFilterTasks {
	const [limit, setLimit] = React.useState(0);
	const [status, setStatus] = React.useState<StatusFilterOption>("all");
	const [isRecur, setIsRecur] = React.useState(false);
	const [shouldShowByCondition, setShouldShowByCondition] =
		React.useState(false);
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
		currentNote: {
			value: isFromCurrentNote,
			setValue: setIsFromCurrentNote,
		},
		condition: {
			value: shouldShowByCondition,
			setValue: setShouldShowByCondition,
		},
	};

	return { filters };
}
