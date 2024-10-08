import React, { useState } from "react";
import styles from "./styles.module.css";

type Tab = {
	title: string;
	view: React.ComponentType<unknown>;
};

type Props = {
	tabs: Array<Tab>;
};

export default function Tabs(props: Props): React.JSX.Element {
	const { tabs } = props;
	const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);

	return (
		<div>
			<ul className={styles.tabs}>
				{tabs.map((tab) => (
					<li className="list-item" key={tab.title}>
						<button
							className={`${tab.title === activeTab.title ? styles.active : ""}`}
							onClick={() => setActiveTab(tab)}
						>
							{tab.title}
						</button>
					</li>
				))}
			</ul>

			<activeTab.view />
		</div>
	);
}
