import { HeadProvider } from 'react-head';
import { StaticRouter } from 'react-router-dom/server';
import { StorageContext } from '@/client/useStorage';
import { ThemeProvider } from '@/client/Common/provider/ThemeProvider';
import { ThemeWrap } from '@/client/ThemeWrap';
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
    <HeadProvider headTags={headTags}>
      <StaticRouter location={url}>
        <StorageContext.Provider value={storage}>
          <ThemeProvider>
            <ThemeWrap emotionCache={emotionCache} />
          </ThemeProvider>
        </StorageContext.Provider>
      </StaticRouter>
    </HeadProvider>
  );
}
