import { TFlightsData, TPagination } from "../../pages/FlightsDashboard";
import { TFlight } from "../../services/flight.services";
import FlightActions from "../FlightActions";
import Pagination from "../Pagination";
import "./index.scss";

const FlightsCard = ({
	pagination,
	flights,
	onEditFlight,
}: {
	pagination: TPagination;
	flights: TFlightsData;
	onEditFlight: (flight: TFlight) => void;
}) => {
	const pageCount = Math.ceil(flights.count / pagination.size);
	const shouldRender = pageCount > 0 && flights.count > 0;

	return (
		shouldRender && (
			<>
				<Pagination pageCount={pageCount} />
				<div className="flights-cards">
					{flights.resources.map((flight) => (
						<div className="flight-card" key={flight.id}>
							<h1>Flight: {flight.code}</h1>
							<div className="flight-details">
								<span>Capacity: {flight.capacity}</span>
								<span>Departure: {flight.departureDate}</span>
								<span>Status: {flight.status}</span>
							</div>
							<FlightActions flight={flight} onEditFlight={onEditFlight} />
						</div>
					))}
				</div>
			</>
		)
	);
};

export default FlightsCard;
