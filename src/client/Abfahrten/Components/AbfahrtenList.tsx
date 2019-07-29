import { AppStore } from 'AppState';
import { getAbfahrtenForConfig } from 'Abfahrten/selector/abfahrten';
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
import useStyles from './AbfahrtenList.style';

const AbfahrtenList = () => {
  const classes = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const selectedDetail = useAbfahrtenSelector(
    state => state.abfahrten.selectedDetail
  );
  const abfahrten = useAbfahrtenSelector(getAbfahrtenForConfig);
  const [loading, setLoading] = useState(!abfahrten);
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
    if (abfahrten) {
      setScrolled(false);
    }
  }, [abfahrten]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const cleanup = () => {
      clearInterval(intervalId);
    };

    if (autoUpdate) {
      intervalId = setInterval(
        () => dispatch(refreshCurrentAbfahrten()),
        autoUpdate * 1000
      );
    } else {
      cleanup();
    }

    return cleanup();
  }, [autoUpdate, dispatch]);

  useEffect(() => {
    if (!currentStation || currentStation.title !== match.params.station) {
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
  }, [currentStation, dispatch, location.state, match.params.station]);

  useEffect(() => {
    if (scrolled) {
      return;
    }
    if (abfahrten) {
      let scrollDom: HTMLElement | null = null;

      if (selectedDetail) {
        scrollDom = document.getElementById(`${selectedDetail}Scroll`);
      }
      if (!scrollDom && abfahrten.lookbehind.length) {
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
  }, [abfahrten, scrolled, selectedDetail]);

  return (
    <Loading isLoading={loading}>
      <main className={classes.main}>
        {error && !loading ? (
          <Redirect to="/" />
        ) : abfahrten &&
          (abfahrten.lookahead.length || abfahrten.lookbehind.length) ? (
          <>
            {Boolean(abfahrten.lookbehind.length) && (
              <div id="lookbehind" className={classes.lookbehind}>
                {abfahrten.lookbehind.map(
                  a => a && <Abfahrt abfahrt={a} key={a.rawId} />
                )}
                <div className={classes.lookaheadMarker} id="lookaheadMarker" />
              </div>
            )}
            <div id="lookahead" className={classes.lookahead}>
              {abfahrten.lookahead.map(
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

// @ts-ignore
AbfahrtenList.loadData = (
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

export default AbfahrtenList;
