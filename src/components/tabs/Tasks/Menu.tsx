import React from "react";
import { Dialog, DialogProps } from "../../reusable/Dialog";

export type MenuOption = { title: string; handler: Function };
type MenuProps = DialogProps & {
	options: Array<MenuOption>;
};
export const Menu = (props: MenuProps): React.JSX.Element => {
	const { isOpen, setIsOpen, options } = props;

	return (
		<Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
			{options.map((option) => (
				<button
					onClick={() => {
						option.handler();
						setIsOpen(false);
					}}
					key={option.title}
				>
					{option.title}
				</button>
			))}
		</Dialog>
	);
};
