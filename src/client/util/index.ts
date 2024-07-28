export * from './minMax';
export * from './configSanitize';

export const uniqBy = <T>(array: T[], identifier: keyof T): T[] => {
	const seen: unknown[] = [];
	return array.filter((item) => {
		if (!seen.includes(item[identifier])) {
			seen.push(item[identifier]);
			return true;
		}
		return false;
	});
};

export const partition = <T>(array: T[], partitionSize: number): T[][] => {
	const arrayCopy = [...array];
	const partitions: T[][] = [];
	while (arrayCopy.length > partitionSize) {
		partitions.push(arrayCopy.splice(0, partitionSize));
	}
	partitions.push(arrayCopy);
	return partitions;
};
