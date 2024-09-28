// This file provides a support for sortings inside the plugin
import { SortOrder, SortType, State } from "@core/types";
import React from "react";

type ISortingContext = {
	sortByType: State<SortType>;
	sortByOrder: State<SortOrder>;
	shouldSortAfterLimit: State<boolean>;
};

const SortingContext = React.createContext<ISortingContext | undefined>(
	undefined,
);

type SortingProviderProps = React.PropsWithChildren;

export default function SortingProvider({
	children,
}: SortingProviderProps): React.JSX.Element {
	const [sortType, setSortType] = React.useState<SortType>("any");
	const [sortOrder, setSortOrder] = React.useState<SortOrder>("any");
	const [shouldSortAfterLimit, setShouldSortAfterLimit] = React.useState(false);

	const context = {
		sortByType: { value: sortType, setValue: setSortType },
		sortByOrder: { value: sortOrder, setValue: setSortOrder },
		shouldSortAfterLimit: {
			value: shouldSortAfterLimit,
			setValue: setShouldSortAfterLimit,
		},
	};

	return (
		<SortingContext.Provider value={context}>
			{children}
		</SortingContext.Provider>
	);
}

export function useSorting(): ISortingContext {
	const context = React.useContext(SortingContext);

	if (context === undefined) {
		throw new Error("useSorting must be used inside of a SortingProvider!");
	}

	return context;
}
