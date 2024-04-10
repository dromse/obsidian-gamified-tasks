import React from 'react'
import { useHistory, useRewards } from "@hooks";
import { Notice } from "obsidian";
import styles from "./styles.module.css";

export default function Rewards() {
	const { rewards, isRewardsParsed } = useRewards();
	const { balance, isHistoryParsed, addHistoryRow } = useHistory();

	if (isRewardsParsed === "parsing" && isHistoryParsed === "parsing") {
		return <div>Parsing...</div>;
	}

	if (isRewardsParsed === "parsed") {
		return (
			<div>
				<h2>Rewards</h2>

				<h3>Balance: {isHistoryParsed === "parsed" ? balance : 0} coins</h3>

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
										`You purchase '${reward.title}': -${reward.price} ${reward.price > 1 ? "coins" : "coin"}`,
									);
								}}
								disabled={reward.price > balance}
							>
								Buy: {reward.price} coins
							</button>
						</li>
					))}
				</ul>
			</div>
		);
	}

	if (isRewardsParsed === "error" || isHistoryParsed === "error") {
		return <div>Error: cannot parsed</div>;
	}

	return <div></div>;
}
