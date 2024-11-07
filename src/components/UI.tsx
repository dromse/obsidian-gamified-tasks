import FiltersProvider from "@providers/FiltersProvider";
import SortingProvider from "@providers/SortingProvider";
import { BookCheck, CakeSlice, History as HistoryIcon } from "lucide-react";
import React from "react";
import Tabs from "./reusable/Tabs";
import { History, Rewards, Tasks } from "./tabs";

export const UI = (): React.JSX.Element => {
    const tabs = [
        {
            title: (
                <>
                    <BookCheck className='p-1' /> Tasks
                </>
            ),
            view: Tasks,
        },
        {
            title: (
                <>
                    <CakeSlice className='p-1' />
                    Rewards
                </>
            ),
            view: Rewards,
        },
        {
            title: (
                <>
                    <HistoryIcon className='p-1' />
                    History
                </>
            ),
            view: History,
        },
    ];

    return (
        <FiltersProvider>
            <SortingProvider>
                <Tabs tabs={tabs} />
            </SortingProvider>
        </FiltersProvider>
    );
};
