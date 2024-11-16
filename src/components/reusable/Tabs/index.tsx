import React, { useState } from "react";
import styles from "./styles.module.css";

type Tab = {
    title: string | React.JSX.Element;
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
                {tabs.map((tab, index) => (
                    <li className='list-item' key={index}>
                        <button
                            onClick={() => setActiveTab(tab)}
                            className={`pl-1 pr-2 ${tab.title === activeTab.title ? "text-accent" : ""}`}
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
