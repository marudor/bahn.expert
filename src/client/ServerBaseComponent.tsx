import { HeadProvider } from 'react-head';
import { StaticRouter } from 'react-router-dom/server';
import { StorageContext } from '@/client/useStorage';
import { ThemeProvider } from '@/client/Themes/Provider';
import { ThemeWrap } from '@/client/ThemeWrap';
// eslint-disable-next-line no-restricted-imports
import type { EmotionCache } from '@emotion/react';
import type { ReactElement } from 'react';
import type { StorageInterface } from '@/client/Common/Storage';

interface Props {
  headTags: any[];
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
          <StorageContext.Provider value={storage}>
            <ThemeWrap emotionCache={emotionCache} />
          </StorageContext.Provider>
        </StaticRouter>
      </HeadProvider>
    </ThemeProvider>
  );
}
