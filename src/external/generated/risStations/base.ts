// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
/**
 * RIS::Stations
 * ## Info  * member of the **RIS-API** family  ## Capabilities  ### Stations  Information on stations [Bahnhöfe] from DB Station & Service and DB Regio like:  * name, address, category [Bahnhofskategorie], owner [Betreiber / Verwaltung], country, timezone and geo coordinate * region information the station belongs [Regionalbereich] * available local services [bahnhofsnahe Dienstleistungen] at station  ### Stop Places  Information on a huge amount of stop-places [Haltestellen] coming from different source like EFZ [Europäisches Fahrplanzentrum] and DB Station & Service. The service offers therefore all stop-place that are part or that were part of the official sales time table for germany including foreign stop-places for transports driving into germany / leaving germany and connecting journeys in foreign countries that are part of the rail team alliance. ÖPNV stop-places are returned as well.  Brief information for particular stop-place like  * language dependent short, long, speech and symbol names from different sources [EFZ or BHW] * metropolis information [Metropole] * parent station [Bahnhof] * geo coordinates, country and timezone * transport types [Verkehrsmittel / Produktart] that depart / arrive * foreign key mappings [Fremdschlüssel] like EVA, RL100 / DS100, EPA, IBNR, DHID / IFOPT, STADA, EBHF, PLC and UIC * validity ranges [Gültigkeitsbereiche]  Different query options for stop-places like  * by name query with fuzzy-search [fehlertolerante Suche] and order by relevance [gewichtete Suche] and optional grouping by station [Bahnhof] in case stop-places belong to a station * by geo-coordinate and radius ordered by distance * by foreign key  Multiple groups a stop-place may belong to like  * Station [selber Bahnhof] * Sales [vertrieblicher Umsteigebereich inkl. ÖPNV]s * Metropolitan Area [Stadtgebiet]  ### Platforms  General information on platforms [Gleise, Bussteige, Plattformen etc.] for a particular stop-place like:  * name, start and end in meters, linked platforms [selber Bahnsteig], parent platform [für Teilgleise]s * sectors with name, start and end in meters, cube position [Würfelposition] and information ob cube signage [Beschilderung] * accessibility information [Barrierefreier Zugang] like audible signals, automatic doors, stair markings and a lot more * information on operational platforms [Betriebsgleise], optics [Optiken], reference points [Referenzpunkte] and orientations [Orientierung gemäß Nullpunkt]  ### Connecting-Times  Connecting-times [Umsteigezeiten / Anschlusszeiten] for a stop-place [Haltestelle] and all members of stop-place group [Umsteigebereich] including foreign stop-places [Auslandshalte gemäß Railteam-Flag etc.]:  * for different kind of stop-place groups     * Station [selber Bahnhof]     * Sales [vertrieblicher Umsteigebereich inkl. ÖPNV]     * All [alle Umsteigebereiche] supported * and different personae, if available     * Occasional Traveller [Gelegenheitsreisender]     * Frequent Traveller [Pendler]     * Handicapped Traveller [Mobilitätseingeschränkter Reisender] * from various sources     * RIL420 [Konzernrichtlinie]     * EFZ [Europäisches Fahrplanzentrum inkl. ÖPNV & Auslandshalte]     * IndoorRouting [Indoor Routing RIS-Maps] available  ### Local Services  Information about Travel-Center, Triple-S-Center [3S Zentrale],Railway Mission[Bahnhofsmission] and many more available by position or station.  ### Station Equipments  Detailed information about equipment at the train station such as:  * Locker with payment types, size, fee and many more. * **stay tuned*  ## Limitations  * *[backlog]* support active and inactive versions of stop-places/stations (differing date ranges) * *[backlog]* raise stop-place change events with RIS::Events in case stop-place data changes * *[backlog]* include Station & Service Bahnhofswissen with it\'s fully functional API starting from ~Q4 2021
 *
 * The version of the OpenAPI document: 1.10.0
 * Contact: doServices.Titan.Support@deutschebahn.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

// Some imports not used depending on template conditions
// @ts-ignore
import globalAxios, {
	AxiosPromise,
	type AxiosInstance,
	type AxiosRequestConfig,
} from 'axios';
import type { Configuration } from './configuration';

export const BASE_PATH =
	'https://apis.deutschebahn.com/db-api-marketplace/apis/ris-stations/v1'.replace(
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
	name = 'RequiredError' as const;
	constructor(
		public field: string,
		msg?: string,
	) {
		super(msg);
	}
}
