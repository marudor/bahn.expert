import { Redirect } from 'react-router';
import { useRouteMatch } from 'react-router';
import Abfahrt from './Abfahrt';
import AbfahrtenConfigContainer from 'Abfahrten/container/AbfahrtenConfigContainer';
import AbfahrtenContainer from 'Abfahrten/container/AbfahrtenContainer';
import Loading from 'Common/Components/Loading';
import React, { useEffect, useState } from 'react';
import ReihungContainer from 'Common/container/ReihungContainer';
import SelectedDetailContainer, {
  SelectedDetailProvider,
} from 'Abfahrten/container/SelectedDetailContainer';
import useAbfahrten from 'Abfahrten/container/AbfahrtenContainer/useAbfahrten';
import useRefreshCurrent from 'Abfahrten/container/AbfahrtenContainer/useRefreshCurrent';
import useStyles from './AbfahrtenList.style';

const AbfahrtenList = () => {
  const classes = useStyles();
  const {
    updateCurrentStationByString,
    currentStation,
    error,
  } = AbfahrtenContainer.useContainer();
  const { selectedDetail } = SelectedDetailContainer.useContainer();
  const { clearReihungen } = ReihungContainer.useContainer();
  const [scrolled, setScrolled] = useState(false);
  const { filteredAbfahrten, unfilteredAbfahrten } = useAbfahrten();
  const loading = !unfilteredAbfahrten && !error;
  const match = useRouteMatch<{ station: string }>();
  const paramStation = match ? match.params.station : undefined;
  const config = AbfahrtenConfigContainer.useContainer().config;
  const refreshCurrentAbfahrten = useRefreshCurrent();

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
        refreshCurrentAbfahrten();
        clearReihungen();
      }, config.autoUpdate * 1000);
    } else {
      cleanup();
    }

    return cleanup;
  }, [clearReihungen, config.autoUpdate, refreshCurrentAbfahrten]);

  const [oldMatch, setOldMatch] = useState(paramStation);

  useEffect(() => {
    if (!currentStation || oldMatch !== paramStation) {
      setOldMatch(paramStation);
      updateCurrentStationByString(decodeURIComponent(paramStation || ''));
    }
  }, [currentStation, oldMatch, paramStation, updateCurrentStationByString]);

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
        {error ? (
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
