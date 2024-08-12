import { useHistory, useRewards } from "@hooks";
import React from "react";
import RewardList from "./RewardList";

export default function RewardsTab(): React.JSX.Element {
	const { rewards, isRewardsParsed } = useRewards();
	const history = useHistory();

	if (isRewardsParsed === "parsing" && history.isHistoryParsed === "parsing") {
		return <div>Parsing...</div>;
	}

	if (isRewardsParsed === "parsed") {
		return <RewardList rewards={rewards} history={history} />;
	}

	if (isRewardsParsed === "error" || history.isHistoryParsed === "error") {
		return <div>Error: cannot parsed</div>;
	}

	return <></>;
}
