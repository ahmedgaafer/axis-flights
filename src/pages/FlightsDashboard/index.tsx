import React, { useEffect, useState } from "react";
import useIsMobile from "../../hooks/useIsMobile";
import FlightsTable from "../../components/FlightsTable";
import FlightsCard from "../../components/FlightsCard";
import { getAllFlights } from "../../services/flight.services";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { set, z } from "zod";
import { useUser } from "../../Providers/AuthProvider";
import "./index.scss";

export type TPagination = {
	page: number;
	size: number;
	code: string;
};

export type TFlightsData = {
	count: number;
	total: number;
	resources: TFlight[];
};

const flightsSchema = z.object({
	id: z.string().uuid(),
	code: z.string().length(6, "Code must be 6 characters long"),
	capacity: z.number().min(0, "Capacity must be at least 0"),
	departureDate: z.string().date(),
	status: z.enum(["none", "processing", "ready"]),
	img: z.any().optional(),
});

export type TFlight = z.infer<typeof flightsSchema>;

const defaultFlights: TFlightsData = {
	count: 0,
	total: 0,
	resources: [],
};

const FlightDashboard = () => {
	const { isMobile } = useIsMobile();
	const [searchParams, setSearchParams] = useSearchParams();
	const user = useUser();

	const page = parseInt(searchParams.get("page") || "0") || 1;
	const size = parseInt(searchParams.get("size") || "0") || 10;
	const code = searchParams.get("code") || "";

	const pagination: TPagination = {
		page,
		size,
		code,
	};

	const [flights, setFlights] = useState<TFlightsData | null>(null);

	useEffect(() => {
		if (!searchParams.get("page") || !searchParams.get("size")) {
			setSearchParams({
				page: page.toString(),
				size: size.toString(),
			});
		}
	}, [user.id]);

	useEffect(() => {
		if (!user.id) return;

		getAllFlights(page, size, code)
			.then((response) => {
				if (!response.data) {
					console.log("🚀 ~ .then ~ response:", response);
					setFlights(defaultFlights);
				} else {
					setFlights(response.data);
				}
			})
			.catch((error) => {
				console.log(error);
				setFlights(null);
			});
	}, [size, page, code]);

	return (
		<>
			<h1>FlightDashboard</h1>

			{flights && (
				<div className={`flights ${isMobile ? "mobile" : ""}`}>
					{isMobile ? (
						<FlightsCard pagination={pagination} flights={flights} />
					) : (
						<FlightsTable pagination={pagination} flights={flights} />
					)}
				</div>
			)}
		</>
	);
};

export default FlightDashboard;
