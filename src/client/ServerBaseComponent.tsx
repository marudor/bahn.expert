import type { StorageInterface } from '@/client/Common/Storage';
import { ThemeWrap } from '@/client/ThemeWrap';
import { ThemeProvider } from '@/client/Themes/Provider';
import type { EmotionCache, PropsOf } from '@emotion/react';
import type { ReactElement } from 'react';
import { CookiesProvider } from 'react-cookie';
import { HeadProvider } from 'react-head';
import { StaticRouter } from 'react-router';

interface Props {
	headTags: PropsOf<typeof HeadProvider>['headTags'];
	url: string;
	storage: StorageInterface;
	emotionCache: EmotionCache;
}
export function ServerBaseComponent({
	headTags,
	url,
	storage,
	emotionCache,
}: Props): ReactElement {
	return (
		<ThemeProvider>
			<HeadProvider headTags={headTags}>
				<StaticRouter location={url}>
					<CookiesProvider cookies={storage}>
						<ThemeWrap emotionCache={emotionCache} />
					</CookiesProvider>
				</StaticRouter>
			</HeadProvider>
		</ThemeProvider>
	);
}
