import { useEffect, useState } from "react";
import useIsMobile from "../../hooks/useIsMobile";
import FlightsTable from "../../components/FlightsTable";
import FlightsCard from "../../components/FlightsCard";
import {
	getAllFlights,
	handleFormSubmit,
	TFlight,
} from "../../services/flight.services";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useUser } from "../../Providers/AuthProvider";
import "./index.scss";
import FormInput from "../../components/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "../../components/Buttons";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import Modal from "react-modal";
import FlightForm from "../../components/FlightForm";

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

const flightSearchSchema = z.object({
	code: z
		.string()

		.max(6, "Code must be 6 characters long"),
});

type TFlightSearch = z.infer<typeof flightSearchSchema>;

const defaultFlights: TFlightsData = {
	count: 0,
	total: 0,
	resources: [],
};

type TModalState =
	| {
			type: "add" | null;
			flight?: null;
	  }
	| {
			type: "edit";
			flight: TFlight;
	  };

const FlightDashboard = () => {
	const { isMobile } = useIsMobile();
	const [searchParams, setSearchParams] = useSearchParams();
	const [modal, setModal] = useState<TModalState>({
		type: null,
	});
	const user = useUser();

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<TFlightSearch>({
		resolver: zodResolver(flightSearchSchema),
	});

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
					if (response.data.count === 0) {
						toast.error("No flights found");
					}
					setFlights(response.data);
				}
			})
			.catch((error) => {
				console.log(error);
				setFlights(null);
			});
	}, [size, page, code]);

	const handleSearchClick = (data: TFlightSearch) => {
		if (data.code.length === 0) return handleClearClick();

		setSearchParams({
			page: page.toString(),
			size: size.toString(),
			code: data.code,
		});
	};

	const handleClearClick = () => {
		reset();
		setSearchParams({
			page: page.toString(),
			size: size.toString(),
		});
	};

	const onEditModalClick = (flight: TFlight) => {
		setModal({ type: "edit", flight });
	};
	const onAddModalClick = () => {
		setModal({ type: "add" });
	};

	return (
		<>
			<h1>FlightDashboard</h1>

			<div className={`flights ${isMobile ? "mobile" : ""}`}>
				<div className="flights-header">
					<span>
						<form>
							<FormInput
								name="code"
								control={control}
								label="Code"
								required
								placeholder="Code..."
								defaultValue={code}
								isToast
							/>

							<Button type="button" onClick={handleSubmit(handleSearchClick)}>
								Search
							</Button>
							<Button
								type="button"
								buttonType="danger"
								onClick={handleClearClick}
							>
								Clear
							</Button>
						</form>
					</span>
					<span>
						<Button onClick={onAddModalClick}>
							<IoMdAddCircleOutline />
							Add Flight
						</Button>
					</span>
				</div>
				{flights?.count ? (
					isMobile ? (
						<FlightsCard
							pagination={pagination}
							flights={flights}
							onEditFlight={onEditModalClick}
						/>
					) : (
						<FlightsTable
							pagination={pagination}
							flights={flights}
							onEditFlight={onEditModalClick}
						/>
					)
				) : (
					<div className="no-records">No records found</div>
				)}
			</div>

			<Modal
				isOpen={!!modal.type}
				onRequestClose={() => setModal({ type: null })}
				appElement={document.body}
				closeTimeoutMS={350}
				shouldCloseOnEsc
				shouldCloseOnOverlayClick
			>
				<FlightForm
					label={modal.type!}
					onSubmit={(data) =>
						handleFormSubmit(data, modal.type!, () => setModal({ type: null }))
					}
					flightData={modal.flight!}
				/>
			</Modal>
		</>
	);
};

export default FlightDashboard;
