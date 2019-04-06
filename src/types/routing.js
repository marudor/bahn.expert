// @flow
import type { Station } from './station';
export type SRoute$cInfo = {|
  +code: string,
  +url: string,
  +msg: string,
|};
export type SRoute$Departure = {|
  +locX: number,
  +idx: number,
  +dProdX: number,
  +dInR: boolean,
  +dTimeS: string,
  +dTimeR?: string,
  +dPlatfS?: string,
  +dPlatfR?: string,
  +dProgType: string,
  +dTZOffset: number,
  +type: string,
|};

export type SRoute$Arrival = {|
  +locX: number,
  +idx: number,
  +aOutR: boolean,
  +aTimeS: string,
  +aTimeR?: string,
  +aPlatfS?: string,
  +aPlatfR?: string,
  +aProgType: string,
  +aTZOffset: number,
  +type: string,
|};
export type SRoute$JourneySegment = {|
  +type: 'JNY',
  +icoX: number,
  +dep: SRoute$Departure,
  +arr: SRoute$Arrival,
  +jny: {|
    +jid: string,
    +prodX: number,
    +dirTxt: string,
    +status: string,
    +isRchbl: boolean,
    +polyG: {|
      +polyXL: $ReadOnlyArray<number>,
      +layerX: number,
      +crdSysX: number,
    |},
    +freq: {|
      +minC: number,
      +maxC: number,
      +numC: number,
      +jnyL: $ReadOnlyArray<{|
        +jid: string,
        +prodX: number,
        +stopL: $ReadOnlyArray<{|
          +locX: number,
          +dTimeS: string,
        |}>,
      |}>,
    |},
    +ctxRecon: string,
    +subscr: string,
    +chgDurR: number,
  |},
  +minChg: string,
  +resState: string,
  +resRecommendation: string,
|};

export type SRoute$Journey = {|
  +cid: string,
  +date: string,
  +dur: string,
  +chg: number,
  +sDays: {|
    +sDaysR: string,
    +sDaysI: string,
    +sDaysB: string,
  |},
  +dep: SRoute$Departure,
  +arr: SRoute$Arrival,
  +secL: $ReadOnlyArray<SRoute$JourneySegment>,
  +ctxRecon: string,
  +conSubscr: string,
  +resState: string,
  +resRecommendation: string,
  +recState: string,
  +sotRating: number,
  +isSotCon: boolean,
  +showARSLink: boolean,
  +sotCtxt: {|
    +cnLocX: number,
    +calcDate: string,
    +jid: string,
    +locMode: string,
    +pLocX: number,
    +reqMode: string,
    +sectX: number,
    +calcTime: string,
  |},
  +cksum: string,
  +cksumDti: string,
|};
export type SRoute$Product = {|
  +name: string,
  +number: string,
  +icoX: number,
  +cls: number,
  +oprX: number,
  +prodCtx: {|
    +addName?: string,
    +name: string,
    +line?: string,
    +num: string,
    +matchId: string,
    +catOut: string,
    +catOutS: string,
    +catOutL: string,
    +catIn: string,
    +catCode: string,
    +admin: string,
  |},
  +addName?: string,
|};
export type SRoute$InnerResult = {|
  +common: {|
    +locL: $ReadOnlyArray<{|
      +lid: string,
      +type: string,
      +name: string,
      +icoX: number,
      +extId: string,
      +state: string,
      +crd: {|
        +x: number,
        +y: number,
        +z: number,
        +layerX: number,
        +crdSysX: number,
      |},
      +pCls: number,
    |}>,
    +prodL: $ReadOnlyArray<SRoute$Product>,
    +polyL: $ReadOnlyArray<any /* FIXME: Type could not be determined */>,
    +layerL: $ReadOnlyArray<{|
      +id: string,
      +name: string,
      +index: number,
      +annoCnt: number,
    |}>,
    +crdSysL: $ReadOnlyArray<{|
      +id: string,
      +index: number,
      +type: string,
    |}>,
    +opL: $ReadOnlyArray<{|
      +name: string,
      +icoX: number,
    |}>,
    +remL: $ReadOnlyArray<{|
      +type: string,
      +code: string,
      +prio: number,
      +icoX: number,
      +txtN: string,
    |}>,
    +icoL: $ReadOnlyArray<{|
      +res: string,
      +txt: ?string,
    |}>,
  |},
  +outConL: $ReadOnlyArray<SRoute$Journey>,
  +outCtxScrB: string,
  +outCtxScrF: string,
  +fpB: string,
  +fpE: string,
  +bfATS: number,
  +bfIOSTS: number,
  +planrtTS: string,
  +outConGrpL: $ReadOnlyArray<{|
    +name: string,
    +icoX: number,
    +grpid: string,
    +conScoringL: $ReadOnlyArray<{|
      +type: string,
      +conScoreL: $ReadOnlyArray<{|
        +score: number,
        +conRefL: $ReadOnlyArray<number>,
      |}>,
    |}>,
    +initScoringType: string,
  |}>,
|};

export type SRoute$svcResL = {|
  +meth: string,
  +err: string,
  +res: SRoute$InnerResult,
|};

export type SRoute$Result = {|
  +ver: string,
  +ext: string,
  +lang: string,
  +id: string,
  +err: string,
  +cInfo: SRoute$cInfo,
  +svcResL: $ReadOnlyArray<SRoute$svcResL>,
|};

export type Route$Arrival = {|
  +scheduledArrivalPlatform: ?string,
  +arrivalPlatform: ?string,
  +scheduledArrival: number,
  +arrival: number,
  +arrivalDelay: number,
|};

export type Route$Departure = {|
  +scheduledDeparturePlatform: ?string,
  +departurePlatform: ?string,
  +scheduledDeparture: number,
  +departure: number,
  +departureDelay: number,
|};

export type Route$JourneySegment = Route$JourneySegmentTrain;
export type Route$JourneySegmentTrain = {|
  +train: string,
  +trainId: ?string,
  +trainNumber: string,
  +trainType: string,
  +changeDuration?: number,
  +segmentStart: Station,
  +segmentDestination: Station,
  ...Route$Arrival,
  ...Route$Departure,
  +duration: number,
  +finalDestination: string,
  +raw?: SRoute$JourneySegment,
  +product?: SRoute$Product,
|};

export type Route = {|
  +cid: string,
  +date: number,
  +duration: number,
  +changes: number,
  ...Route$Arrival,
  ...Route$Departure,
  +segments: Route$JourneySegment[],
  +segmentTypes: $ReadOnlyArray<string>,
  raw?: any,
|};
