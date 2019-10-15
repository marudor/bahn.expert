import { Redirect } from 'react-router';
import { useAbfahrtenSelector } from 'useSelector';
import { useDispatch } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router';
import Abfahrt from './Abfahrt';
import AbfahrtenConfigContainer from 'Abfahrten/container/AbfahrtenConfigContainer';
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
  const match = useRouteMatch<{ station: string }>();
  const paramStation = match ? match.params.station : undefined;
  const location = useLocation();
  const currentStation = useAbfahrtenSelector(
    state => state.abfahrten.currentStation
  );
  const dispatch = useDispatch<any>();
  const config = AbfahrtenConfigContainer.useContainer().config;

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

    if (config.autoUpdate) {
      intervalId = setInterval(() => {
        dispatch(refreshCurrentAbfahrten(config));
        clearReihungen();
      }, config.autoUpdate * 1000);
    } else {
      cleanup();
    }

    return cleanup;
  }, [clearReihungen, config, dispatch]);

  const [oldMatch, setOldMatch] = useState(paramStation);

  useEffect(() => {
    if (!currentStation || oldMatch !== paramStation) {
      setOldMatch(paramStation);
      setLoading(true);
      dispatch(
        Actions.setCurrentStation({
          title: decodeURIComponent(paramStation || ''),
          id: '0',
        })
      );
      dispatch(
        getAbfahrtenByString(
          config,
          paramStation,
          location.state && location.state.searchType
        )
      ).finally(() => {
        setLoading(false);
        setScrolled(false);
      });
    }
  }, [
    config,
    currentStation,
    dispatch,
    location.state,
    oldMatch,
    paramStation,
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

export default AbfahrtenListWrap;
