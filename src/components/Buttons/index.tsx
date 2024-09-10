import React from "react";
import "./index.scss";
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	buttonType?: "primary" | "secondary" | "danger";
}

const Button = ({
	buttonType = "primary",
	children,
	...props
}: IButtonProps) => {
	return (
		<button {...props} className={`${buttonType}`}>
			{children}
		</button>
	);
};

export default Button;
