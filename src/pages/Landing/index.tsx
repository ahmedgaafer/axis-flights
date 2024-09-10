import Button from "../../components/Buttons";
import LandingSVG from "../../assets/landing.svg?react";
import { useAuth } from "../../Providers/AuthProvider";
import authRouter from "../../services/router.services";

const Landing = () => {
	const { signIn } = useAuth();

	return (
		<div>
			<div className="actions">
				<Button
					onClick={() => {
						authRouter.get("/flights").then(console.log);
					}}
				>
					Register
				</Button>
				<Button
					onClick={() => {
						signIn("john@doe.com", "123");
					}}
				>
					Login
				</Button>
			</div>
			<div className="page">
				Welcome
				<LandingSVG width={100} />
			</div>
		</div>
	);
};

export default Landing;
