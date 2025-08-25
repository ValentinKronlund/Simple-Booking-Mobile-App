/** @format */

import { TimeSlotRender } from '../../types/types';

export function combineClasses(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(' ');
}

export function getCellStateVisuals(state: TimeSlotRender['state']) {
	switch (state) {
		case 'booked':
			return {
				container: 'rounded-xl border px-2 py-2 mb-2 bg-[#316f48] border-[#00695C]',
				primary: 'text-md text-white',
				secondary: 'text-sm text-white/80',
			};
		case 'occupied':
			return {
				container: 'rounded-xl border px-2 py-2 mb-2 bg-[#e85959] border-[#df2525]',
				primary: 'text-md text-white',
				secondary: 'text-sm text-white/80',
			};
		case 'vacant':
		default:
			return {
				container: 'rounded-xl border px-2 py-2 mb-2 border-black/50',
				primary: 'text-md text-[#1C1B1F]',
				secondary: 'text-sm text-[#1C1B1F]/60',
			};
	}
}

type TableBodyProps = {
	isFirst?: boolean;
	isLast?: boolean;
};
export function getTableBodyVisuals({ isFirst, isLast }: TableBodyProps) {
	if (isFirst || isLast) {
		return 'flex-1 pb-1';
	}
	return 'flex-1 pb-1 border-l border-r  border-[#E0E0E0]';
}

type HeaderProps = {
	isFirst?: boolean;
	isLast?: boolean;
};
export function getRowHeaderVisuals({ isFirst, isLast }: HeaderProps) {
	if (isFirst || isLast) {
		return {
			container: 'border-b border-[#E0E0E0] py-2 items-center',
			primary: 'text-[#212121]',
		};
	}
	return {
		container: 'border-l border-r border-b border-[#E0E0E0] bg-white py-2 items-center',
		primary: 'text-[#212121]',
	};
}

type FooterProps = {
	error: string;
	loading: boolean;
};
export function getFooterVisuals(className: string | undefined) {
	return {
		container: [
			className ?? '',
			'absolute bottom-0 left-0 right-0 bg-neutral-950/85 border-t border-white/10 px-6 pt-4',
		].join(' '),
		error: 'text-red-400 text-sm mb-2',
		loading: 'mb-3',
	};
}
