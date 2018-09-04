// @flow
import React from 'react';
import Paper from '@material-ui/core/Paper';
import { setCurrentStation } from 'actions/abfahrten';
import { connect } from 'react-redux';

type Props = {|
  setCurrentStation: typeof setCurrentStation,
|};

class Privacy extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.setCurrentStation(null);
  }
  render() {
    return (
      <Paper className="AbfahrtenList">
        <h2>Datenschutzerklärung</h2>
        <p>
          Personenbezogene Daten (nachfolgend zumeist nur „Daten“ genannt) werden von uns nur im Rahmen der
          Erforderlichkeit sowie zum Zwecke der Bereitstellung eines funktionsfähigen und nutzerfreundlichen
          Internetauftritts, inklusive seiner Inhalte und der dort angebotenen Leistungen, verarbeitet.
        </p>
        <p>
          Gemäß Art. 4 Ziffer 1. der Verordnung (EU) 2016/679, also der Datenschutz-Grundverordnung (nachfolgend nur
          „DSGVO“ genannt), gilt als „Verarbeitung“ jeder mit oder ohne Hilfe automatisierter Verfahren ausgeführter
          Vorgang oder jede solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten, wie das Erheben, das
          Erfassen, die Organisation, das Ordnen, die Speicherung, die Anpassung oder Veränderung, das Auslesen, das
          Abfragen, die Verwendung, die Offenlegung durch Übermittlung, Verbreitung oder eine andere Form der
          Bereitstellung, den Abgleich oder die Verknüpfung, die Einschränkung, das Löschen oder die Vernichtung.
        </p>
        <p>
          Mit der nachfolgenden Datenschutzerklärung informieren wir Sie insbesondere über Art, Umfang, Zweck, Dauer und
          Rechtsgrundlage der Verarbeitung personenbezogener Daten, soweit wir entweder allein oder gemeinsam mit
          anderen über die Zwecke und Mittel der Verarbeitung entscheiden. Zudem informieren wir Sie nachfolgend über
          die von uns zu Optimierungszwecken sowie zur Steigerung der Nutzungsqualität eingesetzten Fremdkomponenten,
          soweit hierdurch Dritte Daten in wiederum eigener Verantwortung verarbeiten.
        </p>
        <p>Unsere Datenschutzerklärung ist wie folgt gegliedert:</p>
        <p>
          I. Rechte der Nutzer und Betroffenen
          <br />
          II. Informationen zur Datenverarbeitung
        </p>
        <h3>I. Rechte der Nutzer und Betroffenen</h3>
        <p>
          Mit Blick auf die nachfolgend noch näher beschriebene Datenverarbeitung haben die Nutzer und Betroffenen das
          Recht
        </p>
        <ul>
          <li>
            auf Bestätigung, ob sie betreffende Daten verarbeitet werden, auf Auskunft über die verarbeiteten Daten, auf
            weitere Informationen über die Datenverarbeitung sowie auf Kopien der Daten (vgl. auch Art. 15 DSGVO);
          </li>
          <li>
            auf Berichtigung oder Vervollständigung unrichtiger bzw. unvollständiger Daten (vgl. auch Art. 16 DSGVO);
          </li>
          <li>
            auf unverzügliche Löschung der sie betreffenden Daten (vgl. auch Art. 17 DSGVO), oder, alternativ, soweit
            eine weitere Verarbeitung gemäß Art. 17 Abs. 3 DSGVO erforderlich ist, auf Einschränkung der Verarbeitung
            nach Maßgabe von Art. 18 DSGVO;
          </li>
          <li>
            auf Erhalt der sie betreffenden und von ihnen bereitgestellten Daten und auf Übermittlung dieser Daten an
            andere Anbieter/Verantwortliche (vgl. auch Art. 20 DSGVO);
          </li>
          <li>
            auf Beschwerde gegenüber der Aufsichtsbehörde, sofern sie der Ansicht sind, dass die sie betreffenden Daten
            durch den Anbieter unter Verstoß gegen datenschutzrechtliche Bestimmungen verarbeitet werden (vgl. auch Art.
            77 DSGVO).
          </li>
        </ul>
        <p>
          Darüber hinaus ist der Anbieter dazu verpflichtet, alle Empfänger, denen gegenüber Daten durch den Anbieter
          offengelegt worden sind, über jedwede Berichtigung oder Löschung von Daten oder die Einschränkung der
          Verarbeitung, die aufgrund der Artikel 16, 17 Abs. 1, 18 DSGVO erfolgt, zu unterrichten. Diese Verpflichtung
          besteht jedoch nicht, soweit diese Mitteilung unmöglich oder mit einem unverhältnismäßigen Aufwand verbunden
          ist. Unbeschadet dessen hat der Nutzer ein Recht auf Auskunft über diese Empfänger.
        </p>
        <p>
          <strong>
            Ebenfalls haben die Nutzer und Betroffenen nach Art. 21 DSGVO das Recht auf Widerspruch gegen die künftige
            Verarbeitung der sie betreffenden Daten, sofern die Daten durch den Anbieter nach Maßgabe von Art. 6 Abs. 1
            lit. f) DSGVO verarbeitet werden. Insbesondere ist ein Widerspruch gegen die Datenverarbeitung zum Zwecke
            der Direktwerbung statthaft.
          </strong>
        </p>
        <h3>II. Informationen zur Datenverarbeitung</h3>
        <p>
          Ihre bei Nutzung unseres Internetauftritts verarbeiteten Daten werden gelöscht oder gesperrt, sobald der Zweck
          der Speicherung entfällt, der Löschung der Daten keine gesetzlichen Aufbewahrungspflichten entgegenstehen und
          nachfolgend keine anderslautenden Angaben zu einzelnen Verarbeitungsverfahren gemacht werden.
        </p>

        <h4>Google Analytics</h4>
        <p>
          In unserem Internetauftritt setzen wir Google Analytics ein. Hierbei handelt es sich um einen Webanalysedienst
          der Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043 USA, nachfolgend nur „Google“ genannt.
        </p>
        <p>Durch die Zertifizierung nach dem EU-US-Datenschutzschild („EU-US Privacy Shield“)</p>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.privacyshield.gov/participant?id=a2zt000000001L5AAI&amp;status=Active"
          >
            https://www.privacyshield.gov/participant?id=a2zt000000001L5AAI&amp;status=Active
          </a>
        </p>
        <p>
          garantiert Google, dass die Datenschutzvorgaben der EU auch bei der Verarbeitung von Daten in den USA
          eingehalten werden.
        </p>
        <p>
          Der Dienst Google Analytics dient zur Analyse des Nutzungsverhaltens unseres Internetauftritts.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f) DSGVO. Unser berechtigtes Interesse liegt in der Analyse,
          Optimierung und dem wirtschaftlichen Betrieb unseres Internetauftritts.
        </p>
        <p>
          Nutzungs- und nutzerbezogene Informationen, wie bspw. IP-Adresse, Ort, Zeit oder Häufigkeit des Besuchs
          unseres Internetauftritts, werden dabei an einen Server von Google in den USA übertragen und dort gespeichert.
          Allerdings nutzen wir Google Analytics mit der sog. Anonymisierungsfunktion. Durch diese Funktion kürzt Google
          die IP-Adresse schon innerhalb der EU bzw. des EWR.
        </p>
        <p>
          Die so erhobenen Daten werden wiederum von Google genutzt, um uns eine Auswertung über den Besuch unseres
          Internetauftritts sowie über die dortigen Nutzungsaktivitäten zur Verfügung zu stellen. Auch können diese
          Daten genutzt werden, um weitere Dienstleistungen zu erbringen, die mit der Nutzung unseres Internetauftritts
          und der Nutzung des Internets zusammenhängen.
        </p>
        <p>Google gibt an, Ihre IP-Adresse nicht mit anderen Daten zu verbinden. Zudem hält Google unter</p>
        <p>
          <a target="_blank" rel="noopener noreferrer" href="https://www.google.com/intl/de/policies/privacy/partners">
            https://www.google.com/intl/de/policies/privacy/partners
          </a>
        </p>
        <p>
          weitere datenschutzrechtliche Informationen für Sie bereit, so bspw. auch zu den Möglichkeiten, die
          Datennutzung zu unterbinden.
        </p>
        <p>Zudem bietet Google unter</p>
        <p>
          <a target="_blank" rel="noopener noreferrer" href="https://tools.google.com/dlpage/gaoptout?hl=de">
            https://tools.google.com/dlpage/gaoptout?hl=de
          </a>
        </p>
        <p>
          ein sog. Deaktivierungs-Add-on nebst weiteren Informationen hierzu an. Dieses Add-on lässt sich mit den
          gängigen Internet-Browsern installieren und bietet Ihnen weitergehende Kontrollmöglichkeit über die Daten, die
          Google bei Aufruf unseres Internetauftritts erfasst. Dabei teilt das Add-on dem JavaScript (ga.js) von Google
          Analytics mit, dass Informationen zum Besuch unseres Internetauftritts nicht an Google Analytics übermittelt
          werden sollen. Dies verhindert aber nicht, dass Informationen an uns oder an andere Webanalysedienste
          übermittelt werden. Ob und welche weiteren Webanalysedienste von uns eingesetzt werden, erfahren Sie natürlich
          ebenfalls in dieser Datenschutzerklärung.
        </p>

        <p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.ratgeberrecht.eu/leistungen/muster-datenschutzerklaerung.html"
          >
            Muster-Datenschutzerklärung
          </a>{' '}
          der{' '}
          <a target="_blank" rel="noopener noreferrer" href="https://www.ratgeberrecht.eu/">
            Anwaltskanzlei Weiß &amp; Partner
          </a>
        </p>
      </Paper>
    );
  }
}

export default connect(
  undefined,
  {
    setCurrentStation,
  }
)(Privacy);
