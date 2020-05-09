import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter, StaticRouterContext } from 'react-router';
import { StorageContext } from 'shared/hooks/useStorage';
import { ThemeProvider } from 'client/Common/container/ThemeContainer';
import StorageInterface from 'shared/hooks/useStorage/StorageInterface';
import ThemeWrap from 'client/ThemeWrap';

interface Props {
  helmetContext: any;
  url: string;
  routeContext: StaticRouterContext;
  storage: StorageInterface;
  sheetsRegistry: any;
}
export default function ServerBaseComponent({
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
