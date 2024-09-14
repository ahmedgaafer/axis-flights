import { z } from "zod";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	checkFlightCode,
	fileToDataUri,
	flightsSchema,
	getFlightImage,
} from "../../services/flight.services";
import FormInput from "../FormInput";
import Button from "../Buttons";
import ReactImageUploading from "react-images-uploading";
import "./index.scss";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { useEffect } from "react";

const FlightFormSchema = flightsSchema
	.omit({ status: true })
	.setKey("id", z.string().uuid().optional())
	.superRefine(async (data, ctx) => {
		const codeResponse = await checkFlightCode(data.code);

		if (codeResponse.status === 200) {
			if (codeResponse.data.status === "unavailable") {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Code is already in use",
					path: ["code"],
				});
			}
		}
	});

export type TFlightForm = z.infer<typeof FlightFormSchema>;

type TFormProps = {
	flightData?: TFlightForm;
	label: string;
	onSubmit: (data: TFlightForm) => void;
};

const FlightForm = (props: TFormProps) => {
	const {
		control,
		handleSubmit,

		formState: { errors },
	} = useForm<TFlightForm>({
		resolver: zodResolver(FlightFormSchema),
		defaultValues: props.flightData || {},
		mode: "onChange",
	});

	useEffect(() => {
		if (props.label == "edit" && props.flightData?.img.length > 0) {
			getFlightImage(props.flightData!.id).then(async (res) => {
				const { data } = res;

				const imageFile = new File([data], "image", { type: "image/svg+xml" });
				const dataURL = await fileToDataUri(imageFile);

				const imageList = [
					{
						file: imageFile,
						dataURL,
					},
				];

				field.onChange(imageList);
			});
		}
	}, []);

	const {
		field,
		fieldState: { error },
	} = useController({
		name: "img",
		control,
		rules: { required: false },
	});

	return (
		<div>
			<h1>{props.label} Flight</h1>

			<form>
				<FormInput
					name="code"
					label="Code"
					control={control}
					placeholder="Code"
					required
				/>

				<FormInput
					name="capacity"
					label="Capacity"
					control={control}
					placeholder="Capacity"
					type="number"
					required
				/>

				<FormInput
					name="departureDate"
					label="Departure Date"
					control={control}
					placeholder="Departure Date"
					type="date"
					required
				/>
				<ReactImageUploading
					multiple={false}
					{...field}
					acceptType={["svg"]}
					maxNumber={1}
				>
					{({
						imageList,
						onImageUpload,

						onImageRemove,
						isDragging,
						dragProps,
					}) => (
						// write your building UI
						<div
							className={`upload__image-wrapper ${
								imageList.length === 0 ? "empty" : ""
							}`}
							style={isDragging ? { color: "red" } : undefined}
							{...dragProps}
						>
							{imageList.length === 0 && (
								<div>
									Drop or Click{" "}
									<span className="upload__image-text" onClick={onImageUpload}>
										Here
									</span>
								</div>
							)}

							{imageList?.map?.((image, index) => (
								<div key={index} className="image-item">
									<img src={image.dataURL} alt="" width="100" />
									<div className="image-item__btn-wrapper">
										<Button
											type="button"
											buttonType="danger"
											buttonShape="circle"
											onClick={() => onImageRemove(index)}
										>
											<MdClose />
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</ReactImageUploading>

				<Button onClick={handleSubmit(props.onSubmit)}>{props.label}</Button>
			</form>
		</div>
	);
};

export default FlightForm;
