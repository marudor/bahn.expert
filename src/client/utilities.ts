const heavyMetalTypes = [
	'HIGH_SPEED_TRAIN',
	'INTERCITY_TRAIN',
	'INTER_REGIONAL_TRAIN',
	'REGIONAL_TRAIN',
	'CITY_TRAIN',
];
export function isHeavyMetal(transportType?: string) {
	if (!transportType) {
		return false;
	}
	return heavyMetalTypes.includes(transportType);
}
