import { Menu, MenuOption } from "@components/reusable/Menu";
import { useApp } from "@hooks/useApp";
import { Reward } from "@hooks/useRewards";
import { useSettings } from "@hooks/useSettings";
import { revealLine } from "@utils/editor";
import React from "react";
import { BuyReward } from "./BuyReward";
import { RewardInfo } from "./RewardInfo";
import styles from './styles.module.css'
import { Dialog } from '@components/reusable/Dialog'

const RewardItem = ({ reward }: { reward: Reward }): React.JSX.Element => {
    const settings = useSettings()!
    const { vault, workspace } = useApp()!

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isBuyMultipleOpen, setIsBuyMultipleOpen] = React.useState(false);
    const [rewardQuantity, setRewardQuantity] = React.useState("")

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
                })
        },
        {
            title: "Buy Multiple",
            handler: () => setIsBuyMultipleOpen(true)
        },
    ]

    const getQuantity = (): number => {
        if (isNaN(Number(rewardQuantity)) || Number(rewardQuantity) === 0) {
            return 1;
        }

        return Number(rewardQuantity);
    }

    return (
        <li
            className={`${styles.reward} border`}
            onClick={() => setIsMenuOpen(prev => !prev)}
        >
            <RewardInfo reward={reward} />
            <BuyReward reward={reward} />

            <Menu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} options={options} />

            <Dialog isOpen={isBuyMultipleOpen} setIsOpen={setIsBuyMultipleOpen} onClose={() => setRewardQuantity('')}>
                <input
                    type="number"
                    placeholder="reward quantity"
                    value={rewardQuantity}
                    onChange={(e) => setRewardQuantity(e.currentTarget.value)}
                />

                <BuyReward 
					onClick={() => { setIsBuyMultipleOpen(false); setIsMenuOpen(false) }} 
					reward={{ ...reward, price: reward.price * getQuantity() }} 
				/>
            </Dialog>
        </li>
    )
}

export default RewardItem
