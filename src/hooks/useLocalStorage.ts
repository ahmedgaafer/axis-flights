import { useEffect, useState } from "react";

const useLocalStorage = <T>(key: string, initialValue: T) => {
	const [state, setState] = useState(
		(JSON.parse(localStorage.getItem(key) || "null") as T) || initialValue
	);

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(state));
	}, [state, key]);

	return [state, setState] as const;
};

export default useLocalStorage;
