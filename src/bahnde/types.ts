interface StopPlaceLocation {
	type: 'stopPlace';
	evaNumber: string;
}

interface RoutingVia {
	evaNumber: string;
	minChangeTime?: number;
}

export interface RoutingOptions {
	start: StopPlaceLocation;
	destination: StopPlaceLocation;
	via?: RoutingVia[];
	time?: Date;
	transferTime?: number;
	maxChanges?: number;
	searchForDeparture?: boolean;
	onlyRegional?: boolean;
	ctxScr?: string;
	useV6?: boolean;
}

export type BahnDEProduktGattung =
	| 'ICE'
	| 'EC_IC'
	| 'IR'
	| 'REGIONAL'
	| 'SBAHN'
	| 'BUS'
	| 'SCHIFF'
	| 'UBAHN'
	| 'TRAM'
	| 'ANRUFPFLICHTIG';

interface BahnDEViaHalt {
	aufenthaltsdauer?: number;
	id: string;
}

type BahnDEKlasse = 'KLASSE_2' | 'KLASSE_1';

export interface BahnDERoutingOptions {
	abfahrtsHalt: string; // A=1@O=Karlsruhe Hbf@X=8402181@Y=48993512@U=80@L=8000191@B=1@p=1733178662@i=U×008014228@
	ankunftsHalt: string; // A=1@O=Dortmund Hbf@X=7459294@Y=51517899@U=80@L=8000080@B=1@p=1733178662@i=U×008010053@
	anfrageZeitpunkt: string; // "2024-12-14T09:10:06" - NOT ISO! Always europe berlin!
	ankunftSuche: 'ABFAHRT' | 'ANKUNFT';
	klasse: BahnDEKlasse;
	produktgattungen: string[];
	schnelleVerbindungen: boolean;
	sitzplatzOnly: boolean;
	bikeCarriage: boolean;
	reservierungsKontingenteVorhanden: boolean;
	nurDeutschlandTicketVerbindungen: boolean;
	deutschlandTicketVorhanden: boolean;
	reisende: {
		typ: 'ERWACHSENER';
		ermaessigungen: [{ art: 'KEINE_ERMAESSIGUNG'; klasse: 'KLASSENLOS' }];
		alter: [];
		anzahl: 1;
	}[];
	zwischenhalte?: BahnDEViaHalt[];
	pagingReference?: string;
	minUmstiegszeit?: number;
	maxUmstiege?: number;
}

interface BahnDERoutingReference {
	earlier: string;
	later: string;
}

export interface BahnDERoutingResult {
	verbindungReference: BahnDERoutingReference;
	tripId: string;
	verbindungen: BahnDERoutingVerbindung[];
}

export interface BahnDEAuslastungsMeldung {
	klasse: BahnDEKlasse;
	stufe: 0 | 1 | 2 | 3 | 4 | 99;
}

interface BahnDEHimMeldung {
	ueberschrift: string;
	text: string;
	prioritaet: string;
	/** ISO Date in Europe/Berlin without offset */
	modDateTime: string;
}

interface BahnDEPriorisierteMeldung {
	prioritaet: string;
	text: string;
}

export interface BahnDERISNotiz {
	key: string;
	value: string;
}

export interface BahnDEHalt {
	id: string;
	/** ISO Date in Europe/Berlin without offset */
	abfahrtsZeitpunkt?: string;
	/** ISO Date in Europe/Berlin without offset */
	ezAbfahrtsZeitpunkt?: string;
	auslastungsmeldungen?: BahnDEAuslastungsMeldung[];
	gleis?: string;
	/** Educated Guess for now */
	ezGleis?: string;
	name: string;
	risNotizen?: BahnDERISNotiz[];
	bahnhofsInfoId?: string;
	extId: string;
	himMeldungen: BahnDEHimMeldung[];
	routeIdx: number;
	priorisierteMeldungen: BahnDEPriorisierteMeldung[];
	/** ISO Date in Europe/Berlin without offset */
	ankunftsZeitpunkt?: string;
	/** ISO Date in Europe/Berlin without offset */
	ezAnkunftsZeitpunkt?: string;
}

