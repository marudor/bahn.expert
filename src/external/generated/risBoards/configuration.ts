// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
/**
 * RIS::Boards (Transporteure)
 * # Info  * powered by [Deutsche Bahn AG](https://www.bahn.de) * member of the RIS-API family, the building kit for traveller informations * for details check out [RIS::Boards](https://developers.deutschebahn.com/db-api-marketplace/apis/product/ris-boards-transporteure) in the DB API Marketplace  # Capabilities  ## Journey-Information  Provides a list of transports [Verkehrsmittel] departing / arriving at a particular stop-place [Haltestelle] and optional all other stop-places belonging to the same stop-place group [vertrieblicher Umsteigebereich] within a specific time window, including  * via stops [Unterwegshalte] with corresponding prioritization * transport-type [Produktklasse], category [Fahrtgattung], line [Linie], administration [Verwaltung / Betreiber], origin [Starthalt] and destination [Zielhalt] and direction-texts [Richtungstexte] * departures [Abfahrten] or arrivals [Ankünfte] with schedule [Soll] and forecast [Vorschau] times and platforms [Plattform / Gleis / Bussteig etc.], cancelled stops [Haltausfall], additional stops [Zusatzhalt], cancelled additional stops [zurückgenommene Zusatzhalte], possible restrictions on changing passengers [Fahrgastwechsel] and on demand stops [Bedarfshalt] * disruptions [Störungen], Messages [Freitexte], quality-deviations [Qualitätsabweichungen] and customer-reasons [Kundengründe] * references to other transports representing replacement [Ersatz], relief [Entlastung], portion-working [Vereinigung] including separatation [Trennung in] and continuation [Durchbindung] * information on replacement transports [Schienen-Ersatzverkehr und Bus-Notverkehr] * and much more  # Limitations / Known Issues  * journeys are limited to 22h ahead of start  # Getting Started  * learn how to [get started with openapi](https://developer-docs.deutschebahn.com/doku/apis/openapi.html) * check out our [coding-examples](https://developer-docs.deutschebahn.com/apis)
 *
 * The version of the OpenAPI document: 1.4.3
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

export interface ConfigurationParameters {
	apiKey?:
		| string
		| Promise<string>
		| ((name: string) => string)
		| ((name: string) => Promise<string>);
	username?: string;
	password?: string;
	accessToken?:
		| string
		| Promise<string>
		| ((name?: string, scopes?: string[]) => string)
		| ((name?: string, scopes?: string[]) => Promise<string>);
	basePath?: string;
	baseOptions?: any;
	formDataCtor?: new () => any;
}

export class Configuration {
	/**
	 * parameter for apiKey security
	 * @param name security name
	 * @memberof Configuration
	 */
	apiKey?:
		| string
		| Promise<string>
		| ((name: string) => string)
		| ((name: string) => Promise<string>);
	/**
	 * parameter for basic security
	 *
	 * @type {string}
	 * @memberof Configuration
	 */
	username?: string;
	/**
	 * parameter for basic security
	 *
	 * @type {string}
	 * @memberof Configuration
	 */
	password?: string;
	/**
	 * parameter for oauth2 security
	 * @param name security name
	 * @param scopes oauth2 scope
	 * @memberof Configuration
	 */
	accessToken?:
		| string
		| Promise<string>
		| ((name?: string, scopes?: string[]) => string)
		| ((name?: string, scopes?: string[]) => Promise<string>);
	/**
	 * override base path
	 *
	 * @type {string}
	 * @memberof Configuration
	 */
	basePath?: string;
	/**
	 * base options for axios calls
	 *
	 * @type {any}
	 * @memberof Configuration
	 */
	baseOptions?: any;
	/**
	 * The FormData constructor that will be used to create multipart form data
	 * requests. You can inject this here so that execution environments that
	 * do not support the FormData class can still run the generated client.
	 *
	 * @type {new () => FormData}
	 */
	formDataCtor?: new () => any;

	constructor(param: ConfigurationParameters = {}) {
		this.apiKey = param.apiKey;
		this.username = param.username;
		this.password = param.password;
		this.accessToken = param.accessToken;
		this.basePath = param.basePath;
		this.baseOptions = param.baseOptions;
		this.formDataCtor = param.formDataCtor;
	}

	/**
	 * Check if the given MIME is a JSON MIME.
	 * JSON MIME examples:
	 *   application/json
	 *   application/json; charset=UTF8
	 *   APPLICATION/JSON
	 *   application/vnd.company+json
	 * @param mime - MIME (Multipurpose Internet Mail Extensions)
	 * @return True if the given MIME is JSON, false otherwise.
	 */
	public isJsonMime(mime: string): boolean {
		const jsonMime: RegExp =
			/^(application\/json|[^;\/ \t]+\/[^;\/ \t]+[+]json)[ \t]*(;.*)?$/i;
		return (
			mime !== null &&
			(jsonMime.test(mime) ||
				mime.toLowerCase() === 'application/json-patch+json')
		);
	}
}
