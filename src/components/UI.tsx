import React from "react";
import Tabs from "./reusable/Tabs";
import { History, Rewards, Tasks } from "./tabs";

export const UI = (): React.JSX.Element => {
	const tabs = [
		{ title: "Tasks", view: Tasks },
		{ title: "Rewards", view: Rewards },
		{ title: "History", view: History },
	];

	return <Tabs tabs={tabs} />;
};
