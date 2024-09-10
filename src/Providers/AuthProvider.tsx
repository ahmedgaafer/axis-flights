import React, { useState, createContext, useContext, useEffect } from "react";

import useLocalStorage from "../hooks/useLocalStorage";
import authRouter from "../services/router.services";
import { Outlet, useNavigate } from "react-router-dom";

type TAuthContext = {
	isAuthenticated: boolean;
	user: TAuthResponse | null;
	signOut: () => void;
	signIn: (email: string, password: string) => void;
	register: (name: string, email: string, password: string) => void;
};

type TAuthResponse = {
	id: string;
	name: string;
	email: string;

	token: string;
	refreshToken: string;
};

const AuthContext = createContext<TAuthContext | null>(null);

export const AuthProvider = () => {
	const [user, setUser] = useLocalStorage<TAuthResponse | null>("User", null);

	const navigate = useNavigate();

	const signOut = () => {
		setUser(null);
		navigate("/");
	};

	const refresh = async () => {
		if (!user?.refreshToken) {
			signOut();
			throw new Error("refresh token not found");
		}

		const response = await authRouter.post<
			Pick<TAuthResponse, "refreshToken" | "token">
		>("/auth/refresh", {
			refreshToken: user.refreshToken,
		});

		setUser({
			...user,
			...response.data,
		});

		return response.data;
	};

	useEffect(() => {
		authRouter.interceptors.response.use(
			(response) => response,
			async (error) => {
				console.log(error);

				const originalRequest = error.config;

				if (error.status === 401) {
					// auto-refresh
					try {
						if (error.config.url === "/auth/refresh") {
							return Promise.reject(error);
						}

						const tokens = await refresh();

						originalRequest.headers.Authorization = `Bearer ${tokens.token}`;
						return authRouter(originalRequest);
					} catch {
						signOut();
					}
				}

				return error;
			}
		);

		return () => {
			authRouter.interceptors.response.clear();
		};
	}, [refresh, signOut]);

	useEffect(() => {
		if (user?.token) {
			authRouter.defaults.headers.common[
				"Authorization"
			] = `Bearer ${user.token}`;
		} else {
			delete authRouter.defaults.headers.common["Authorization"];
		}
	}, [user?.token]);

	const signIn = async (email: string, password: string) => {
		const response = await authRouter.post("/auth/login", { email, password });

		setUser(response.data);
	};

	const register = async (name: string, email: string, password: string) => {
		const response = await authRouter.post<TAuthResponse>("/auth/register", {
			name,
			email,
			password,
		});

		setUser(response.data);
	};

	return (
		<AuthContext.Provider
			value={{ isAuthenticated: !!user, user, signIn, register, signOut }}
		>
			<Outlet />
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const data = useContext(AuthContext);

	if (!data) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return data;
};

export const useUser = () => {
	const { user, signOut } = useAuth();

	if (!user) {
		signOut();
		throw new Error("User not found");
	}

	return user;
};
