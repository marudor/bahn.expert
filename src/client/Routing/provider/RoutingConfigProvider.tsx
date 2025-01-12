import { useExpertCookies } from '@/client/Common/hooks/useExpertCookies';
import constate from '@/constate';
import { AllowedHafasProfile } from '@/types/HAFAS';
import type { MinimalStopPlace } from '@/types/stopPlace';
import {
	addDays,
	endOfDay,
	isSameDay,
	isSameYear,
	isWithinInterval,
	lightFormat,
	startOfDay,
	subDays,
} from 'date-fns';
import type { Day } from 'date-fns';
import { de as deLocale } from 'date-fns/locale/de';
import { useCallback, useMemo, useState } from 'react';
import type { PropsWithChildren, SyntheticEvent } from 'react';

export interface RoutingSettings {
	maxChanges: string;
	transferTime: string;
	onlyRegional: boolean;
	onlyNetzcard: boolean;
	onlyBC100: boolean;
	hafasProfileN?:
		| AllowedHafasProfile.DB
		| AllowedHafasProfile.OEBB
		| AllowedHafasProfile.BAHN;
}
const routingConfigKeys = [
	'maxChanges',
	'transferTime',
	'onlyRegional',
	'onlyNetzcard',
	'hafasProfileN',
] as (keyof RoutingSettings)[];

const useRoutingConfigInternal = ({
	initialSettings,
	initialStart,
	initialDestination,
	initialDate,
	initialVia,
}: PropsWithChildren<{
	initialSettings: RoutingSettings;
	initialStart?: MinimalStopPlace;
	initialDestination?: MinimalStopPlace;
	initialDate?: Date;
	initialVia?: MinimalStopPlace[];
}>) => {
	const [start, setStart] = useState<MinimalStopPlace | undefined>(
		initialStart,
	);
	const [destination, setDestination] = useState<MinimalStopPlace | undefined>(
		initialDestination,
	);
	const [via, setVia] = useState<MinimalStopPlace[]>(initialVia || []);
	const [date, setDate] = useState<Date>(initialDate || new Date());
	const [touchedDate, setTouchedDate] = useState(Boolean(initialDate));
	const [settings, setSettings] = useState<RoutingSettings>(initialSettings);
	const [departureMode, setDepartureMode] = useState<'an' | 'ab'>('ab');
	const formattedDate = useMemo(() => {
		if (!touchedDate) {
			return `Jetzt (Heute ${lightFormat(new Date(), 'HH:mm')})`;
		}
		const today = startOfDay(new Date());
		const tomorrow = endOfDay(addDays(today, 1));
		const yesterday = subDays(today, 1);

		let relativeDayString = '';

		if (isWithinInterval(date, { start: yesterday, end: tomorrow })) {
			if (isSameDay(date, today)) relativeDayString = 'Heute';
			else if (isSameDay(date, yesterday)) relativeDayString = 'Gestern';
			else if (isSameDay(date, tomorrow)) relativeDayString = 'Morgen';
			relativeDayString += `, ${deLocale.localize?.day(date.getDay() as Day, {
				width: 'short',
			})}`;
		} else {
			relativeDayString = deLocale.localize?.day(date.getDay() as Day);
		}
		relativeDayString += ` ${lightFormat(date, 'dd.MM.')}`;
		if (!isSameYear(date, today)) {
			relativeDayString += lightFormat(date, 'yyyy');
		}
		relativeDayString += ` ${lightFormat(date, 'HH:mm')}`;
		return relativeDayString;
	}, [touchedDate, date]);

	const [routingConfig, setRoutingConfig] = useExpertCookies(routingConfigKeys);

	const updateSetting = useCallback(
		<K extends keyof RoutingSettings>(key: K, value: RoutingSettings[K]) => {
			setRoutingConfig(key, value);
			setSettings((oldSettings) => ({
				...oldSettings,
				[key]: value,
			}));
		},
		[setRoutingConfig],
	);

	const updateVia = useCallback(
		(index: number, stopPlace?: MinimalStopPlace) => {
			setVia((oldVia) => {
				if (!stopPlace) {
					return oldVia.filter((_, i) => i !== index);
				}
				if (index < 0) {
					oldVia.push(stopPlace);
				} else {
					oldVia[index] = stopPlace;
				}

				return [...oldVia];
			});
		},
		[],
	);

	const swapStartDestination = useMemo(
		() => (e: SyntheticEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setDestination(start);
			setStart(destination);
		},
		[destination, start],
	);

	const setDateWithTouched = useCallback((date: Date | null) => {
		setTouchedDate(Boolean(date));
		setDate(date || new Date());
	}, []);

	const updateDepartureMode = useCallback((_e: any, value: string) => {
		if (value === 'ab' || value === 'an') {
			setDepartureMode(value);
		}
	}, []);

	return {
		start,
		setStart,
		destination,
		setDestination,
		date,
		setDate: setDateWithTouched,
		touchedDate,
		via,
		updateVia,
		setVia,
		swapStartDestination,
		settings,
		updateSetting,
		departureMode,
		updateDepartureMode,
		formattedDate,
	};
};

export const [
	InnerRoutingConfigProvider,
	useRoutingConfig,
	useRoutingSettings,
	useRoutingConfigActions,
] = constate(
	useRoutingConfigInternal,
	(v) => ({
		start: v.start,
		destination: v.destination,
		date: v.date,
		via: v.via,
		touchedDate: v.touchedDate,
		departureMode: v.departureMode,
		formattedDate: v.formattedDate,
	}),
	(v) => v.settings,
	(v) => ({
		setStart: v.setStart,
		setDestination: v.setDestination,
		setDate: v.setDate,
		updateVia: v.updateVia,
		setVia: v.setVia,
		swapStartDestination: v.swapStartDestination,
		updateSettings: v.updateSetting,
		updateDepartureMode: v.updateDepartureMode,
	}),
);

export const RoutingConfigProvider: FCC<{
	start?: MinimalStopPlace;
	destination?: MinimalStopPlace;
	date?: Date;
	via?: MinimalStopPlace[];
}> = ({ children, start, destination, date, via }) => {
	const [routingConfig] = useExpertCookies(routingConfigKeys);

	const savedRoutingSettings: RoutingSettings = {
		maxChanges: routingConfig.maxChanges?.toString() ?? '-1',
		transferTime: routingConfig.transferTime?.toString() ?? '0',
		onlyRegional: routingConfig.onlyRegional ?? false,
		onlyNetzcard: routingConfig.onlyNetzcard ?? false,
		onlyBC100: routingConfig.onlyBC100 ?? false,
		hafasProfileN: routingConfig.hafasProfileN ?? AllowedHafasProfile.BAHN,
	};

	return (
		<InnerRoutingConfigProvider
			initialSettings={savedRoutingSettings}
			initialStart={start}
			initialDestination={destination}
			initialDate={date}
			initialVia={via}
		>
			{children}
		</InnerRoutingConfigProvider>
	);
};
