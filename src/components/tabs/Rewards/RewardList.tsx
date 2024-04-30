import React, { useState } from "react";

import styles from "./styles.module.css";

import { useApp } from "@hooks";
import { UseHistoryReturn } from "@hooks/useHistory";
import { Reward } from "@hooks/useRewards";
import { PiggyBank } from "lucide-react";
import { Notice } from "obsidian";
import Depository from "./Depository";
import { coins } from "@utils/string";

type RewardListProps = {
	rewards: ReadonlyArray<Reward>;
	history: UseHistoryReturn;
};

export default function RewardList(props: RewardListProps): React.JSX.Element {
	const { rewards, history } = props;
	const { balance, addHistoryRow } = history;
	const app = useApp();
	const [isDepositoryOpen, setIsDepositoryOpen] = useState(false);

	return (
		<div>
			<div className={`border ${styles.header}`}>
				<h3>Balance: {coins(balance)}</h3>

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
					<li
						className={`${styles.reward} border`}
						key={reward.title}
					>
						<div>
							<h3 className={styles.title}>{reward.title}</h3>
							<p className={styles.desc}>{reward.desc}</p>
						</div>

						<button
							onClick={() => {
								addHistoryRow({
									title: reward.title,
									change: -reward.price,
								});
								new Notice(
									`You purchase '${reward.title}': -${reward.price} ${
										reward.price > 1 ? "coins" : "coin"
									}`,
								);
							}}
							disabled={reward.price > balance}
						>
							{coins(reward.price)}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
