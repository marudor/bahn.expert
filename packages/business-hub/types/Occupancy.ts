export interface OccupancyItem {
  period: OccupancyPeriod;
  currentCountMax: number;
  averageCountMax: number;
  occupancyTimeSlot: OccupancyTimeSlot[];
}

export interface OccupancyPeriod {
  // ISO String
  start: string;
  // ISO String
  end: string;
}

export interface OccupancyTimeSlot {
  period: OccupancyPeriod;
  currentCount: number;
  averageCount: number;
  currentPercentage: number;
  level: OccupancyLevel;
}

export interface OccupancyLevelDescription {
  language: string;
  text: string;
}

export interface OccupancyLevel {
  value: number;
  description: OccupancyLevelDescription[];
}

export interface OccupancyResponse {
  items: OccupancyItem[];
}
