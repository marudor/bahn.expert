/* tslint:disable */
/* eslint-disable */
/**
 * RIS::Transports
 * ## Info  * powered by DB Systel - [doServices Sirius](https://db.de/do-services-sirius) * powered by [DB Reisendeninformation](https://db-planet.deutschebahn.com/pages/reisendeninformation/apps/content/willkommen) * member of the [RIS-API](https://db.de/ris-api) family, the building kit for traveller information * for details check out [RIS::Transports](https://api-portal.hub.db.de/db/apis/product/ris-transports) in the DB API Portal   ## Capabilities  ### Vehicle-Sequences  Returns the vehicle-sequence [Wagenreihung] for a departure [Abfahrt] or an arrival [Ankunft] within a journey [Fahrt], meaning:  * the vehicle groups that travel together [Vereinigung], their names and destinations * the sequence of the vehicles and the vehicle type (control car, dining car, passenger car etc.) * the position of the vehicles at the platform / track / sector [Plattform / Gleis / Sektor] and according platform information * existing equipment features [Ausstattungsmerkmale] (boarding aid, toilet, etc.) * flag that indicates whether sequence matches schedule [Bitte beachten Sie die geänderte Wagenreihung] * changes for vehicles within vehicle-sequences [Stärkung, Schwächung, Parktausch etc.]  Additionally, all administration IDs [Verwaltungs ID / Code] the system is able to provide vehicle-sequences for can be queried.  ### Occupancies  Provides occupancy information [Auslastungsinformation] for a journey [Fahrt] and its departures [Abfahrten], if available.  This information can therefore be used to:  * let the travellers know the occupancy of a particular journey [Fahrt] at a particular departure [Abfahrt] * let the travellers know where to stand at the platform in order to board the train at the emptiest vehicle [Fahrgastlenkung beim Einstieg]  ### Vehicles by vehicle-id  Returns all journeys [Fahrten] a vehicle [Fahrzeug] with a particular vehicle-id [usually the UIC-number] travels in for a specific date:  * enables consumers to find the journey a traveller is currently travelling with by the uic-number of a vehicle * can be used to match a particular train to its journey [Zugtaufe]  ### Asynchronous change-notifications  The RIS-API event-system [RIS::Events](https://db-planet.deutschebahn.com/pages/reisendeninformation-ris-api/apps/content/events) can be used to get push-notifications in case information within RIS::Transports changes. This enables use-cases like:  * refreshing ui in case information changes * doing something in your backend in case information changes * caching information and invalidate cache in case information changes  ## Limitations / Known Issues  * vehicle-sequences are limited to 22h ahead and are usually ready at about ~22:30 o\'clock for the next day * vehicle-amenity status is only working for bike spaces for DB Regio Baden-Württemberg, all other amenities don\'t have a status at all * the field `vehicleGroupName` sometimes can contain a string with two vehicle group names splitted by a semicolon e.g RPF200009;RPF47041, instead of one vehicle group name  ## Getting Started  * visit our [documentation](https://ris-api.gitpages.tech.rz.db.de), learn how to [get started with openapi](https://developer-docs.deutschebahn.com/doku/apis/openapi.html)   or how to [get started with asyncapi](https://developer-docs.deutschebahn.com/doku/apis/asyncapi.html) and check out our [coding-examples](https://developer-docs.deutschebahn.com/doku/apis) * bounty hunter, bug finder or just idea creator, we are thirsty to hear from you - get in touch with us by using [DB AnwenderEcho](https://anwenderecho.extranet.deutschebahn.com/ris-api/) or write an [email](mailto:ris-api@deutschebahn.com) ## Changelog  <details>  ### 3.3.1  #### Fixed  * set maxLength of departureID in JourneyOccupancyRequest to 12  ### 3.3.0  ### Added  * added endpoints `/vehicle-sequences/departures/{journeyID}` and `/vehicle-sequences/arrivals/{journeyID}` in order to get all sequences of a particular journey  #### Changed  * fixed wrong length for `departureID` and `arrivalID` from `10` to `12` * refactored `/occupancies/` to `/occupancies`  </details> 
 *
 * The version of the OpenAPI document: 3.3.1-7
 * Contact: doServices.Sirius.Team@deutschebahn.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from "./configuration";
import type { RequestArgs } from "./base";
import type { AxiosInstance, AxiosResponse } from 'axios';
import { RequiredError } from "./base";

/**
 *
 * @export
 */
