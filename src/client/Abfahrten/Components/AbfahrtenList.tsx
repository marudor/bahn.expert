import { Abfahrt } from './Abfahrt';
import { Loading } from '@/client/Common/Components/Loading';
import { Navigate, useParams } from 'react-router';
import {
  SelectedDetailProvider,
  useSelectedDetail,
} from '@/client/Abfahrten/provider/SelectedDetailProvider';
import { Streik } from '@/client/Common/Components/Streik';
import {
  useAbfahrten,
  useRefreshCurrent,
} from '@/client/Abfahrten/provider/AbfahrtenProvider/hooks';
import {
  useAbfahrtenError,
  useCurrentAbfahrtenStopPlace,
  useRawAbfahrten,
} from '@/client/Abfahrten/provider/AbfahrtenProvider';
import { useAbfahrtenUrlPrefix } from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import { useEffect, useState } from 'react';
import { useHeaderTagsActions } from '@/client/Common/provider/HeaderTagProvider';
import { useSequencesActions } from '@/client/Common/provider/CoachSequenceProvider';
import styled from '@emotion/styled';
import type { AbfahrtenResult } from '@/types/iris';
import type { FC } from 'react';

const LookaheadMarker = styled.div`
  height: 154px;
  position: absolute;
  bottom: 0;
`;

const Lookbehind = styled.div(({ theme }) => ({
  position: 'relative',
  paddingTop: 10,
  backgroundColor: theme.colors.shadedBackground,
}));

const Container = styled.main`
  display: flex;
  flex-direction: column;
`;

const InnerAbfahrtenList = () => {
  const { updateCurrentStopPlaceByString, setCurrentStopPlace, setError } =
    useRawAbfahrten();
  const currentStopPlace = useCurrentAbfahrtenStopPlace();
  const error = useAbfahrtenError();
  const selectedDetail = useSelectedDetail();
  const { clearSequences } = useSequencesActions();
  const [scrolled, setScrolled] = useState(false);
  const { filteredAbfahrten, unfilteredAbfahrten } = useAbfahrten();
  const paramStation = useParams().station;
  const { autoUpdate } = useCommonConfig();
  const urlPrefix = useAbfahrtenUrlPrefix();
  const refreshCurrentAbfahrten = useRefreshCurrent();
  const { updateTitle, updateDescription, updateKeywords } =
    useHeaderTagsActions();

  useEffect(() => {
    if (currentStopPlace) {
      updateTitle(currentStopPlace.name);
      updateDescription(`Zugabfahrten für ${currentStopPlace.name}`);
      updateKeywords([currentStopPlace.name]);
    } else {
      updateTitle();
      updateDescription();
      updateKeywords();
    }
  }, [currentStopPlace, updateDescription, updateTitle, updateKeywords]);

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

    if (autoUpdate) {
      intervalId = setInterval(() => {
        void refreshCurrentAbfahrten();
        clearSequences();
      }, autoUpdate * 1000);
    } else {
      cleanup();
    }

    return cleanup;
  }, [clearSequences, autoUpdate, refreshCurrentAbfahrten]);

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
        scrollDom = document.getElementById(selectedDetail);
      }
      if (!scrollDom && unfilteredAbfahrten.lookbehind.length > 0) {
        scrollDom = document.querySelector('#lookaheadMarker');
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
    <Loading check={unfilteredAbfahrten || error}>
      {() => (
        <Container>
          {error ? (
            <Navigate to={urlPrefix} />
          ) : filteredAbfahrten &&
            (filteredAbfahrten.departures.length > 0 ||
              filteredAbfahrten.lookbehind.length > 0) ? (
            <>
              {Boolean(
                unfilteredAbfahrten?.strike && unfilteredAbfahrten.strike > 10,
              ) && <Streik />}
              {filteredAbfahrten.lookbehind.length > 0 && (
                <Lookbehind id="lookbehind" data-testid="lookbehind">
                  {filteredAbfahrten.lookbehind.map((a) => (
                    <Abfahrt abfahrt={a} key={a.rawId} />
                  ))}
                  <LookaheadMarker id="lookaheadMarker" />
                </Lookbehind>
              )}
              <div id="lookahead" data-testid="lookahead">
                {filteredAbfahrten.departures.map((a) => (
                  <Abfahrt abfahrt={a} key={a.rawId} />
                ))}
              </div>
            </>
          ) : (
            <NothingFound unfilteredAbfahrten={unfilteredAbfahrten} />
          )}
        </Container>
      )}
    </Loading>
  );
};

const NothingFound: FC<{
  unfilteredAbfahrten?: AbfahrtenResult;
}> = ({ unfilteredAbfahrten }) => {
  let text = 'Leider keine Abfahrten in nächster Zeit';
  if (unfilteredAbfahrten) {
    const hasUnfiltered =
      unfilteredAbfahrten.departures.length > 0 ||
      unfilteredAbfahrten.lookbehind.length > 0;
    if (hasUnfiltered) {
      text =
        'Es gibt Abfahrten, diese werden aber durch den gesetzten Filter nicht angezeigt.';
    }
  }
  return <div>{text}</div>;
};

export const AbfahrtenList: FC = () => (
  <SelectedDetailProvider>
    <InnerAbfahrtenList />
  </SelectedDetailProvider>
);
