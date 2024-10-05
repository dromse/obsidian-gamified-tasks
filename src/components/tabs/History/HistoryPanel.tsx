import Input from "@components/reusable/Input";
import React from "react";
import styles from "./styles.module.css";

type HistoryPanelProps = {
	totalPages: number;
	page: number;
	setPage: React.Dispatch<number>;
	search: string;
	setSearch: React.Dispatch<string>;
};

export default function HistoryPanel(
	props: HistoryPanelProps,
): React.JSX.Element {
	const { page, setPage, totalPages, search, setSearch } = props;

	const [pageInput, setPageInput] = React.useState(String(page + 1));

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

			<Input
				type="text"
				name="search"
				placeholder="Search.."
				id={styles.search}
				value={search}
				onChange={(e) => setSearch(e.currentTarget.value)}
			/>
		</div>
	);
}
