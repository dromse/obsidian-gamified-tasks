import { useApp } from "@hooks/useApp";
import { Reward } from "@hooks/useRewards";
import { useSettings } from "@hooks/useSettings";
import { revealLine } from "@utils/editor";
import React from "react";
import styles from "./styles.module.css";

export function RewardInfo({ reward }: { reward: Reward }): React.JSX.Element {
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
