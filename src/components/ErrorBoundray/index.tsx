import React, { Component, ReactNode } from "react";
import { toast } from "react-toastify";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		// Update state to show fallback UI on the next render
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Log the error to an error reporting service
		console.error("Error caught by ErrorBoundary:", error, errorInfo);

		console.log("TOAST CALLED");
		// Show toast notification
		toast.error("An unexpected error occurred. Please try again later.");
	}

	render() {
		if (this.state.hasError) {
			// Render fallback UI or null
			return null;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
