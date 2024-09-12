import NotFoundSVG from "../../assets/page-not-found.svg?react";

import "./index.scss";
import Nav from "../../components/Nav";

const NotFound = () => {
	return (
		<>
			<section>
				<h1>Page not found</h1>
				<NotFoundSVG />
			</section>
		</>
	);
};

export default NotFound;
