import { CommonConfigProvider } from 'client/Common/container/CommonConfigContainer';
import { HeaderTagContainer } from 'client/Common/container/HeaderTagContainer';
import { Loading } from 'client/Common/Components/Loading';
import { makeStyles } from '@material-ui/core';
import { Navigation } from 'client/Common/Components/Navigation';
import { ReihungContainer } from 'client/Common/container/ReihungContainer';
import { Route, Switch } from 'react-router-dom';
import { RoutingProvider } from 'client/Routing/container/RoutingContainer';
import { useEffect } from 'react';
import loadable from '@loadable/component';

const lazyOptions = {
  fallback: <Loading />,
};
const LazyRouting = loadable(() => import('./Routing'), lazyOptions);
const LazyDetails = loadable(
  () => import('./Common/Components/Details/DetailsRoute'),
  lazyOptions
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

export const App = () => {
  useStyles();
  useEffect(() => {
    const jssStyles = document.querySelector('#jss');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <HeaderTagContainer.Provider>
        <CommonConfigProvider>
          <Navigation>
            <ReihungContainer.Provider>
              <RoutingProvider>
                <Switch>
                  <Route path="/about" component={About} exact />
                  <Route path="/map" component={LazyMap} exact />
                  <Route
                    component={LazyDetails}
                    path="/details/:train/:initialDeparture*"
                  />
                  <Route component={LazyRouting} path="/routing" />
                  <Route component={LazyRegional} path="/regional" />
                  <Route component={LazyAbfahrten} path="/" />
                </Switch>
              </RoutingProvider>
            </ReihungContainer.Provider>
          </Navigation>
        </CommonConfigProvider>
      </HeaderTagContainer.Provider>
    </>
  );
};
