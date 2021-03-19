/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
* Locale to use, defaults to DE.
- DE (German)
- EN (English)
- FR (French)
- IT (Italian)
*/
export enum Locale {
  DE = 'DE',
  EN = 'EN',
  FR = 'FR',
  IT = 'IT',
}

/**
 * 2D Coordinate within geo reference system.
 */
export interface Coordinate2D {
  /**
   * Longitude position in reference system.
   * @format double
   */
  longitude: number;

  /**
   * Latitude position in reference system.
   * @format double
   */
  latitude: number;
}

/**
 * Base information for a stop place [Haltestelle].
 */
export interface StopPlace {
  /** Eva number of stop place. */
  evaNumber: string;

  /** ID of station [Bahnhof] the stop place belongs to [usually the STADA code for S&S], may be empty when stop place is not part of a station. */
  stationID?: string;

  /** Language dependent names for stop place, may contain different stop place names for a specific language depending on names filter. */
  names: Record<string, StopPlaceName>;

  /** Language dependent name for metropolis [Metropole]. */
  metropolis?: Record<string, string>;

  /** Available transport types [Verkehrsarten] at stop place. */
  availableTransports: TransportType[];

  /** Country [Staat / Land] the stop place belongs to as ISO-2 code [germany = DE for instance]. */
  countryCode: string;

  /** Timezone the stop place belongs to in iana time zone notation, for instance 'MET', 'CET', 'GMT-3' etc. Must not necessarly be the time zone of the geo coordinate. */
  timeZone: string;

  /**
   * Date the stop place is valid from.
   * @format date-time
   */
  validFrom?: string;

  /**
   * Date the stop place is valid to.
   * @format date-time
   */
  validTo?: string;

  /** 2D Coordinate within geo reference system. */
  position?: Coordinate2D;
}

/**
 * Name information for stop place [Haltestelle].
 */
export interface StopPlaceName {
  /** Full long name for stop place. */
  nameLong: string;

  /** Short name for stop place. */
  nameShort: string;

  /** Name that is applicable for local areas, for instance 'Berlin Zoologischer Garten' may become 'B Zoologischer Garten'. */
  nameLocal?: string;

  /** Long name speech information for stop place [Haltestelle]. */
  speechLong?: string;

  /** Short name speech information for stop place [Haltestelle]. */
  speechShort?: string;

  /** Symbol information [UTF-8] for stop place [Haltestelle]. */
  symbol?: string;
}

/**
 * Pageable stop place [Haltestelle] search result.
 */
export interface StopPlacesPageable {
  /**
   * Pagination offset of the results, provided by the consumer.
   * @format int32
   */
  offset: number;

  /**
   * Maximum number of results that may be returned for one page, provided by the consumer.
   * @format int32
   */
  limit: number;

  /**
   * Total number of available results.
   * @format int32
   */
  total: number;
  stopPlaces?: StopPlace[];
}

/**
* Type of transport.
- HIGH_SPEED_TRAIN (High speed train [Hochgeschwindigkeitszug] like ICE or TGV etc.)
- INTERCITY_TRAIN (Inter city train [Intercityzug])
- INTER_REGIONAL_TRAIN (Inter regional train [Interregiozug])
- REGIONAL_TRAIN (Regional train [Regionalzug])
- CITY_TRAIN (City train [S-Bahn])
- SUBWAY (Subway [U-Bahn])
- TRAM (Tram [Strassenbahn])
- BUS (Bus [Bus])
- FERRY (Ferry [Faehre])
- FLIGHT (Flight [Flugzeug])
- CAR (Car [Auto])
- TAXI (Taxi)
- SHUTTLE (Shuttle [Ruftaxi])
- BIKE ((E-)Bike [Fahrrad])
- SCOOTER ((E-)Scooter [Roller])
- WALK (Walk ([Laufen])
- UNKNOWN (Unknown)
*/
export enum TransportType {
  HIGH_SPEED_TRAIN = 'HIGH_SPEED_TRAIN',
  INTERCITY_TRAIN = 'INTERCITY_TRAIN',
  INTER_REGIONAL_TRAIN = 'INTER_REGIONAL_TRAIN',
  REGIONAL_TRAIN = 'REGIONAL_TRAIN',
  CITY_TRAIN = 'CITY_TRAIN',
  SUBWAY = 'SUBWAY',
  TRAM = 'TRAM',
  BUS = 'BUS',
  FERRY = 'FERRY',
  FLIGHT = 'FLIGHT',
  CAR = 'CAR',
  TAXI = 'TAXI',
  SHUTTLE = 'SHUTTLE',
  BIKE = 'BIKE',
  SCOOTER = 'SCOOTER',
  WALK = 'WALK',
  UNKNOWN = 'UNKNOWN',
}

