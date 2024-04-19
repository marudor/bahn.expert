import { BaseHeader } from '@/client/Common/Components/BaseHeader';
import { Stack } from '@mui/material';
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

export const About: FC = () => {
  return (
    <>
      <BaseHeader spacing={0.3}>About</BaseHeader>
      <Stack margin="0 10px 0">
        <span>
          Entwickelt von{' '}
          <a
            href="https://chaos.social/@marudor"
            target="_blank"
            rel="noopener noreferrer"
          >
            @marudor@chaos.social
          </a>
        </span>
        <span>
          Featurewünsche und Bugreports sind mir am Liebsten über Github. Dafür
          gibt es jeweils ein eigenes Formular.{' '}
        </span>
        <span>
          <a
            href="https://github.com/marudor/bahn.expert/issues/new?assignees=&labels=bug&template=bug_report.md&title="
            target="_blank"
            rel="noopener noreferrer"
          >
            Bugs
          </a>{' '}
          sowie{' '}
          <a
            href="https://github.com/marudor/bahn.expert/issues/new?assignees=&labels=feature&template=feature_request.md&title="
            target="_blank"
            rel="noopener noreferrer"
          >
            Features
          </a>
        </span>
        <span>
          Wer mich anderweitig kontaktieren möchte kann dies neben dem
          verlinkten Social Media Profil auch per Mail an info (at) bahn (dot)
          expert. Bitte als Anrede nicht siezen. Im Idealfall einfach "marudor"
          nutzen.
        </span>
        <Privacy />
      </Stack>
    </>
  );
};
// eslint-disable-next-line import/no-default-export
export default About;
