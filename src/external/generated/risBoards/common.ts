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

import type { AxiosInstance, AxiosResponse } from 'axios';
import type { RequestArgs } from './base';
import { RequiredError } from './base';
import type { Configuration } from './configuration';

/**
 *
 * @export
 */
export const DUMMY_BASE_URL = 'https://example.com';

/**
 *
 * @throws {RequiredError}
 * @export
 */
export const assertParamExists = (
	functionName: string,
	paramName: string,
	paramValue: unknown,
) => {
	if (paramValue === null || paramValue === undefined) {
		throw new RequiredError(
			paramName,
			`Required parameter ${paramName} was null or undefined when calling ${functionName}.`,
		);
	}
};

/**
 *
 * @export
 */
export const setApiKeyToObject = async (
	object: any,
	keyParamName: string,
	configuration?: Configuration,
) => {
	if (configuration && configuration.apiKey) {
		const localVarApiKeyValue =
			typeof configuration.apiKey === 'function'
				? await configuration.apiKey(keyParamName)
				: await configuration.apiKey;
		object[keyParamName] = localVarApiKeyValue;
	}
};

/**
 *
 * @export
 */
export const setBasicAuthToObject = (
	object: any,
	configuration?: Configuration,
) => {
	if (configuration && (configuration.username || configuration.password)) {
		object['auth'] = {
			username: configuration.username,
			password: configuration.password,
		};
	}
};

/**
 *
 * @export
 */
export const setBearerAuthToObject = async (
	object: any,
	configuration?: Configuration,
) => {
	if (configuration && configuration.accessToken) {
		const accessToken =
			typeof configuration.accessToken === 'function'
				? await configuration.accessToken()
				: await configuration.accessToken;
		object['Authorization'] = 'Bearer ' + accessToken;
	}
};

/**
 *
 * @export
 */
export const setOAuthToObject = async (
	object: any,
	name: string,
	scopes: string[],
	configuration?: Configuration,
) => {
	if (configuration && configuration.accessToken) {
		const localVarAccessTokenValue =
			typeof configuration.accessToken === 'function'
				? await configuration.accessToken(name, scopes)
				: await configuration.accessToken;
		object['Authorization'] = 'Bearer ' + localVarAccessTokenValue;
	}
};

function setFlattenedQueryParams(
	urlSearchParams: URLSearchParams,
	parameter: any,
	key = '',
): void {
	if (parameter == null) return;
	if (typeof parameter === 'object') {
		if (Array.isArray(parameter)) {
			(parameter as any[]).forEach((item) =>
				setFlattenedQueryParams(urlSearchParams, item, key),
			);
		} else {
			Object.keys(parameter).forEach((currentKey) =>
				setFlattenedQueryParams(
					urlSearchParams,
					parameter[currentKey],
					`${key}${key !== '' ? '.' : ''}${currentKey}`,
				),
			);
		}
	} else {
		if (urlSearchParams.has(key)) {
			urlSearchParams.append(key, parameter);
		} else {
			urlSearchParams.set(key, parameter);
		}
	}
}

/**
 *
 * @export
 */
export const setSearchParams = (url: URL, ...objects: any[]) => {
	const searchParams = new URLSearchParams(url.search);
	setFlattenedQueryParams(searchParams, objects);
	url.search = searchParams.toString();
};

/**
 *
 * @export
 */
export const serializeDataIfNeeded = (
	value: any,
	requestOptions: any,
	configuration?: Configuration,
) => {
	const nonString = typeof value !== 'string';
	const needsSerialization =
		nonString && configuration && configuration.isJsonMime
			? configuration.isJsonMime(requestOptions.headers['Content-Type'])
			: nonString;
	return needsSerialization
		? JSON.stringify(value !== undefined ? value : {})
		: value || '';
};

/**
 *
 * @export
 */
export const toPathString = (url: URL) => url.pathname + url.search + url.hash;

/**
 *
 * @export
 */
export const createRequestFunction =
	(
		axiosArgs: RequestArgs,
		globalAxios: AxiosInstance,
		BASE_PATH: string,
		configuration?: Configuration,
	) =>
	<T = unknown, R = AxiosResponse<T>>(
		axios: AxiosInstance = globalAxios,
		basePath: string = BASE_PATH,
	) => {
		const axiosRequestArgs = {
			...axiosArgs.options,
			url:
				(configuration?.basePath || axios.defaults.baseURL || basePath) +
				axiosArgs.url,
		};
		return axios.request<T, R>(axiosRequestArgs);
	};
