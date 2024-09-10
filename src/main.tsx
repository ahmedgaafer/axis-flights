import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
	createBrowserRouter,
	Navigate,
	Outlet,
	RouterProvider,
} from "react-router-dom";
import "./index.scss";
import NotFound from "./pages/NotFound/index.tsx";
import FlightDashboard from "./pages/FlightsDashboard/index.tsx";
import Landing from "./pages/Landing/index.tsx";
import About from "./pages/About/index.tsx";
import { AuthProvider, useAuth } from "./Providers/AuthProvider.tsx";

const AuthElement = () => {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

const router = createBrowserRouter([
	{
		path: "/",
		element: <AuthProvider />,
		children: [
			{
				path: "",
				element: <Landing />,
			},
			{
				path: "flights",
				element: <AuthElement />,
				children: [
					{
						path: "",
						element: <FlightDashboard />,
					},
				],
			},
			{
				path: "about",
				element: <About />,
			},
		],
	},

	{
		path: "*",
		element: <NotFound />,
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
