export const getAreaStyle = (properties: { type: string }) => {
	const type = properties.type;
	switch (type) {
		case 'WALL':
		case 'TECHNICS': {
			return {
				lineWidth: 10,
				strokeStyle: '#3C414B',
				fillStyle: '#3C414B',
			};
		}
		case 'WINDOW':
		case 'EXIT_DOOR': {
			return {
				lineWidth: 2,
				strokeStyle: 'gray',
				fillStyle: 'white',
			};
		}
		case 'TRANSIT': {
			return {
				lineWidth: 4,
				fillStyle: '#f8f9fa',
				strokeStyle: '#AFB4BB',
			};
		}
		case 'EXIT_STAIRS':
		case 'RAMP': {
			return {
				strokeStyle: undefined,
				fillStyle: undefined,
			};
		}
		case 'STRUCTURE': {
			return {
				strokeStyle: undefined,
				fillStyle: 'white',
			};
		}
		case 'STAIRS': {
			return {
				strokeStyle: '#AFB4BB',
				fillStyle: '#AFB4BB',
			};
		}
		case 'PRAM':
		case 'BIKE':
		case 'WHEELCHAIR':
		case 'BAGGAGE': {
			return {
				strokeStyle: undefined,
				fillStyle: '#AFB4BB',
			};
		}
		case 'FOLDING_SEAT':
		case 'SEAT': {
			return {
				lineWidth: 4,
				fillStyle: undefined,
			};
		}
		case 'STANCE':
		case 'FLOOR': {
			return {
				lineWidth: 1,
				strokeStyle: undefined,
				fillStyle: undefined,
			};
		}
		default: {
			return {
				lineWidth: 1,
				strokeStyle: 'yellow',
				fillStyle: 'yellow',
			};
		}
	}
};

export const getInteriorStyle = (properties: { interiorType: string }) => {
	const type = properties.interiorType;
	if (type.includes('TABLE') || type === 'COUNTER' || type === 'SHELF') {
		return {
			strokeStyle: undefined,
			fillStyle: '#9C9A8E',
		};
	}
	switch (type) {
		case 'BAGGAGE_RACK': {
			return {
				strokeStyle: undefined,
				fillStyle: undefined,
			};
		}
		case 'STORAGE':
		case 'WORKSPACE': {
			return {
				strokeStyle: undefined,
				fillStyle: '#878C96',
			};
		}
		case 'RACK':
		case 'FOLDING_SEAT':
		case 'CORNER_SEAT':
		case 'STANCE':
		case 'WC':
		case 'WASH_BASIN': {
			return {
				strokeStyle: undefined,
				fillStyle: '#AFB4BB',
			};
		}
		default: {
			return {
				lineWidth: 1,
				strokeStyle: 'yellow',
				fillStyle: undefined,
			};
		}
	}
};

export const getZoneStyle = (properties: { space: string }) => {
	const space = properties.space;
	switch (space) {
		case 'COMPARTMENT':
		case 'OFFICE':
		case 'TOILET': {
			return {
				lineWidth: 4,
				strokeStyle: '#3C414B',
				fillStyle: '#D7DCE1',
			};
		}
		case 'ENTRANCE_AREA':
		case 'UNDEFINED':
		case 'BISTRO':
		case 'KITCHEN':
		case 'RESTAURANT': {
			return {
				strokeStyle: undefined,
				fillStyle: undefined,
			};
		}
		case 'SALOON': {
			return {
				strokeStyle: undefined,
				fillStyle: '#f8f9fa',
			};
		}
		default: {
			return {
				strokeStyle: undefined,
				fillStyle: undefined,
			};
		}
	}
};
