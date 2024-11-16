import useHistory from "@hooks/useHistory";
import { useSettings } from "@hooks/useSettings";
import { formatTasks } from "@utils/string";
import { PiggyBank } from "lucide-react";
import React from "react";
import Depository from "./Depository";
import styles from "./styles.module.css";

export function RewardPanel(): React.JSX.Element {
	const { balance } = useHistory();
	const [isDepositoryOpen, setIsDepositoryOpen] = React.useState(false);
	const settings = useSettings();

	return (
		<div>
			<div className={`border ${styles.header}`}>
				<h3>
					Balance: {formatTasks(balance)}
					<span>{settings?.creditMode ? " [Credit Mode]" : ""}</span>
				</h3>

				<button onClick={() => setIsDepositoryOpen((prev) => !prev)}>
					<PiggyBank />
				</button>
			</div>

			{isDepositoryOpen && (
				<Depository className={"border " + styles.depository} />
			)}
		</div>
	);
}