/**
* Possible groups to consider when returning connecting-times for particular stop-place.
- STATION (return connecting-times for stop-place and all members of the same station [Bahnhof]
- SALES (return connecting-times for stop-place and all members of the sales group [EFZ / Vertrieb inkl. OEPNV]
- ALL (return connecting-times for stop-place and all members of all groups the stop-place belongs to [all we have]
*/
export enum ConnectingTimeGroup {
  STATION = 'STATION',
  SALES = 'SALES',
  ALL = 'ALL',
}

/**
* Specifies different personae.
- HANDICAPPED (Handicaped [MER] slow traveller, not able to use stairs and escalators)
- OCCASIONAL_TRAVELLER (Occasional traveller [Gelegenheits-Reisender / Standard-Reisender] having mean walking speed. This is the default traveller.)
- FREQUENT_TRAVELLER (Frequent traveller [Pendler] having higher speed than occasional traveller.)
*/
export enum PersonaType {
  HANDICAPPED = 'HANDICAPPED',
  OCCASIONAL_TRAVELLER = 'OCCASIONAL_TRAVELLER',
  FREQUENT_TRAVELLER = 'FREQUENT_TRAVELLER',
}

/**
* Enumerates all possible sources for connecting times [Umsteigezeiten].
- FIXED (no specific information available, fixed constant used)
- RIL420 (connecting time is based on DB guideline RIL420)
- EFZ (connecting time is based on EFZ = Europäisches Fahrplanzentrum)
- INDOOR_ROUTING (connecting time is based on real indoor routing information from ris-maps system)
*/
export enum ConnectingTimeSource {
  FIXED = 'FIXED',
  RIL420 = 'RIL420',
  EFZ = 'EFZ',
  INDOOR_ROUTING = 'INDOOR_ROUTING',
}

/**
 * Connecting time [Umsteigezeit] from a particular stop place [Haltestelle], platform [Gleis, Bahnsteig, Plattform] and optional sector [Gleisabschnitt, Steigabschnitt] to a particular station, platform and optional sector.
 */
export interface ConnectingTime {
  /** Eva number of stop place [Haltestelle] to connect from. */
  fromEvaNumber: string;

  /** Platform [Gleis, Bahnsteig, Plattform] of stop place to connect from. */
  fromPlatform: string;

  /** Sector [Gleisabschnitt, Steigabschnitt] of stop place to connect from. */
  fromSector?: string;

  /** Eva number stop place to connect to. */
  toEvaNumber: string;

  /** Platform [Gleis, Bahnsteig, Plattform] of stop place [Haltestelle] to connect to. */
  toPlatform: string;

  /** Sector [Gleisabschnitt, Steigabschnitt] of stop place [Haltestelle] to connect from. */
  toSector?: string;

  /** Indicates whether connection takes place on the same physical platform [Bahnsteig] (platform '12' and '13' belong to physical platform '12/13' for instance). */
  identicalPhysicalPlatform: boolean;

  /** Connecting times fo different personae. */
  times: ConnectionTime[];

  /**
   * Enumerates all possible sources for connecting times [Umsteigezeiten].
   * - FIXED (no specific information available, fixed constant used)
   * - RIL420 (connecting time is based on DB guideline RIL420)
   * - EFZ (connecting time is based on EFZ = Europäisches Fahrplanzentrum)
   * - INDOOR_ROUTING (connecting time is based on real indoor routing information from ris-maps system)
   */
  source: ConnectingTimeSource;
}

