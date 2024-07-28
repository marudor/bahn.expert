import qs from 'qs';
import { useLocation } from 'react-router';

export const useQuery = (): qs.ParsedQs => {
	const location = useLocation();

	return qs.parse(location.search, { ignoreQueryPrefix: true });
};
