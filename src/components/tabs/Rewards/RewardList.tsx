import React from "react";

import styles from "./styles.module.css";

import { Reward } from "@hooks/useRewards";
import { BuyReward } from "./BuyReward";
import { RewardInfo } from "./RewardInfo";

type RewardListProps = {
	rewards: ReadonlyArray<Reward>;
};

export default function RewardList(props: RewardListProps): React.JSX.Element {
	const { rewards } = props;

	return (
		<ul className={`list ${styles.list}`}>
			{rewards.map((reward) => (
				<li className={`${styles.reward} border`} key={reward.title}>
					<RewardInfo reward={reward} />
					<BuyReward reward={reward} />
				</li>
			))}
		</ul>
	);
}
