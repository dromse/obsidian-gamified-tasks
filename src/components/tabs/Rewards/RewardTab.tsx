import { Reward } from "@hooks/useRewards";
import React from "react";
import RewardList from "./RewardList";
import { RewardPanel } from "./RewardPanel";

export function RewardTab({
	rewards,
}: {
	rewards: Array<Reward>;
}): React.JSX.Element {
	return (
		<div>
			<RewardPanel />

			<RewardList rewards={rewards} />
		</div>
	);
}
