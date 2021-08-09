/* tslint:disable */
/* eslint-disable */
/**
 * RIS :: Stations
 * ## Info * member of the **[RIS-API](https://db.de/ris-api)** family * powered by [DB Systel BusinessHub - doServices](https://user-portal.hub.ose.db.de/) * powered by [T.R Reisendeninformation](https://db-planet.deutschebahn.com/pages/reisendeninformation/apps/content/willkommen) * implements model: *1.0.201-SNAPSHOT*  ## Capabilities  ### Stations *stay tuned*  ### Travel Centers *stay tuned*  ### Stop Places Information on a huge amount of stop-places [Haltestellen] coming from different source like EFZ [Europäisches Fahrplanzentrum] and DB Station & Service. The service offers therefore all stop-place that are part or that were part of the official sales time table for germany including foreign stop-places for transpors driving into germany / leaving germany and connecting journeys in foreign countries that are part of the railteam alliance. OEPNV stop-places are returned as well.  Brief information for particular stop-place like * language dependent short, long, speech and symbol names from different sources [EFZ or BHW] * metropolis information [Metropole] * parent station [Bahnhof] * geo coordinates, country and timezone * transport types [Verkehrsmittel / Produkart] that depart / arrive * foreign key mappings [Fremdschluessel] like EVA, RL100 / DS100, EPA, IBNR, DHID / IFOPT, STADA and UIC * validity ranges [Gueltigkeitsbereiche]  Different query options for stop-places like * by name query with fuzzy-search [fehlertolerante Suche] and order by relevance [gewichtete Suche] * by geo-coordinate and radius ordered by distance * by foreign key  Multiple groups a stop-place may belong to like * Station [selber Bahnhof] * Sales [vertrieblicher Umsteigebereich inkl. OEPNV]  * Metropolitan Area [Stadtgebiet]  ### Platforms General information on platforms [Gleise, Bussteige, Plattformen etc.] for a particular stop-place like: * name, start and end in meters, linked platforms [selber Bahnsteig], parent platform [fuer Teilgleise]  * sectors with name, start and end in meters, cube position [Wuerfelposition] and information ob cube signage [Beschilderung] * accessibility information [Barrierefreier Zugang] like audible signals, automatic doors, stair markings and a lot more * informaton on operational platforms [Betriebsgleise], optics [Optiken], reference points [Refeenzpunkte] and orientations [Orientierung gemaess Nullpunkt]  ### Connecting-Times Connecting-times [Umsteigezeiten / Anschlusszeiten] for a stop-place [Haltestelle] and all members of stop-place group [Umsteigebereich] including foreign stop-places [Auslandshalte gemaess Railteam-Flag etc.]: * for different kind of stop-place groups    * Station [selber Bahnhof]   * Sales [vertrieblicher Umsteigebereich inkl. OEPNV]   * All [alle Umsteigebereiche] supported * and different personae, if available   * Occasional Traveller [Gelegenheitsreisender]   * Frequent Traveller [Pendler]   * Handicapped Traveller [Mobilitaetseingeschraenkter Reisender] * from various sources   * RIL420 [Konzernrichtlinie]   * EFZ [Europäisches Fahrplanzentrum inkl. OEPNV & Auslandshalte]   * IndoorRouting [Indoor Routing RIS-Maps] available  ## Limitations * *[backlog]* support active and inactive versions of stop-places/stations (differing date ranges) * *[backlog]* support foreign keys EPA & IBNR * *[backlog]* raise stop-place change events with RIS::Events in case stop-place data changes * *[backlog]* enable query of all stop-places that have been changed since a certain datetime * *[backlog]* include Station & Service Bahnhofswissen with it\'s fully functional API starting from ~Q1/Q2 2021  ## Getting Started * get to know the vision behind [RIS-API](https://db.de/ris-api) * visit our [Coding Dojo](https://ris.gitpages.tech.rz.db.de/risapi/documentation/) and learn how to get started  ## Licenses * The usage of the station data of DB Station & Services is subject to the Creative Commons Attribution 4.0 International (CC BY 4.0) license
 *
 * The version of the OpenAPI document: 1.0
 * Contact: BusinessHub.doServices.Titan.Team@deutschebahn.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Configuration } from './configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';

export const BASE_PATH =
  'https://gateway.businesshub.deutschebahn.com/ris-stations/v1'.replace(
    /\/+$/,
    '',
  );

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
  options: any;
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