/**
* Enumerates all possible sources for fallback connecting times [Umsteigezeiten].
- FIXED (no specific information available, fixed constant used)
- RIL420 (connecting time is based on DB guideline RIL420)
*/
export enum ConnectingTimeFallbackSource {
  FIXED = 'FIXED',
  RIL420 = 'RIL420',
}

/**
 * List of connecting times [Umsteigezeiten] for requested list of stop places [Haltestellen].
 */
export interface ConnectingTimes {
  /** Fallback times for different personae in case no information is available. */
  fallbackTimes: ConnectionTimeFallback[];

  /** List of connecting times. */
  connectingTimesList: ConnectingTime[];
}

/**
 * Connection time [Anschlusszeit] for persona.
 */
export interface ConnectionTime {
  /**
   * Specifies different personae.
   * - HANDICAPPED (Handicaped [MER] slow traveller, not able to use stairs and escalators)
   * - OCCASIONAL_TRAVELLER (Occasional traveller [Gelegenheits-Reisender / Standard-Reisender] having mean walking speed. This is the default traveller.)
   * - FREQUENT_TRAVELLER (Frequent traveller [Pendler] having higher speed than occasional traveller.)
   */
  persona: PersonaType;

  /** Distance in meters. */
  distance?: number;

  /**
   * Duration of connect in ISO8601 (for instance 'P3Y6M4DT12H30M17S').
   * @format duration
   */
  duration: string;
}

/**
 * Fallback connection time [Anschlusszeit] for persona in case no information on stop-places and or plattform is available.
 */
export interface ConnectionTimeFallback {
  /**
   * Specifies different personae.
   * - HANDICAPPED (Handicaped [MER] slow traveller, not able to use stairs and escalators)
   * - OCCASIONAL_TRAVELLER (Occasional traveller [Gelegenheits-Reisender / Standard-Reisender] having mean walking speed. This is the default traveller.)
   * - FREQUENT_TRAVELLER (Frequent traveller [Pendler] having higher speed than occasional traveller.)
   */
  persona: PersonaType;

  /**
   * Duration of connect in ISO8601 (for instance 'P3Y6M4DT12H30M17S').
   * @format duration
   */
  duration: string;

  /**
   * Enumerates all possible sources for fallback connecting times [Umsteigezeiten].
   * - FIXED (no specific information available, fixed constant used)
   * - RIL420 (connecting time is based on DB guideline RIL420)
   */
  source: ConnectingTimeFallbackSource;
}

/**
 * Stop place [Haltestelle] result.
 */
export interface StopPlaces {
  stopPlaces?: StopPlace[];
}

/**
 * Accessibility [Barrierefreiheit] information for a particular platform.
 */
export interface Accessibility {
  /**
   * Status of platform accessibility [Barrierefreiheit] information.
   * - AVAILABLE (accessibility item is available)
   * - NOT_AVAILABLE (accessibility item is not available)
   * - PARTIAL (accessibility item is only partial available, for instance availble for 12a but not for 12b and therefore not for 12 in total)
   * - NOT_APPLICABLE (accessibility item is not applicable because it depends on availability of other items, for instance stair mark depends on step free access)
   * - UNKNOWN (no information on availability for accessibility item)
   */
  audibleSignalsAvailable?: AccessibilityStatus;

  /**
   * Status of platform accessibility [Barrierefreiheit] information.
   * - AVAILABLE (accessibility item is available)
   * - NOT_AVAILABLE (accessibility item is not available)
   * - PARTIAL (accessibility item is only partial available, for instance availble for 12a but not for 12b and therefore not for 12 in total)
   * - NOT_APPLICABLE (accessibility item is not applicable because it depends on availability of other items, for instance stair mark depends on step free access)
   * - UNKNOWN (no information on availability for accessibility item)
   */
  automaticDoor?: AccessibilityStatus;

  /**
   * Status of platform accessibility [Barrierefreiheit] information.
   * - AVAILABLE (accessibility item is available)
   * - NOT_AVAILABLE (accessibility item is not available)
   * - PARTIAL (accessibility item is only partial available, for instance availble for 12a but not for 12b and therefore not for 12 in total)
   * - NOT_APPLICABLE (accessibility item is not applicable because it depends on availability of other items, for instance stair mark depends on step free access)
   * - UNKNOWN (no information on availability for accessibility item)
   */
  boardingAid?: AccessibilityStatus;

