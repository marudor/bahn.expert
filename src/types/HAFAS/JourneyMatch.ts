import type { RouteStop } from '@/types/routing';
import type { ParsedProduct } from '.';

export interface ParsedJourneyMatchResponse {
	train: ParsedProduct;
	stops: RouteStop[];
	jid: string;
	firstStop: RouteStop;
	lastStop: RouteStop;
}
