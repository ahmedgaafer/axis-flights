import React, { useState } from "react";
import { useAuth, useUser } from "../../Providers/AuthProvider";
import LogoSVG from "../../../public/logo.svg?react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../Buttons";
import AuthForm from "../AuthForm";
import "./index.scss";

const AuthedNav = () => {
	const { signOut } = useAuth();
	const user = useUser();

	const [open, setOpen] = useState(false);
	const location = useLocation(); // Get the current location

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	return (
		<>
			<span className="nav-links auth-links">
				<Link to="/flights" className={isActive("/flights") ? "active" : ""}>
					Flights
				</Link>
				<Link to="/about" className={isActive("/about") ? "active" : ""}>
					About
				</Link>
			</span>

			<span className="anchor--user" onClick={() => setOpen((prev) => !prev)}>
				{user.name[0]}
			</span>
			<span className={`anchored--user ${open ? "open" : ""}`}>
				<div>{user.name}</div>

				<Button onClick={signOut} buttonType="danger">
					Sign Out
				</Button>
			</span>
		</>
	);
};

const UnAuthedNav = () => {
	const [open, setOpen] = useState<"login" | "register" | null>(null);

	const handleClick = (formType: "login" | "register") => {
		open == formType ? setOpen(null) : setOpen(formType);
	};

	return (
		<>
			<span className="nav-links unauth-links">
				<Button buttonType="secondary" onClick={() => handleClick("register")}>
					Register
				</Button>
				<Button onClick={() => handleClick("login")}>Login</Button>
			</span>
			<AuthForm
				isOpen={open === "login" || open === "register"}
				formType={open!}
				setOpen={setOpen}
			/>
		</>
	);
};

const Nav: React.FC = () => {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	return (
		<nav>
			<span className="nav-left">
				<LogoSVG />
				<span onClick={() => navigate("/")}>Axis Flights</span>
			</span>
			<span className="nav-right">
				{isAuthenticated ? <AuthedNav /> : <UnAuthedNav />}
			</span>
		</nav>
	);
};

export default Nav;
