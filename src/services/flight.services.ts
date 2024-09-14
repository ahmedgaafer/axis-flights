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

export const handleFormSubmit = (
	data: TFlightForm,
	label: "add" | "edit",
	cb: () => void
) => {
	console.log(data);
	if (data.img?.length > 0) {
		const formData = new FormData();

		formData.append("photo", data.img[0].file);
		formData.append("code", data.code);
		formData.append("capacity", data.capacity.toString());
		formData.append("departureDate", data.departureDate);
		if (label === "add") {
			addFlightWithPhoto(formData)
				.then((response) => {
					toast.success("Flight added successfully");
				})
				.catch((error) => {
					console.log(error);
				});
		} else if (label === "edit") {
			updateFlightWithPhoto(data.id, formData);
			toast.success("Flight updated successfully");
		}
	} else {
		if (label === "add") {
			addFlights(data)
				.then((response) => {
					toast.success("Flight added successfully");
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			const updatedData = {
				code: data.code,
				capacity: data.capacity,
				departureDate: data.departureDate,
			};
			updateFlights(data.id, updatedData)
				.then((response) => {
					toast.success("Flight updated successfully");
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}

	cb();
};
