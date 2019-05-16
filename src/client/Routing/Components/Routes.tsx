import { AppStore, RoutingState } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
import { getRoutes } from 'Routing/actions/routing';
import { useRouter } from 'useRouter';
import React, { useEffect } from 'react';
import RouteList from './RouteList';
import Search from './Search';
import searchActions from 'Routing/actions/search';

type DispatchProps = ResolveThunks<{
  getRoutes: typeof getRoutes;
}>;
type StateProps = {
  date: Date;
  dateTouched?: boolean;
};
type Props = DispatchProps & StateProps;

const Routing = ({ getRoutes, date, dateTouched }: Props) => {
  const { match } = useRouter<{
    start?: string;
    destination?: string;
  }>();

  useEffect(() => {
    const { start, destination } = match.params;

    if (start && destination && date && dateTouched) {
      getRoutes(start, destination, date);
    }
  }, [date, dateTouched, getRoutes, match.params]);

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

export default connect<StateProps, DispatchProps, {}, RoutingState>(
  state => ({
    date: state.search.date,
    dateTouched: state.search.dateTouched,
  }),
  {
    getRoutes,
  }
)(Routing);
