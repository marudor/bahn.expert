import { Abfahrt } from './Abfahrt';
import { Loading } from 'client/Common/Components/Loading';
import { makeStyles } from '@material-ui/core';
import { Navigate, useParams } from 'react-router';
import {
  SelectedDetailProvider,
  useSelectedDetail,
} from 'client/Abfahrten/provider/SelectedDetailProvider';
import { Streik } from 'client/Common/Components/Streik';
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
  useCurrentAbfahrtenStopPlace,
  useRawAbfahrten,
} from 'client/Abfahrten/provider/AbfahrtenProvider';
import { useEffect, useState } from 'react';
import { useHeaderTagsActions } from 'client/Common/provider/HeaderTagProvider';
import { useSequencesActions } from 'client/Common/provider/ReihungenProvider';
import type { FC } from 'react';

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
  const { updateCurrentStopPlaceByString, setCurrentStopPlace, setError } =
    useRawAbfahrten();
  const currentStopPlace = useCurrentAbfahrtenStopPlace();
  const error = useAbfahrtenError();
  const selectedDetail = useSelectedDetail();
  const { clearSequences } = useSequencesActions();
  const [scrolled, setScrolled] = useState(false);
  const { filteredAbfahrten, unfilteredAbfahrten } = useAbfahrten();
  const loading = !unfilteredAbfahrten && !error;
  const paramStation = useParams().station;
  const config = useAbfahrtenConfig();
  const urlPrefix = useAbfahrtenUrlPrefix();
  const refreshCurrentAbfahrten = useRefreshCurrent();
  const { updateTitle, updateDescription } = useHeaderTagsActions();

  useEffect(() => {
    if (!currentStopPlace) {
      updateTitle();
      updateDescription();
    } else {
      updateTitle(currentStopPlace.name);
      updateDescription(`Zugabfahrten für ${currentStopPlace.name}`);
    }
  }, [currentStopPlace, updateDescription, updateTitle]);

  useEffect(() => {
    return () => {
      setCurrentStopPlace(undefined);
      setError(undefined);
    };
  }, [setCurrentStopPlace, setError]);

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
        void refreshCurrentAbfahrten();
        clearSequences();
      }, config.autoUpdate * 1000);
    } else {
      cleanup();
    }

    return cleanup;
  }, [clearSequences, config.autoUpdate, refreshCurrentAbfahrten]);

  const [oldMatch, setOldMatch] = useState(paramStation);

  useEffect(() => {
    if (!currentStopPlace || oldMatch !== paramStation) {
      setOldMatch(paramStation);
      void updateCurrentStopPlaceByString(
        decodeURIComponent(paramStation || ''),
      );
    }
  }, [
    currentStopPlace,
    oldMatch,
    paramStation,
    updateCurrentStopPlaceByString,
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
      <main className={classes.wrap}>
        {error ? (
          <Navigate to={urlPrefix} />
        ) : filteredAbfahrten &&
          (filteredAbfahrten.departures.length ||
            filteredAbfahrten.lookbehind.length) ? (
          <>
            {unfilteredAbfahrten?.strike && <Streik />}
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
              {filteredAbfahrten.departures.map((a) => (
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

export const AbfahrtenList: FC = () => (
  <SelectedDetailProvider>
    <InnerAbfahrtenList />
  </SelectedDetailProvider>
);
