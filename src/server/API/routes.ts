/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TsoaRoute, fetchMiddlewares, KoaTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { JourneysV1Controller } from './controller/journeys/v1';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { StopPlaceController } from './controller/StopPlace/v1';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { IrisControllerv2 } from './controller/Iris/v2';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HafasControllerV4 } from './controller/Hafas/v4';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HafasControllerV3 } from './controller/Hafas/v3';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HafasControllerV2 } from './controller/Hafas/v2';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HafasController } from './controller/Hafas/v1';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CoachSequenceControllerV4 } from './controller/CoachSequence/v4';
import type { Context, Next, Middleware, Request as KRequest, Response as KResponse } from 'koa';
import type * as KoaRouter from '@koa/router';


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "OpL": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "icoX": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommonProductInfo": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "line": {"dataType":"string"},
            "number": {"dataType":"string"},
            "type": {"dataType":"string"},
            "operator": {"ref":"OpL"},
            "admin": {"dataType":"string"},
            "transportType": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ParsedProduct": {
        "dataType": "refAlias",
        "type": {"ref":"CommonProductInfo","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RemL": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"string","required":true},
            "code": {"dataType":"string","required":true},
            "icoX": {"dataType":"double","required":true},
            "txtN": {"dataType":"string","required":true},
            "txtS": {"dataType":"string"},
            "prio": {"dataType":"double"},
            "sIdx": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommonStopInfo": {
        "dataType": "refObject",
        "properties": {
            "isPlan": {"dataType":"boolean"},
            "scheduledPlatform": {"dataType":"string"},
            "platform": {"dataType":"string"},
            "scheduledTime": {"dataType":"datetime","required":true},
            "time": {"dataType":"datetime","required":true},
            "delay": {"dataType":"integer"},
            "reihung": {"dataType":"boolean"},
            "messages": {"dataType":"array","array":{"dataType":"refObject","ref":"RemL"}},
            "cancelled": {"dataType":"boolean"},
            "isRealTime": {"dataType":"boolean"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MinimalStopPlace": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "evaNumber": {"dataType":"string","required":true},
            "ril100": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuslastungsValue": {
        "dataType": "refEnum",
        "enums": [1,2,3,4],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RouteAuslastung": {
        "dataType": "refObject",
        "properties": {
            "first": {"ref":"AuslastungsValue"},
            "second": {"ref":"AuslastungsValue"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MessagePrio": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["1"]},{"dataType":"enum","enums":["2"]},{"dataType":"enum","enums":["3"]},{"dataType":"enum","enums":["4"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IrisMessage": {
        "dataType": "refObject",
        "properties": {
            "text": {"dataType":"string","required":true},
            "timestamp": {"dataType":"datetime"},
            "superseded": {"dataType":"boolean"},
            "priority": {"ref":"MessagePrio"},
            "value": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HimIrisMessage": {
        "dataType": "refObject",
        "properties": {
            "text": {"dataType":"string","required":true},
            "timestamp": {"dataType":"datetime"},
            "superseded": {"dataType":"boolean"},
            "priority": {"ref":"MessagePrio"},
            "value": {"dataType":"double"},
            "head": {"dataType":"string","required":true},
            "short": {"dataType":"string"},
            "stopPlaceInfo": {"dataType":"string"},
            "source": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Message": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"IrisMessage"},{"ref":"HimIrisMessage"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StopAtStopPlace": {
        "dataType": "refObject",
        "properties": {
            "canceled": {"dataType":"boolean","required":true},
            "evaNumber": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StopPlaceEmbedded": {
        "dataType": "refObject",
        "properties": {
            "evaNumber": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DirectionInfo": {
        "dataType": "refObject",
        "properties": {
            "text": {"dataType":"string"},
            "stopPlaces": {"dataType":"array","array":{"dataType":"refObject","ref":"StopPlaceEmbedded"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReplacementTransport": {
        "dataType": "refObject",
        "properties": {
            "realType": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransportType": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["HIGH_SPEED_TRAIN"]},{"dataType":"enum","enums":["INTERCITY_TRAIN"]},{"dataType":"enum","enums":["INTER_REGIONAL_TRAIN"]},{"dataType":"enum","enums":["REGIONAL_TRAIN"]},{"dataType":"enum","enums":["CITY_TRAIN"]},{"dataType":"enum","enums":["SUBWAY"]},{"dataType":"enum","enums":["TRAM"]},{"dataType":"enum","enums":["BUS"]},{"dataType":"enum","enums":["FERRY"]},{"dataType":"enum","enums":["FLIGHT"]},{"dataType":"enum","enums":["CAR"]},{"dataType":"enum","enums":["TAXI"]},{"dataType":"enum","enums":["SHUTTLE"]},{"dataType":"enum","enums":["BIKE"]},{"dataType":"enum","enums":["SCOOTER"]},{"dataType":"enum","enums":["WALK"]},{"dataType":"enum","enums":["UNKNOWN"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransportPublicDestinationPortionWorking": {
        "dataType": "refObject",
        "properties": {
            "category": {"dataType":"string","required":true},
            "destination": {"ref":"StopAtStopPlace","required":true},
            "differingDestination": {"ref":"StopAtStopPlace"},
            "direction": {"ref":"DirectionInfo"},
            "journeyID": {"dataType":"string","required":true},
            "label": {"dataType":"string"},
            "line": {"dataType":"string"},
            "number": {"dataType":"double","required":true},
            "replacementTransport": {"ref":"ReplacementTransport"},
            "separationAt": {"ref":"StopPlaceEmbedded"},
            "type": {"ref":"TransportType","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RouteStop": {
        "dataType": "refObject",
        "properties": {
            "arrival": {"ref":"CommonStopInfo"},
            "departure": {"ref":"CommonStopInfo"},
            "station": {"ref":"MinimalStopPlace","required":true},
            "auslastung": {"ref":"RouteAuslastung"},
            "messages": {"dataType":"array","array":{"dataType":"refObject","ref":"RemL"}},
            "additional": {"dataType":"boolean"},
            "cancelled": {"dataType":"boolean"},
            "irisMessages": {"dataType":"array","array":{"dataType":"refAlias","ref":"Message"}},
            "joinsWith": {"dataType":"array","array":{"dataType":"refObject","ref":"TransportPublicDestinationPortionWorking"}},
            "splitsWith": {"dataType":"array","array":{"dataType":"refObject","ref":"TransportPublicDestinationPortionWorking"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ParsedJourneyMatchResponse": {
        "dataType": "refObject",
        "properties": {
            "train": {"ref":"ParsedProduct","required":true},
            "stops": {"dataType":"array","array":{"dataType":"refObject","ref":"RouteStop"},"required":true},
            "jid": {"dataType":"string","required":true},
            "firstStop": {"ref":"RouteStop","required":true},
            "lastStop": {"ref":"RouteStop","required":true},
            "messages": {"dataType":"array","array":{"dataType":"refObject","ref":"RemL"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Administration": {
        "dataType": "refObject",
        "properties": {
            "administrationID": {"dataType":"string","required":true},
            "operatorCode": {"dataType":"string","required":true},
            "operatorName": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Transport": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"string","required":true},
            "category": {"dataType":"string","required":true},
            "journeyNumber": {"dataType":"double","required":true},
            "line": {"dataType":"string"},
            "label": {"dataType":"string"},
            "administration": {"ref":"Administration","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StopPlaceEmbeddedWithCancel": {
        "dataType": "refObject",
        "properties": {
            "evaNumber": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "cancelled": {"dataType":"boolean"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourneyInfo": {
        "dataType": "refObject",
        "properties": {
            "transportAtStart": {"ref":"Transport","required":true},
            "type": {"dataType":"string","required":true},
            "journeyCancelled": {"dataType":"boolean"},
            "origin": {"ref":"StopPlaceEmbeddedWithCancel","required":true},
            "differingOrigin": {"ref":"StopPlaceEmbedded"},
            "destination": {"ref":"StopPlaceEmbeddedWithCancel","required":true},
            "differingDestination": {"ref":"StopPlaceEmbedded"},
            "headerAdministration": {"ref":"Administration","required":true},
            "headerJourneyNumber": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MessageAttribute": {
        "dataType": "refObject",
        "properties": {
            "messageID": {"dataType":"double","required":true},
            "displayPriority": {"dataType":"double"},
            "displayPriorityDetail": {"dataType":"double"},
            "code": {"dataType":"string","required":true},
            "text": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DisruptionCommunicationDescription": {
        "dataType": "refObject",
        "properties": {
            "text": {"dataType":"string","required":true},
            "textShort": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MessageDisruptionCommunication": {
        "dataType": "refObject",
        "properties": {
            "messageID": {"dataType":"double","required":true},
            "disruptionID": {"dataType":"string"},
            "disruptionCommunicationID": {"dataType":"string"},
            "displayPriority": {"dataType":"double"},
            "langDe": {"ref":"DisruptionCommunicationDescription","required":true},
            "langEn": {"ref":"DisruptionCommunicationDescription"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MessageNote": {
        "dataType": "refObject",
        "properties": {
            "messageID": {"dataType":"double","required":true},
            "code": {"dataType":"string"},
            "category": {"dataType":"string"},
            "text": {"dataType":"string","required":true},
            "textShort": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MessageRisCauseCode": {
        "dataType": "refObject",
        "properties": {
            "messageID": {"dataType":"double","required":true},
            "code": {"dataType":"string","required":true},
            "text": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MessageRisQualityDeviation": {
        "dataType": "refObject",
        "properties": {
            "messageID": {"dataType":"double","required":true},
            "code": {"dataType":"string","required":true},
            "text": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Messages": {
        "dataType": "refObject",
        "properties": {
            "attributes": {"dataType":"array","array":{"dataType":"refObject","ref":"MessageAttribute"}},
            "disruptions": {"dataType":"array","array":{"dataType":"refObject","ref":"MessageDisruptionCommunication"}},
            "notes": {"dataType":"array","array":{"dataType":"refObject","ref":"MessageNote"}},
            "risCauseCodes": {"dataType":"array","array":{"dataType":"refObject","ref":"MessageRisCauseCode"}},
            "risQualityDeviations": {"dataType":"array","array":{"dataType":"refObject","ref":"MessageRisQualityDeviation"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EventType": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ARRIVAL"]},{"dataType":"enum","enums":["DEPARTURE"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StopPlaceDifferingInJourney": {
        "dataType": "refObject",
        "properties": {
            "evaNumber": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StopPlaceInJourney": {
        "dataType": "refObject",
        "properties": {
            "evaNumber": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "differingStopPlace": {"ref":"StopPlaceDifferingInJourney"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransportWithDirection": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"string","required":true},
            "category": {"dataType":"string","required":true},
            "journeyNumber": {"dataType":"double","required":true},
            "line": {"dataType":"string"},
            "label": {"dataType":"string"},
            "replacementTransport": {"ref":"ReplacementTransport"},
            "direction": {"ref":"DirectionInfo"},
            "administration": {"ref":"Administration","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CodeShare": {
        "dataType": "refObject",
        "properties": {
            "airlineCode": {"dataType":"string","required":true},
            "flightnumber": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransportDestinationRef": {
        "dataType": "refObject",
        "properties": {
            "journeyID": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "category": {"dataType":"string","required":true},
            "journeyNumber": {"dataType":"double","required":true},
            "line": {"dataType":"string"},
            "label": {"dataType":"string"},
            "destination": {"ref":"StopPlaceEmbeddedWithCancel","required":true},
            "differingDestination": {"ref":"StopPlaceEmbedded"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransportDestinationPortionWorkingRef": {
        "dataType": "refObject",
        "properties": {
            "journeyID": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "category": {"dataType":"string","required":true},
            "journeyNumber": {"dataType":"double","required":true},
            "line": {"dataType":"string"},
            "label": {"dataType":"string"},
            "destination": {"ref":"StopPlaceEmbeddedWithCancel","required":true},
            "differingDestination": {"ref":"StopPlaceEmbedded"},
            "separationAt": {"ref":"StopPlaceEmbedded"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourneyEvent": {
        "dataType": "refObject",
        "properties": {
            "type": {"ref":"EventType","required":true},
            "arrivalOrDepartureID": {"dataType":"string","required":true},
            "stopPlace": {"ref":"StopPlaceInJourney","required":true},
            "transport": {"ref":"TransportWithDirection","required":true},
            "timeSchedule": {"dataType":"string","required":true},
            "timeType": {"dataType":"string","required":true},
            "time": {"dataType":"string","required":true},
            "platformSchedule": {"dataType":"string"},
            "platform": {"dataType":"string"},
            "cancelled": {"dataType":"boolean"},
            "additional": {"dataType":"boolean"},
            "noPassengerChange": {"dataType":"boolean"},
            "onDemand": {"dataType":"boolean"},
            "messages": {"dataType":"array","array":{"dataType":"double"}},
            "codeshares": {"dataType":"array","array":{"dataType":"refObject","ref":"CodeShare"}},
            "reliefFor": {"dataType":"array","array":{"dataType":"refObject","ref":"TransportDestinationRef"}},
            "reliefBy": {"dataType":"array","array":{"dataType":"refObject","ref":"TransportDestinationRef"}},
            "replacementFor": {"dataType":"array","array":{"dataType":"refObject","ref":"TransportDestinationRef"}},
            "replacedBy": {"dataType":"array","array":{"dataType":"refObject","ref":"TransportDestinationRef"}},
            "travelsWith": {"dataType":"array","array":{"dataType":"refObject","ref":"TransportDestinationPortionWorkingRef"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransportOriginRef": {
        "dataType": "refObject",
        "properties": {
            "journeyID": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "category": {"dataType":"string","required":true},
            "journeyNumber": {"dataType":"double","required":true},
            "line": {"dataType":"string"},
            "label": {"dataType":"string"},
            "origin": {"ref":"StopPlaceEmbeddedWithCancel","required":true},
            "differingOrigin": {"ref":"StopPlaceEmbedded"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourneyEventBased": {
        "dataType": "refObject",
        "properties": {
            "journeyID": {"dataType":"string","required":true},
            "info": {"ref":"JourneyInfo","required":true},
            "messages": {"ref":"Messages"},
            "events": {"dataType":"array","array":{"dataType":"refObject","ref":"JourneyEvent"}},
            "eventsCancelled": {"dataType":"array","array":{"dataType":"refObject","ref":"JourneyEvent"}},
            "continuationFor": {"dataType":"array","array":{"dataType":"refObject","ref":"TransportOriginRef"}},
            "continuationBy": {"dataType":"array","array":{"dataType":"refObject","ref":"TransportDestinationRef"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HafasCoordinates": {
        "dataType": "refObject",
        "properties": {
            "lat": {"dataType":"double","required":true},
            "lng": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HafasStation": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "evaNumber": {"dataType":"string","required":true},
            "ril100": {"dataType":"string"},
            "products": {"dataType":"array","array":{"dataType":"refAlias","ref":"ParsedProduct"}},
            "coordinates": {"ref":"HafasCoordinates","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ParsedPolyline": {
        "dataType": "refObject",
        "properties": {
            "points": {"dataType":"array","array":{"dataType":"array","array":{"dataType":"double"}},"required":true},
            "delta": {"dataType":"boolean","required":true},
            "locations": {"dataType":"array","array":{"dataType":"refObject","ref":"HafasStation"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProdCtx": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "num": {"dataType":"string"},
            "matchId": {"dataType":"string"},
            "catOut": {"dataType":"string"},
            "catOutS": {"dataType":"string"},
            "catOutL": {"dataType":"string"},
            "catIn": {"dataType":"string"},
            "catCode": {"dataType":"string"},
            "admin": {"dataType":"string"},
            "lineId": {"dataType":"string"},
            "line": {"dataType":"string"},
            "cls": {"dataType":"double","required":true},
            "icoX": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProdL": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "number": {"dataType":"string"},
            "icoX": {"dataType":"double","required":true},
            "cls": {"dataType":"double","required":true},
            "oprX": {"dataType":"double"},
            "prodCtx": {"ref":"ProdCtx"},
            "addName": {"dataType":"string"},
            "nameS": {"dataType":"string"},
            "matchId": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TrnCmpSX": {
        "dataType": "refObject",
        "properties": {
            "tcocX": {"dataType":"array","array":{"dataType":"double"}},
            "tcM": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TxtC": {
        "dataType": "refObject",
        "properties": {
            "r": {"dataType":"double","required":true},
            "g": {"dataType":"double","required":true},
            "b": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MsgL": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"string","required":true},
            "remX": {"dataType":"double","required":true},
            "txtC": {"ref":"TxtC","required":true},
            "prio": {"dataType":"double","required":true},
            "fIdx": {"dataType":"double","required":true},
            "tIdx": {"dataType":"double","required":true},
            "tagL": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommonDeparture": {
        "dataType": "refObject",
        "properties": {
            "locX": {"dataType":"double","required":true},
            "idx": {"dataType":"double"},
            "dCncl": {"dataType":"boolean"},
            "dProdX": {"dataType":"double"},
            "dInS": {"dataType":"boolean","required":true},
            "dInR": {"dataType":"boolean","required":true},
            "dTimeS": {"dataType":"string","required":true},
            "dTimeR": {"dataType":"string"},
            "dPlatfS": {"dataType":"string"},
            "dPlatfR": {"dataType":"string"},
            "dProgType": {"dataType":"string"},
            "type": {"dataType":"string"},
            "dTZOffset": {"dataType":"double"},
            "dTrnCmpSX": {"ref":"TrnCmpSX"},
            "msgL": {"dataType":"array","array":{"dataType":"refObject","ref":"MsgL"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommonArrival": {
        "dataType": "refObject",
        "properties": {
            "locX": {"dataType":"double","required":true},
            "idx": {"dataType":"double"},
            "aCncl": {"dataType":"boolean"},
            "aProdX": {"dataType":"double"},
            "aOutR": {"dataType":"boolean","required":true},
            "aTimeS": {"dataType":"string","required":true},
            "aTimeR": {"dataType":"string"},
            "aPlatfS": {"dataType":"string"},
            "aPlatfR": {"dataType":"string"},
            "aProgType": {"dataType":"string"},
            "type": {"dataType":"string"},
            "aTZOffset": {"dataType":"double"},
            "aTrnCmpSX": {"ref":"TrnCmpSX"},
            "msgL": {"dataType":"array","array":{"dataType":"refObject","ref":"MsgL"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommonStop": {
        "dataType": "refObject",
        "properties": {
            "locX": {"dataType":"double","required":true},
            "idx": {"dataType":"double"},
            "aCncl": {"dataType":"boolean"},
            "aProdX": {"dataType":"double"},
            "aOutR": {"dataType":"boolean","required":true},
            "aTimeS": {"dataType":"string","required":true},
            "aTimeR": {"dataType":"string"},
            "aPlatfS": {"dataType":"string"},
            "aPlatfR": {"dataType":"string"},
            "aProgType": {"dataType":"string"},
            "type": {"dataType":"string"},
            "aTZOffset": {"dataType":"double"},
            "aTrnCmpSX": {"ref":"TrnCmpSX"},
            "msgL": {"dataType":"array","array":{"dataType":"refObject","ref":"MsgL"}},
            "dCncl": {"dataType":"boolean"},
            "dProdX": {"dataType":"double"},
            "dInS": {"dataType":"boolean","required":true},
            "dInR": {"dataType":"boolean","required":true},
            "dTimeS": {"dataType":"string","required":true},
            "dTimeR": {"dataType":"string"},
            "dPlatfS": {"dataType":"string"},
            "dPlatfR": {"dataType":"string"},
            "dProgType": {"dataType":"string"},
            "dTZOffset": {"dataType":"double"},
            "dTrnCmpSX": {"ref":"TrnCmpSX"},
            "isAdd": {"dataType":"boolean"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JnyL": {
        "dataType": "refObject",
        "properties": {
            "jid": {"dataType":"string","required":true},
            "prodX": {"dataType":"double","required":true},
            "dirTxt": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "isRchbl": {"dataType":"boolean","required":true},
            "isCncl": {"dataType":"boolean"},
            "isPartCncl": {"dataType":"boolean"},
            "subscr": {"dataType":"string","required":true},
            "stopL": {"dataType":"array","array":{"dataType":"refObject","ref":"CommonStop"},"required":true},
            "msgL": {"dataType":"array","array":{"dataType":"refObject","ref":"MsgL"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Freq": {
        "dataType": "refObject",
        "properties": {
            "minC": {"dataType":"double","required":true},
            "maxC": {"dataType":"double","required":true},
            "numC": {"dataType":"double","required":true},
            "jnyL": {"dataType":"array","array":{"dataType":"refObject","ref":"JnyL"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Jny": {
        "dataType": "refObject",
        "properties": {
            "jid": {"dataType":"string","required":true},
            "prodX": {"dataType":"double","required":true},
            "dirTxt": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "isRchbl": {"dataType":"boolean","required":true},
            "isCncl": {"dataType":"boolean"},
            "isPartCncl": {"dataType":"boolean"},
            "subscr": {"dataType":"string","required":true},
            "stopL": {"dataType":"array","array":{"dataType":"refObject","ref":"CommonStop"}},
            "msgL": {"dataType":"array","array":{"dataType":"refObject","ref":"MsgL"}},
            "chgDurR": {"dataType":"double"},
            "ctxRecon": {"dataType":"string","required":true},
            "dTrnCmpSXmsgL": {"dataType":"array","array":{"dataType":"refObject","ref":"MsgL"},"required":true},
            "dTrnCmpSX": {"ref":"TrnCmpSX"},
            "freq": {"ref":"Freq","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SecLJNY": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"enum","enums":["JNY"],"required":true},
            "icoX": {"dataType":"double","required":true},
            "dep": {"ref":"CommonDeparture","required":true},
            "arr": {"ref":"CommonArrival","required":true},
            "jny": {"ref":"Jny","required":true},
            "parJnyL": {"dataType":"array","array":{"dataType":"refObject","ref":"Jny"}},
            "resState": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["N"]},{"dataType":"enum","enums":["B"]},{"dataType":"enum","enums":["S"]}],"required":true},
            "resRecommendation": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Gis": {
        "dataType": "refObject",
        "properties": {
            "dist": {"dataType":"double","required":true},
            "durS": {"dataType":"string","required":true},
            "dirGeo": {"dataType":"double","required":true},
            "ctx": {"dataType":"string","required":true},
            "gisPrvr": {"dataType":"string","required":true},
            "getDescr": {"dataType":"boolean","required":true},
            "getPoly": {"dataType":"boolean","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SecLWALK": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["WALK"]},{"dataType":"enum","enums":["TRSF"]}],"required":true},
            "icoX": {"dataType":"double","required":true},
            "dep": {"ref":"CommonDeparture","required":true},
            "arr": {"ref":"CommonArrival","required":true},
            "gis": {"ref":"Gis","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SecLKISS": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"enum","enums":["KISS"],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SecL": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"SecLJNY"},{"ref":"SecLWALK"},{"ref":"SecLKISS"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RouteTarifFare": {
        "dataType": "refObject",
        "properties": {
            "price": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"in Cent"}}},
            "moreExpensiveAvailable": {"dataType":"boolean","required":true},
            "bookable": {"dataType":"boolean","required":true},
            "upsell": {"dataType":"boolean","required":true},
            "targetContext": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RouteTarifFareSet": {
        "dataType": "refObject",
        "properties": {
            "fares": {"dataType":"array","array":{"dataType":"refObject","ref":"RouteTarifFare"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RouteJourney": {
        "dataType": "refObject",
        "properties": {
            "cancelled": {"dataType":"boolean"},
            "changeDuration": {"dataType":"double"},
            "duration": {"dataType":"double"},
            "finalDestination": {"dataType":"string","required":true},
            "jid": {"dataType":"string"},
            "journeyId": {"dataType":"string"},
            "product": {"ref":"ProdL"},
            "raw": {"ref":"SecL"},
            "segmentDestination": {"ref":"MinimalStopPlace","required":true},
            "segmentStart": {"ref":"MinimalStopPlace","required":true},
            "stops": {"dataType":"array","array":{"dataType":"refObject","ref":"RouteStop"},"required":true},
            "train": {"ref":"ParsedProduct","required":true},
            "auslastung": {"ref":"RouteAuslastung"},
            "messages": {"dataType":"array","array":{"dataType":"refObject","ref":"RemL"}},
            "tarifSet": {"dataType":"array","array":{"dataType":"refObject","ref":"RouteTarifFareSet"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ParsedSearchOnTripResponse": {
        "dataType": "refObject",
        "properties": {
            "cancelled": {"dataType":"boolean"},
            "changeDuration": {"dataType":"double"},
            "duration": {"dataType":"double"},
            "finalDestination": {"dataType":"string","required":true},
            "jid": {"dataType":"string"},
            "journeyId": {"dataType":"string"},
            "product": {"ref":"ProdL"},
            "raw": {"ref":"SecL"},
            "segmentDestination": {"ref":"MinimalStopPlace","required":true},
            "segmentStart": {"ref":"MinimalStopPlace","required":true},
            "stops": {"dataType":"array","array":{"dataType":"refObject","ref":"RouteStop"},"required":true},
            "train": {"ref":"ParsedProduct","required":true},
            "auslastung": {"ref":"RouteAuslastung"},
            "messages": {"dataType":"array","array":{"dataType":"refObject","ref":"RemL"}},
            "tarifSet": {"dataType":"array","array":{"dataType":"refObject","ref":"RouteTarifFareSet"}},
            "type": {"dataType":"enum","enums":["JNY"],"required":true},
            "arrival": {"ref":"CommonStopInfo","required":true},
            "departure": {"ref":"CommonStopInfo","required":true},
            "wings": {"dataType":"array","array":{"dataType":"refObject","ref":"RouteJourney"}},
            "himMessages": {"dataType":"array","array":{"dataType":"refObject","ref":"HimIrisMessage"}},
            "currentStop": {"ref":"RouteStop"},
            "polyline": {"ref":"ParsedPolyline"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EvaNumber": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LageplanResponse": {
        "dataType": "refObject",
        "properties": {
            "lageplan": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Coordinate2D": {
        "dataType": "refObject",
        "properties": {
            "latitude": {"dataType":"double","required":true},
            "longitude": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupedStopPlace": {
        "dataType": "refObject",
        "properties": {
            "evaNumber": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "availableTransports": {"dataType":"array","array":{"dataType":"refAlias","ref":"TransportType"},"required":true},
            "position": {"ref":"Coordinate2D"},
            "ifopt": {"dataType":"string"},
            "ril100": {"dataType":"string"},
            "alternativeRil100": {"dataType":"array","array":{"dataType":"string"}},
            "stationId": {"dataType":"string"},
            "uic": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.RouteAuslastung-or-null_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"ref":"RouteAuslastung"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TrainOccupancyList": {
        "dataType": "refAlias",
        "type": {"ref":"Record_string.RouteAuslastung-or-null_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StopInfo": {
        "dataType": "refObject",
        "properties": {
            "isPlan": {"dataType":"boolean"},
            "scheduledPlatform": {"dataType":"string"},
            "platform": {"dataType":"string"},
            "scheduledTime": {"dataType":"datetime","required":true},
            "time": {"dataType":"datetime","required":true},
            "delay": {"dataType":"integer"},
            "reihung": {"dataType":"boolean"},
            "messages": {"dataType":"array","array":{"dataType":"refObject","ref":"RemL"}},
            "cancelled": {"dataType":"boolean"},
            "isRealTime": {"dataType":"boolean"},
            "wingIds": {"dataType":"array","array":{"dataType":"string"}},
            "hidden": {"dataType":"boolean"},
            "transition": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IrisMessages": {
        "dataType": "refObject",
        "properties": {
            "qos": {"dataType":"array","array":{"dataType":"refObject","ref":"IrisMessage"},"required":true},
            "delay": {"dataType":"array","array":{"dataType":"refObject","ref":"IrisMessage"},"required":true},
            "him": {"dataType":"array","array":{"dataType":"refObject","ref":"HimIrisMessage"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubstituteRef": {
        "dataType": "refObject",
        "properties": {
            "number": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Stop": {
        "dataType": "refObject",
        "properties": {
            "additional": {"dataType":"boolean"},
            "cancelled": {"dataType":"boolean"},
            "showVia": {"dataType":"boolean"},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TrainInfo": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "line": {"dataType":"string"},
            "number": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "operator": {"ref":"OpL"},
            "admin": {"dataType":"string"},
            "transportType": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Abfahrt": {
        "dataType": "refObject",
        "properties": {
            "journeyId": {"dataType":"string"},
            "initialDeparture": {"dataType":"datetime","required":true},
            "initialStopPlace": {"dataType":"string","required":true},
            "arrival": {"ref":"StopInfo"},
            "currentStopPlace": {"ref":"MinimalStopPlace","required":true},
            "departure": {"ref":"StopInfo"},
            "destination": {"dataType":"string","required":true},
            "id": {"dataType":"string","required":true},
            "additional": {"dataType":"boolean"},
            "cancelled": {"dataType":"boolean"},
            "mediumId": {"dataType":"string","required":true},
            "messages": {"ref":"IrisMessages","required":true},
            "platform": {"dataType":"string","required":true},
            "productClass": {"dataType":"string","required":true},
            "rawId": {"dataType":"string","required":true},
            "ref": {"ref":"SubstituteRef"},
            "route": {"dataType":"array","array":{"dataType":"refObject","ref":"Stop"},"required":true},
            "scheduledDestination": {"dataType":"string","required":true},
            "scheduledPlatform": {"dataType":"string","required":true},
            "substitute": {"dataType":"boolean"},
            "substituted": {"dataType":"boolean"},
            "train": {"ref":"TrainInfo","required":true},
            "previousTrain": {"ref":"TrainInfo"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.Abfahrt_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"ref":"Abfahrt"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Wings": {
        "dataType": "refAlias",
        "type": {"ref":"Record_string.Abfahrt_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AbfahrtenResult": {
        "dataType": "refObject",
        "properties": {
            "departures": {"dataType":"array","array":{"dataType":"refObject","ref":"Abfahrt"},"required":true},
            "lookbehind": {"dataType":"array","array":{"dataType":"refObject","ref":"Abfahrt"},"required":true},
            "wings": {"ref":"Wings"},
            "strike": {"dataType":"double"},
            "stopPlaces": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RouteJourneySegmentTrain": {
        "dataType": "refObject",
        "properties": {
            "cancelled": {"dataType":"boolean"},
            "changeDuration": {"dataType":"double"},
            "duration": {"dataType":"double"},
            "finalDestination": {"dataType":"string","required":true},
            "jid": {"dataType":"string"},
            "journeyId": {"dataType":"string"},
            "product": {"ref":"ProdL"},
            "raw": {"ref":"SecL"},
            "segmentDestination": {"ref":"MinimalStopPlace","required":true},
            "segmentStart": {"ref":"MinimalStopPlace","required":true},
            "stops": {"dataType":"array","array":{"dataType":"refObject","ref":"RouteStop"},"required":true},
            "train": {"ref":"ParsedProduct","required":true},
            "auslastung": {"ref":"RouteAuslastung"},
            "messages": {"dataType":"array","array":{"dataType":"refObject","ref":"RemL"}},
            "tarifSet": {"dataType":"array","array":{"dataType":"refObject","ref":"RouteTarifFareSet"}},
            "type": {"dataType":"enum","enums":["JNY"],"required":true},
            "arrival": {"ref":"CommonStopInfo","required":true},
            "departure": {"ref":"CommonStopInfo","required":true},
            "wings": {"dataType":"array","array":{"dataType":"refObject","ref":"RouteJourney"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WalkStopInfo": {
        "dataType": "refObject",
        "properties": {
            "time": {"dataType":"datetime","required":true},
            "delay": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RouteJourneySegmentWalk": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"enum","enums":["WALK"],"required":true},
            "train": {"ref":"ParsedProduct","required":true},
            "arrival": {"ref":"WalkStopInfo","required":true},
            "departure": {"ref":"WalkStopInfo","required":true},
            "duration": {"dataType":"integer","required":true},
            "segmentStart": {"ref":"HafasStation","required":true},
            "segmentDestination": {"ref":"HafasStation","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RouteJourneySegment": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"RouteJourneySegmentTrain"},{"ref":"RouteJourneySegmentWalk"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SingleRoute": {
        "dataType": "refObject",
        "properties": {
            "arrival": {"ref":"CommonStopInfo","required":true},
            "departure": {"ref":"CommonStopInfo","required":true},
            "isRideable": {"dataType":"boolean","required":true},
            "checksum": {"dataType":"string","required":true},
            "cid": {"dataType":"string","required":true},
            "date": {"dataType":"datetime","required":true},
            "duration": {"dataType":"integer","required":true,"validators":{"isInt":{"errorMsg":"in ms"}}},
            "changes": {"dataType":"integer","required":true},
            "segments": {"dataType":"array","array":{"dataType":"refAlias","ref":"RouteJourneySegment"},"required":true},
            "segmentTypes": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "tarifSet": {"dataType":"array","array":{"dataType":"refObject","ref":"RouteTarifFareSet"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoutingResult": {
        "dataType": "refObject",
        "properties": {
            "routes": {"dataType":"array","array":{"dataType":"refObject","ref":"SingleRoute"},"required":true},
            "context": {"dataType":"nestedObjectLiteral","nestedProperties":{"later":{"dataType":"string","required":true},"earlier":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StopPlaceLocation": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"enum","enums":["stopPlace"],"required":true},
            "evaNumber": {"ref":"EvaNumber","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CoordinateLocation": {
        "dataType": "refObject",
        "properties": {
            "latitude": {"dataType":"double","required":true},
            "longitude": {"dataType":"double","required":true},
            "type": {"dataType":"enum","enums":["coordinate"],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoutingLocationInput": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"StopPlaceLocation"},{"ref":"CoordinateLocation"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TripSearchViaV4": {
        "dataType": "refObject",
        "properties": {
            "evaNumber": {"dataType":"string","required":true},
            "minChangeTime": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JnyCl": {
        "dataType": "refEnum",
        "enums": [1,2],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TravelerType": {
        "dataType": "refEnum",
        "enums": ["E","K","B"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoyalityCard": {
        "dataType": "refEnum",
        "enums": ["BC25First","BC25Second","BC50First","BC50Second","SHCard","ATVorteilscard","CHGeneral","CHHalfWithRailplus","CHHalfWithoutRailplus","NLWithRailplus","NLWithoutRailplus","BC100First","BC100Second"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TripSearchTraveler": {
        "dataType": "refObject",
        "properties": {
            "type": {"ref":"TravelerType","required":true},
            "loyalityCard": {"ref":"LoyalityCard"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TripSearchTarifRequest": {
        "dataType": "refObject",
        "properties": {
            "class": {"ref":"JnyCl","required":true},
            "traveler": {"dataType":"array","array":{"dataType":"refObject","ref":"TripSearchTraveler"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TripSearchOptionsV4": {
        "dataType": "refObject",
        "properties": {
            "economic": {"dataType":"boolean"},
            "getIV": {"dataType":"boolean"},
            "getPasslist": {"dataType":"boolean"},
            "getPolyline": {"dataType":"boolean"},
            "numF": {"dataType":"double"},
            "ctxScr": {"dataType":"string"},
            "ushrp": {"dataType":"boolean"},
            "time": {"dataType":"datetime"},
            "transferTime": {"dataType":"double"},
            "maxChanges": {"dataType":"double"},
            "searchForDeparture": {"dataType":"boolean"},
            "onlyRegional": {"dataType":"boolean"},
            "onlyNetzcard": {"dataType":"boolean"},
            "tarif": {"ref":"TripSearchTarifRequest"},
            "start": {"ref":"RoutingLocationInput","required":true},
            "destination": {"ref":"RoutingLocationInput","required":true},
            "via": {"dataType":"array","array":{"dataType":"refObject","ref":"TripSearchViaV4"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InputTripSearchOptionsV4": {
        "dataType": "refAlias",
        "type": {"ref":"TripSearchOptionsV4","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AllowedHafasProfile": {
        "dataType": "refEnum",
        "enums": ["db","oebb","bvg","hvv","rmv","sncb","avv","nahsh","insa","anachb","vao","sbb","dbnetz","pkp","dbregio","smartrbl","vbn"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TripSearchViaV3": {
        "dataType": "refObject",
        "properties": {
            "evaId": {"dataType":"string","required":true},
            "minChangeTime": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TripSearchOptionsV3": {
        "dataType": "refObject",
        "properties": {
            "economic": {"dataType":"boolean"},
            "getIV": {"dataType":"boolean"},
            "getPasslist": {"dataType":"boolean"},
            "getPolyline": {"dataType":"boolean"},
            "numF": {"dataType":"double"},
            "ctxScr": {"dataType":"string"},
            "ushrp": {"dataType":"boolean"},
            "time": {"dataType":"datetime"},
            "transferTime": {"dataType":"double"},
            "maxChanges": {"dataType":"double"},
            "searchForDeparture": {"dataType":"boolean"},
            "onlyRegional": {"dataType":"boolean"},
            "onlyNetzcard": {"dataType":"boolean"},
            "tarif": {"ref":"TripSearchTarifRequest"},
            "start": {"ref":"EvaNumber","required":true},
            "destination": {"ref":"EvaNumber","required":true},
            "via": {"dataType":"array","array":{"dataType":"refObject","ref":"TripSearchViaV3"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InputTripSearchOptionsV3": {
        "dataType": "refAlias",
        "type": {"ref":"TripSearchOptionsV3","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_EvaNumber.RouteAuslastung_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"ref":"RouteAuslastung"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdditionalJourneyInformation": {
        "dataType": "refObject",
        "properties": {
            "jid": {"dataType":"string"},
            "operatorName": {"dataType":"string"},
            "occupancy": {"ref":"Record_EvaNumber.RouteAuslastung_","required":true},
            "polyline": {"ref":"ParsedPolyline"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ArrivalStationBoardEntry": {
        "dataType": "refObject",
        "properties": {
            "train": {"ref":"ParsedProduct","required":true},
            "cancelled": {"dataType":"boolean"},
            "finalDestination": {"dataType":"string","required":true},
            "jid": {"dataType":"string","required":true},
            "stops": {"dataType":"array","array":{"dataType":"refObject","ref":"RouteStop"}},
            "currentStation": {"ref":"HafasStation","required":true},
            "messages": {"dataType":"array","array":{"dataType":"refObject","ref":"RemL"}},
            "arrival": {"ref":"CommonStopInfo","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DepartureStationBoardEntry": {
        "dataType": "refObject",
        "properties": {
            "train": {"ref":"ParsedProduct","required":true},
            "cancelled": {"dataType":"boolean"},
            "finalDestination": {"dataType":"string","required":true},
            "jid": {"dataType":"string","required":true},
            "stops": {"dataType":"array","array":{"dataType":"refObject","ref":"RouteStop"}},
            "currentStation": {"ref":"HafasStation","required":true},
            "messages": {"dataType":"array","array":{"dataType":"refObject","ref":"RemL"}},
            "departure": {"ref":"CommonStopInfo","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StationBoardEntry": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"ArrivalStationBoardEntry"},{"ref":"DepartureStationBoardEntry"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CInfo": {
        "dataType": "refObject",
        "properties": {
            "code": {"dataType":"string","required":true},
            "url": {"dataType":"string","required":true},
            "msg": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ArrStbStop": {
        "dataType": "refAlias",
        "type": {"ref":"CommonArrival","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ArrivalJny": {
        "dataType": "refObject",
        "properties": {
            "jid": {"dataType":"string","required":true},
            "prodX": {"dataType":"double","required":true},
            "dirTxt": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "isRchbl": {"dataType":"boolean","required":true},
            "isCncl": {"dataType":"boolean"},
            "isPartCncl": {"dataType":"boolean"},
            "subscr": {"dataType":"string","required":true},
            "stopL": {"dataType":"array","array":{"dataType":"refObject","ref":"CommonStop"}},
            "msgL": {"dataType":"array","array":{"dataType":"refObject","ref":"MsgL"}},
            "date": {"dataType":"string","required":true},
            "stbStop": {"ref":"ArrStbStop","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Crd": {
        "dataType": "refObject",
        "properties": {
            "x": {"dataType":"double","required":true},
            "y": {"dataType":"double","required":true},
            "z": {"dataType":"double"},
            "layerX": {"dataType":"double"},
            "crdSysX": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Required_OptionalLocL_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"lid":{"dataType":"string","required":true},"type":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"icoX":{"dataType":"double","required":true},"extId":{"dataType":"string","required":true},"state":{"dataType":"string","required":true},"crd":{"ref":"Crd","required":true},"pCls":{"dataType":"double","required":true},"pRefL":{"dataType":"array","array":{"dataType":"double"},"required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LocL": {
        "dataType": "refAlias",
        "type": {"ref":"Required_OptionalLocL_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PpLocRefL": {
        "dataType": "refObject",
        "properties": {
            "ppIdx": {"dataType":"double","required":true},
            "locX": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PolyL": {
        "dataType": "refObject",
        "properties": {
            "delta": {"dataType":"boolean","required":true},
            "dim": {"dataType":"double","required":true},
            "crdEncYX": {"dataType":"string","required":true},
            "crdEncS": {"dataType":"string","required":true},
            "crdEncF": {"dataType":"string","required":true},
            "ppLocRefL": {"dataType":"array","array":{"dataType":"refObject","ref":"PpLocRefL"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LayerL": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "index": {"dataType":"double","required":true},
            "annoCnt": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CrdSysL": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "index": {"dataType":"double","required":true},
            "type": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IcoL": {
        "dataType": "refObject",
        "properties": {
            "res": {"dataType":"string","required":true},
            "txt": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TcocL": {
        "dataType": "refObject",
        "properties": {
            "c": {"dataType":"string","required":true},
            "r": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HimMsgEdgeL": {
        "dataType": "refObject",
        "properties": {
            "icoCrd": {"dataType":"nestedObjectLiteral","nestedProperties":{"y":{"dataType":"string","required":true},"x":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Common": {
        "dataType": "refObject",
        "properties": {
            "locL": {"dataType":"array","array":{"dataType":"refAlias","ref":"LocL"},"required":true},
            "prodL": {"dataType":"array","array":{"dataType":"refObject","ref":"ProdL"},"required":true},
            "polyL": {"dataType":"array","array":{"dataType":"refObject","ref":"PolyL"},"required":true},
            "layerL": {"dataType":"array","array":{"dataType":"refObject","ref":"LayerL"},"required":true},
            "crdSysL": {"dataType":"array","array":{"dataType":"refObject","ref":"CrdSysL"},"required":true},
            "opL": {"dataType":"array","array":{"dataType":"refObject","ref":"OpL"},"required":true},
            "remL": {"dataType":"array","array":{"dataType":"refObject","ref":"RemL"},"required":true},
            "icoL": {"dataType":"array","array":{"dataType":"refObject","ref":"IcoL"},"required":true},
            "tcocL": {"dataType":"array","array":{"dataType":"refObject","ref":"TcocL"}},
            "himMsgEdgeL": {"dataType":"array","array":{"dataType":"refObject","ref":"HimMsgEdgeL"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ArrivalStationBoardResponse": {
        "dataType": "refObject",
        "properties": {
            "common": {"ref":"Common","required":true},
            "fpB": {"dataType":"string","required":true},
            "fpE": {"dataType":"string","required":true},
            "planrtTS": {"dataType":"string","required":true},
            "sD": {"dataType":"string","required":true},
            "sT": {"dataType":"string","required":true},
            "locRefL": {"dataType":"array","array":{"dataType":"double"},"required":true},
            "type": {"dataType":"enum","enums":["ARR"],"required":true},
            "jnyL": {"dataType":"array","array":{"dataType":"refObject","ref":"ArrivalJny"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DepStbStop": {
        "dataType": "refAlias",
        "type": {"ref":"CommonDeparture","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DepartureJny": {
        "dataType": "refObject",
        "properties": {
            "jid": {"dataType":"string","required":true},
            "prodX": {"dataType":"double","required":true},
            "dirTxt": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "isRchbl": {"dataType":"boolean","required":true},
            "isCncl": {"dataType":"boolean"},
            "isPartCncl": {"dataType":"boolean"},
            "subscr": {"dataType":"string","required":true},
            "stopL": {"dataType":"array","array":{"dataType":"refObject","ref":"CommonStop"}},
            "msgL": {"dataType":"array","array":{"dataType":"refObject","ref":"MsgL"}},
            "date": {"dataType":"string","required":true},
            "stbStop": {"ref":"DepStbStop","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DepartureStationBoardResponse": {
        "dataType": "refObject",
        "properties": {
            "common": {"ref":"Common","required":true},
            "fpB": {"dataType":"string","required":true},
            "fpE": {"dataType":"string","required":true},
            "planrtTS": {"dataType":"string","required":true},
            "sD": {"dataType":"string","required":true},
            "sT": {"dataType":"string","required":true},
            "locRefL": {"dataType":"array","array":{"dataType":"double"},"required":true},
            "type": {"dataType":"enum","enums":["DEP"],"required":true},
            "jnyL": {"dataType":"array","array":{"dataType":"refObject","ref":"DepartureJny"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StationBoardResponse": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"ArrivalStationBoardResponse"},{"ref":"DepartureStationBoardResponse"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SvcResL_StationBoardResponse_": {
        "dataType": "refObject",
        "properties": {
            "meth": {"dataType":"string","required":true},
            "err": {"dataType":"string","required":true},
            "res": {"ref":"StationBoardResponse","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HafasResponse_StationBoardResponse_": {
        "dataType": "refObject",
        "properties": {
            "ver": {"dataType":"string","required":true},
            "lang": {"dataType":"string","required":true},
            "id": {"dataType":"string","required":true},
            "err": {"dataType":"string","required":true},
            "cInfo": {"ref":"CInfo","required":true},
            "svcResL": {"dataType":"array","array":{"dataType":"refObject","ref":"SvcResL_StationBoardResponse_"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LocMatchResponse": {
        "dataType": "refObject",
        "properties": {
            "common": {"ref":"Common","required":true},
            "match": {"dataType":"nestedObjectLiteral","nestedProperties":{"locL":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"wt":{"dataType":"double","required":true},"pRefL":{"dataType":"array","array":{"dataType":"double"},"required":true},"pCls":{"dataType":"double","required":true},"meta":{"dataType":"boolean","required":true},"crd":{"dataType":"nestedObjectLiteral","nestedProperties":{"z":{"dataType":"double"},"crdSysX":{"dataType":"double","required":true},"layerX":{"dataType":"double","required":true},"y":{"dataType":"double","required":true},"x":{"dataType":"double","required":true}},"required":true},"state":{"dataType":"string","required":true},"extId":{"dataType":"string","required":true},"icoX":{"dataType":"double","required":true},"name":{"dataType":"string","required":true},"type":{"dataType":"string","required":true},"lid":{"dataType":"string","required":true}}},"required":true},"state":{"dataType":"string","required":true},"field":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SvcResL_LocMatchResponse_": {
        "dataType": "refObject",
        "properties": {
            "meth": {"dataType":"string","required":true},
            "err": {"dataType":"string","required":true},
            "res": {"ref":"LocMatchResponse","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HafasResponse_LocMatchResponse_": {
        "dataType": "refObject",
        "properties": {
            "ver": {"dataType":"string","required":true},
            "lang": {"dataType":"string","required":true},
            "id": {"dataType":"string","required":true},
            "err": {"dataType":"string","required":true},
            "cInfo": {"ref":"CInfo","required":true},
            "svcResL": {"dataType":"array","array":{"dataType":"refObject","ref":"SvcResL_LocMatchResponse_"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CoachSequencePosition": {
        "dataType": "refObject",
        "properties": {
            "startPercent": {"dataType":"double","required":true},
            "endPercent": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CoachSequenceSector": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "position": {"ref":"CoachSequencePosition","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CoachSequenceStop": {
        "dataType": "refObject",
        "properties": {
            "stopPlace": {"ref":"MinimalStopPlace","required":true},
            "sectors": {"dataType":"array","array":{"dataType":"refObject","ref":"CoachSequenceSector"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CoachSequenceProduct": {
        "dataType": "refObject",
        "properties": {
            "number": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "line": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CoachSequenceCoachFeatures": {
        "dataType": "refObject",
        "properties": {
            "dining": {"dataType":"boolean"},
            "wheelchair": {"dataType":"boolean"},
            "bike": {"dataType":"boolean"},
            "disabled": {"dataType":"boolean"},
            "quiet": {"dataType":"boolean"},
            "info": {"dataType":"boolean"},
            "family": {"dataType":"boolean"},
            "toddler": {"dataType":"boolean"},
            "wifi": {"dataType":"boolean"},
            "comfort": {"dataType":"boolean"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CoachSequenceCoachSeats": {
        "dataType": "refObject",
        "properties": {
            "comfort": {"dataType":"string"},
            "disabled": {"dataType":"string"},
            "family": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CoachSequenceCoach": {
        "dataType": "refObject",
        "properties": {
            "class": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":[0]},{"dataType":"enum","enums":[1]},{"dataType":"enum","enums":[2]},{"dataType":"enum","enums":[3]},{"dataType":"enum","enums":[4]}],"required":true},
            "vehicleCategory": {"dataType":"string","required":true},
            "closed": {"dataType":"boolean"},
            "uic": {"dataType":"string"},
            "type": {"dataType":"string"},
            "identificationNumber": {"dataType":"string"},
            "position": {"ref":"CoachSequencePosition","required":true},
            "features": {"ref":"CoachSequenceCoachFeatures","required":true},
            "seats": {"ref":"CoachSequenceCoachSeats"},
            "occupancy": {"ref":"AuslastungsValue"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AvailableBR": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["401"]},{"dataType":"enum","enums":["402"]},{"dataType":"enum","enums":["403"]},{"dataType":"enum","enums":["406"]},{"dataType":"enum","enums":["407"]},{"dataType":"enum","enums":["408"]},{"dataType":"enum","enums":["410.1"]},{"dataType":"enum","enums":["411"]},{"dataType":"enum","enums":["412"]},{"dataType":"enum","enums":["415"]},{"dataType":"enum","enums":["4110"]},{"dataType":"enum","enums":["4010"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AvailableIdentifierOnly": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["401.LDV"]},{"dataType":"enum","enums":["401.9"]},{"dataType":"enum","enums":["411.S1"]},{"dataType":"enum","enums":["411.S2"]},{"dataType":"enum","enums":["412.7"]},{"dataType":"enum","enums":["412.13"]},{"dataType":"enum","enums":["403.R"]},{"dataType":"enum","enums":["403.S1"]},{"dataType":"enum","enums":["403.S2"]},{"dataType":"enum","enums":["406.R"]},{"dataType":"enum","enums":["IC2.TRE"]},{"dataType":"enum","enums":["MET"]},{"dataType":"enum","enums":["TGV"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AvailableIdentifier": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"AvailableIdentifierOnly"},{"ref":"AvailableBR"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CoachSequenceBaureihe": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "baureihe": {"ref":"AvailableBR"},
            "identifier": {"ref":"AvailableIdentifier","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CoachSequenceGroup": {
        "dataType": "refObject",
        "properties": {
            "coaches": {"dataType":"array","array":{"dataType":"refObject","ref":"CoachSequenceCoach"},"required":true},
            "name": {"dataType":"string","required":true},
            "originName": {"dataType":"string","required":true},
            "destinationName": {"dataType":"string","required":true},
            "trainName": {"dataType":"string"},
            "number": {"dataType":"string","required":true},
            "baureihe": {"ref":"CoachSequenceBaureihe"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CoachSequence": {
        "dataType": "refObject",
        "properties": {
            "groups": {"dataType":"array","array":{"dataType":"refObject","ref":"CoachSequenceGroup"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CoachSequenceInformation": {
        "dataType": "refObject",
        "properties": {
            "source": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["OEBB"]},{"dataType":"enum","enums":["DB-noncd"]},{"dataType":"enum","enums":["DB-plan"]},{"dataType":"enum","enums":["DB-bahnde"]},{"dataType":"enum","enums":["SBB"]}],"required":true},
            "stop": {"ref":"CoachSequenceStop","required":true},
            "product": {"ref":"CoachSequenceProduct","required":true},
            "sequence": {"ref":"CoachSequence","required":true},
            "multipleTrainNumbers": {"dataType":"boolean"},
            "multipleDestinations": {"dataType":"boolean"},
            "isRealtime": {"dataType":"boolean","required":true},
            "direction": {"dataType":"boolean"},
            "journeyId": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TrainRunStop": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "evaNumber": {"dataType":"string","required":true},
            "ril100": {"dataType":"string"},
            "arrivalTime": {"dataType":"datetime"},
            "departureTime": {"dataType":"datetime"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_TrainRun.Exclude_keyofTrainRun.primaryVehicleGroupName__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"product":{"ref":"CoachSequenceProduct","required":true},"origin":{"ref":"TrainRunStop","required":true},"destination":{"ref":"TrainRunStop","required":true},"via":{"dataType":"array","array":{"dataType":"refObject","ref":"TrainRunStop"},"required":true},"dates":{"dataType":"array","array":{"dataType":"datetime"},"required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TrainRunWithBR": {
        "dataType": "refObject",
        "properties": {
            "product": {"ref":"CoachSequenceProduct","required":true},
            "origin": {"ref":"TrainRunStop","required":true},
            "destination": {"ref":"TrainRunStop","required":true},
            "via": {"dataType":"array","array":{"dataType":"refObject","ref":"TrainRunStop"},"required":true},
            "dates": {"dataType":"array","array":{"dataType":"datetime"},"required":true},
            "br": {"ref":"CoachSequenceBaureihe"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new KoaTemplateService(models, {"noImplicitAdditionalProperties":"ignore","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(router: KoaRouter) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        router.get('/api/journeys/v1/health',
            ...(fetchMiddlewares<Middleware>(JourneysV1Controller)),
            ...(fetchMiddlewares<Middleware>(JourneysV1Controller.prototype.health)),

            async function JourneysV1Controller_health(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    notFound: {"in":"res","name":"404","required":true,"dataType":"void"},
                    notAuthorized: {"in":"res","name":"401","required":true,"dataType":"void"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new JourneysV1Controller();

            return templateService.apiHandler({
              methodName: 'health',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/journeys/v1/find/number/:trainNumber',
            ...(fetchMiddlewares<Middleware>(JourneysV1Controller)),
            ...(fetchMiddlewares<Middleware>(JourneysV1Controller.prototype.findNumber)),

            async function JourneysV1Controller_findNumber(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    response: {"in":"res","name":"401","required":true,"dataType":"string"},
                    trainNumber: {"in":"path","name":"trainNumber","required":true,"dataType":"double"},
                    initialDepartureDate: {"in":"query","name":"initialDepartureDate","dataType":"datetime"},
                    initialEvaNumber: {"in":"query","name":"initialEvaNumber","dataType":"string"},
                    filtered: {"in":"query","name":"filtered","dataType":"boolean"},
                    limit: {"in":"query","name":"limit","dataType":"double"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new JourneysV1Controller();

            return templateService.apiHandler({
              methodName: 'findNumber',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/journeys/v1/find/:trainName',
            ...(fetchMiddlewares<Middleware>(JourneysV1Controller)),
            ...(fetchMiddlewares<Middleware>(JourneysV1Controller.prototype.find)),

            async function JourneysV1Controller_find(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    response: {"in":"res","name":"401","required":true,"dataType":"string"},
                    trainName: {"in":"path","name":"trainName","required":true,"dataType":"string"},
                    initialDepartureDate: {"in":"query","name":"initialDepartureDate","dataType":"datetime"},
                    initialEvaNumber: {"in":"query","name":"initialEvaNumber","dataType":"string"},
                    filtered: {"in":"query","name":"filtered","dataType":"boolean"},
                    limit: {"in":"query","name":"limit","dataType":"double"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new JourneysV1Controller();

            return templateService.apiHandler({
              methodName: 'find',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/journeys/v1/details/id/:journeyId',
            ...(fetchMiddlewares<Middleware>(JourneysV1Controller)),
            ...(fetchMiddlewares<Middleware>(JourneysV1Controller.prototype.idDetails)),

            async function JourneysV1Controller_idDetails(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    res: {"in":"res","name":"404","required":true,"dataType":"any"},
                    journeyId: {"in":"path","name":"journeyId","required":true,"dataType":"string"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new JourneysV1Controller();

            return templateService.apiHandler({
              methodName: 'idDetails',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/journeys/v1/details/:trainName',
            ...(fetchMiddlewares<Middleware>(JourneysV1Controller)),
            ...(fetchMiddlewares<Middleware>(JourneysV1Controller.prototype.details)),

            async function JourneysV1Controller_details(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    res: {"in":"res","name":"404","required":true,"dataType":"any"},
                    trainName: {"in":"path","name":"trainName","required":true,"dataType":"string"},
                    evaNumberAlongRoute: {"in":"query","name":"evaNumberAlongRoute","ref":"EvaNumber"},
                    initialDepartureDate: {"in":"query","name":"initialDepartureDate","dataType":"datetime"},
                    journeyId: {"in":"query","name":"journeyId","dataType":"string"},
                    jid: {"in":"query","name":"jid","dataType":"string"},
                    administration: {"in":"query","name":"administration","dataType":"string"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new JourneysV1Controller();

            return templateService.apiHandler({
              methodName: 'details',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/stopPlace/v1/lageplan/:stopPlaceName/:evaNumber',
            ...(fetchMiddlewares<Middleware>(StopPlaceController)),
            ...(fetchMiddlewares<Middleware>(StopPlaceController.prototype.lageplan)),

            async function StopPlaceController_lageplan(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    stopPlaceName: {"in":"path","name":"stopPlaceName","required":true,"dataType":"string"},
                    evaNumber: {"in":"path","name":"evaNumber","required":true,"ref":"EvaNumber"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new StopPlaceController();

            return templateService.apiHandler({
              methodName: 'lageplan',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/stopPlace/v1/search/:searchTerm',
            ...(fetchMiddlewares<Middleware>(StopPlaceController)),
            ...(fetchMiddlewares<Middleware>(StopPlaceController.prototype.stopPlaceSearch)),

            async function StopPlaceController_stopPlaceSearch(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    searchTerm: {"in":"path","name":"searchTerm","required":true,"dataType":"string"},
                    max: {"in":"query","name":"max","dataType":"integer","validators":{"isInt":{"errorMsg":"max"}}},
                    filterForIris: {"default":false,"in":"query","name":"filterForIris","dataType":"boolean"},
                    groupedBySales: {"default":false,"in":"query","name":"groupedBySales","dataType":"boolean"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new StopPlaceController();

            return templateService.apiHandler({
              methodName: 'stopPlaceSearch',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/stopPlace/v1/:evaNumberOrRl100',
            ...(fetchMiddlewares<Middleware>(StopPlaceController)),
            ...(fetchMiddlewares<Middleware>(StopPlaceController.prototype.stopPlaceByEvaOrRl100)),

            async function StopPlaceController_stopPlaceByEvaOrRl100(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    evaNumberOrRl100: {"in":"path","name":"evaNumberOrRl100","required":true,"dataType":"string"},
                    notFoundResponse: {"in":"res","name":"404","required":true,"dataType":"void"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new StopPlaceController();

            return templateService.apiHandler({
              methodName: 'stopPlaceByEvaOrRl100',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/stopPlace/v1/:evaNumber/live',
            ...(fetchMiddlewares<Middleware>(StopPlaceController)),
            ...(fetchMiddlewares<Middleware>(StopPlaceController.prototype.stopPlaceByEvaLive)),

            async function StopPlaceController_stopPlaceByEvaLive(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    evaNumber: {"in":"path","name":"evaNumber","required":true,"ref":"EvaNumber"},
                    notFoundResponse: {"in":"res","name":"404","required":true,"dataType":"void"},
                    notAuthorized: {"in":"res","name":"401","required":true,"dataType":"void"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new StopPlaceController();

            return templateService.apiHandler({
              methodName: 'stopPlaceByEvaLive',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/stopPlace/v1/:evaNumber/trainOccupancy',
            ...(fetchMiddlewares<Middleware>(StopPlaceController)),
            ...(fetchMiddlewares<Middleware>(StopPlaceController.prototype.trainOccupancy)),

            async function StopPlaceController_trainOccupancy(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    evaNumber: {"in":"path","name":"evaNumber","required":true,"ref":"EvaNumber"},
                    notFoundResponse: {"in":"res","name":"404","required":true,"dataType":"void"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new StopPlaceController();

            return templateService.apiHandler({
              methodName: 'trainOccupancy',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/iris/v2/abfahrten/:evaNumber',
            ...(fetchMiddlewares<Middleware>(IrisControllerv2)),
            ...(fetchMiddlewares<Middleware>(IrisControllerv2.prototype.abfahrten)),

            async function IrisControllerv2_abfahrten(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    evaNumber: {"in":"path","name":"evaNumber","required":true,"ref":"EvaNumber"},
                    lookahead: {"default":150,"in":"query","name":"lookahead","dataType":"integer","validators":{"isInt":{"errorMsg":"lookahead"}}},
                    lookbehind: {"default":0,"in":"query","name":"lookbehind","dataType":"integer","validators":{"isInt":{"errorMsg":"lookbehind"}}},
                    startTime: {"in":"query","name":"startTime","dataType":"datetime"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new IrisControllerv2();

            return templateService.apiHandler({
              methodName: 'abfahrten',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/api/hafas/v4/tripSearch',
            ...(fetchMiddlewares<Middleware>(HafasControllerV4)),
            ...(fetchMiddlewares<Middleware>(HafasControllerV4.prototype.tripSearch)),

            async function HafasControllerV4_tripSearch(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"ref":"InputTripSearchOptionsV4"},
                    profile: {"in":"query","name":"profile","ref":"AllowedHafasProfile"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new HafasControllerV4();

            return templateService.apiHandler({
              methodName: 'tripSearch',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/hafas/v4/idDetails/:id',
            ...(fetchMiddlewares<Middleware>(HafasControllerV4)),
            ...(fetchMiddlewares<Middleware>(HafasControllerV4.prototype.idDetails)),

            async function HafasControllerV4_idDetails(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new HafasControllerV4();

            return templateService.apiHandler({
              methodName: 'idDetails',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/hafas/v4/detailsByJourney/:journeyId',
            ...(fetchMiddlewares<Middleware>(HafasControllerV4)),
            ...(fetchMiddlewares<Middleware>(HafasControllerV4.prototype.details)),

            async function HafasControllerV4_details(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    journeyId: {"in":"path","name":"journeyId","required":true,"dataType":"string"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new HafasControllerV4();

            return templateService.apiHandler({
              methodName: 'details',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/api/hafas/v3/tripSearch',
            ...(fetchMiddlewares<Middleware>(HafasControllerV3)),
            ...(fetchMiddlewares<Middleware>(HafasControllerV3.prototype.tripSearch)),

            async function HafasControllerV3_tripSearch(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"ref":"InputTripSearchOptionsV3"},
                    profile: {"in":"query","name":"profile","ref":"AllowedHafasProfile"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new HafasControllerV3();

            return templateService.apiHandler({
              methodName: 'tripSearch',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/hafas/v3/additionalInformation/:trainName/:journeyId',
            ...(fetchMiddlewares<Middleware>(HafasControllerV3)),
            ...(fetchMiddlewares<Middleware>(HafasControllerV3.prototype.additionalInformation)),

            async function HafasControllerV3_additionalInformation(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    notFoundResponse: {"in":"res","name":"404","required":true,"dataType":"void"},
                    trainName: {"in":"path","name":"trainName","required":true,"dataType":"string"},
                    journeyId: {"in":"path","name":"journeyId","required":true,"dataType":"string"},
                    evaNumberAlongRoute: {"in":"query","name":"evaNumberAlongRoute","dataType":"string"},
                    initialDepartureDate: {"in":"query","name":"initialDepartureDate","dataType":"datetime"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new HafasControllerV3();

            return templateService.apiHandler({
              methodName: 'additionalInformation',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/hafas/v3/occupancy/:start/:destination/:trainNumber/:plannedDepartureTime/:stopEva',
            ...(fetchMiddlewares<Middleware>(HafasControllerV3)),
            ...(fetchMiddlewares<Middleware>(HafasControllerV3.prototype.occupancy)),

            async function HafasControllerV3_occupancy(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    notFoundResponse: {"in":"res","name":"404","required":true,"dataType":"void"},
                    start: {"in":"path","name":"start","required":true,"dataType":"string"},
                    destination: {"in":"path","name":"destination","required":true,"dataType":"string"},
                    plannedDepartureTime: {"in":"path","name":"plannedDepartureTime","required":true,"dataType":"datetime"},
                    trainNumber: {"in":"path","name":"trainNumber","required":true,"dataType":"string"},
                    stopEva: {"in":"path","name":"stopEva","required":true,"dataType":"string"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new HafasControllerV3();

            return templateService.apiHandler({
              methodName: 'occupancy',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/hafas/v3/departures/:evaNumber',
            ...(fetchMiddlewares<Middleware>(HafasControllerV3)),
            ...(fetchMiddlewares<Middleware>(HafasControllerV3.prototype.departures)),

            async function HafasControllerV3_departures(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    evaNumber: {"in":"path","name":"evaNumber","required":true,"dataType":"string"},
                    profile: {"in":"query","name":"profile","ref":"AllowedHafasProfile"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new HafasControllerV3();

            return templateService.apiHandler({
              methodName: 'departures',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/hafas/v3/departures/:evaNumber/raw',
            ...(fetchMiddlewares<Middleware>(HafasControllerV3)),
            ...(fetchMiddlewares<Middleware>(HafasControllerV3.prototype.departuresRaw)),

            async function HafasControllerV3_departuresRaw(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    evaNumber: {"in":"path","name":"evaNumber","required":true,"dataType":"string"},
                    profile: {"in":"query","name":"profile","ref":"AllowedHafasProfile"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new HafasControllerV3();

            return templateService.apiHandler({
              methodName: 'departuresRaw',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/hafas/v3/stopPlaceSearch/:query',
            ...(fetchMiddlewares<Middleware>(HafasControllerV3)),
            ...(fetchMiddlewares<Middleware>(HafasControllerV3.prototype.stopPlaceSearch)),

            async function HafasControllerV3_stopPlaceSearch(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    query: {"in":"path","name":"query","required":true,"dataType":"string"},
                    profile: {"in":"query","name":"profile","ref":"AllowedHafasProfile"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new HafasControllerV3();

            return templateService.apiHandler({
              methodName: 'stopPlaceSearch',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/hafas/v3/stopPlaceSearch/:query/raw',
            ...(fetchMiddlewares<Middleware>(HafasControllerV3)),
            ...(fetchMiddlewares<Middleware>(HafasControllerV3.prototype.stopPlaceSearchRaw)),

            async function HafasControllerV3_stopPlaceSearchRaw(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    query: {"in":"path","name":"query","required":true,"dataType":"string"},
                    profile: {"in":"query","name":"profile","ref":"AllowedHafasProfile"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new HafasControllerV3();

            return templateService.apiHandler({
              methodName: 'stopPlaceSearchRaw',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/hafas/v3/irisCompatibleAbfahrten/:evaId',
            ...(fetchMiddlewares<Middleware>(HafasControllerV3)),
            ...(fetchMiddlewares<Middleware>(HafasControllerV3.prototype.irisCompatibleAbfahrten)),

            async function HafasControllerV3_irisCompatibleAbfahrten(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    evaId: {"in":"path","name":"evaId","required":true,"dataType":"string"},
                    profile: {"in":"query","name":"profile","ref":"AllowedHafasProfile"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new HafasControllerV3();

            return templateService.apiHandler({
              methodName: 'irisCompatibleAbfahrten',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/hafas/v2/details/:trainName',
            ...(fetchMiddlewares<Middleware>(HafasControllerV2)),
            ...(fetchMiddlewares<Middleware>(HafasControllerV2.prototype.details)),

            async function HafasControllerV2_details(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    notFoundResponse: {"in":"res","name":"404","required":true,"dataType":"void"},
                    trainName: {"in":"path","name":"trainName","required":true,"dataType":"string"},
                    stop: {"in":"query","name":"stop","dataType":"string"},
                    station: {"in":"query","name":"station","ref":"EvaNumber"},
                    date: {"in":"query","name":"date","dataType":"datetime"},
                    profile: {"in":"query","name":"profile","ref":"AllowedHafasProfile"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new HafasControllerV2();

            return templateService.apiHandler({
              methodName: 'details',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/hafas/v1/detailsRedirect/:tripId',
            ...(fetchMiddlewares<Middleware>(HafasController)),
            ...(fetchMiddlewares<Middleware>(HafasController.prototype.detailsRedirect)),

            async function HafasController_detailsRedirect(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    tripId: {"in":"path","name":"tripId","required":true,"dataType":"string"},
                    res: {"in":"res","name":"302","required":true,"dataType":"void"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new HafasController();

            return templateService.apiHandler({
              methodName: 'detailsRedirect',
              controller,
              context,
              validatedArgs,
              successStatus: 302,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/api/hafas/v1/rawHafas',
            ...(fetchMiddlewares<Middleware>(HafasController)),
            ...(fetchMiddlewares<Middleware>(HafasController.prototype.rawHafas)),

            async function HafasController_rawHafas(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"any"},
                    profile: {"in":"query","name":"profile","ref":"AllowedHafasProfile"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new HafasController();

            return templateService.apiHandler({
              methodName: 'rawHafas',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/coachSequence/v4/wagen/:trainNumber',
            ...(fetchMiddlewares<Middleware>(CoachSequenceControllerV4)),
            ...(fetchMiddlewares<Middleware>(CoachSequenceControllerV4.prototype.coachSequence)),

            async function CoachSequenceControllerV4_coachSequence(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    response: {"in":"res","name":"404","required":true,"dataType":"union","subSchemas":[{"dataType":"void"},{"dataType":"string"}]},
                    trainNumber: {"in":"path","name":"trainNumber","required":true,"dataType":"integer","validators":{"isInt":{"errorMsg":"trainNumber"}}},
                    departure: {"in":"query","name":"departure","required":true,"dataType":"datetime"},
                    evaNumber: {"in":"query","name":"evaNumber","ref":"EvaNumber"},
                    initialDeparture: {"in":"query","name":"initialDeparture","dataType":"datetime"},
                    category: {"in":"query","name":"category","dataType":"string"},
                    lastArrivalEva: {"in":"query","name":"lastArrivalEva","dataType":"string"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new CoachSequenceControllerV4();

            return templateService.apiHandler({
              methodName: 'coachSequence',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/api/coachSequence/v4/runsPerDate/:date',
            ...(fetchMiddlewares<Middleware>(CoachSequenceControllerV4)),
            ...(fetchMiddlewares<Middleware>(CoachSequenceControllerV4.prototype.runsPerDate)),

            async function CoachSequenceControllerV4_runsPerDate(context: Context, next: Next) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    response: {"in":"res","name":"401","required":true,"dataType":"union","subSchemas":[{"dataType":"void"},{"dataType":"string"}]},
                    date: {"in":"path","name":"date","required":true,"dataType":"datetime"},
                    baureihen: {"in":"query","name":"baureihen","dataType":"array","array":{"dataType":"refAlias","ref":"AvailableBR"}},
                    identifier: {"in":"query","name":"identifier","dataType":"array","array":{"dataType":"refAlias","ref":"AvailableIdentifier"}},
                    stopsAt: {"in":"query","name":"stopsAt","dataType":"array","array":{"dataType":"refAlias","ref":"EvaNumber"}},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new CoachSequenceControllerV4();

            return templateService.apiHandler({
              methodName: 'runsPerDate',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
