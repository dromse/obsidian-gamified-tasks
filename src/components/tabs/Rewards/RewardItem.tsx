import { Menu, MenuOption } from "@components/reusable/Menu";
import { useApp } from "@hooks/useApp";
import { Reward } from "@hooks/useRewards";
import { useSettings } from "@hooks/useSettings";
import { revealLine } from "@utils/editor";
import React, { useState } from "react";
import { BuyReward } from "./BuyReward";
import { RewardInfo } from "./RewardInfo";
import styles from "./styles.module.css";
import { Dialog } from "@components/reusable/Dialog";
import ConfettiExplosion from "react-confetti-explosion";

const RewardItem = ({ reward }: { reward: Reward }): React.JSX.Element => {
    const settings = useSettings()!;
    const { vault, workspace } = useApp()!;

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isBuyMultipleOpen, setIsBuyMultipleOpen] = React.useState(false);
    const [rewardQuantity, setRewardQuantity] = React.useState("");

    const [centerConfetti, setCenterConfetti] = useState<Array<number>>([]);
    const [rigthConfetti, setRightConfetti] = useState<Array<number>>([]);

    const options: Array<MenuOption> = [
        {
            title: "Reveal Task",
            handler: () =>
                revealLine({
                    location: {
                        path: settings!.pathToRewards,
                        lineNumber: reward.lineNumber,
                    },
                    workspace,
                    vault,
                }),
        },
        {
            title: "Buy Multiple",
            handler: () => setIsBuyMultipleOpen(true),
        },
    ];

    const getQuantity = (): number => {
        if (isNaN(Number(rewardQuantity)) || Number(rewardQuantity) === 0) {
            return 1;
        }

        return Number(rewardQuantity);
    };

    const spawnCenterConfetti = (): void => {
        const id = Date.now();
        setCenterConfetti((p) => [...p, id]);

        setTimeout(() => {
            setCenterConfetti((p) => [...p.filter((el) => el !== id)]);
        }, 2200);
    };

    const spawnRightConfetti = (): void => {
        const id = Date.now();
        setRightConfetti((p) => [...p, id]);

        setTimeout(() => {
            setRightConfetti((p) => [...p.filter((el) => el !== id)]);
        }, 2200);
    };

    return (
        <li className={`${styles.reward} border relative`}>
            <div
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className='w-full'
            >
                <RewardInfo reward={reward} />
            </div>

            <BuyReward onClick={spawnRightConfetti} reward={reward} />

            {centerConfetti.map((id) => (
                <ConfettiExplosion
                    key={id}
                    className='absolute w-20 inset-0 m-auto'
                    force={0.4}
                    particleCount={15}
                    width={400}
                />
            ))}

            {rigthConfetti.map((id) => (
                <ConfettiExplosion
                    key={id}
                    className='absolute w-20 right-[-40px]'
                    force={0.4}
                    particleCount={15}
                    width={400}
                />
            ))}

            <Menu
                isOpen={isMenuOpen}
                setIsOpen={setIsMenuOpen}
                options={options}
            />

            <Dialog
                isOpen={isBuyMultipleOpen}
                setIsOpen={setIsBuyMultipleOpen}
                onClose={() => setRewardQuantity("")}
            >
                <input
                    type='number'
                    placeholder='reward quantity'
                    value={rewardQuantity}
                    onChange={(e) => setRewardQuantity(e.currentTarget.value)}
                />

                <BuyReward
                    onClick={() => {
                        setIsBuyMultipleOpen(false);
                        setIsMenuOpen(false);

                        spawnCenterConfetti();
                    }}
                    reward={{ ...reward, price: reward.price * getQuantity() }}
                />
            </Dialog>
        </li>
    );
};

export default RewardItem;
