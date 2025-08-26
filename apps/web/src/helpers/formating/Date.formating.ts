/** @format */

export function FormatTime_FourDigits(d?: Date | string | number) {
	if (!d) return '—';
	const date = d instanceof Date ? d : new Date(d);
	if (isNaN(+date)) return '—';
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function dayKey(d: Date) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
		d.getDate(),
	).padStart(2, '0')}`;
}

export function swedishShort(d: Date) {
	return d.toLocaleDateString('sv-SE', { day: '2-digit', month: 'short' });
}

export function addMinutes(d: Date, m: number) {
	const n = new Date(d);
	n.setMinutes(n.getMinutes() + m);
	return n;
}

export const addDays = (d: Date, n: number) => {
	const copy = new Date(d);
	copy.setDate(copy.getDate() + n);
	return copy;
};

export const startOfDay = (d: Date) => {
	const x = new Date(d);
	x.setHours(0, 0, 0, 0);
	return x;
};
