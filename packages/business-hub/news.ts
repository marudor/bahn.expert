import { axios } from 'business-hub';
import { NewsResponse } from 'business-hub/types/News';

interface NewsOptions {
  offset?: number;
  limit?: number;
  groupIds?: number[];
  published?: boolean;
  sectionIds?: string[];
}
export async function news(options: NewsOptions = {}): Promise<NewsResponse> {
  const r = (
    await axios.get('/news-api/v1/news/', {
      params: options,
      headers: {
        key: process.env.BUSINESS_HUB_NEWS_KEY,
      },
    })
  ).data;

  return r;
}
