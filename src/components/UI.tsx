import FiltersProvider from "@providers/FiltersProvider";
import SortingProvider from "@providers/SortingProvider";
import React from "react";
import Tabs from "./reusable/Tabs";
import { History, Rewards, Tasks } from "./tabs";

export const UI = (): React.JSX.Element => {
	const tabs = [
		{ title: "Tasks", view: Tasks },
		{ title: "Rewards", view: Rewards },
		{ title: "History", view: History },
	];

	return (
		<FiltersProvider>
			<SortingProvider>
				<Tabs tabs={tabs} />
			</SortingProvider>
		</FiltersProvider>
	);
};
