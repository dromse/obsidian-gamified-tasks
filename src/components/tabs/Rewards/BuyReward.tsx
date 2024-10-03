import useHistory from "@hooks/useHistory";
import { Reward } from "@hooks/useRewards";
import { useSettings } from "@hooks/useSettings";
import { coins } from "@utils/string";
import { Notice } from "obsidian";
import React from "react";

export function BuyReward({ reward }: { reward: Reward }): React.JSX.Element {
	const { addHistoryRow, balance } = useHistory();
	const settings = useSettings()!;

	return (
		<button
			onClick={() => {
				addHistoryRow({
					title: reward.title,
					change: -reward.price,
				});
				new Notice(
					`You purchase '${reward.title}': -${reward.price} ${reward.price > 1 ? "coins" : "coin"
					}`,
				);
			}}
			disabled={reward.price > balance && !settings.creditMode}
		>
			{coins(reward.price)}
		</button>
	);
}
