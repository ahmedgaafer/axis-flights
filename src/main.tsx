import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.scss";
import NotFound from "./pages/NotFound/index.tsx";
import FlightDashboard from "./pages/FlightsDashboard/index.tsx";

import About from "./pages/About/index.tsx";

import { AuthProvider } from "./Providers/AuthProvider.tsx";
import ErrorBoundary from "./components/ErrorBoundray/index.tsx";
import Nav from "./components/Nav/index.tsx";
import Landing from "./pages/Landing/index.tsx";
import AuthedRoot from "./pages/Root.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<AuthProvider>
				<Nav />
				<Outlet />{" "}
			</AuthProvider>
		),
		children: [
			{
				path: "",
				element: <AuthedRoot />,

				children: [
					{
						path: "/flights",
						element: <FlightDashboard />,
					},
					{
						path: "/about",
						element: <About />,
					},
				],
			},
			{
				path: "*",
				element: <NotFound />,
			},
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary>
			<RouterProvider router={router} />
		</ErrorBoundary>
	</StrictMode>
);
