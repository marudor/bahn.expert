import type { WebConfigMap } from '@/client/Common/Storage';
import { useCookies } from 'react-cookie';
import type { CookieGetOptions } from 'universal-cookie';

export const useExpertCookies = <T extends keyof WebConfigMap>(
	deps: T[],
	options?: CookieGetOptions,
) =>
	useCookies<
		T,
		{
			[K in T]?: WebConfigMap[K];
		}
	>(deps, options);
