import authRouter from "./router.services";

export const getAllFlights = async (page: number, size: number, code = "") => {
	let queryString = `page=${page}&size=${size}`;
	if (code?.length > 0) queryString = `${queryString}&search=${code}`;

	//if code then dont add it

	const response = await authRouter.get(`/flights?${queryString}`);

	return response;
};
