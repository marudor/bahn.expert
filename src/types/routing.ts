import { Station } from './station';
export type SRoute$cInfo = {
  code: string;
  url: string;
  msg: string;
};
export type SRoute$Departure = {
  locX: number;
  idx: number;
  dProdX: number;
  dInR: boolean;
  dTimeS?: string;
  dTimeR?: string;
  dPlatfS?: string;
  dPlatfR?: string;
  dProgType: string;
  dTZOffset: number;
  type: string;
};

export type SRoute$Arrival = {
  locX: number;
  idx: number;
  aOutR: boolean;
  aTimeS?: string;
  aTimeR?: string;
  aPlatfS?: string;
  aPlatfR?: string;
  aProgType: string;
  aTZOffset: number;
  type: string;
};
export type SRoute$JourneySegment = {
  type: 'JNY';
  icoX: number;
  dep: SRoute$Departure;
  arr: SRoute$Arrival;
  jny: {
    stopL?: SRoute$StopL[];
    jid: string;
    prodX: number;
    dirTxt: string;
    status: string;
    isRchbl: boolean;
    polyG: {
      polyXL: Array<number>;
      layerX: number;
      crdSysX: number;
    };
    freq: {
      minC: number;
      maxC: number;
      numC: number;
      jnyL: Array<{
        jid: string;
        prodX: number;
        stopL: Array<{
          locX: number;
          dTimeS: string;
        }>;
      }>;
    };
    ctxRecon: string;
    subscr: string;
    chgDurR: number;
  };
  minChg: string;
  resState: string;
  resRecommendation: string;
};

export type SRoute$Journey = {
  cid: string;
  date: string;
  dur: string;
  chg: number;
  sDays: {
    sDaysR: string;
    sDaysI: string;
    sDaysB: string;
  };
  dep: SRoute$Departure;
  arr: SRoute$Arrival;
  secL: Array<SRoute$JourneySegment>;
  ctxRecon: string;
  conSubscr: string;
  resState: string;
  resRecommendation: string;
  recState: string;
  sotRating: number;
  isSotCon: boolean;
  showARSLink: boolean;
  sotCtxt: {
    cnLocX: number;
    calcDate: string;
    jid: string;
    locMode: string;
    pLocX: number;
    reqMode: string;
    sectX: number;
    calcTime: string;
  };
  cksum: string;
  cksumDti: string;
};
export type SRoute$Product = {
  name: string;
  number: string;
  icoX: number;
  cls: number;
  oprX: number;
  prodCtx: {
    addName?: string;
    name: string;
    line?: string;
    num: string;
    matchId: string;
    catOut: string;
    catOutS: string;
    catOutL: string;
    catIn: string;
    catCode: string;
    admin: string;
  };
  addName?: string;
};

export type SRoute$StopL = {
  aOutR?: boolean;
  aPlatfR?: string;
  aPlatfS?: string;
  aProdX?: number;
  aTZOffset?: number;
  aTimeR?: string;
  aTimeS?: string;
  dDirTxt?: string;
  dInR?: boolean;
  dInS?: boolean;
  dPlatfR?: string;
  dPlatfS?: string;
  dProdX?: number;
  dTrnCmpSX?: {
    tcocX: Array<number>;
  };
  dTZOffset?: number;
  dTimeR?: string;
  dTimeS?: string;
  idx: number;
  locX: number;
  type: string;
};

export type SRoute$InnerResult = {
  common: {
    locL: Array<{
      lid: string;
      type: string;
      name: string;
      icoX: number;
      extId: string;
      state: string;
      crd: {
        x: number;
        y: number;
        z: number;
        layerX: number;
        crdSysX: number;
      };
      pCls: number;
    }>;
    prodL: Array<SRoute$Product>;
    polyL: Array<any /* FIXME: Type could not be determined */>;
    layerL: Array<{
      id: string;
      name: string;
      index: number;
      annoCnt: number;
    }>;
    crdSysL: Array<{
      id: string;
      index: number;
      type: string;
    }>;
    opL: Array<{
      name: string;
      icoX: number;
    }>;
    remL: Array<{
      type: string;
      code: string;
      prio: number;
      icoX: number;
      txtN: string;
    }>;
    icoL: Array<{
      res: string;
      txt?: string;
    }>;
  };
  outConL: Array<SRoute$Journey>;
  outCtxScrB: string;
  outCtxScrF: string;
  fpB: string;
  fpE: string;
  bfATS: number;
  bfIOSTS: number;
  planrtTS: string;
  outConGrpL: Array<{
    name: string;
    icoX: number;
    grpid: string;
    conScoringL: Array<{
      type: string;
      conScoreL: Array<{
        score: number;
        conRefL: Array<number>;
      }>;
    }>;
    initScoringType: string;
  }>;
};

export type SRoute$svcResL = {
  meth: string;
  err: string;
  res: SRoute$InnerResult;
};

export type SRoute$Result = {
  ver: string;
  ext: string;
  lang: string;
  id: string;
  err: string;
  cInfo: SRoute$cInfo;
  svcResL: Array<SRoute$svcResL>;
};

export type Route$Arrival = {
  scheduledArrivalPlatform?: string;
  arrivalPlatform?: string;
  scheduledArrival?: number;
  arrival?: number;
  arrivalDelay?: number;
};

export type Route$Departure = {
  scheduledDeparturePlatform?: string;
  departurePlatform?: string;
  scheduledDeparture?: number;
  departure?: number;
  departureDelay?: number;
};

export type Route$Stop = {
  station: Station;
  scheduledDeparturePlatform?: string;
  departurePlatform?: string;
  // +scheduledDeparture?: number,
  departure?: number;
  departureDelay?: number;
  scheduledArrivalPlatform?: string;
  arrivalPlatform?: string;
  // +scheduledArrival?: number,
  arrival?: number;
  arrivalDelay?: number;
};
export type Route$JourneySegment = Route$JourneySegmentTrain;
export type Route$JourneySegmentTrain = Route$Arrival &
  Route$Departure & {
    train: string;
    trainId?: string;
    trainNumber: string;
    trainType: string;
    changeDuration?: number;
    segmentStart: Station;
    segmentDestination: Station;
    stops?: Route$Stop[];
    duration?: number;
    finalDestination: string;
    raw?: SRoute$JourneySegment;
    product?: SRoute$Product;
  };

export type Route = Route$Arrival &
  Route$Departure & {
    cid: string;
    date: number;
    duration: number;
    changes: number;
    segments: Route$JourneySegment[];
    segmentTypes: Array<string>;
    raw?: any;
  };