  /**
   * Status of platform accessibility [Barrierefreiheit] information.
   * - AVAILABLE (accessibility item is available)
   * - NOT_AVAILABLE (accessibility item is not available)
   * - PARTIAL (accessibility item is only partial available, for instance availble for 12a but not for 12b and therefore not for 12 in total)
   * - NOT_APPLICABLE (accessibility item is not applicable because it depends on availability of other items, for instance stair mark depends on step free access)
   * - UNKNOWN (no information on availability for accessibility item)
   */
  passengerInformationDisplay?: AccessibilityStatus;

  /**
   * Status of platform accessibility [Barrierefreiheit] information.
   * - AVAILABLE (accessibility item is available)
   * - NOT_AVAILABLE (accessibility item is not available)
   * - PARTIAL (accessibility item is only partial available, for instance availble for 12a but not for 12b and therefore not for 12 in total)
   * - NOT_APPLICABLE (accessibility item is not applicable because it depends on availability of other items, for instance stair mark depends on step free access)
   * - UNKNOWN (no information on availability for accessibility item)
   */
  standardPlatformHeight?: AccessibilityStatus;

  /**
   * Status of platform accessibility [Barrierefreiheit] information.
   * - AVAILABLE (accessibility item is available)
   * - NOT_AVAILABLE (accessibility item is not available)
   * - PARTIAL (accessibility item is only partial available, for instance availble for 12a but not for 12b and therefore not for 12 in total)
   * - NOT_APPLICABLE (accessibility item is not applicable because it depends on availability of other items, for instance stair mark depends on step free access)
   * - UNKNOWN (no information on availability for accessibility item)
   */
  platformSign?: AccessibilityStatus;

  /**
   * Status of platform accessibility [Barrierefreiheit] information.
   * - AVAILABLE (accessibility item is available)
   * - NOT_AVAILABLE (accessibility item is not available)
   * - PARTIAL (accessibility item is only partial available, for instance availble for 12a but not for 12b and therefore not for 12 in total)
   * - NOT_APPLICABLE (accessibility item is not applicable because it depends on availability of other items, for instance stair mark depends on step free access)
   * - UNKNOWN (no information on availability for accessibility item)
   */
  stairsMarking?: AccessibilityStatus;

  /**
   * Status of platform accessibility [Barrierefreiheit] information.
   * - AVAILABLE (accessibility item is available)
   * - NOT_AVAILABLE (accessibility item is not available)
   * - PARTIAL (accessibility item is only partial available, for instance availble for 12a but not for 12b and therefore not for 12 in total)
   * - NOT_APPLICABLE (accessibility item is not applicable because it depends on availability of other items, for instance stair mark depends on step free access)
   * - UNKNOWN (no information on availability for accessibility item)
   */
  stepFreeAccess?: AccessibilityStatus;

  /**
   * Status of platform accessibility [Barrierefreiheit] information.
   * - AVAILABLE (accessibility item is available)
   * - NOT_AVAILABLE (accessibility item is not available)
   * - PARTIAL (accessibility item is only partial available, for instance availble for 12a but not for 12b and therefore not for 12 in total)
   * - NOT_APPLICABLE (accessibility item is not applicable because it depends on availability of other items, for instance stair mark depends on step free access)
   * - UNKNOWN (no information on availability for accessibility item)
   */
  tactileGuidingStrips?: AccessibilityStatus;

  /**
   * Status of platform accessibility [Barrierefreiheit] information.
   * - AVAILABLE (accessibility item is available)
   * - NOT_AVAILABLE (accessibility item is not available)
   * - PARTIAL (accessibility item is only partial available, for instance availble for 12a but not for 12b and therefore not for 12 in total)
   * - NOT_APPLICABLE (accessibility item is not applicable because it depends on availability of other items, for instance stair mark depends on step free access)
   * - UNKNOWN (no information on availability for accessibility item)
   */
  tactileHandrailLabel?: AccessibilityStatus;

