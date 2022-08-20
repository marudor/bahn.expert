// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
/**
 * RIS :: Journeys
 * ## Info * member of the **[RIS-API](https://db-planet.deutschebahn.com/pages/reisendeninformation-ris-api)** family * powered by [TR Reisendeninformationen](https://db-planet.deutschebahn.com/pages/reisendeninformation/apps/content/willkommen) * implements model: 1.0.206-SNAPSHOT  ## Capabilities Provides detailed information for a particular journey [Fahrt], including: * transport type [Produktklasse], category [Fahrtgattung], line [Linie], administration [Verwaltung] and operator [Betreiber] * origin [Starthalt] and destination [Zielhalt] * departues [Abfahrten] or arrivals [Ankuenfte] (depending on board) with schedule [Soll] and forecast [Vorschau] times and platforms [Plattform / Gleis / Bussteig etc.] * canceld stops [Haltausfall], additional stops [Zusatzhalt], additional textual information [Freitexte] and possible restrictions on changing passengers [Fahrgastwechsel] * references to other transports representing replacement [Ersatz], relief [Entlastung], travels with [Vereinigung] and continuation [Durchbindung] * disruptions [Störungen] for journey, arrivals and departures  The consumer can choose a segment based [Fahrtabschnittsbasiert] or an event based [Fahrtereignisbasiert] view.  Requests are usually stated using a journey ID defined by TR. In addition journeys and partiuclar departures [Abfahrten] can be matched by providing data like category [Fahrtgattung], number [Fahrtnummer] and administration ID [VerwaltungsID].   ## Limitations * journeys are limited to 22 hours ahead  ## Getting Started * get to know the vision behind [RIS-API](https://db-planet.deutschebahn.com/pages/reisendeninformation-ris-api/apps/content/inhalt) * learn how to [get started](https://db-planet.deutschebahn.com/pages/reisendeninformation-ris-api/apps/content/openapi-beispiele) for your programming language of desire
 *
 * The version of the OpenAPI document: 1.1.82
 * Contact: ris-fachbetrieb@deutschebahn.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Configuration } from './configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import globalAxios, {
  AxiosPromise,
  AxiosInstance,
  AxiosRequestConfig,
} from 'axios';

export const BASE_PATH =
  'https://apis.deutschebahn.com/db/apis/ris-journeys/v1'.replace(/\/+$/, '');

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
  csv: ',',
  ssv: ' ',
  tsv: '\t',
  pipes: '|',
};

/**
 *
 * @export
 * @interface RequestArgs
 */
export interface RequestArgs {
  url: string;
  options: AxiosRequestConfig;
}

/**
 *
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
  protected configuration: Configuration | undefined;

  constructor(
    configuration?: Configuration,
    protected basePath: string = BASE_PATH,
    protected axios: AxiosInstance = globalAxios,
  ) {
    if (configuration) {
      this.configuration = configuration;
      this.basePath = configuration.basePath || this.basePath;
    }
  }
}

/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
  name: 'RequiredError' = 'RequiredError';
  constructor(public field: string, msg?: string) {
    super(msg);
  }
}
