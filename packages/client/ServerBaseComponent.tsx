import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter, StaticRouterContext } from 'react-router';
import { StorageContext } from 'shared/hooks/useStorage';
import { StorageInterface } from 'shared/hooks/useStorage/StorageInterface';
import { ThemeProvider } from 'client/Common/provider/ThemeProvider';
import { ThemeWrap } from 'client/ThemeWrap';
import { WebConfigMap } from 'client/useWebStorage';

interface Props {
  helmetContext: any;
  url: string;
  routeContext: StaticRouterContext;
  storage: StorageInterface<WebConfigMap>;
  sheetsRegistry: any;
}
export function ServerBaseComponent({
  helmetContext,
  url,
  routeContext,
  storage,
  sheetsRegistry,
}: Props) {
  return (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url} context={routeContext}>
        <StorageContext.Provider value={storage}>
          <ThemeProvider>
            <ThemeWrap sheetsRegistry={sheetsRegistry} />
          </ThemeProvider>
        </StorageContext.Provider>
      </StaticRouter>
    </HelmetProvider>
  );
}
