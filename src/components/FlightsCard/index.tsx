import { TFlightsData, TPagination } from "../../pages/FlightsDashboard";
import Pagination from "../Pagination";
import "./index.scss";

const FlightsCard = ({
	pagination,

	flights,
}: {
	pagination: TPagination;

	flights: TFlightsData;
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
							<div className="flight-actions">
								<span>a</span>
								<span>b</span>
								<span>c</span>
							</div>
						</div>
					))}
				</div>
			</>
		)
	);
};

export default FlightsCard;
