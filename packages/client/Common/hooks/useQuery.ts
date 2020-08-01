import { useLocation } from 'react-router';
import qs from 'qs';

export const useQuery = () => {
  const location = useLocation();

  return qs.parse(location.search, { ignoreQueryPrefix: true });
};
