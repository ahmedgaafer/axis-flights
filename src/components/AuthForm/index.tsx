import Modal from "react-modal";
import Button from "../Buttons";
import { MdClose } from "react-icons/md";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../Providers/AuthProvider";
import FormInput from "../FormInput";
import { useNavigate } from "react-router-dom";
// can have 2 mode "login" or "register"

//#region Types & schemas
type TAuthFormProps = {
	isOpen: boolean;
	formType: "login" | "register";
	setOpen: React.Dispatch<
		React.SetStateAction<TAuthFormProps["formType"] | null>
	>;
};

const LoginSchema = z.object({
	email: z.string().email("Invalid email"),
	password: z
		.string()
		.min(3, "Password must be at least 3 characters")
		.max(32, "Password must be less than 32 characters"),
});

const RegisterSchema = z
	.object({
		name: z.string().min(3, "Name must be at least 3 characters"),
	})
	.merge(LoginSchema);

const schemaRegistry = {
	login: LoginSchema,
	register: RegisterSchema,
};

type TFormRegistry = {
	[K in TAuthFormProps["formType"]]: z.infer<(typeof schemaRegistry)[K]>;
};

//#endregion
const resolveSchema = (formType: TAuthFormProps["formType"]) => {
	return schemaRegistry[formType];
};

const AuthForm = (props: TAuthFormProps) => {
	const { register, signIn } = useAuth();
	const { isOpen, formType, setOpen } = props;
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<TFormRegistry[typeof formType]>({
		resolver: zodResolver(resolveSchema(formType)),
	});

	const navigate = useNavigate();

	let title = formType?.charAt(0)?.toUpperCase() + formType?.slice(1) || "";

	const handleFormSubmit = async (data: TFormRegistry[typeof formType]) => {
		if (formType === "login") {
			const { email, password } = data as TFormRegistry[typeof formType];
			await signIn(email, password);
			navigate("/flights");
		} else if (formType === "register") {
			const { name, email, password } = data as TFormRegistry[typeof formType];
			await register(name, email, password);
		} else {
			throw new Error("Invalid form type");
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			contentLabel={title}
			appElement={document.body}
			closeTimeoutMS={350}
			onRequestClose={() => setOpen(null)}
			shouldCloseOnEsc
			shouldCloseOnOverlayClick
		>
			<div className="c-head">
				<h1>{title} form</h1>

				<Button
					onClick={() => setOpen(null)}
					buttonType="danger"
					buttonShape="circle"
				>
					<MdClose />
				</Button>
			</div>
			<div className="c-body">
				<form>
					{formType === "register" && (
						<FormInput
							name="name"
							control={control}
							label="Name"
							required
							placeholder="Your name..."
						/>
					)}

					<FormInput
						name="email"
						control={control}
						label="Email"
						required
						placeholder="av6yW@example.com"
					/>
					<FormInput
						name="password"
						control={control}
						label="Password"
						required
						type="password"
						placeholder="Password..."
					/>

					{errors && <p>{errors.root?.message}</p>}

					<div className="form-actions">
						<Button
							onClick={handleSubmit(handleFormSubmit)}
							buttonType="primary"
						>
							{title}
						</Button>
						<Button buttonType="secondary" onClick={() => setOpen(null)}>
							Cancel
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default AuthForm;
