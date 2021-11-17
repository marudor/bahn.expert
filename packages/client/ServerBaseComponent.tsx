import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import { StorageContext } from 'client/useStorage';
import { ThemeProvider } from 'client/Common/provider/ThemeProvider';
import { ThemeWrap } from 'client/ThemeWrap';
import type { ReactElement } from 'react';
import type { StorageInterface } from 'client/Common/Storage';

interface Props {
  helmetContext: any;
  url: string;
  storage: StorageInterface;
  sheetsRegistry: any;
}
export function ServerBaseComponent({
  helmetContext,
  url,
  storage,
  sheetsRegistry,
}: Props): ReactElement {
  return (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <StorageContext.Provider value={storage}>
          <ThemeProvider>
            <ThemeWrap sheetsRegistry={sheetsRegistry} />
          </ThemeProvider>
        </StorageContext.Provider>
      </StaticRouter>
    </HelmetProvider>
  );
}
