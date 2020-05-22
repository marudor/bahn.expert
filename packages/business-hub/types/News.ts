export interface NewsResponse {
  count: number;
  offset: number;
  limit: number;
  news: News[];
}

export interface News {
  published: boolean;
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  startTimestamp: string;
  endTimestamp: string;
  optionalData?: OptionalData;
  image: string;
  version: number;
  updatedAt: string;
  createdAt: string;
  group: Group;
  sections: Section[];
}

export interface OptionalData {
  link: string;
}

export interface Group {
  id: number;
  title: string;
  optionalData?: OptionalData;
}

export interface Section {
  id: string;
  title: string;
  optionalData?: {
    ds100: string;
    lat: string;
    lon: string;
    evaNumber: string;
  };
}
