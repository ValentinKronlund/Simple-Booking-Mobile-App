/** @format */

export function FormatTime_FourDigits(d?: Date | string | number) {
	if (!d) return '—';
	const date = d instanceof Date ? d : new Date(d);
	if (isNaN(+date)) return '—';
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function addMinutes(d: Date, m: number): Date {
	const n = new Date(d);
	n.setMinutes(n.getMinutes() + m);
	return n;
}

export function addDays(d: Date, n: number) {
	return addMinutes(d, n * 1440);
}

export function startOfHour(d: Date): Date {
	const n = new Date(d);
	n.setMinutes(0, 0, 0);
	return n;
}

export function toDateSafe(input?: Date | string | number | null): Date | null {
	if (input == null) return null;
	const d = input instanceof Date ? input : new Date(input);
	return isNaN(d.getTime()) ? null : d;
}

export function dayKey(d?: Date | string | number | null): string {
	const date = toDateSafe(d);
	if (!date) return 'invalid-date';
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

export function swedishShort(d: Date): string {
	return d.toLocaleDateString('sv-SE', { day: '2-digit', month: 'short' });
}
