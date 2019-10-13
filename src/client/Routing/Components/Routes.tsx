import { AppStore } from 'AppState';
import { getRoutes } from 'Routing/actions/routing';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { useRoutingSelector } from 'useSelector';
import React, { useEffect } from 'react';
import RouteList from './RouteList';
import Search from './Search';
import searchActions from 'Routing/actions/search';

const Routing = () => {
  const dispatch = useDispatch();
  const date = useRoutingSelector(state => state.search.date);
  const dateTouched = useRoutingSelector(state => state.search.dateTouched);
  const match = useRouteMatch<{
    start?: string;
    destination?: string;
  }>();

  useEffect(() => {
    if (match) {
      const { start, destination } = match.params;

      if (start && destination && date && dateTouched) {
        dispatch(getRoutes(start, destination, date));
      }
    }
  }, [date, dateTouched, dispatch, match]);

  return (
    <div>
      <Search />
      <div style={{ marginBottom: '1em' }} />
      <RouteList />
    </div>
  );
};

Routing.loadData = (store: AppStore) => {
  store.dispatch(searchActions.setDate(new Date(), false));
};

export default Routing;
