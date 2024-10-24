import { useApp } from "@hooks/useApp";
import { Reward } from "@hooks/useRewards";
import { useSettings } from "@hooks/useSettings";
import React from "react";
import styles from "./styles.module.css";

export function RewardInfo({ reward }: { reward: Reward }): React.JSX.Element {
    const settings = useSettings()!;
    const { workspace, vault } = useApp()!;

    return (
        <div>
            <h3 className={styles.title}>
                {reward.title}
            </h3>

            <p className={styles.desc}>{reward.desc}</p>
        </div>
    );
}
