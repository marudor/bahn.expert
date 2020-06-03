import { CommonConfigProvider } from 'client/Common/container/CommonConfigContainer';
import { Route, Switch } from 'react-router-dom';
import { RoutingProvider } from 'client/Routing/container/RoutingContainer';
import { useEffect } from 'react';
import HeaderTagContainer from 'client/Common/container/HeaderTagContainer';
import loadable from 'client/loadable';
import Navigation from 'client/Common/Components/Navigation';
import ReihungenContainer from 'client/Common/container/ReihungContainer';
import useStyles from './App.style';

const LazyRouting = loadable(() => import('./Routing'));
const LazyDetails = loadable(() =>
  import('./Common/Components/Details/DetailsRoute')
);
const LazyAbfahrten = loadable(() => import('./Abfahrten'));
const LazyMap = loadable(() => import('./Map'));
const LazyRegional = loadable(() => import('./Regional'));
const About = loadable(() => import('./Common/Components/About'));

const App = () => {
  useStyles();
  useEffect(() => {
    const jssStyles = document.querySelector('#jss');

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
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
  );
};

export default App;
