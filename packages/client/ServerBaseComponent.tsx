import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import { StorageContext } from 'client/useStorage';
import { ThemeProvider } from 'client/Common/provider/ThemeProvider';
import { ThemeWrap } from 'client/ThemeWrap';
import React from 'react';
import type { EmotionCache } from '@emotion/react';
import type { ReactElement } from 'react';
import type { StorageInterface } from 'client/Common/Storage';

interface Props {
  helmetContext: any;
  url: string;
  storage: StorageInterface;
  emotionCache: EmotionCache;
}
export function ServerBaseComponent({
  helmetContext,
  url,
  storage,
  emotionCache,
}: Props): ReactElement {
  return (
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <StorageContext.Provider value={storage}>
            <ThemeProvider>
              <ThemeWrap emotionCache={emotionCache} />
            </ThemeProvider>
          </StorageContext.Provider>
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
}