  /**
   * Status of platform accessibility [Barrierefreiheit] information.
   * - AVAILABLE (accessibility item is available)
   * - NOT_AVAILABLE (accessibility item is not available)
   * - PARTIAL (accessibility item is only partial available, for instance availble for 12a but not for 12b and therefore not for 12 in total)
   * - NOT_APPLICABLE (accessibility item is not applicable because it depends on availability of other items, for instance stair mark depends on step free access)
   * - UNKNOWN (no information on availability for accessibility item)
   */
  tactilePlatformAccess?: AccessibilityStatus;
}

/**
* Status of platform accessibility [Barrierefreiheit] information.
- AVAILABLE (accessibility item is available)
- NOT_AVAILABLE (accessibility item is not available)
- PARTIAL (accessibility item is only partial available, for instance availble for 12a but not for 12b and therefore not for 12 in total)
- NOT_APPLICABLE (accessibility item is not applicable because it depends on availability of other items, for instance stair mark depends on step free access)
- UNKNOWN (no information on availability for accessibility item)
*/
export enum AccessibilityStatus {
  AVAILABLE = 'AVAILABLE',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  PARTIAL = 'PARTIAL',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Detailed operational [Betrieb] information.
 */
export interface Operational {
  /**
   * Total length of platform [Baulicher Bereich].
   * @format double
   */
  length?: number;

  /**
   * Orientation of the platform in degrees (north=0, east=90, ...), seen from the origin of the local coordinates.
   * @format double
   */
  orientation?: number;

  /** Positions of the reference points that determine the position of a stopping train at the platform. */
  referencePoints?: ReferencePoint[];

  /** Names of the operational units [Optiken] that belong to the platform. */
  optics?: string[];

  /** Names of the network platforms [Netzgleis] that belong to the platform. */
  networkPlatforms?: string[];
}

/**
 * Platform [Gleis, Bahnsteig, Plattform] information. All ranges and positions of objects are given in meter in local coordinates, e.g. as a distance to a fixed point somewhere on the platform and differentiating between the two possible directions by a plus- and a minus-sign.
 */
export interface Platform {
  /** Name of the platform (12, 1a, Nord, Süd etc.). */
  name: string;

  /**
   * Start of the usable part of the platform given in meter in local coordinates. This value may differ from zero and may be positive as well as negative.
   * @format double
   */
  start?: number;

  /**
   * End of the usable part of the platform given in meter in local coordinates.
   * @format double
   */
  end?: number;

  /**
   * Total length of platform [Baulicher Bereich].
   * @format double
   */
  length?: number;

  /** List of platforms [Gleise] that share the same physical platform [Bahnsteig]. */
  linkedPlatforms?: string[];

  /** Name of parent platform in case this is a subplatform [Teilgleis]. */
  parentPlatform?: string;

  /** Indicates whether platform is a head platform [Kopfgleis]. */
  headPlatform?: boolean;

  /** List of sectors [Sektoren] that belong to the platform. */
  sectors?: Sector[];

  /** Accessibility [Barrierefreiheit] information for a particular platform. */
  accessibility?: Accessibility;

  /** Detailed operational [Betrieb] information. */
  operational?: Operational;
}

/**
 * List of platforms [Gleise, Bahnsteige, Plattformen] for a station.
 */
export interface Platforms {
  platforms?: Platform[];
}

/**
 * Reference point that indicates where a vehicle [Fahrzeug] stops at a platform [Gleis, Bahnsteig, Plattform].
 */
export interface ReferencePoint {
  /** Unique ID of reference point. */
  uuid: string;

  /** Name of the reference point. */
  name: string;

  /**
   * Type of a reference point.
   * - STOP_SIGNAL (Haltesignal)
   * - STOP_BOARD (Haltetafel)
   */
  referencePointType: ReferencePointType;

  /**
   * Position of the reference point in meter in local coordinates.
   * @format double
   */
  position: number;

  /**
   * Length up to the reference point is to be used by a stopping formation.
   * @format double
   */
  maxLength?: number;

