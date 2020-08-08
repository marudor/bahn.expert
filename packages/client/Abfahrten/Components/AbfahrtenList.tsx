import { Abfahrt } from './Abfahrt';
import { Loading } from 'client/Common/Components/Loading';
import { makeStyles } from '@material-ui/core';
import { Redirect } from 'react-router';
import {
  SelectedDetailProvider,
  useSelectedDetail,
} from 'client/Abfahrten/provider/SelectedDetailProvider';
import {
  useAbfahrten,
  useRefreshCurrent,
} from 'client/Abfahrten/provider/AbfahrtenProvider/hooks';
import {
  useAbfahrtenConfig,
  useAbfahrtenUrlPrefix,
} from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import {
  useAbfahrtenError,
  useCurrentAbfahrtenStation,
  useRawAbfahrten,
} from 'client/Abfahrten/provider/AbfahrtenProvider';
import { useEffect, useState } from 'react';
import { useHeaderTagsActions } from 'client/Common/provider/HeaderTagProvider';
import { useReihungenActions } from 'client/Common/provider/ReihungenProvider';
import { useRouteMatch } from 'react-router';

const useStyles = makeStyles((theme) => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
  },
  lookbehind: {
    position: 'relative',
    paddingTop: 10,
    backgroundColor: theme.colors.shadedBackground,
  },
  lookaheadMarker: {
    height: 154,
    position: 'absolute',
    bottom: 0,
  },
}));

const InnerAbfahrtenList = () => {
  const classes = useStyles();
  const {
    updateCurrentStationByString,
    setCurrentStation,
    setError,
  } = useRawAbfahrten();
  const currentStation = useCurrentAbfahrtenStation();
  const error = useAbfahrtenError();
  const selectedDetail = useSelectedDetail();
  const { clearReihungen } = useReihungenActions();
  const [scrolled, setScrolled] = useState(false);
  const { filteredAbfahrten, unfilteredAbfahrten } = useAbfahrten();
  const loading = !unfilteredAbfahrten && !error;
  const match = useRouteMatch<{ station: string }>();
  const paramStation = match ? match.params.station : undefined;
  const config = useAbfahrtenConfig();
  const urlPrefix = useAbfahrtenUrlPrefix();
  const refreshCurrentAbfahrten = useRefreshCurrent();
  const { updateTitle, updateDescription } = useHeaderTagsActions();

  useEffect(() => {
    if (!currentStation) {
      updateTitle();
      updateDescription();
    } else {
      updateTitle(currentStation.title);
      updateDescription(`Zugabfahrten für ${currentStation.title}`);
    }
  }, [currentStation, updateDescription, updateTitle]);

  useEffect(() => {
    return () => {
      setCurrentStation(undefined);
      setError(undefined);
    };
  }, [setCurrentStation, setError]);

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
      <main className={classes.wrap}>
        {error ? (
          <Redirect to={urlPrefix} />
        ) : filteredAbfahrten &&
          (filteredAbfahrten.lookahead.length ||
            filteredAbfahrten.lookbehind.length) ? (
          <>
            {Boolean(filteredAbfahrten.lookbehind.length) && (
              <div
                className={classes.lookbehind}
                id="lookbehind"
                data-testid="lookbehind"
              >
                {filteredAbfahrten.lookbehind.map((a) => (
                  <Abfahrt abfahrt={a} key={a.rawId} />
                ))}
                <div className={classes.lookaheadMarker} id="lookaheadMarker" />
              </div>
            )}
            <div id="lookahead" data-testid="lookahead">
              {filteredAbfahrten.lookahead.map((a) => (
                <Abfahrt abfahrt={a} key={a.rawId} />
              ))}
            </div>
          </>
        ) : (
          <div>Leider keine Abfahrten in nächster Zeit</div>
        )}
      </main>
    </Loading>
  );
};

export const AbfahrtenList = () => (
  <SelectedDetailProvider>
    <InnerAbfahrtenList />
  </SelectedDetailProvider>
);
