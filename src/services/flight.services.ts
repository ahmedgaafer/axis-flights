import { z } from "zod";
import authRouter from "./router.services";
import { toast } from "react-toastify";
import { TFlightForm } from "../components/FlightForm";

export const flightsSchema = z.object({
	id: z.string().uuid(),
	code: z.string().length(6, "Code must be 6 characters long"),
	capacity: z.coerce.number().min(50, "Capacity must be at least 50"),
	departureDate: z.string().date(),
	status: z.enum(["none", "processing", "ready"]),
	img: z.any().optional(),
});

export type TFlight = z.infer<typeof flightsSchema>;

export const getAllFlights = async (page: number, size: number, code = "") => {
	let queryString = `page=${page}&size=${size}`;
	if (code?.length > 0) queryString = `${queryString}&code=${code}`;

	//if code then dont add it

	const response = await authRouter.get(`/flights?${queryString}`);

	return response;
};

export const addFlights = async (data: Omit<TFlight, "status">) => {
	const response = await authRouter.post("/flights", data);
	return response;
};

export const updateFlights = async (
	id: string,
	data: Omit<TFlight, "status" | "id">
) => {
	const response = await authRouter.put(`/flights/${id}`, data);
	return response;
};

export const deleteFlights = async (id: string) => {
	const response = await authRouter.delete(`/flights/${id}`);
	return response;
};

export const addFlightWithPhoto = async (data: FormData) => {
	const response = await authRouter.post("/flights/withPhoto", data);
	return response;
};

export const updateFlightWithPhoto = async (id: string, data: FormData) => {
	const response = await authRouter.put(`/flights/${id}/withPhoto`, data);
	return response;
};

export const getFlightImage = async (id: string) => {
	const response = await authRouter.get(`/flights/${id}/photo`);
	return response;
};

export const checkFlightCode = async (code: string) => {
	const response = await authRouter.get(`/flights/available?code=${code}`);

	return response;
};

export function fileToDataUri(file: File) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		// When the file is successfully read
		reader.onload = () => {
			resolve(reader.result); // This will be the data URI string
		};

		// If an error occurs
		reader.onerror = (error) => {
			reject(error);
		};

		// Read the file as a data URL (base64 string)
		reader.readAsDataURL(file);
	});
}

export const handleFormSubmit = async (
	data: TFlightForm,
	label: "add" | "edit"
) => {
	if (data.img?.length > 0) {
		const formData = new FormData();

		formData.append("photo", data.img[0].file);
		formData.append("code", data.code);
		formData.append("capacity", data.capacity.toString());
		formData.append("departureDate", data.departureDate);
		if (label === "add") {
			const response = await addFlightWithPhoto(formData);

			if (response.status === 201) {
				toast.success("Flight added successfully");
				return { status: true, data: response.data, type: "add" };
			} else {
				return { status: false, message: response.statusText, type: "add" };
			}
		} else if (label === "edit") {
			const response = await updateFlightWithPhoto(data.id, formData);

			if (response.status === 200) {
				toast.success("Flight updated successfully");
				return {
					status: true,
					data: response.data,
					type: "edit",
					isPhoto: true,
				};
			} else {
				return { status: false, message: response.statusText, type: "edit" };
			}
		}
	} else {
		if (label === "add") {
			const response = await addFlights(data);

			if (response.status === 201) {
				toast.success("Flight added successfully");
				return { status: true, data: response.data, type: "add" };
			} else {
				return { status: false, message: response.statusText, type: "add" };
			}
		} else {
			const updatedData = {
				code: data.code,
				capacity: data.capacity,
				departureDate: data.departureDate,
			};
			const response = await updateFlights(data.id, updatedData);

			if (response.status === 200) {
				toast.success("Flight updated successfully");
				return { status: true, data: response.data, type: "edit" };
			} else {
				return { status: false, message: response.statusText, type: "edit" };
			}
		}
	}

	return { status: false, message: "Something went wrong" };
};