  /** Determines the direction the reference point is to be used. If true, the formation moves from origin to positive values in local coordinates. */
  readableFromOrigin: boolean;
}

/**
* Type of a reference point.
- STOP_SIGNAL (Haltesignal)
- STOP_BOARD (Haltetafel)
*/
export enum ReferencePointType {
  STOP_SIGNAL = 'STOP_SIGNAL',
  STOP_BOARD = 'STOP_BOARD',
}

/**
 * Platform [Gleis, Bahnsteig, Plattform] sector [Gleisabschnitt, Steigabschnitt] information.
 */
export interface Sector {
  /** Name of the sector [Sektor / Mast etc.]. */
  name: string;

  /**
   * Start of the sector given in meters in local coordinates.
   * @format double
   */
  start: number;

  /**
   * End of the sector given in meters in local coordinates.
   * @format double
   */
  end: number;

  /**
   * Position of the cube [Sektorwuerfel] given in meters in local coordinates.
   * @format double
   */
  cubePosition?: number;

  /** Indicates whether cube [Sektorwuerfel] has signage [Beschilderung] nor not. */
  cubeSignage?: boolean;
}

/**
* Enumerates all identifiers a stop-place [Haltestelle] can be mapped into or mapped from.
- IFOPT (transmodel identifier for fixed objects, in germany dhid = Deutschlandweite Halt ID)
- EVA (eva number)
- RL100 (primary rl100 / ds100)
- RL100_ALTERNATIVE (alternative rl100 / ds100)
- EPA (epa uic number)
- STADA (statitionsdatenbank number)
- IBNR (internal station number [interne bahnhofsnummer])
- UIC (international station number)
*/
export enum StopPlaceKeyType {
  IFOPT = 'IFOPT',
  EVA = 'EVA',
  RL100 = 'RL100',
  RL100ALTERNATIVE = 'RL100_ALTERNATIVE',
  EPA = 'EPA',
  STADA = 'STADA',
  IBNR = 'IBNR',
  UIC = 'UIC',
}

/**
 * Key mapping for a stop place [Haltestelle].
 */
export interface StopPlaceKey {
  /**
   * Enumerates all identifiers a stop-place [Haltestelle] can be mapped into or mapped from.
   * - IFOPT (transmodel identifier for fixed objects, in germany dhid = Deutschlandweite Halt ID)
   * - EVA (eva number)
   * - RL100 (primary rl100 / ds100)
   * - RL100_ALTERNATIVE (alternative rl100 / ds100)
   * - EPA (epa uic number)
   * - STADA (statitionsdatenbank number)
   * - IBNR (internal station number [interne bahnhofsnummer])
   * - UIC (international station number)
   */
  type: StopPlaceKeyType;

  /** Key value. */
  key: string;
}

/**
 * Different key mappings a stop place [Haltestelle] may have.
 */
export interface StopPlaceKeys {
  /** List of stop place keys. */
  keys: StopPlaceKey[];
}

/**
* Different grouping options for stop places name query.
- STATION (group by parent station that is defined by DB Station & Services STADA-ID)
- NONE (no grouping is applied, just stop-places are returned)
*/
export enum StopPlaceSearchGroupByKey {
  STATION = 'STATION',
  NONE = 'NONE',
}

/**
* Different sorting keys for stop place queries.
- RELEVANCE (stop places are sorted by relevance descending (central stations etc. first))
- QUERY_MATCH (stop places are sorted by matching the provided query descending)
*/
export enum StopPlaceSortKey {
  RELEVANCE = 'RELEVANCE',
  QUERY_MATCH = 'QUERY_MATCH',
}

/**
 * Search result information for a stop place [Haltestelle].
 */
export interface StopPlaceSearchResult {
  /** Eva number of stop place. */
  evaNumber: string;

  /** ID of station [Bahnhof] the stop place belongs to [usually the STADA code for S&S], may be empty when stop place is not part of a station. */
  stationID?: string;

  /** TBD */
  groupMembers: string[];

  /** Language dependent names for stop place. */
  names: Record<string, StopPlaceName>;

  /** Available transport types [Verkehrsarten] at stop place. */
  availableTransports: TransportType[];

  /** 2D Coordinate within geo reference system. */
  position?: Coordinate2D;
}

/**
 * Stop place [Haltestelle] search result.
 */
export interface StopPlaceSearchResults {
  stopPlaces?: StopPlaceSearchResult[];
}
