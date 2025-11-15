export class ApiError extends Error {
	public readonly statusCode?: number;
	public readonly originalError?: unknown;

	constructor(message: string, statusCode?: number, originalError?: unknown) {
		super(message);
		this.name = "ApiError";
		this.statusCode = statusCode;
		this.originalError = originalError;
	}
}

interface FetchConfig extends RequestInit {
	timeout?: number;
}

async function fetchWithTimeout(
	url: string,
	config: FetchConfig = {},
): Promise<Response> {
	const { timeout = 30000, ...fetchConfig } = config;

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, {
			...fetchConfig,
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			throw new ApiError(
				`HTTP Error: ${response.status} ${response.statusText}`,
				response.status,
			);
		}

		return response;
	} catch (error) {
		clearTimeout(timeoutId);

		if (error instanceof ApiError) {
			throw error;
		}

		if (error instanceof Error) {
			if (error.name === "AbortError") {
				throw new ApiError("Request timeout", 408, error);
			}
			throw new ApiError("Network error", undefined, error);
		}

		throw new ApiError("Unknown error occurred", undefined, error);
	}
}

export const apiClient = {
	async get<T>(url: string, config?: FetchConfig): Promise<T> {
		const response = await fetchWithTimeout(url, { ...config, method: "GET" });
		return response.json() as Promise<T>;
	},

	async post<T>(url: string, data: unknown, config?: FetchConfig): Promise<T> {
		const response = await fetchWithTimeout(url, {
			...config,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...config?.headers,
			},
			body: JSON.stringify(data),
		});
		return response.json() as Promise<T>;
	},
};
