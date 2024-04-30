import { useHistory } from "@/hooks";
import Input from "@components/reusable/Input";
import React, { useState } from "react";
import styles from "./styles.module.css";

export default function HistoryTab(): React.JSX.Element {
	const { historyRows, isHistoryParsed } = useHistory();
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
	const [pageInput, setPageInput] = useState(String(page + 1));

	const handleClickPage = (pageIndex: number): void => {
		setPage(pageIndex);
		setPageInput(String(pageIndex + 1));
	};

	const handleChangeInputPage = (
		e: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const pageInput = e.currentTarget.value;

		if (totalPages) {
			if (
				pageInput === "" ||
				(Number(pageInput) > 0 && Number(pageInput) <= totalPages)
			) {
				setPageInput(pageInput);
			}

			if (Number(pageInput) > 0 && Number(pageInput) <= totalPages) {
				setPage(Number(pageInput) - 1);
			}
		}
	};

	if (isHistoryParsed === "parsing") {
		return <div>Parsing...</div>;
	}

	if (isHistoryParsed === "parsed") {
		if (typeof totalPages === "number") {
			const historyPages = Array.from({ length: totalPages }, (_, i) => i);

			return (
				<div>
					<div className={styles.pageList}>
						{historyPages
							.slice(page === 0 ? page : page - 1, page + 3)
							.map((index) => (
								<button
									key={index}
									onClick={() => handleClickPage(index)}
									className={index === page ? styles.activePage : ""}
								>
									{index + 1}
								</button>
							))}

						{page !== totalPages - 1 && (
							<>
								<button disabled={true}> ... </button>

								<button
									onClick={() => handleClickPage(totalPages - 1)}
									className={totalPages - 1 === page ? styles.activePage : ""}
								>
									{totalPages}
								</button>
							</>
						)}
					</div>

					<Input
						type="number"
						name="page-input"
						id={styles.pageInput}
						value={pageInput}
						onChange={handleChangeInputPage}
						afterclearvalue="1"
					/>

					<table className={styles.table}>
						<thead>
							<tr>
								<th scope="col">Change</th>
								<th scope="col">Title</th>
								<th scope="col">Date</th>
							</tr>
						</thead>

						<tbody>
							{historyRows
								.slice(page * 10, (page + 1) * 10)
								.map((row, index) => (
									<tr key={index}>
										<th scope="row">
											{row.change > 0 ? "+" + row.change : row.change}
										</th>
										<td>{row.title}</td>
										<td>{row.date}</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			);
		} else {
			setTotalPages(Math.ceil(historyRows.length / 10));
		}
	}

	if (isHistoryParsed === "error") {
		return <div>Error: cannot parsed</div>;
	}

	return <div>Something went wrong...</div>;
}
