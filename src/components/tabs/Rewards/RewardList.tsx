import React, { useState } from "react";

import styles from "./styles.module.css";

import { useApp } from "@hooks/useApp";
import useHistory, { UseHistoryReturn } from "@hooks/useHistory";
import { Reward } from "@hooks/useRewards";
import { useSettings } from "@hooks/useSettings";
import { revealLine } from "@utils/editor";
import { coins } from "@utils/string";
import { PiggyBank } from "lucide-react";
import { Notice } from "obsidian";
import Depository from "./Depository";

type RewardListProps = {
	rewards: ReadonlyArray<Reward>;
	history: UseHistoryReturn;
};

export default function RewardList(props: RewardListProps): React.JSX.Element {
	const { rewards, history } = props;
	const { balance, addHistoryRow } = history;
	const app = useApp();
	const [isDepositoryOpen, setIsDepositoryOpen] = useState(false);

	const settings = useSettings();
	const { workspace, vault } = app!;

	return (
		<div>
			<div className={`border ${styles.header}`}>
				<h3>
					Balance: {coins(balance)}
					<span>{settings?.creditMode ? " [Credit Mode]" : ""}</span>
				</h3>

				{app && (
					<button onClick={() => setIsDepositoryOpen((prev) => !prev)}>
						<PiggyBank />
					</button>
				)}
			</div>

			{isDepositoryOpen && (
				<Depository
					className={"border " + styles.depository}
					history={history}
				/>
			)}

			<ul className={`list ${styles.list}`}>
				{rewards.map((reward) => (
					<li className={`${styles.reward} border`} key={reward.title}>
						<RewardInfo reward={reward} />
						<BuyReward reward={reward} />
					</li>
				))}
			</ul>
		</div>
	);
}

function BuyReward({ reward }: { reward: Reward }): React.JSX.Element {
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

function RewardInfo({ reward }: { reward: Reward }): React.JSX.Element {
	const settings = useSettings()!;
	const { workspace, vault } = useApp()!;

	return (
		<div>
			<h3
				className={styles.title}
				onClick={() =>
					revealLine({
						location: {
							path: settings!.pathToRewards,
							lineNumber: reward.lineNumber,
						},
						workspace,
						vault,
					})
				}
			>
				{reward.title}
			</h3>
			<p className={styles.desc}>{reward.desc}</p>
		</div>
	);
}
