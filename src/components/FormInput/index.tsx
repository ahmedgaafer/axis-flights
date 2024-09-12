import { useController } from "react-hook-form";
import "./index.scss";
interface GenericInputProps {
	name: string; // Name of the input, used for RHF registration
	control: any; // Control object from RHF
	label?: string; // Optional label for the input
	type?: string; // Optional type for the input (e.g., text, email, etc.)
	placeholder?: string; // Optional placeholder text
	required?: boolean; // Optional required flag
	defaultValue?: string; // Optional default value
}

const FormInput = ({
	name,
	control,
	label,
	type = "text",
	placeholder,
	required = false,
	defaultValue = "",
}: GenericInputProps) => {
	// useController hook connects the input to the RHF context
	const {
		field,
		fieldState: { error },
	} = useController({
		name,
		control,
		defaultValue,
		rules: { required },
	});

	return (
		<div className="form-group">
			{label && <label htmlFor={name}>{label}</label>}
			<input
				id={name}
				type={type}
				placeholder={placeholder}
				{...field} // Spread field props to the input
				className={`form-input ${error ? "is-invalid" : ""}`} // Add conditional class based on validation
			/>
			{error && <span className="error-message">{error.message}</span>}
		</div>
	);
};

export default FormInput;
