import React from "react";

import styles from "../tabs/Tasks/styles.module.css";

export type DialogProps = {
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
    children?: string | React.JSX.Element | Array<React.JSX.Element>;
    onClose?: Function
};
export const Dialog = (props: DialogProps): React.JSX.Element => {
    const { isOpen, setIsOpen, children, onClose } = props;
    const ref = React.useRef<HTMLDialogElement>(null);

    const handleKeyDown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            setIsOpen(false);
        }
    };

    React.useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    React.useEffect(() => {
        function onClick(event: MouseEvent): void {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            setTimeout(() => document.addEventListener("click", onClick), 0);
        }

        if (!isOpen && onClose) {
            onClose()
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
