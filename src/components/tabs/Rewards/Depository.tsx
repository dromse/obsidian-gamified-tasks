import Input from "@components/reusable/Input";
import {
    DepositoryTransactionState,
    DEPOSITORY_TRANSACTION_STATE,
    useDepository
} from "@hooks/useDepository";
import useHistory from "@hooks/useHistory";
import { isDigitString } from "@utils/check";
import { formatCoins } from "@utils/string";
import { Notice } from "obsidian";
import React, { useState } from "react";
import styles from "./styles.module.css";

type DepositoryProps = React.ComponentPropsWithoutRef<"div">;

export default function Depository(props: DepositoryProps): React.JSX.Element {
	const { ...dialogAttributes } = props;
	const [inputValue, setInputValue] = useState("");
	const [amount, setAmount] = useState(0);
	const history = useHistory();

	const { balance, store, restore } = useDepository(history);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value = e.currentTarget.value;

		setAmount(0);
		setInputValue(value);

		if (isDigitString(value)) {
			setAmount(Number(value));
		}
	};

	const clear = (): void => {
		setAmount(0);
		setInputValue("");
	};

	const handleTransactionState = (state: DepositoryTransactionState): void => {
		switch (state) {
			case DEPOSITORY_TRANSACTION_STATE.SUCCESS:
				break;

			case DEPOSITORY_TRANSACTION_STATE.NEGATIVE_PARAM:
				new Notice("You cannot get the negative amount of coins.");
				break;

			case DEPOSITORY_TRANSACTION_STATE.ZERO_PARAM:
				new Notice("You cannot get zero coins.");
				break;

			case DEPOSITORY_TRANSACTION_STATE.OVER_BALANCE_PARAM:
				new Notice("You cannot get coins which is over the balance.");
				break;

			case DEPOSITORY_TRANSACTION_STATE.ERROR:
				new Notice("Something went wrong...");
				break;
		}
	};

	const handleStore = async (): Promise<void> => {
		const state = await store(amount);

		handleTransactionState(state);

		clear();
	};

	const handleRestore = async (): Promise<void> => {
		const state = await restore(amount);

		handleTransactionState(state);

		clear();
	};

	return (
		<div {...dialogAttributes}>
			<div>Depository: {formatCoins(balance)}</div>

			<Input
				type="number"
				id={styles.inputCoins}
				placeholder="input coins"
				value={inputValue}
				onChange={handleInput}
			/>

			<div className={styles.buttons}>
				<button onClick={handleStore}>Store</button>
				<button onClick={handleRestore}>Restore</button>
			</div>
		</div>
	);
}
