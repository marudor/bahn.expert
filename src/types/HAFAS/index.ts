export interface CommonProductInfo {
	name: string;
	line?: string;
	number?: string;
	/**
	 * This is actually category
	 */
	type?: string;
	operator?: string;
	admin?: string;
	// was TRANSPORT_TYPE ENUM before
	transportType: string;
}
export interface CommonStopInfo {
	/**
	 * Quelle dieser info ist die Planwagenreihung
	 */
	isPlan?: boolean;
	/**
	 * Scheduled Platform
	 */
	scheduledPlatform?: string;
	/**
	 * Best known platform, might be identical to scheduledPlatform
	 */
	platform?: string;
	/**
	 * scheduled time for this stop
	 */
	scheduledTime: Date;
	/**
	 * best known time for this stop, might be identical to scheduledTime
	 */
	time: Date;
	/**
	 * @isInt
	 */
	delay?: number;
	cancelled?: boolean;
	additional?: boolean;
	noPassengerChange?: boolean;
	/**
	 * Arrival/Departure ID
	 */
	id?: string;
	/** REPORTED Time */
	isRealTime?: boolean;
}
