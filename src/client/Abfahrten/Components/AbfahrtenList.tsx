import { AppStore } from 'AppState';
import { match } from 'react-router';
import { Redirect } from 'react-router';
import { useAbfahrtenSelector } from 'useSelector';
import { useDispatch } from 'react-redux';
import { useRouter } from 'useRouter';
import Abfahrt from './Abfahrt';
import Actions, {
  getAbfahrtenByString,
  refreshCurrentAbfahrten,
} from 'Abfahrten/actions/abfahrten';
import Loading from 'Common/Components/Loading';
import React, { useEffect, useState } from 'react';
import ReihungContainer from 'Common/container/ReihungContainer';
import SelectedDetailContainer, {
  SelectedDetailProvider,
} from 'Abfahrten/container/SelectedDetailContainer';
import useAbfahrten from 'Abfahrten/hooks/useAbfahrten';
import useStyles from './AbfahrtenList.style';

const AbfahrtenList = () => {
  const classes = useStyles();
  const { selectedDetail } = SelectedDetailContainer.useContainer();
  const { clearReihungen } = ReihungContainer.useContainer();
  const [scrolled, setScrolled] = useState(false);
  const { filteredAbfahrten, unfilteredAbfahrten } = useAbfahrten();
  const [loading, setLoading] = useState(!unfilteredAbfahrten);
  const error = useAbfahrtenSelector(state => state.abfahrten.error);
  const { match, location } = useRouter<{ station: string }>();
  const currentStation = useAbfahrtenSelector(
    state => state.abfahrten.currentStation
  );
  const dispatch = useDispatch<any>();
  const autoUpdate = useAbfahrtenSelector(
    state => state.abfahrtenConfig.config.autoUpdate
  );

  useEffect(() => {
    if (unfilteredAbfahrten) {
      setScrolled(false);
    }
  }, [unfilteredAbfahrten]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const cleanup = () => {
      clearInterval(intervalId);
    };

    if (autoUpdate) {
      intervalId = setInterval(() => {
        dispatch(refreshCurrentAbfahrten());
        clearReihungen();
      }, autoUpdate * 1000);
    } else {
      cleanup();
    }

    return cleanup;
  }, [autoUpdate, clearReihungen, dispatch]);

  const [oldMatch, setOldMatch] = useState(match.params.station);

  useEffect(() => {
    if (!currentStation || oldMatch !== match.params.station) {
      setOldMatch(match.params.station);
      setLoading(true);
      dispatch(
        Actions.setCurrentStation({
          title: decodeURIComponent(match.params.station || ''),
          id: '0',
        })
      );
      dispatch(
        getAbfahrtenByString(
          match.params.station,
          location.state && location.state.searchType
        )
      ).finally(() => {
        setLoading(false);
        setScrolled(false);
      });
    }
  }, [
    currentStation,
    dispatch,
    location.state,
    match.params.station,
    oldMatch,
  ]);

  useEffect(() => {
    if (scrolled) {
      return;
    }
    if (unfilteredAbfahrten) {
      let scrollDom: HTMLElement | null = null;

      if (selectedDetail) {
        scrollDom = document.getElementById(`${selectedDetail}Scroll`);
      }
      if (!scrollDom && unfilteredAbfahrten.lookbehind.length) {
        scrollDom = document.getElementById('lookaheadMarker');
      }
      if (scrollDom) {
        const scrollIntoView = () =>
          setTimeout(() => scrollDom && scrollDom.scrollIntoView());

        if (document.readyState === 'complete') {
          scrollIntoView();
        } else {
          window.addEventListener('load', scrollIntoView);
        }
      }
      setScrolled(true);
    }
  }, [unfilteredAbfahrten, scrolled, selectedDetail]);

  return (
    <Loading isLoading={loading}>
      <main className={classes.main}>
        {error && !loading ? (
          <Redirect to="/" />
        ) : filteredAbfahrten &&
          (filteredAbfahrten.lookahead.length ||
            filteredAbfahrten.lookbehind.length) ? (
          <>
            {Boolean(filteredAbfahrten.lookbehind.length) && (
              <div
                id="lookbehind"
                className={classes.lookbehind}
                data-testid="lookbehind"
              >
                {filteredAbfahrten.lookbehind.map(
                  a => a && <Abfahrt abfahrt={a} key={a.rawId} />
                )}
                <div className={classes.lookaheadMarker} id="lookaheadMarker" />
              </div>
            )}
            <div
              id="lookahead"
              className={classes.lookahead}
              data-testid="lookahead"
            >
              {filteredAbfahrten.lookahead.map(
                a => a && <Abfahrt abfahrt={a} key={a.rawId} />
              )}
            </div>
          </>
        ) : (
          <div>Leider keine Abfahrten in nächster Zeit</div>
        )}
      </main>
    </Loading>
  );
};

const AbfahrtenListWrap = () => (
  <SelectedDetailProvider>
    <AbfahrtenList />
  </SelectedDetailProvider>
);

// @ts-ignore
AbfahrtenListWrap.loadData = (
  store: AppStore,
  match: match<{ station: string }>
) => {
  store.dispatch(
    Actions.setCurrentStation({
      title: decodeURIComponent(match.params.station || ''),
      id: '0',
    })
  );

  return store.dispatch(getAbfahrtenByString(match.params.station));
};

export default AbfahrtenListWrap;
