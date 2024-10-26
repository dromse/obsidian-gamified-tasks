import { Reward } from "@hooks/useRewards";
import React from "react";
import styles from "./styles.module.css";

export function RewardInfo({ reward }: { reward: Reward }): React.JSX.Element {
    return (
        <div>
            <h3 className={styles.title}>
                {reward.title}
            </h3>

            <p className={styles.desc}>{reward.desc}</p>
        </div>
    );
}
