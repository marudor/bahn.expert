import { useLocation } from 'react-router';
import qs from 'qs';

export const useQuery = (): qs.ParsedQs => {
  const location = useLocation();

  return qs.parse(location.search, { ignoreQueryPrefix: true });
};
