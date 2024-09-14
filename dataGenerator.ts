import { AxiosError } from "axios";
import { TFlightForm } from "./src/components/FlightForm";
import {
	addFlights,
	addFlightWithPhoto,
	handleFormSubmit,
} from "./src/services/flight.services";

const codeGenerator = nextLexicographicalString();

import { File } from "file-api";
import fs from "fs";
import FormData from "form-data";
function createFormDataWithSVG(filePath, flight: TFlightForm) {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, (err, data) => {
			if (err) {
				reject(err);
				return;
			}

			// Create a FormData instance
			const form = new FormData();

			// Append the SVG file to the form-data instance
			form.append("photo", data, {
				filename: "react.svg",
				contentType: "image/svg+xml",
			});

			form.append("code", flight.code);
			form.append("capacity", flight.capacity.toString());
			form.append("departureDate", flight.departureDate);

			resolve(form);
		});
	});
}

const generateFlights = async (numberOfFlights: number, isImage: boolean) => {
	const newCodes: string[] = [];
	const existingCodes: string[] = [];

	const originalNumberOfFlights = numberOfFlights;
	let i = numberOfFlights;
	console.log("Generating flights....");
	console.log("Number of flights: ", numberOfFlights);
	console.log("Generating images: ", isImage);
	console.log("0% of flights generated");

	while (i > 0) {
		const flightCode = codeGenerator.next().value as string;
		if (flightCode === "ZZZZZZ") {
			console.log("All flights generated Wow you are awesome!!");
			break;
		}

		let flight = {
			code: flightCode,
			capacity: 50,
			departureDate: new Date().toLocaleDateString(),
		} as TFlightForm;

		try {
			let response;

			if (isImage) {
				const formData = await createFormDataWithSVG(
					"./src/assets/react.svg",
					flight
				);
				//@ts-ignore
				response = await addFlightWithPhoto(formData);
			} else {
				response = await addFlights(flight);
			}

			if (response.status) {
				i--;

				console.log(
					`${
						((originalNumberOfFlights - i) / originalNumberOfFlights) * 100
					}% of flights generated`
				);
			}
		} catch (e) {
			const err = e as AxiosError;
			delete err.stack;

			console.log(`Flight with code ${flightCode} already exists`);

			existingCodes.push(flightCode);

			continue;
		}
	}

	return { newCodes, existingCodes };
};

/**
 * Generates a sequence of strings in lexicographical order, from the start
 * string up to and including the end string.
 *
 * @param {string} [start="aaaaaa"] The starting string.
 * @param {string} [end="ZZZZZZ"] The ending string.
 * @yields {string} The next string in lexicographical order.
 */
function* nextLexicographicalString(
	start: string = "aaaaaa",
	end: string = "ZZZZZZ"
): Generator<string> {
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const length = start.length;

	// Convert the string to an array of character indices
	const toIndices = (s: string): number[] => {
		return Array.from(s).map((char) => chars.indexOf(char));
	};

	// Convert an array of indices back to the corresponding string
	const toString = (indices: number[]): string => {
		return indices.map((index) => chars[index]).join("");
	};

	// Increment the character indices in a lexicographical manner
	const increment = (indices: number[]): boolean => {
		for (let i = indices.length - 1; i >= 0; i--) {
			if (indices[i] < chars.length - 1) {
				indices[i]++;
				return true;
			} else {
				indices[i] = 0; // Reset this character and carry over to the next one
			}
		}
		return false; // If all positions are reset, we've reached the end
	};

	let current = toIndices(start);
	const endIndices = toIndices(end);

	while (current <= endIndices) {
		yield toString(current);
		if (!increment(current)) {
			break;
		}
	}
}

// CHANGE VARIABLES HERE
const NUMBER_OF_FLIGHTS = 100;
const IS_IMAGE = true;

console.log("Starting data generation");
const response = await generateFlights(NUMBER_OF_FLIGHTS, IS_IMAGE);
