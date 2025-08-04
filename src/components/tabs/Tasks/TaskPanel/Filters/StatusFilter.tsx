import React, { useState } from "react";

import { StatusKeys } from "@core/consts";
import { Status } from "@core/types";
import { useFilters } from "@providers/FiltersProvider";
import styles from "../../../../reusable/styles.module.css";

// export default function StatusFilter(): React.JSX.Element {
// 	const statusOptions: Array<Status> = StatusKeys;
// 	const { status } = useFilters();

// 	const statusValue = status.value;
// 	const setStatus = status.setValue;

// 	return (
// 		<div className="flex-items-center">
// 			<label htmlFor="status">Filter by status</label>
//             <div className="
//                 flex gap-2 flex-wrap
//             ">
//               {statusOptions.map((s) => (
//                 <label key={s} className="flex items-center gap-1 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={statusValue.includes(s)}
//                     onChange={() => {
//                       const newStatuses = statusValue.includes(s)
//                         ? statusValue.filter((v) => v !== s)
//                         : [...statusValue, s];
//                       setStatus(newStatuses);
//                     }}
//                     className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className="text-gray-700">{s}</span>
//                 </label>
//               ))}
//             </div>
// 		</div>
// 	);
// }

import { useMobile } from "@/hooks/useMobile"

export default function StatusFilter(): React.JSX.Element {
  const statusOptions: Array<Status> = StatusKeys
  const { status } = useFilters()
  const isMobile = useMobile()
  const [isCollapsed, setIsCollapsed] = useState(isMobile)

  const statusValue = status.value
  const setStatus = status.setValue

  const toggleCollapse = (): void => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="flex flex-col mb-4">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="status" className="text-sm font-medium text-red-600">
          Filter by status
        </label>
        {isMobile && (
          <button
            onClick={toggleCollapse}
            className="text-red-600"
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand status filter" : "Collapse status filter"}
          >
            {isCollapsed ? "▼" : "▲"}
          </button>
        )}
      </div>

      <div
        className={`${isCollapsed && isMobile ? "hidden" : "flex"} ${
          isMobile ? "flex-col space-y-2" : "flex-row flex-wrap gap-2"
        }`}
      >
        {statusOptions.map((s) => (
          <label key={s} className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={statusValue.includes(s)}
              onChange={() => {
                const newStatuses = statusValue.includes(s) ? statusValue.filter((v) => v !== s) : [...statusValue, s]
                setStatus(newStatuses)
              }}
              className="h-4 w-4 rounded border-red-600 text-red-600 focus:ring-red-500"
            />
            <span className="text-red-600">{s}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
