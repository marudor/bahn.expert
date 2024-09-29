const heavyMetalTypes = [
	'HIGH_SPEED_TRAIN',
	'INTERCITY_TRAIN',
	'INTER_REGIONAL_TRAIN',
	'REGIONAL_TRAIN',
	'CITY_TRAIN',
];
export function isHeavyMetal(transportType: string) {
	return heavyMetalTypes.includes(transportType);
}
