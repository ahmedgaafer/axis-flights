import { RefObject, useEffect } from "react";

export const useClickOutside = (
	ref: RefObject<HTMLElement | undefined>,
	callback: () => void,
	addEventListener = true,
	parentRef: RefObject<HTMLElement | undefined>
) => {
	const handleClick = (event: MouseEvent) => {
		if (
			ref.current &&
			parentRef.current &&
			!ref.current.contains(event.target as HTMLElement) &&
			!parentRef.current.contains(event.target as HTMLElement)
		) {
			callback();
		}
	};

	useEffect(() => {
		if (addEventListener) {
			document.addEventListener("click", handleClick);
		}

		return () => {
			document.removeEventListener("click", handleClick);
		};
	});
};
