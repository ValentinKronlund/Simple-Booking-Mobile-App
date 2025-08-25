/** @format */

// api/http.ts
import { API_BASE_URL } from '../config/api';
import { WithTimeout } from '../helpers/promises/WithTimeout.promises';

export class ApiError extends Error {
	constructor(
		message: string,
		public status?: number,
		public body?: unknown,
	) {
		super(message);
		this.name = 'ApiError';
	}
}

type FetchInit = Omit<RequestInit, 'body'> & { body?: any };

async function request<T>(
	path: string,
	init: FetchInit = {},
	signal?: AbortSignal,
): Promise<T> {
	const res = await WithTimeout(
		fetch(`${API_BASE_URL}${path}`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				...(init.headers ?? {}),
			},
			...init,
			body: init.body ? JSON.stringify(init.body) : undefined,
			signal,
		}),
		10_000,
	);

	let data: any;
	try {
		data = await res.json();
	} catch {
		data = await res.text();
	}

	if (!res.ok) {
		throw new ApiError(`HTTP ${res.status}`, res.status, data);
	}

	return data as T;
}

export const http = {
	get: <T>(path: string, signal?: AbortSignal) =>
		request<T>(path, { method: 'GET' }, signal),
	post: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
		request<T>(path, { method: 'POST', body }, signal),
	// add put/patch/delete as needed
};
