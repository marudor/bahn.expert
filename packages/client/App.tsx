import { CommonConfigProvider } from 'client/Common/container/CommonConfigContainer';
import { Route, Switch } from 'react-router-dom';
import { RoutingProvider } from 'client/Routing/container/RoutingContainer';
import { useEffect } from 'react';
import GlobalStyles from 'client/GlobalStyles';
import HeaderTagContainer from 'client/Common/container/HeaderTagContainer';
import loadable from '@loadable/component';
import Loading from 'client/Common/Components/Loading';
import Navigation from 'client/Common/Components/Navigation';
import ReihungenContainer from 'client/Common/container/ReihungContainer';

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

const App = () => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <GlobalStyles />
      <HeaderTagContainer.Provider>
        <CommonConfigProvider>
          <Navigation>
            <ReihungenContainer.Provider>
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
            </ReihungenContainer.Provider>
          </Navigation>
        </CommonConfigProvider>
      </HeaderTagContainer.Provider>
    </>
  );
};

export default App;
