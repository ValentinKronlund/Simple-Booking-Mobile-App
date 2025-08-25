/** @format */

export function labelToName(label: string): string {
	return label.replace(/\s*\(\d+.*?\)\s*$/, '').trim();
}

export function normalizeSpaces(s: string): string {
	return s.replace(/\s+/g, ' ').trim();
}
