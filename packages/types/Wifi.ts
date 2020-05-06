export interface Status {
  updates_disabled: boolean;
}

export interface AP {
  configVersion: string;
  desiredFirmwareVersion: string;
  id: number;
  ip: string;
  lan_mac: string;
  lastSeen: any;
  mtd2: string;
  number: number;
  online: boolean;
  serial: string;
  status: number;
  tzn: string;
  uic: string;
  vendor: string;
  wlan0_mac: string;
  wlan1_mac: string;
}

export interface WifiTrain {
  br: string;
  ciscoVersion: string;
  eltecVersion: string;
  ip: string;
  jumphost: string;
  monitor: string;
  tzn: string;
  watchdogVersion: string;
}

export interface TrainData {
  ap_expected: number;
  ap_is: number;
  ap_list: AP[];
  ap_unconf: number;
  ngc_release: string;
  timestamp: number;
  train: WifiTrain;
}

export interface WifiData {
  status: Status;
  traindata: TrainData[];
}
