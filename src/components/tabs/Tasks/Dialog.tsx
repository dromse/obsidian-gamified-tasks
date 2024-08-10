import React from 'react'

import styles from './styles.module.css'

export type DialogProps = {
	isOpen: boolean;
	setIsOpen: (arg: boolean) => void;
	children?: string | React.JSX.Element | Array<React.JSX.Element>;
};
export const Dialog = (props: DialogProps): React.JSX.Element => {
	const { isOpen, setIsOpen, children } = props;
	const ref = React.useRef<HTMLDialogElement>(null);

	React.useEffect(() => {
		function onClick(event: MouseEvent): void {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			setTimeout(() => document.addEventListener("click", onClick), 0);
		}

		return () => {
			document.removeEventListener("click", onClick);
		};
	}, [isOpen]);

	return isOpen ? (
		<dialog open={isOpen} ref={ref} className={`${styles.menu} border`}>
			{children}
		</dialog>
	) : (
		<></>
	);
};
