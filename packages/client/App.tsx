import { CommonConfigProvider } from 'client/Common/provider/CommonConfigProvider';
import { HeaderTagProvider } from 'client/Common/provider/HeaderTagProvider';
import { Loading } from 'client/Common/Components/Loading';
import { makeStyles } from '@material-ui/core';
import { Navigation } from 'client/Common/Components/Navigation';
import { ReihungenProvider } from 'client/Common/provider/ReihungenProvider';
import { Route, Routes } from 'react-router-dom';
import { RoutingProvider } from 'client/Routing/provider/RoutingProvider';
import loadable from '@loadable/component';
import React, { useEffect } from 'react';
import type { FC } from 'react';

const lazyOptions = {
  fallback: <Loading />,
};
const LazyRouting = loadable(() => import('./Routing'), lazyOptions);
const LazyDetails = loadable(
  () => import('./Common/Components/Details/DetailsRoute'),
  lazyOptions,
);
const LazyAbfahrten = loadable(() => import('./Abfahrten'), lazyOptions);
const LazyMap = loadable(() => import('./Map'), lazyOptions);
const LazyRegional = loadable(() => import('./Regional'), lazyOptions);
const About = loadable(() => import('./Common/Components/About'), lazyOptions);

const useStyles = makeStyles((theme) => ({
  '@global': {
    'html, body': {
      height: '100%',
    },
    '#app': {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    body: {
      margin: 0,
      fontFamily: 'Roboto, sans-serif',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
    a: {
      textDecoration: 'none',
      color: theme.colors.blue,
    },
    main: {
      marginTop: theme.shape.headerSpacing,
    },
  },
}));

export const App: FC = () => {
  useStyles();
  useEffect(() => {
    const jssStyles = document.querySelector('#jss');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <HeaderTagProvider>
        <CommonConfigProvider>
          <Navigation>
            <ReihungenProvider>
              <RoutingProvider>
                <Routes>
                  <Route path="/about" element={<About />} />
                  <Route path="/map" element={<LazyMap />} />
                  {/* If you change this route also change hafasDetailsRedirect.ts */}
                  <Route
                    path="/details/:train/:initialDeparture/*"
                    element={<LazyDetails />}
                  />
                  <Route path="/details/:train" element={<LazyDetails />} />
                  <Route path="/routing/*" element={<LazyRouting />} />
                  <Route path="/regional/*" element={<LazyRegional />} />
                  <Route path="/*" element={<LazyAbfahrten />} />
                </Routes>
              </RoutingProvider>
            </ReihungenProvider>
          </Navigation>
        </CommonConfigProvider>
      </HeaderTagProvider>
    </>
  );
};
