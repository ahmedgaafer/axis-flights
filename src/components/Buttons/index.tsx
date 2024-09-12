import React from "react";
import "./index.scss";
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	buttonType?: "primary" | "secondary" | "danger";
	buttonShape?: "circle" | "square";
}

const Button = ({
	buttonType = "primary",
	buttonShape = "square",
	children,
	...props
}: IButtonProps) => {
	return (
		<button {...props} className={`${buttonType} ${buttonShape}`}>
			{children}
		</button>
	);
};

export default Button;
