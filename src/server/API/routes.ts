/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BahnhofControllerV1 } from './controller/Bahnhof/v1';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HafasController } from './controller/Hafas/v1';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { IrisController } from './controller/Iris/v1';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ReihungMonitoringController } from './controller/Reihung/monitor';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ReihungControllerV1 } from './controller/Reihung/v1';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { StationController } from './controller/Station/v1';
import * as KoaRouter from 'koa-router';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  "LageplanResponse": {
    "dataType": "refObject",
    "properties": {
      "lageplan": { "dataType": "string" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "ParsedProduct": {
    "dataType": "refObject",
    "properties": {
      "name": { "dataType": "string", "required": true },
      "line": { "dataType": "string" },
      "number": { "dataType": "string" },
      "type": { "dataType": "string" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "AuslastungsValue": {
    "dataType": "refEnum",
    "enums": [1, 2, 3, 4],
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Route$Auslastung": {
    "dataType": "refObject",
    "properties": {
      "first": { "ref": "AuslastungsValue" },
      "second": { "ref": "AuslastungsValue" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "RemL": {
    "dataType": "refObject",
    "properties": {
      "type": { "dataType": "string", "required": true },
      "code": { "dataType": "string", "required": true },
      "icoX": { "dataType": "double", "required": true },
      "txtN": { "dataType": "string", "required": true },
      "txtS": { "dataType": "string" },
      "prio": { "dataType": "double" },
      "sIdx": { "dataType": "double" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "CommonStopInfo": {
    "dataType": "refObject",
    "properties": {
      "scheduledPlatform": { "dataType": "string" },
      "platform": { "dataType": "string" },
      "scheduledTime": { "dataType": "double", "required": true },
      "time": { "dataType": "double", "required": true },
      "delay": { "dataType": "double" },
      "reihung": { "dataType": "boolean" },
      "messages": { "dataType": "array", "array": { "ref": "RemL" } },
      "cancelled": { "dataType": "boolean" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Station": {
    "dataType": "refObject",
    "properties": {
      "title": { "dataType": "string", "required": true },
      "id": { "dataType": "string", "required": true },
      "favendoId": { "dataType": "double" },
      "DS100": { "dataType": "string" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Message": {
    "dataType": "refObject",
    "properties": {
      "text": { "dataType": "string", "required": true },
      "timestamp": { "dataType": "double", "required": true },
      "superseded": { "dataType": "boolean" },
      "priority": { "dataType": "enum", "enums": ["1", "2", "3", "4"] },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Route$ValidDepartureStop": {
    "dataType": "refObject",
    "properties": {
      "arrival": { "ref": "CommonStopInfo" },
      "departure": { "ref": "CommonStopInfo", "required": true },
      "station": { "ref": "Station", "required": true },
      "auslastung": { "ref": "Route$Auslastung" },
      "messages": { "dataType": "array", "array": { "ref": "RemL" } },
      "additional": { "dataType": "boolean" },
      "cancelled": { "dataType": "boolean" },
      "irisMessages": { "dataType": "array", "array": { "ref": "Message" } },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Route$ValidArrivalStop": {
    "dataType": "refObject",
    "properties": {
      "arrival": { "ref": "CommonStopInfo", "required": true },
      "departure": { "ref": "CommonStopInfo" },
      "station": { "ref": "Station", "required": true },
      "auslastung": { "ref": "Route$Auslastung" },
      "messages": { "dataType": "array", "array": { "ref": "RemL" } },
      "additional": { "dataType": "boolean" },
      "cancelled": { "dataType": "boolean" },
      "irisMessages": { "dataType": "array", "array": { "ref": "Message" } },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Route$Stop": {
    "dataType": "refObject",
    "properties": {
      "arrival": { "ref": "CommonStopInfo" },
      "departure": { "ref": "CommonStopInfo" },
      "station": { "ref": "Station", "required": true },
      "auslastung": { "ref": "Route$Auslastung" },
      "messages": { "dataType": "array", "array": { "ref": "RemL" } },
      "additional": { "dataType": "boolean" },
      "cancelled": { "dataType": "boolean" },
      "irisMessages": { "dataType": "array", "array": { "ref": "Message" } },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "ParsedJourneyDetails": {
    "dataType": "refObject",
    "properties": {
      "train": { "ref": "ParsedProduct", "required": true },
      "auslastung": { "ref": "Route$Auslastung" },
      "jid": { "dataType": "string", "required": true },
      "firstStop": { "ref": "Route$ValidDepartureStop", "required": true },
      "lastStop": { "ref": "Route$ValidArrivalStop", "required": true },
      "stops": { "dataType": "array", "array": { "ref": "Route$Stop" }, "required": true },
      "messages": { "dataType": "array", "array": { "ref": "RemL" } },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "SDays": {
    "dataType": "refObject",
    "properties": {
      "sDaysR": { "dataType": "string", "required": true },
      "sDaysI": { "dataType": "string", "required": true },
      "sDaysB": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "TrnCmpSX": {
    "dataType": "refObject",
    "properties": {
      "tcocX": { "dataType": "array", "array": { "dataType": "double" } },
      "tcM": { "dataType": "double" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "TxtC": {
    "dataType": "refObject",
    "properties": {
      "r": { "dataType": "double", "required": true },
      "g": { "dataType": "double", "required": true },
      "b": { "dataType": "double", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "MsgL": {
    "dataType": "refObject",
    "properties": {
      "type": { "dataType": "string", "required": true },
      "remX": { "dataType": "double", "required": true },
      "txtC": { "ref": "TxtC", "required": true },
      "prio": { "dataType": "double", "required": true },
      "fIdx": { "dataType": "double", "required": true },
      "tIdx": { "dataType": "double", "required": true },
      "tagL": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "CommonDeparture": {
    "dataType": "refObject",
    "properties": {
      "locX": { "dataType": "double", "required": true },
      "idx": { "dataType": "double", "required": true },
      "dCncl": { "dataType": "boolean" },
      "dProdX": { "dataType": "double" },
      "dInR": { "dataType": "boolean", "required": true },
      "dTimeS": { "dataType": "string", "required": true },
      "dTimeR": { "dataType": "string" },
      "dPlatfS": { "dataType": "string" },
      "dPlatfR": { "dataType": "string" },
      "dProgType": { "dataType": "string" },
      "type": { "dataType": "string", "required": true },
      "dTZOffset": { "dataType": "double" },
      "dTrnCmpSX": { "ref": "TrnCmpSX" },
      "msgL": { "dataType": "array", "array": { "ref": "MsgL" } },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "CommonArrival": {
    "dataType": "refObject",
    "properties": {
      "locX": { "dataType": "double", "required": true },
      "idx": { "dataType": "double", "required": true },
      "aCncl": { "dataType": "boolean" },
      "aProdX": { "dataType": "double" },
      "aOutR": { "dataType": "boolean", "required": true },
      "aTimeS": { "dataType": "string", "required": true },
      "aTimeR": { "dataType": "string" },
      "aPlatfS": { "dataType": "string" },
      "aPlatfR": { "dataType": "string" },
      "aProgType": { "dataType": "string" },
      "type": { "dataType": "string", "required": true },
      "aTZOffset": { "dataType": "double" },
      "aTrnCmpSX": { "ref": "TrnCmpSX" },
      "msgL": { "dataType": "array", "array": { "ref": "MsgL" } },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "SotCtxt": {
    "dataType": "refObject",
    "properties": {
      "cnLocX": { "dataType": "double", "required": true },
      "calcDate": { "dataType": "string", "required": true },
      "jid": { "dataType": "string", "required": true },
      "locMode": { "dataType": "string", "required": true },
      "pLocX": { "dataType": "double", "required": true },
      "reqMode": { "dataType": "string", "required": true },
      "sectX": { "dataType": "double", "required": true },
      "calcTime": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "CommonStop": {
    "dataType": "refObject",
    "properties": {
      "locX": { "dataType": "double", "required": true },
      "idx": { "dataType": "double", "required": true },
      "aCncl": { "dataType": "boolean" },
      "aProdX": { "dataType": "double" },
      "aOutR": { "dataType": "boolean", "required": true },
      "aTimeS": { "dataType": "string", "required": true },
      "aTimeR": { "dataType": "string" },
      "aPlatfS": { "dataType": "string" },
      "aPlatfR": { "dataType": "string" },
      "aProgType": { "dataType": "string" },
      "type": { "dataType": "string", "required": true },
      "aTZOffset": { "dataType": "double" },
      "aTrnCmpSX": { "ref": "TrnCmpSX" },
      "msgL": { "dataType": "array", "array": { "ref": "MsgL" } },
      "dCncl": { "dataType": "boolean" },
      "dProdX": { "dataType": "double" },
      "dInR": { "dataType": "boolean", "required": true },
      "dTimeS": { "dataType": "string", "required": true },
      "dTimeR": { "dataType": "string" },
      "dPlatfS": { "dataType": "string" },
      "dPlatfR": { "dataType": "string" },
      "dProgType": { "dataType": "string" },
      "dTZOffset": { "dataType": "double" },
      "dTrnCmpSX": { "ref": "TrnCmpSX" },
      "isAdd": { "dataType": "boolean" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "JnyL": {
    "dataType": "refObject",
    "properties": {
      "jid": { "dataType": "string", "required": true },
      "prodX": { "dataType": "double", "required": true },
      "dirTxt": { "dataType": "string", "required": true },
      "status": { "dataType": "string", "required": true },
      "isRchbl": { "dataType": "boolean", "required": true },
      "isCncl": { "dataType": "boolean" },
      "subscr": { "dataType": "string", "required": true },
      "stopL": { "dataType": "array", "array": { "ref": "CommonStop" }, "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Freq": {
    "dataType": "refObject",
    "properties": {
      "minC": { "dataType": "double", "required": true },
      "maxC": { "dataType": "double", "required": true },
      "numC": { "dataType": "double", "required": true },
      "jnyL": { "dataType": "array", "array": { "ref": "JnyL" }, "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "OutConL": {
    "dataType": "refObject",
    "properties": {
      "isNotRdbl": { "dataType": "boolean" },
      "cid": { "dataType": "string", "required": true },
      "date": { "dataType": "string", "required": true },
      "dur": { "dataType": "string", "required": true },
      "chg": { "dataType": "double", "required": true },
      "sDays": { "ref": "SDays", "required": true },
      "dep": { "ref": "CommonDeparture", "required": true },
      "arr": { "ref": "CommonArrival", "required": true },
      "secL": { "dataType": "array", "array": { "dataType": "any" }, "required": true },
      "ctxRecon": { "dataType": "string", "required": true },
      "conSubscr": { "dataType": "string", "required": true },
      "resState": { "dataType": "string", "required": true },
      "resRecommendation": { "dataType": "string", "required": true },
      "recState": { "dataType": "string", "required": true },
      "sotRating": { "dataType": "double", "required": true },
      "isSotCon": { "dataType": "boolean", "required": true },
      "showARSLink": { "dataType": "boolean", "required": true },
      "sotCtxt": { "ref": "SotCtxt", "required": true },
      "cksum": { "dataType": "string", "required": true },
      "cksumDti": { "dataType": "string", "required": true },
      "msgL": { "dataType": "array", "array": { "ref": "MsgL" }, "required": true },
      "dTrnCmpSX": { "ref": "TrnCmpSX", "required": true },
      "freq": { "ref": "Freq", "required": true },
      "isAlt": { "dataType": "boolean" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "SingleRoute": {
    "dataType": "refObject",
    "properties": {
      "arrival": { "ref": "CommonStopInfo", "required": true },
      "departure": { "ref": "CommonStopInfo", "required": true },
      "isRideable": { "dataType": "boolean", "required": true },
      "checksum": { "dataType": "string", "required": true },
      "cid": { "dataType": "string", "required": true },
      "date": { "dataType": "double", "required": true },
      "duration": { "dataType": "double", "required": true },
      "changes": { "dataType": "double", "required": true },
      "segments": { "dataType": "array", "array": { "dataType": "any" }, "required": true },
      "segmentTypes": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
      "raw": { "ref": "OutConL" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "SearchOnTripBody": {
    "dataType": "refObject",
    "properties": {
      "sotMode": { "dataType": "enum", "enums": ["JI", "RC"], "required": true },
      "id": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "ProdCtx": {
    "dataType": "refObject",
    "properties": {
      "name": { "dataType": "string", "required": true },
      "num": { "dataType": "string" },
      "matchId": { "dataType": "string" },
      "catOut": { "dataType": "string" },
      "catOutS": { "dataType": "string" },
      "catOutL": { "dataType": "string" },
      "catIn": { "dataType": "string" },
      "catCode": { "dataType": "string" },
      "admin": { "dataType": "string" },
      "lineId": { "dataType": "string" },
      "line": { "dataType": "string" },
      "cls": { "dataType": "double", "required": true },
      "icoX": { "dataType": "double", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "ProdL": {
    "dataType": "refObject",
    "properties": {
      "name": { "dataType": "string", "required": true },
      "number": { "dataType": "string" },
      "icoX": { "dataType": "double", "required": true },
      "cls": { "dataType": "double", "required": true },
      "oprX": { "dataType": "double" },
      "prodCtx": { "ref": "ProdCtx" },
      "addName": { "dataType": "string" },
      "nameS": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Route$Journey": {
    "dataType": "refObject",
    "properties": {
      "cancelled": { "dataType": "boolean" },
      "changeDuration": { "dataType": "double" },
      "duration": { "dataType": "double" },
      "finalDestination": { "dataType": "string", "required": true },
      "jid": { "dataType": "string", "required": true },
      "product": { "ref": "ProdL" },
      "raw": { "dataType": "any" },
      "segmentDestination": { "ref": "Station", "required": true },
      "segmentStart": { "ref": "Station", "required": true },
      "stops": { "dataType": "array", "array": { "ref": "Route$Stop" }, "required": true },
      "train": { "ref": "ParsedProduct", "required": true },
      "auslastung": { "ref": "Route$Auslastung" },
      "messages": { "dataType": "array", "array": { "ref": "RemL" } },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "ParsedSearchOnTripResponse": {
    "dataType": "refObject",
    "properties": {
      "cancelled": { "dataType": "boolean" },
      "changeDuration": { "dataType": "double" },
      "duration": { "dataType": "double" },
      "finalDestination": { "dataType": "string", "required": true },
      "jid": { "dataType": "string", "required": true },
      "product": { "ref": "ProdL" },
      "raw": { "dataType": "any" },
      "segmentDestination": { "ref": "Station", "required": true },
      "segmentStart": { "ref": "Station", "required": true },
      "stops": { "dataType": "array", "array": { "ref": "Route$Stop" }, "required": true },
      "train": { "ref": "ParsedProduct", "required": true },
      "auslastung": { "ref": "Route$Auslastung" },
      "messages": { "dataType": "array", "array": { "ref": "RemL" } },
      "type": { "dataType": "enum", "enums": ["JNY"], "required": true },
      "arrival": { "ref": "CommonStopInfo", "required": true },
      "departure": { "ref": "CommonStopInfo", "required": true },
      "wings": { "dataType": "array", "array": { "ref": "Route$Journey" } },
      "currentStop": { "ref": "Route$Stop" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "ArrivalStationBoardEntry": {
    "dataType": "refObject",
    "properties": {
      "train": { "ref": "ParsedProduct", "required": true },
      "cancelled": { "dataType": "boolean" },
      "finalDestination": { "dataType": "string", "required": true },
      "jid": { "dataType": "string", "required": true },
      "arrival": { "ref": "CommonStopInfo", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "DepartureStationBoardEntry": {
    "dataType": "refObject",
    "properties": {
      "train": { "ref": "ParsedProduct", "required": true },
      "cancelled": { "dataType": "boolean" },
      "finalDestination": { "dataType": "string", "required": true },
      "jid": { "dataType": "string", "required": true },
      "departure": { "ref": "CommonStopInfo", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "TrainSearchResult": {
    "dataType": "refObject",
    "properties": {
      "value": { "dataType": "string", "required": true },
      "cycle": { "dataType": "double", "required": true },
      "pool": { "dataType": "double", "required": true },
      "id": { "dataType": "string", "required": true },
      "dep": { "dataType": "string", "required": true },
      "trainLink": { "dataType": "string", "required": true },
      "journParam": { "dataType": "string", "required": true },
      "pubTime": { "dataType": "string", "required": true },
      "depDate": { "dataType": "string", "required": true },
      "depTime": { "dataType": "string", "required": true },
      "arr": { "dataType": "string", "required": true },
      "arrTime": { "dataType": "string", "required": true },
      "vt": { "dataType": "string", "required": true },
      "jid": { "dataType": "string", "required": true },
      "ctxRecon": { "dataType": "string", "required": true },
      "jDetails": { "ref": "ParsedJourneyDetails", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "ParsedJourneyMatchResponse": {
    "dataType": "refObject",
    "properties": {
      "train": { "ref": "ParsedProduct", "required": true },
      "stops": { "dataType": "array", "array": { "ref": "Route$Stop" }, "required": true },
      "jid": { "dataType": "string", "required": true },
      "firstStop": { "ref": "Route$Stop", "required": true },
      "lastStop": { "ref": "Route$Stop", "required": true },
      "messages": { "dataType": "array", "array": { "ref": "RemL" } },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Coordinates": {
    "dataType": "refObject",
    "properties": {
      "lat": { "dataType": "double", "required": true },
      "lng": { "dataType": "double", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "HafasStation": {
    "dataType": "refObject",
    "properties": {
      "title": { "dataType": "string", "required": true },
      "id": { "dataType": "string", "required": true },
      "products": { "dataType": "array", "array": { "ref": "ParsedProduct" } },
      "coordinates": { "ref": "Coordinates", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "RoutingResult": {
    "dataType": "refObject",
    "properties": {
      "routes": { "dataType": "array", "array": { "ref": "SingleRoute" }, "required": true },
      "context": { "dataType": "nestedObjectLiteral", "nestedProperties": { "later": { "dataType": "string", "required": true }, "earlier": { "dataType": "string", "required": true } }, "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "TripSearchOptions": {
    "dataType": "refObject",
    "properties": {
      "start": { "dataType": "string", "required": true },
      "destination": { "dataType": "string", "required": true },
      "time": { "dataType": "double" },
      "transferTime": { "dataType": "double" },
      "maxChanges": { "dataType": "double" },
      "getPasslist": { "dataType": "boolean" },
      "searchForDeparture": { "dataType": "boolean" },
      "economic": { "dataType": "boolean" },
      "getTariff": { "dataType": "boolean" },
      "ushrp": { "dataType": "boolean" },
      "getPolyline": { "dataType": "boolean" },
      "getIV": { "dataType": "boolean" },
      "numF": { "dataType": "double" },
      "ctxScr": { "dataType": "string" },
      "onlyRegional": { "dataType": "boolean" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "PartialLocL": {
    "dataType": "refObject",
    "properties": {
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "JnyFltr": {
    "dataType": "refObject",
    "properties": {
      "value": { "dataType": "string", "required": true },
      "mode": { "dataType": "string", "required": true },
      "type": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "DateTimeTripSeachRequest": {
    "dataType": "refObject",
    "properties": {
      "arrLocL": { "dataType": "array", "array": { "ref": "PartialLocL" }, "required": true },
      "depLocL": { "dataType": "array", "array": { "ref": "PartialLocL" }, "required": true },
      "economic": { "dataType": "boolean", "required": true },
      "getIV": { "dataType": "boolean", "required": true },
      "getPT": { "dataType": "boolean", "required": true },
      "getPasslist": { "dataType": "boolean", "required": true },
      "getPolyline": { "dataType": "boolean", "required": true },
      "getTariff": { "dataType": "boolean", "required": true },
      "maxChg": { "dataType": "double", "required": true },
      "minChgTime": { "dataType": "double", "required": true },
      "numF": { "dataType": "double", "required": true },
      "outFrwd": { "dataType": "boolean", "required": true },
      "ushrp": { "dataType": "boolean", "required": true },
      "ctxScr": { "dataType": "string" },
      "jnyFltrL": { "dataType": "array", "array": { "ref": "JnyFltr" } },
      "outDate": { "dataType": "string", "required": true },
      "outTime": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "AfterBeforeTripSearchRequest": {
    "dataType": "refObject",
    "properties": {
      "arrLocL": { "dataType": "array", "array": { "ref": "PartialLocL" }, "required": true },
      "depLocL": { "dataType": "array", "array": { "ref": "PartialLocL" }, "required": true },
      "economic": { "dataType": "boolean", "required": true },
      "getIV": { "dataType": "boolean", "required": true },
      "getPT": { "dataType": "boolean", "required": true },
      "getPasslist": { "dataType": "boolean", "required": true },
      "getPolyline": { "dataType": "boolean", "required": true },
      "getTariff": { "dataType": "boolean", "required": true },
      "maxChg": { "dataType": "double", "required": true },
      "minChgTime": { "dataType": "double", "required": true },
      "numF": { "dataType": "double", "required": true },
      "outFrwd": { "dataType": "boolean", "required": true },
      "ushrp": { "dataType": "boolean", "required": true },
      "ctxScr": { "dataType": "string", "required": true },
      "jnyFltrL": { "dataType": "array", "array": { "ref": "JnyFltr" } },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "TripSearchRequest": {
    "dataType": "refObject",
    "properties": {
      "req": { "dataType": "union", "subSchemas": [{ "ref": "DateTimeTripSeachRequest" }, { "ref": "AfterBeforeTripSearchRequest" }], "required": true },
      "meth": { "dataType": "enum", "enums": ["TripSearch"], "required": true },
      "cfg": { "dataType": "nestedObjectLiteral", "nestedProperties": { "rtMode": { "dataType": "enum", "enums": ["HYBRID"], "required": true } } },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "WingInfo": {
    "dataType": "refObject",
    "properties": {
      "station": { "dataType": "nestedObjectLiteral", "nestedProperties": { "title": { "dataType": "string", "required": true }, "id": { "dataType": "string", "required": true } }, "required": true },
      "pt": { "dataType": "double", "required": true },
      "fl": { "dataType": "boolean", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "WingDefinition": {
    "dataType": "refObject",
    "properties": {
      "start": { "ref": "WingInfo" },
      "end": { "ref": "WingInfo" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "StopInfo": {
    "dataType": "refObject",
    "properties": {
      "scheduledPlatform": { "dataType": "string" },
      "platform": { "dataType": "string" },
      "scheduledTime": { "dataType": "double", "required": true },
      "time": { "dataType": "double", "required": true },
      "delay": { "dataType": "double" },
      "reihung": { "dataType": "boolean" },
      "messages": { "dataType": "array", "array": { "ref": "RemL" } },
      "cancelled": { "dataType": "boolean", "required": true },
      "wingIds": { "dataType": "array", "array": { "dataType": "string" } },
      "hidden": { "dataType": "boolean", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Messages": {
    "dataType": "refObject",
    "properties": {
      "qos": { "dataType": "array", "array": { "ref": "Message" }, "required": true },
      "delay": { "dataType": "array", "array": { "ref": "Message" }, "required": true },
    },
    "additionalProperties": { "dataType": "array", "array": { "ref": "Message" } },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "SubstituteRef": {
    "dataType": "refObject",
    "properties": {
      "trainNumber": { "dataType": "string", "required": true },
      "trainType": { "dataType": "string", "required": true },
      "train": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Train": {
    "dataType": "refObject",
    "properties": {
      "additional": { "dataType": "boolean" },
      "cancelled": { "dataType": "boolean" },
      "showVia": { "dataType": "boolean" },
      "name": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "TrainInfo": {
    "dataType": "refObject",
    "properties": {
      "name": { "dataType": "string", "required": true },
      "line": { "dataType": "string" },
      "number": { "dataType": "string", "required": true },
      "type": { "dataType": "string", "required": true },
      "thirdParty": { "dataType": "string" },
      "longDistance": { "dataType": "boolean", "required": true },
      "trainCategory": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Abfahrt": {
    "dataType": "refObject",
    "properties": {
      "initialDeparture": { "dataType": "double", "required": true },
      "arrival": { "ref": "StopInfo" },
      "auslastung": { "dataType": "boolean", "required": true },
      "currentStation": { "ref": "Station", "required": true },
      "departure": { "ref": "StopInfo" },
      "destination": { "dataType": "string", "required": true },
      "id": { "dataType": "string", "required": true },
      "additional": { "dataType": "boolean" },
      "cancelled": { "dataType": "boolean", "required": true },
      "mediumId": { "dataType": "string", "required": true },
      "messages": { "ref": "Messages", "required": true },
      "platform": { "dataType": "string", "required": true },
      "productClass": { "dataType": "string", "required": true },
      "rawId": { "dataType": "string", "required": true },
      "ref": { "ref": "SubstituteRef" },
      "reihung": { "dataType": "boolean", "required": true },
      "route": { "dataType": "array", "array": { "ref": "Train" }, "required": true },
      "scheduledDestination": { "dataType": "string", "required": true },
      "scheduledPlatform": { "dataType": "string", "required": true },
      "substitute": { "dataType": "boolean" },
      "train": { "ref": "TrainInfo", "required": true },
      "hiddenReihung": { "dataType": "boolean", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Wings": {
    "dataType": "refObject",
    "properties": {
    },
    "additionalProperties": { "ref": "Abfahrt" },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "AbfahrtenResult": {
    "dataType": "refObject",
    "properties": {
      "departures": { "dataType": "array", "array": { "ref": "Abfahrt" }, "required": true },
      "lookbehind": { "dataType": "array", "array": { "ref": "Abfahrt" }, "required": true },
      "wings": { "ref": "Wings", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "AdditionalId": {
    "dataType": "refObject",
    "properties": {
      "evaNr": { "dataType": "string", "required": true },
      "shortName": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Destination": {
    "dataType": "refObject",
    "properties": {
      "destinationName": { "dataType": "string", "required": true },
      "destinationVia": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Subtrain": {
    "dataType": "refObject",
    "properties": {
      "destination": { "ref": "Destination", "required": true },
      "sections": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Waggon": {
    "dataType": "refObject",
    "properties": {
      "position": { "dataType": "double", "required": true },
      "waggon": { "dataType": "boolean", "required": true },
      "sections": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
      "number": { "dataType": "string", "required": true },
      "type": { "dataType": "enum", "enums": ["2", "1", "s", "e"], "required": true },
      "symbols": { "dataType": "string", "required": true },
      "differentDestination": { "dataType": "string", "required": true },
      "length": { "dataType": "double", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "TrackRecord": {
    "dataType": "refObject",
    "properties": {
      "time": { "dataType": "string", "required": true },
      "additionalText": { "dataType": "string", "required": true },
      "name": { "dataType": "string", "required": true },
      "trainNumbers": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
      "days": { "dataType": "array", "array": { "dataType": "any" }, "required": true },
      "subtrains": { "dataType": "array", "array": { "ref": "Subtrain" }, "required": true },
      "waggons": { "dataType": "array", "array": { "ref": "Waggon" }, "required": true },
      "trainTpes": { "dataType": "string" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "SpecificWagenreihung": {
    "dataType": "refObject",
    "properties": {
      "name": { "dataType": "string", "required": true },
      "additionalId": { "ref": "AdditionalId", "required": true },
      "trackRecords": { "dataType": "array", "array": { "ref": "TrackRecord" }, "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "WagenreihungStation": {
    "dataType": "refObject",
    "properties": {
      "trainNumber": { "dataType": "string", "required": true },
      "trainType": { "dataType": "any" },
      "time": { "dataType": "any" },
      "timeOffset": { "dataType": "any" },
      "weekday": { "dataType": "any" },
      "platform": { "dataType": "any" },
      "waggon": { "dataType": "any" },
      "trainLine": { "dataType": "any" },
      "stations": { "dataType": "array", "array": { "ref": "SpecificWagenreihung" }, "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "AdditionalFahrzeugInfo": {
    "dataType": "refObject",
    "properties": {
      "klasse": { "dataType": "enum", "enums": ["0", "1", "2", "3", "4"], "required": true },
      "icons": { "dataType": "nestedObjectLiteral", "nestedProperties": { "wifiOff": { "dataType": "boolean" }, "wifi": { "dataType": "boolean" }, "toddler": { "dataType": "boolean" }, "family": { "dataType": "boolean" }, "info": { "dataType": "boolean" }, "quiet": { "dataType": "boolean" }, "disabled": { "dataType": "boolean" }, "bike": { "dataType": "boolean" }, "wheelchair": { "dataType": "boolean" }, "dining": { "dataType": "boolean" } }, "required": true },
      "comfort": { "dataType": "boolean" },
      "comfortSeats": { "dataType": "string" },
      "disabledSeats": { "dataType": "string" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Fahrzeugausstattung": {
    "dataType": "refObject",
    "properties": {
      "anzahl": { "dataType": "string", "required": true },
      "ausstattungsart": { "dataType": "string", "required": true },
      "bezeichnung": { "dataType": "string", "required": true },
      "status": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Fahrzeug": {
    "dataType": "refObject",
    "properties": {
      "allFahrzeugausstattung": { "dataType": "array", "array": { "ref": "Fahrzeugausstattung" }, "required": true },
      "kategorie": { "dataType": "string", "required": true },
      "fahrzeugnummer": { "dataType": "string", "required": true },
      "orientierung": { "dataType": "string", "required": true },
      "positioningruppe": { "dataType": "string", "required": true },
      "fahrzeugsektor": { "dataType": "string", "required": true },
      "fahrzeugtyp": { "dataType": "string", "required": true },
      "wagenordnungsnummer": { "dataType": "string", "required": true },
      "positionamhalt": { "dataType": "any", "required": true },
      "status": { "dataType": "string", "required": true },
      "additionalInfo": { "ref": "AdditionalFahrzeugInfo", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "BRInfo": {
    "dataType": "refObject",
    "properties": {
      "name": { "dataType": "string", "required": true },
      "BR": { "dataType": "enum", "enums": ["401", "402", "403", "406", "407", "410.1", "411", "412", "415"] },
      "serie": { "dataType": "string" },
      "redesign": { "dataType": "boolean" },
      "noPdf": { "dataType": "boolean" },
      "pdf": { "dataType": "string" },
      "country": { "dataType": "enum", "enums": ["DE", "AT"] },
      "showBRInfo": { "dataType": "boolean" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "BaseFahrzeug": {
    "dataType": "refObject",
    "properties": {
      "allFahrzeugausstattung": { "dataType": "array", "array": { "ref": "Fahrzeugausstattung" }, "required": true },
      "kategorie": { "dataType": "string", "required": true },
      "fahrzeugnummer": { "dataType": "string", "required": true },
      "orientierung": { "dataType": "string", "required": true },
      "positioningruppe": { "dataType": "string", "required": true },
      "fahrzeugsektor": { "dataType": "string", "required": true },
      "fahrzeugtyp": { "dataType": "string", "required": true },
      "wagenordnungsnummer": { "dataType": "string", "required": true },
      "positionamhalt": { "dataType": "any", "required": true },
      "status": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Fahrzeuggruppe": {
    "dataType": "refObject",
    "properties": {
      "allFahrzeug": { "dataType": "array", "array": { "ref": "Fahrzeug" }, "required": true },
      "fahrzeuggruppebezeichnung": { "dataType": "string", "required": true },
      "zielbetriebsstellename": { "dataType": "string", "required": true },
      "startbetriebsstellename": { "dataType": "string", "required": true },
      "verkehrlichezugnummer": { "dataType": "string", "required": true },
      "goesToFrance": { "dataType": "boolean", "required": true },
      "startPercentage": { "dataType": "double", "required": true },
      "endPercentage": { "dataType": "double", "required": true },
      "br": { "ref": "BRInfo" },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "BaseFahrzeuggruppe": {
    "dataType": "refObject",
    "properties": {
      "allFahrzeug": { "dataType": "array", "array": { "ref": "BaseFahrzeug" }, "required": true },
      "fahrzeuggruppebezeichnung": { "dataType": "string", "required": true },
      "zielbetriebsstellename": { "dataType": "string", "required": true },
      "startbetriebsstellename": { "dataType": "string", "required": true },
      "verkehrlichezugnummer": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Sektor": {
    "dataType": "refObject",
    "properties": {
      "positionamgleis": { "dataType": "any", "required": true },
      "sektorbezeichnung": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Halt": {
    "dataType": "refObject",
    "properties": {
      "abfahrtszeit": { "dataType": "string" },
      "ankunftszeit": { "dataType": "string" },
      "bahnhofsname": { "dataType": "string", "required": true },
      "evanummer": { "dataType": "string", "required": true },
      "gleisbezeichnung": { "dataType": "string" },
      "haltid": { "dataType": "string", "required": true },
      "rl100": { "dataType": "string", "required": true },
      "allSektor": { "dataType": "array", "array": { "ref": "Sektor" }, "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Formation": {
    "dataType": "refObject",
    "properties": {
      "fahrtrichtung": { "dataType": "enum", "enums": ["VORWAERTS", "RUCKWAERTS"], "required": true },
      "allFahrzeuggruppe": { "dataType": "array", "array": { "ref": "Fahrzeuggruppe" }, "required": true },
      "halt": { "ref": "Halt", "required": true },
      "liniebezeichnung": { "dataType": "string", "required": true },
      "zuggattung": { "dataType": "string", "required": true },
      "zugnummer": { "dataType": "string", "required": true },
      "serviceid": { "dataType": "string", "required": true },
      "planstarttag": { "dataType": "string", "required": true },
      "fahrtid": { "dataType": "string", "required": true },
      "istplaninformation": { "dataType": "boolean", "required": true },
      "isActuallyIC": { "dataType": "boolean", "required": true },
      "reportedZuggattung": { "dataType": "string", "required": true },
      "differentDestination": { "dataType": "boolean" },
      "differentZugnummer": { "dataType": "boolean" },
      "scale": { "dataType": "double", "required": true },
      "startPercentage": { "dataType": "double", "required": true },
      "endPercentage": { "dataType": "double", "required": true },
      "realFahrtrichtung": { "dataType": "boolean", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "IrisStation": {
    "dataType": "refObject",
    "properties": {
      "name": { "dataType": "string", "required": true },
      "meta": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
      "eva": { "dataType": "string", "required": true },
      "ds100": { "dataType": "string", "required": true },
      "db": { "dataType": "string", "required": true },
      "creationts": { "dataType": "string", "required": true },
      "p": { "dataType": "string", "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "IrisStationWithRelated": {
    "dataType": "refObject",
    "properties": {
      "station": { "ref": "IrisStation", "required": true },
      "relatedStations": { "dataType": "array", "array": { "ref": "IrisStation" }, "required": true },
    },
    "additionalProperties": false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(router: KoaRouter) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################
  router.get('/api/bahnhof/v1/lageplan/:stationName',
    async (context: any, next: any) => {
      const args = {
        stationName: { "in": "path", "name": "stationName", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new BahnhofControllerV1();

      const promise = controller.lageplan.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/hafas/v1/journeyDetails',
    async (context: any, next: any) => {
      const args = {
        jid: { "in": "query", "name": "jid", "required": true, "dataType": "string" },
        profile: { "in": "query", "name": "profile", "dataType": "enum", "enums": ["db", "oebb", "sncb", "avv", "nahsh", "hvv", "bvg", "insa", "anachb", "vao"] },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new HafasController();

      const promise = controller.journeyDetails.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.post('/api/hafas/v1/searchOnTrip',
    async (context: any, next: any) => {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "ref": "SearchOnTripBody" },
        profile: { "in": "query", "name": "profile", "dataType": "enum", "enums": ["db", "oebb", "sncb", "avv", "nahsh", "hvv", "bvg", "insa", "anachb", "vao"] },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new HafasController();

      const promise = controller.searchOnTrip.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/hafas/v1/details/:trainName',
    async (context: any, next: any) => {
      const args = {
        trainName: { "in": "path", "name": "trainName", "required": true, "dataType": "string" },
        date: { "in": "query", "name": "date", "dataType": "double" },
        stop: { "in": "query", "name": "stop", "dataType": "string" },
        profile: { "in": "query", "name": "profile", "dataType": "enum", "enums": ["db", "oebb", "sncb", "avv", "nahsh", "hvv", "bvg", "insa", "anachb", "vao"] },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new HafasController();

      const promise = controller.details.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/hafas/v1/auslastung/:start/:destination/:trainNumber/:time',
    async (context: any, next: any) => {
      const args = {
        start: { "in": "path", "name": "start", "required": true, "dataType": "string" },
        destination: { "in": "path", "name": "destination", "required": true, "dataType": "string" },
        trainNumber: { "in": "path", "name": "trainNumber", "required": true, "dataType": "string" },
        time: { "in": "path", "name": "time", "required": true, "dataType": "double" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new HafasController();

      const promise = controller.auslastung.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/hafas/v1/arrivalStationBoard',
    async (context: any, next: any) => {
      const args = {
        station: { "in": "query", "name": "station", "required": true, "dataType": "string" },
        date: { "in": "query", "name": "date", "dataType": "double" },
        profile: { "in": "query", "name": "profile", "dataType": "enum", "enums": ["db", "oebb", "sncb", "avv", "nahsh", "hvv", "bvg", "insa", "anachb", "vao"] },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new HafasController();

      const promise = controller.arrivalStationBoard.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/hafas/v1/departureStationBoard',
    async (context: any, next: any) => {
      const args = {
        station: { "in": "query", "name": "station", "required": true, "dataType": "string" },
        direction: { "in": "query", "name": "direction", "dataType": "string" },
        date: { "in": "query", "name": "date", "dataType": "double" },
        profile: { "in": "query", "name": "profile", "dataType": "enum", "enums": ["db", "oebb", "sncb", "avv", "nahsh", "hvv", "bvg", "insa", "anachb", "vao"] },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new HafasController();

      const promise = controller.departureStationBoard.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/hafas/v1/trainSearch/:trainName',
    async (context: any, next: any) => {
      const args = {
        trainName: { "in": "path", "name": "trainName", "required": true, "dataType": "string" },
        date: { "in": "query", "name": "date", "dataType": "double" },
        profile: { "in": "query", "name": "profile", "dataType": "enum", "enums": ["db", "oebb", "sncb", "avv", "nahsh", "hvv", "bvg", "insa", "anachb", "vao"] },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new HafasController();

      const promise = controller.trainSearch.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/hafas/v1/journeyMatch/:trainName',
    async (context: any, next: any) => {
      const args = {
        trainName: { "in": "path", "name": "trainName", "required": true, "dataType": "string" },
        date: { "in": "query", "name": "date", "dataType": "double" },
        profile: { "in": "query", "name": "profile", "dataType": "enum", "enums": ["db", "oebb", "sncb", "avv", "nahsh", "hvv", "bvg", "insa", "anachb", "vao"] },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new HafasController();

      const promise = controller.journeyMatch.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/hafas/v1/geoStation',
    async (context: any, next: any) => {
      const args = {
        lat: { "in": "query", "name": "lat", "required": true, "dataType": "double" },
        lng: { "in": "query", "name": "lng", "required": true, "dataType": "double" },
        maxDist: { "default": 1000, "in": "query", "name": "maxDist", "dataType": "double" },
        profile: { "in": "query", "name": "profile", "dataType": "enum", "enums": ["db", "oebb", "sncb", "avv", "nahsh", "hvv", "bvg", "insa", "anachb", "vao"] },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new HafasController();

      const promise = controller.geoStation.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/hafas/v1/station/:searchTerm',
    async (context: any, next: any) => {
      const args = {
        searchTerm: { "in": "path", "name": "searchTerm", "required": true, "dataType": "string" },
        profile: { "in": "query", "name": "profile", "dataType": "enum", "enums": ["db", "oebb", "sncb", "avv", "nahsh", "hvv", "bvg", "insa", "anachb", "vao"] },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new HafasController();

      const promise = controller.station.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.post('/api/hafas/v1/route',
    async (context: any, next: any) => {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "ref": "TripSearchOptions" },
        profile: { "in": "query", "name": "profile", "dataType": "enum", "enums": ["db", "oebb", "sncb", "avv", "nahsh", "hvv", "bvg", "insa", "anachb", "vao"] },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new HafasController();

      const promise = controller.route.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.post('/api/hafas/v1/rawHafas',
    async (context: any, next: any) => {
      const args = {
        body: { "in": "body", "name": "body", "required": true, "ref": "TripSearchRequest" },
        profile: { "in": "query", "name": "profile", "dataType": "enum", "enums": ["db", "oebb", "sncb", "avv", "nahsh", "hvv", "bvg", "insa", "anachb", "vao"] },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new HafasController();

      const promise = controller.rawHafas.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/iris/v1/wings/:rawId1/:rawId2',
    async (context: any, next: any) => {
      const args = {
        rawId1: { "in": "path", "name": "rawId1", "required": true, "dataType": "string" },
        rawId2: { "in": "path", "name": "rawId2", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new IrisController();

      const promise = controller.wings.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/iris/v1/abfahrten/:evaId',
    async (context: any, next: any) => {
      const args = {
        evaId: { "in": "path", "name": "evaId", "required": true, "dataType": "string" },
        lookahead: { "in": "query", "name": "lookahead", "dataType": "double" },
        lookbehind: { "in": "query", "name": "lookbehind", "dataType": "double" },
        type: { "in": "query", "name": "type", "dataType": "enum", "enums": ["open", "default"] },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new IrisController();

      const promise = controller.abfahrten.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/reihung/monitoring/wagen',
    async (context: any, next: any) => {
      const args = {
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new ReihungMonitoringController();

      const promise = controller.monitoring.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/reihung/v1/wagenstation/:train/:station',
    async (context: any, next: any) => {
      const args = {
        train: { "in": "path", "name": "train", "required": true, "dataType": "string" },
        station: { "in": "path", "name": "station", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new ReihungControllerV1();

      const promise = controller.planWagenreihung.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/reihung/v1/wagen/:trainNumber/:date',
    async (context: any, next: any) => {
      const args = {
        trainNumber: { "in": "path", "name": "trainNumber", "required": true, "dataType": "string" },
        date: { "in": "path", "name": "date", "required": true, "dataType": "double" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new ReihungControllerV1();

      const promise = controller.wagenreihung.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/station/v1/search/:searchTerm',
    async (context: any, next: any) => {
      const args = {
        searchTerm: { "in": "path", "name": "searchTerm", "required": true, "dataType": "string" },
        type: { "in": "query", "name": "type", "dataType": "enum", "enums": ["default", "favendo", "hafas", "openData", "openDataOffline", "stationsData", "favendoStationsData"] },
        max: { "in": "query", "name": "max", "dataType": "double" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new StationController();

      const promise = controller.searchStation.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/station/v1/geoSearch',
    async (context: any, next: any) => {
      const args = {
        lat: { "in": "query", "name": "lat", "required": true, "dataType": "double" },
        lng: { "in": "query", "name": "lng", "required": true, "dataType": "double" },
        searchText: { "default": "", "in": "query", "name": "searchText", "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new StationController();

      const promise = controller.geoSearch.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  router.get('/api/station/v1/iris/:evaId',
    async (context: any, next: any) => {
      const args = {
        evaId: { "in": "path", "name": "evaId", "required": true, "dataType": "string" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, context);
      } catch (error) {
        context.status = error.status;
        context.throw(error.status, JSON.stringify({ fields: error.fields }));
      }

      const controller = new StationController();

      const promise = controller.irisSearch.apply(controller, validatedArgs as any);
      return promiseHandler(controller, promise, context, next);
    });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function isController(object: any): object is Controller {
    return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
  }

  function promiseHandler(controllerObj: any, promise: Promise<any>, context: any, next: () => Promise<any>) {
    return Promise.resolve(promise)
      .then((data: any) => {
        if (data || data === false) {
          context.body = data;
          context.status = 200;
        } else {
          context.status = 204;
        }

        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

        if (isController(controllerObj)) {
          const headers = controllerObj.getHeaders();
          Object.keys(headers).forEach((name: string) => {
            context.set(name, headers[name]);
          });

          const statusCode = controllerObj.getStatus();
          if (statusCode) {
            context.status = statusCode;
          }
        }
        return next();
      })
      .catch((error: any) => {
        context.status = error.status || 500;
        context.throw(context.status, error.message, error);
      });
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function getValidatedArgs(args: any, context: any): any[] {
    const errorFields: FieldErrors = {};
    const values = Object.keys(args).map(key => {
      const name = args[key].name;
      switch (args[key].in) {
        case 'request':
          return context.request;
        case 'query':
          return validationService.ValidateParam(args[key], context.request.query[name], name, errorFields, undefined, { "noImplicitAdditionalProperties": "silently-remove-extras", "controllerPathGlobs": ["./src/server/API/controller/**", "./src/types/**"], "specVersion": 3 });
        case 'path':
          return validationService.ValidateParam(args[key], context.params[name], name, errorFields, undefined, { "noImplicitAdditionalProperties": "silently-remove-extras", "controllerPathGlobs": ["./src/server/API/controller/**", "./src/types/**"], "specVersion": 3 });
        case 'header':
          return validationService.ValidateParam(args[key], context.request.headers[name], name, errorFields, undefined, { "noImplicitAdditionalProperties": "silently-remove-extras", "controllerPathGlobs": ["./src/server/API/controller/**", "./src/types/**"], "specVersion": 3 });
        case 'body':
          return validationService.ValidateParam(args[key], context.request.body, name, errorFields, name + '.', { "noImplicitAdditionalProperties": "silently-remove-extras", "controllerPathGlobs": ["./src/server/API/controller/**", "./src/types/**"], "specVersion": 3 });
        case 'body-prop':
          return validationService.ValidateParam(args[key], context.request.body[name], name, errorFields, 'body.', { "noImplicitAdditionalProperties": "silently-remove-extras", "controllerPathGlobs": ["./src/server/API/controller/**", "./src/types/**"], "specVersion": 3 });
      }
    });
    if (Object.keys(errorFields).length > 0) {
      throw new ValidateError(errorFields, '');
    }
    return values;
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
