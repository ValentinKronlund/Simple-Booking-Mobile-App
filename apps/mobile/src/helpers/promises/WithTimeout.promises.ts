/** @format */

export const WithTimeout = <T>(p: Promise<T>, ms = 10000) =>
	Promise.race<T>([
		p,
		new Promise<T>((_, rej) =>
			setTimeout(() => rej(new Error('Request timeout')), ms),
		) as Promise<T>,
	]);