export interface BahnDEFahrtHalt extends BahnDEHalt {
	adminID?: string;
	kategorie?: string;
	nummer?: string;
}

interface BahnDEVerkehrsmittelAttribut {
	kategorie: string;
	key: string;
	value: string;
}

export interface BahnDEVerkehrsmittel {
	/** ICE */
	produktGattung: string;
	/** ICE */
	kategorie: string;
	/** ICE 76 */
	name: string;
	linienNummer?: string;
	/** 76 */
	nummer: string;
	richtung: string;
	typ: string;
	zugattribute: BahnDEVerkehrsmittelAttribut[];
	/** ICE */
	kurzText: string;
	/** ICE 76 */
	mittelText: string;
	/** ICE 76 / RE 73 (26134)*/
	langText: string;
}

export interface BahnDERoutingAbschnitt {
	risNotizen?: BahnDERISNotiz[];
	himMeldungen?: BahnDEHimMeldung[];
	priorisierteMeldungen?: BahnDEPriorisierteMeldung[];
	externeBahnhofsinfoIdOrigin?: string;
	externeBahnhofsinfoIdDestination?: string;
	/** ISO Date in Europe/Berlin without offset */
	abfahrtsZeitpunkt: string;
	abfahrtsOrt: string;
	abfahrtsOrtExtId: string;
	abschnittsDauer: number;
	abschnittsAnteil: number;
	ankunftsOrt: string;
	ankunftsOrtExtId: string; // Eva
	auslastungsmeldungen: BahnDEAuslastungsMeldung[];
	/** ISO Date in Europe/Berlin without offset */
	ezAbfahrtsZeitpunkt?: string;
	ezAbschnittsDauerInSeconds?: number;
	/** ISO Date in Europe/Berlin without offset */
	ankunftsZeitpunkt?: string;
	/** ISO Date in Europe/Berlin without offset */
	ezAnkunftsZeitpunkt?: string;
	halte?: BahnDEHalt[];
	idx: number;
	/** This is a Hafas ID! */
	journeyId: string;
	verkehrsmittel: BahnDEVerkehrsmittel;
}

export interface BahnDERoutingVerbindung {
	tripId: string;
	ctxRecon: string;
	verbindungsAbschnitte: BahnDERoutingAbschnitt[];
	umstiegsAnzahl: number;
	verbindungsDauerInSeconds: number;
	ezVerbindungsDauerInSeconds?: number;
	isAlternativeVerbindung: boolean;
	auslastungsmeldungen?: BahnDEAuslastungsMeldung[];
	auslastungstexte?: any;
	himMeldungen?: BahnDEHimMeldung[];
	risNotizen?: BahnDERISNotiz[];
	priorisierteMeldungen?: BahnDEPriorisierteMeldung[];
	reservierungsMeldungen?: any[];
	isAngebotseinholungNachgelagert?: boolean;
	isAlterseingabeErforderlich?: boolean;
	serviceDays?: any;
	ereignisZusammenfassung?: { prioritaet: string };
	angebotsPreis?: any;
	hasTeilpreis?: boolean;
	reiseAngebote?: any[];
	hinRueckPauschalpreis?: boolean;
	isReservierungAusserhalbVorverkaufszeitraum?: boolean;
	gesamtAngebotsbeziehungList?: any[];
}

export interface BahnDEFahrt {
	/** ISO Date */
	reisetag: string;
	regulaereVerkehrstage: string;
	irregulaereVerkehrstage: string;
	zugName: string;
	halte: BahnDEFahrtHalt[];
	himMeldungen?: BahnDEHimMeldung[];
	risNotizen?: BahnDERISNotiz[];
	zugattribute?: BahnDEVerkehrsmittelAttribut[];
	priorisierteMeldungen: BahnDEPriorisierteMeldung[];
	abfahrtsZeitpunkt: string;
	ezAbfahrtsZeitpunkt?: string;
	ankunftsZeitpunkt: string;
	ezAnkunftsZeitpunkt?: string;
	cancelled?: boolean;
	polylineGroup: {
		polylineDescriptions: {
			coordinates: {
				lng: number;
				lat: number;
			}[];
			delta?: boolean;
		}[];
	};
}
