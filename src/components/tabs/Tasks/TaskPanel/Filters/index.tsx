import React from "react";
import Modes from "./Modes";
import MoreFilters from "./MoreFilters";
import StatusFilter from "./StatusFilter";

export default function Filters(): React.JSX.Element {
    return (
        <>
            <StatusFilter />
            <Modes />
            <MoreFilters />

            <hr />
        </>
    );
}
