import React from "react";

import styles from "./styles.module.css";

import { Reward } from "@hooks/useRewards";
import RewardItem from "./RewardItem";

type RewardListProps = {
    rewards: ReadonlyArray<Reward>;
};

export default function RewardList(props: RewardListProps): React.JSX.Element {
    const { rewards } = props;

    return (
        <ul className={`list ${styles.list}`}>
            {rewards.map((reward) => (
                <RewardItem key={reward.title} reward={reward} />
            ))}
        </ul>
    );
}
