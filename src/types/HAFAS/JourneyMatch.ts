import type { RouteStop } from '@/types/routing';
import type { CommonProductInfo } from '.';

export interface ParsedJourneyMatchResponse {
	train: CommonProductInfo;
	stops: RouteStop[];
	jid: string;
	firstStop: RouteStop;
	lastStop: RouteStop;
}
