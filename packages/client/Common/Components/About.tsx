import { BaseHeader } from 'client/Common/Components/BaseHeader';
import { BugReport, Extension, Message } from '@material-ui/icons';
import { Button, makeStyles } from '@material-ui/core';
import type { FC } from 'react';

const Privacy = () => (
  <div data-testid="Privacy">
    <h2>Impressum</h2>
    <p>Verantwortlich für diese Seite ist:</p>
    <p>
      <span>
        {globalThis.IMPRINT.name}
        <br />
        {globalThis.IMPRINT.street}
        <br />
        {globalThis.IMPRINT.town}
      </span>
    </p>
    <h2>Datenschutzerklärung</h2>
    <h3>Logdaten des Webservers</h3>
    <p>
      Bei jedem Aufruf dieser Website werden vom Webserver die folgenden Daten
      gespeichert und für vier Wochen aufbewahrt:
    </p>
    <p>
      Datum und Uhrzeit,
      <br /> die aufgerufene Seite,
      <br /> der dabei verwendete Browser (gemäß des von diesem gesendeten
      UserAgents) und
      <br /> der Referer (d.h. die auf diese Seite verlinkende Website —
      ebenfalls gemäß der vom Browser gesendeten Informationen, kann meist im
      Browser deaktiviert werden).
      <br />
      Die IP-Adresse sowie die bei Aufruf der Hauptseite an den Server
      übertragenen Geokoordinaten werden nicht gespeichert. Eine Ausnahme für
      das Speichern der IP ist die Nutzung von deprecated APIs. In diesen Fällen
      wird die IP gespeichert bis die API entfernt wird um eventuelle Nutzern
      bescheid zu geben.
    </p>
  </div>
);

const useStyles = makeStyles((theme) => ({
  wrap: {
    margin: `${theme.shape.headerSpacing}px 10px 0`,
    display: 'flex',
    flexDirection: 'column',
  },
  donation: {
    marginTop: 5,
  },
  buttonsWrap: {
    [theme.breakpoints.down('md')]: {
      height: '10em',
    },
  },
  buttons: {
    '& svg': {
      marginRight: 5,
    },
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '1em',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
}));

export const About: FC = () => {
  const classes = useStyles();
  return (
    <>
      <BaseHeader>About</BaseHeader>
      <div className={classes.wrap}>
        <span>
          Entwickelt von{' '}
          <a
            href="https://twitter.com/marudor"
            target="_blank"
            rel="noopener noreferrer"
          >
            @marudor
          </a>{' '}
          /{' '}
          <a
            href="https://chaos.social/@marudor"
            target="_blank"
            rel="noopener noreferrer"
          >
            @marudor@chaos.social
          </a>
        </span>
        <div className={classes.donation}>
          Falls euch der Service gefällt, könnt ihr mir mit folgendem Button per
          PayPal Geld spenden. Falls ihr anderweitig spenden wollt, schreibt mir
          &apos;ne Mail an
          <a href="mailto:spende@marudor.de"> spende@marudor.de</a>
        </div>
        <div className={classes.buttonsWrap}>
          <div className={classes.buttons}>
            <a
              href="https://paypal.me/marudor"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outlined">Paypal Spende</Button>
            </a>
            <a
              href="https://twitter.com/marudor"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outlined">
                <Message />
                Kontakt
              </Button>
            </a>
            <a
              href="https://github.com/marudor/BahnhofsAbfahrten/issues/new?assignees=&labels=bug&template=bug_report.md&title="
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outlined">
                <BugReport />
                Bugs?
              </Button>
            </a>
            <a
              href="https://github.com/marudor/BahnhofsAbfahrten/issues/new?assignees=&labels=feature&template=feature_request.md&title="
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outlined">
                <Extension />
                Features?
              </Button>
            </a>
          </div>
        </div>
        <Privacy />
      </div>
    </>
  );
};
// eslint-disable-next-line import/no-default-export
export default About;
