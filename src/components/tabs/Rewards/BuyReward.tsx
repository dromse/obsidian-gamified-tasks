import useHistory from "@hooks/useHistory";
import { Reward } from "@hooks/useRewards";
import { useSettings } from "@hooks/useSettings";
import { formatTasks } from "@utils/string";
import { Notice } from "obsidian";
import React from "react";

export function BuyReward({
    reward,
    onClick,
}: {
    reward: Reward;
    onClick?: Function;
}): React.JSX.Element {
    const { addHistoryRow, balance } = useHistory();
    const settings = useSettings()!;

    const buy = (): void => {
        addHistoryRow({
            title: reward.title,
            change: -reward.price,
        });

        new Notice(
            `You purchase '${reward.title}': -${reward.price} ${
                reward.price > 1 ? "coins" : "coin"
            }`,
        );

        onClick && onClick();
    };


    return (
        <>
            <button
                onClick={buy}
                disabled={reward.price > balance && !settings.creditMode}
            >
                {formatTasks(reward.price)}
            </button>
        </>
    );
}