export const DUMMY_BASE_URL = 'https://example.com'

/**
 *
 * @throws {RequiredError}
 * @export
 */
export const assertParamExists = function (functionName: string, paramName: string, paramValue: unknown) {
    if (paramValue === null || paramValue === undefined) {
        throw new RequiredError(paramName, `Required parameter ${paramName} was null or undefined when calling ${functionName}.`);
    }
}

/**
 *
 * @export
 */
export const setApiKeyToObject = async function (object: any, keyParamName: string, configuration?: Configuration) {
    if (configuration && configuration.apiKey) {
        const localVarApiKeyValue = typeof configuration.apiKey === 'function'
            ? await configuration.apiKey(keyParamName)
            : await configuration.apiKey;
        object[keyParamName] = localVarApiKeyValue;
    }
}

/**
 *
 * @export
 */
export const setBasicAuthToObject = function (object: any, configuration?: Configuration) {
    if (configuration && (configuration.username || configuration.password)) {
        object["auth"] = { username: configuration.username, password: configuration.password };
    }
}

/**
 *
 * @export
 */
export const setBearerAuthToObject = async function (object: any, configuration?: Configuration) {
    if (configuration && configuration.accessToken) {
        const accessToken = typeof configuration.accessToken === 'function'
            ? await configuration.accessToken()
            : await configuration.accessToken;
        object["Authorization"] = "Bearer " + accessToken;
    }
}

/**
 *
 * @export
 */
export const setOAuthToObject = async function (object: any, name: string, scopes: string[], configuration?: Configuration) {
    if (configuration && configuration.accessToken) {
        const localVarAccessTokenValue = typeof configuration.accessToken === 'function'
            ? await configuration.accessToken(name, scopes)
            : await configuration.accessToken;
        object["Authorization"] = "Bearer " + localVarAccessTokenValue;
    }
}

function setFlattenedQueryParams(urlSearchParams: URLSearchParams, parameter: any, key: string = ""): void {
    if (parameter == null) return;
    if (typeof parameter === "object") {
        if (Array.isArray(parameter)) {
            (parameter as any[]).forEach(item => setFlattenedQueryParams(urlSearchParams, item, key));
        } 
        else {
            Object.keys(parameter).forEach(currentKey => 
                setFlattenedQueryParams(urlSearchParams, parameter[currentKey], `${key}${key !== '' ? '.' : ''}${currentKey}`)
            );
        }
    } 
    else {
        if (urlSearchParams.has(key)) {
            urlSearchParams.append(key, parameter);
        } 
        else {
            urlSearchParams.set(key, parameter);
        }
    }
}

/**
 *
 * @export
 */
export const setSearchParams = function (url: URL, ...objects: any[]) {
    const searchParams = new URLSearchParams(url.search);
    setFlattenedQueryParams(searchParams, objects);
    url.search = searchParams.toString();
}

/**
 *
 * @export
 */
export const serializeDataIfNeeded = function (value: any, requestOptions: any, configuration?: Configuration) {
    const nonString = typeof value !== 'string';
    const needsSerialization = nonString && configuration && configuration.isJsonMime
        ? configuration.isJsonMime(requestOptions.headers['Content-Type'])
        : nonString;
    return needsSerialization
        ? JSON.stringify(value !== undefined ? value : {})
        : (value || "");
}

/**
 *
 * @export
 */
export const toPathString = function (url: URL) {
    return url.pathname + url.search + url.hash
}

/**
 *
 * @export
 */
export const createRequestFunction = function (axiosArgs: RequestArgs, globalAxios: AxiosInstance, BASE_PATH: string, configuration?: Configuration) {
    return <T = unknown, R = AxiosResponse<T>>(axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
        const axiosRequestArgs = {...axiosArgs.options, url: (configuration?.basePath || axios.defaults.baseURL || basePath) + axiosArgs.url};
        return axios.request<T, R>(axiosRequestArgs);
    };
}
