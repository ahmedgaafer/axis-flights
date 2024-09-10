import React from "react";
import NotFoundSVG from "../../assets/page-not-found.svg?react";
const NotFound: React.FC = () => {
	return (
		<section>
			<h1>Page not found</h1>
			<NotFoundSVG />
		</section>
	);
};

export default NotFound;
