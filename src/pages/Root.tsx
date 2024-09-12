import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { useAuth } from "../Providers/AuthProvider";
import Landing from "./Landing";

import { Bounce, toast, ToastContainer } from "react-toastify";

import "react-toastify/ReactToastify.css";
import { useEffect, useState } from "react";

const Root = () => {
	const { isAuthenticated } = useAuth();
	const [previousLocation, setPreviousLocation] = useState<string | null>(null);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		// Store the previous route whenever the location changes
		setPreviousLocation(location.pathname);
		if (location.pathname === "/flights" && !isAuthenticated) {
			navigate("/");
			toast.error("Must login to view flights");
		}
	}, [location]);

	useEffect(() => {
		if (previousLocation === "/" && isAuthenticated) {
			navigate("/flights");
			toast.success("Welcome back!");
		}
	}, [previousLocation]);

	return (
		<>
			{!isAuthenticated && <Landing />}
			{isAuthenticated && <Outlet />}
		</>
	);
};

const AuthedRoot = () => {
	return (
		<>
			<Root />

			<ToastContainer
				position="bottom-left"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
				transition={Bounce}
				stacked
			/>
		</>
	);
};

export default AuthedRoot;
