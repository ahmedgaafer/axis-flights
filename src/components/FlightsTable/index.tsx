import { TFlightsData, TPagination } from "../../pages/FlightsDashboard";
import Pagination from "../Pagination";
import "./index.scss";

const FlightsTable = ({
	pagination,
	flights,
}: {
	pagination: TPagination;
	flights: TFlightsData;
}) => {
	const pageCount = Math.ceil(flights.count / pagination.size);
	const shouldRender = pageCount > 0 && flights.count > 0;

	let tableKeys = ["code", "capacity", "departureDate", "status"];

	return (
		shouldRender && (
			<>
				<div className="flights-table">
					<table>
						<thead>
							<tr>
								{tableKeys.map((key) => (
									<th key={key}>{key}</th>
								))}

								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{flights.resources.map((flight) => (
								<tr key={flight.id}>
									<td>{flight.status}</td>
									<td>{flight.code}</td>
									<td>{flight.capacity}</td>
									<td>{flight.departureDate}</td>
									<td> Actions</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<Pagination pageCount={pageCount} />
			</>
		)
	);
};

export default FlightsTable;
