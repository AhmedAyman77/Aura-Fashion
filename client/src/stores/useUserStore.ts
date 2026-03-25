import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";
import axiosInstance from "../lib/axios";

interface User {
	_id: string;
	name: string;
	email: string;
	role: "customer" | "admin";
}

interface SignupData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

// Shape of a 422 validation error from zod-express-middleware
interface ValidationErrorResponse {
	success: false;
	message: string;
	errors: { field?: string; message: string }[];
}

interface UserStore {
	user: User | null;
	loading: boolean;
	checkingAuth: boolean;
	signup: (data: SignupData) => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
	refreshToken: () => Promise<void>;
}

// Extracts a readable message from any API error.
// Handles both the new 422 zod format and the existing { message } format.
function getErrorMessage(error: unknown, fallback: string): string {
	const err = error as AxiosError<ValidationErrorResponse & { message: string }>;
	const data = err.response?.data;

	// 422 from zod — show the first field error
	if (err.response?.status === 422 && data?.errors?.length) {
		return data.errors[0].message;
	}

	// 429 rate limit
	if (err.response?.status === 429) {
		return 'Too many attempts. Please try again later.';
	}

	return data?.message || fallback;
}

export const useUserStore = create<UserStore>((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			toast.error("Passwords do not match");
			return;
		}

		try {
			const res = await axiosInstance.post<User>("/auth/signup", { name, email, password });
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(getErrorMessage(error, "Signup failed. Please try again."));
		}
	},

	login: async (email, password) => {
		set({ loading: true });
		try {
			const res = await axiosInstance.post<User>("/auth/login", { email, password });
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(getErrorMessage(error, "Login failed. Please try again."));
		}
	},

	logout: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ user: null });
		} catch (error) {
			toast.error(getErrorMessage(error, "An error occurred during logout."));
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axiosInstance.get<User>("/auth/profile");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			const err = error as AxiosError;
			console.log(err.message);
			set({ checkingAuth: false, user: null });
		}
	},

	refreshToken: async () => {
		set({ checkingAuth: true });
		try {
			await axiosInstance.post("/auth/refresh-token");
			set({ checkingAuth: false });
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
}));

// Axios interceptor for token refresh
let refreshPromise: Promise<void> | null = null;

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as typeof error.config & { _retry?: boolean };

		const skipRefreshRoutes = ["/auth/login", "/auth/signup", "/auth/refresh-token"];
		const isSkippedRoute = skipRefreshRoutes.some(route => originalRequest?.url?.includes(route));
		if (isSkippedRoute) return Promise.reject(error);

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				if (refreshPromise) {
					await refreshPromise;
					return axiosInstance(originalRequest!);
				}

				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axiosInstance(originalRequest!);
			} catch (refreshError) {
				useUserStore.getState().logout();
				refreshPromise = null;
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);