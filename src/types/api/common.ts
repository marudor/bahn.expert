import { RemL } from './hafas';
export interface CommonProductInfo {
  name: string;
  line?: string;
  number?: string;
  type?: string;
}
export interface CommonStopInfo {
  scheduledPlatform?: string;
  platform?: string;
  scheduledTime: number;
  time: number;
  delay?: number;
  reihung?: boolean;
  messages?: RemL[];
  cancelled?: boolean;
}
/**
 */
