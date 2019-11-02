import { Fahrzeug } from 'types/reihung';
import { Tooltip } from '@material-ui/core';
import Accessibility from '@material-ui/icons/Accessibility';
import ActionAccessible from '@material-ui/icons/Accessible';
import ActionMotorcycle from '@material-ui/icons/Motorcycle';
import cc from 'clsx';
import ChildCare from '@material-ui/icons/ChildCare';
import ChildFriendly from '@material-ui/icons/ChildFriendly';
import Info from '@material-ui/icons/InfoOutlined';
import MapsLocalDining from '@material-ui/icons/LocalDining';
import NotificationsOff from '@material-ui/icons/NotificationsOff';
import React from 'react';
import useStyles from './Fahrzeug.style';
import WagenLink from './WagenLink';
import Wifi from '@material-ui/icons/Wifi';
import WifiOff from '@material-ui/icons/WifiOff';

export const icons = {
  rollstuhl: ActionAccessible,
  fahrrad: ActionMotorcycle,
  speise: MapsLocalDining,
  ruhe: NotificationsOff,
  kleinkind: ChildFriendly,
  familie: ChildCare,
  schwebe: Accessibility,
  info: Info,
  wifi: Wifi,
  wifiOff: WifiOff,
};

export type InheritedProps = {
  scale: number;
  correctLeft: number;
  type: string;
};

export type OwnProps = InheritedProps & {
  fahrzeug: Pick<
    Fahrzeug,
    | 'fahrzeugtyp'
    | 'wagenordnungsnummer'
    | 'positionamhalt'
    | 'status'
    | 'additionalInfo'
    | 'fahrzeugnummer'
  >;
  destination?: string;
  wrongWing?: boolean;
  showUIC: boolean;
  auslastung: any;
};

type Props = OwnProps;

const FahrzeugComp = ({
  fahrzeug,
  wrongWing,
  scale,
  correctLeft,
  type,
  showUIC,
  auslastung,
}: Props) => {
  const classes = useStyles();
  const wagenAuslastung = auslastung && auslastung[fahrzeug.fahrzeugnummer];

  const { startprozent, endeprozent } = fahrzeug.positionamhalt;
  const start = Number.parseInt(startprozent, 10);
  const end = Number.parseInt(endeprozent, 10);

  const position = {
    left: `${(start - correctLeft) * scale}%`,
    width: `${(end - start) * scale}%`,
  };

  // @ts-ignore
  const klasseClassName: keyof typeof classes = `klasse${fahrzeug.additionalInfo.klasse}`;

  return (
    <div
      data-testid="reihungFahrzeug"
      style={position}
      className={cc(classes.main, {
        [classes.closed]: fahrzeug.status === 'GESCHLOSSEN',
        [classes.wrongWing]: wrongWing,
      })}
    >
      <span className={cc(classes.klasse, classes[klasseClassName])} />
      <span className={classes.nummer}>{fahrzeug.wagenordnungsnummer}</span>
      <span className={classes.icons}>
        {fahrzeug.additionalInfo.rollstuhl && (
          <icons.rollstuhl className={classes.icon} />
        )}
        {fahrzeug.additionalInfo.fahrrad && (
          <icons.fahrrad className={classes.icon} />
        )}
        {fahrzeug.additionalInfo.speise && (
          <icons.speise className={classes.icon} />
        )}
        {fahrzeug.additionalInfo.ruhe && (
          <icons.ruhe className={classes.icon} />
        )}
        {fahrzeug.additionalInfo.kleinkind && (
          <icons.kleinkind className={classes.icon} />
        )}
        {fahrzeug.additionalInfo.familie && (
          <icons.familie className={classes.icon} />
        )}
        {fahrzeug.additionalInfo.schwebe && (
          <icons.schwebe className={classes.icon} />
        )}
        {fahrzeug.additionalInfo.info && (
          <icons.info className={classes.icon} />
        )}
        {fahrzeug.additionalInfo.wifi && <Wifi className={classes.icon} />}
        {fahrzeug.additionalInfo.wifiOff && (
          <WifiOff className={classes.icon} />
        )}
      </span>
      {fahrzeug.additionalInfo.comfort && <span className={classes.comfort} />}
      <WagenLink
        type={type}
        fahrzeugnummer={fahrzeug.fahrzeugnummer}
        fahrzeugtyp={fahrzeug.fahrzeugtyp}
      />
      {(showUIC || wagenAuslastung) && (
        <span className={classes.extraInfo}>
          {showUIC && fahrzeug.fahrzeugnummer}
          {wagenAuslastung && (
            <span className={classes.auslastung}>
              {(fahrzeug.additionalInfo.klasse === 1 ||
                fahrzeug.additionalInfo.klasse === 3) &&
                wagenAuslastung.estimatedUtilizationFirst != null && (
                  <Tooltip title="% Reserviert 1. Klasse">
                    <span>
                      1:{' '}
                      {Math.round(
                        wagenAuslastung.estimatedUtilizationFirst * 100 * 100
                      ) / 100}
                      %
                    </span>
                  </Tooltip>
                )}
              {(fahrzeug.additionalInfo.klasse === 2 ||
                fahrzeug.additionalInfo.klasse === 3) &&
                wagenAuslastung.estimatedUtilizationSecond != null && (
                  <Tooltip title="% Reserviert 2. Klasse">
                    <span>
                      2:{' '}
                      {Math.round(
                        wagenAuslastung.estimatedUtilizationSecond * 100 * 100
                      ) / 100}
                      %
                    </span>
                  </Tooltip>
                )}
            </span>
          )}
        </span>
      )}
    </div>
  );
};

export default FahrzeugComp;
