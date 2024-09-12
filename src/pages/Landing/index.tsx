import LandingSVG from "../../assets/landing.svg?react";
import "./index.scss";
const Landing = () => {
	return (
		<div className="landing">
			<section>
				<h1>Welcome to axis flights</h1>
				<h5>Were all the data are gathered in one place.</h5>
			</section>
			<LandingSVG />
		</div>
	);
};

export default Landing;
