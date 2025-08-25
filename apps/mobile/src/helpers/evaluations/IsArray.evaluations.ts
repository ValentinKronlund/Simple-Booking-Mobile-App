/** @format */

export const IsArray = (data: any) => {
	// Support both `[...]` and `{ rooms: [...] }`
	const list = Array.isArray((data as any)?.rooms) ? (data as any).rooms : (data as any);
	if (!Array.isArray(list))
		throw new Error('Unexpected payload shape (expected an array)');
	return list;
};
