export * from './minMax';
export * from './configSanitize';

export function uniqBy<T>(array: undefined, identifier: keyof T): undefined;
export function uniqBy<T>(array: T[], identifier: keyof T): T[];
export function uniqBy<T>(
	array: T[] | undefined,
	identifier: keyof T,
): T[] | undefined {
	if (!array) {
		return undefined;
	}
	const seen: unknown[] = [];
	return array.filter((item) => {
		if (!seen.includes(item[identifier])) {
			seen.push(item[identifier]);
			return true;
		}
		return false;
	});
}

export const partition = <T>(array: T[], partitionSize: number): T[][] => {
	const arrayCopy = [...array];
	const partitions: T[][] = [];
	while (arrayCopy.length > partitionSize) {
		partitions.push(arrayCopy.splice(0, partitionSize));
	}
	partitions.push(arrayCopy);
	return partitions;
};
