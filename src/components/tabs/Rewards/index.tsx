import useHistory from "@hooks/useHistory";
import useRewards from "@hooks/useRewards";
import React from "react";
import { RewardTab } from "./RewardTab";

export default function Rewards(): React.JSX.Element {
	const { rewards, isRewardsParsed } = useRewards();
	const history = useHistory();

	if (isRewardsParsed === "parsing" && history.isHistoryParsed === "parsing") {
		return <div>Parsing...</div>;
	}

	if (isRewardsParsed === "parsed") {
		return <RewardTab rewards={rewards} />;
	}

	if (isRewardsParsed === "error" || history.isHistoryParsed === "error") {
		return <div>Error: cannot parsed</div>;
	}

	return <></>;
}
