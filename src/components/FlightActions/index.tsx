import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { IoMdImages } from "react-icons/io";

import "./index.scss";
import {
	deleteFlights,
	getFlightImage,
	TFlight,
} from "../../services/flight.services";
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";

const FlightActions = ({
	flight,
	onEditFlight,
}: {
	flight: TFlight;
	onEditFlight: (flight: TFlight) => void;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [img, setImage] = useState<any>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	const parentRef = useRef<HTMLDivElement>(null);

	useClickOutside(imgRef, () => setIsOpen(false), isOpen, parentRef);

	useEffect(() => {
		if (isOpen && !img) {
			getFlightImage(flight.id)
				.then(async (res) => {
					const imgFile = new File([res.data], "image", {
						type: "image/svg+xml",
					});
					const url = URL.createObjectURL(imgFile);
					console.log(img);
					setImage(url);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [isOpen]);

	const handleClick = () => {
		const answer = confirm(
			`Are you sure you want to delete this flight (${flight.code})? `
		);

		if (answer) {
			deleteFlights(flight.id);
		}
	};

	return (
		<div className="flight-actions">
			<span ref={parentRef}>
				<IoMdImages
					onClick={() => setIsOpen((prev) => !prev)}
					className={`flight-img ${!flight.img ? "disabled" : ""}`}
				/>
			</span>
			<BiSolidEditAlt
				onClick={() => {
					onEditFlight(flight);
				}}
			/>
			<MdDelete onClick={handleClick} className="delete" />

			{isOpen && (
				<div className="overlay" ref={imgRef}>
					{img && <img src={img} alt="flight image" />}
				</div>
			)}
		</div>
	);
};

export default FlightActions;
