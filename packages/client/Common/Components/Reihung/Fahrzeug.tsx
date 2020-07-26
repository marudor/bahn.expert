import Accessibility from '@material-ui/icons/Accessibility';
import ActionAccessible from '@material-ui/icons/Accessible';
import ActionMotorcycle from '@material-ui/icons/Motorcycle';
import ChildCare from '@material-ui/icons/ChildCare';
import ChildFriendly from '@material-ui/icons/ChildFriendly';
import Info from '@material-ui/icons/InfoOutlined';
import MapsLocalDining from '@material-ui/icons/LocalDining';
import NotificationsOff from '@material-ui/icons/NotificationsOff';
import SitzplatzInfo from './SitzplatzInfo';
import styled, { css } from 'styled-components/macro';
import UIC from './UIC';
import WagenLink from './WagenLink';
import Wifi from '@material-ui/icons/Wifi';
import WifiOff from '@material-ui/icons/WifiOff';
import type { AdditionalFahrzeugInfo, Fahrzeug } from 'types/reihung';
import type { ComponentType } from 'react';

const Icon = styled.a`
  width: 0.6em;
  height: 0.6em;
  ${({ theme }) => css`
    ${theme.breakpoints.down('md')} {
      font-size: 16px;
    }
  `}
`;
export const icons: {
  [key in keyof Required<AdditionalFahrzeugInfo['icons']>]: ComponentType;
} = {
  wheelchair: Icon.withComponent(ActionAccessible),
  bike: Icon.withComponent(ActionMotorcycle),
  dining: Icon.withComponent(MapsLocalDining),
  quiet: Icon.withComponent(NotificationsOff),
  toddler: Icon.withComponent(ChildFriendly),
  family: Icon.withComponent(ChildCare),
  disabled: Icon.withComponent(Accessibility),
  info: Icon.withComponent(Info),
  wifi: Icon.withComponent(Wifi),
  wifiOff: Icon.withComponent(WifiOff),
};

const Wrap = styled.div<{ closed?: boolean; wrongWing?: boolean }>`
  position: absolute;
  height: 2.5em;
  border: ${({ theme }) => theme.palette.text.primary} 1px solid;
  box-sizing: border-box;
  ${({ closed, wrongWing, theme }) => [
    closed &&
      css`
        background: repeating-linear-gradient(
          135deg,
          #999,
          #999,
          5px,
          transparent 5px,
          transparent 10px
        );
      `,
    wrongWing &&
      css`
        background: ${theme.colors.shadedBackground};
        ::after {
          content: ' ';
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -3.7em;
          pointer-events: none;
          z-index: 5;
          background: ${theme.colors.transparentBackground};
        }
      `,
  ]}
`;

const KlassenCss = [
  css`
    ::after {
      content: '?';
    }
  `,
  css`
    ${({ theme }) => css`
      background-color: ${theme.colors.yellow};
      color: ${theme.palette.getContrastText(theme.colors.yellow)};
    `}
    ::after {
      content: '1';
    }
  `,
  css`
    ${({ theme }) => css`
      background-color: ${theme.colors.red};
      color: ${theme.palette.getContrastText(theme.colors.red)};
    `}
    ::after {
      content: '2';
    }
  `,
  css`
    background: ${({ theme }) =>
      `linear-gradient(to right, ${theme.colors.yellow}, ${theme.colors.red})`};
    ::after {
      content: '1/2';
    }
  `,
  css`
    right: 50%;
    transform: translateX(50%);
    ::after {
      content: 'LOK';
    }
  `,
];

const Klasse = styled.span<{ klasse: number }>`
  bottom: 0;
  right: 0;
  position: absolute;
  ${({ klasse }) => KlassenCss[klasse]}
`;

const Nummer = styled.span`
  position: absolute;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
`;

const ComfortIcon = styled.span`
  position: absolute;
  top: 0.2em;
  right: 0.3em;
  width: 0.7em;
  height: 0.7em;
  background-color: ${({ theme }) => theme.colors.red};
  border-radius: 50%;
`;

const ExtraInfo = styled.span`
  position: absolute;
  top: 150%;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

export interface InheritedProps {
  scale: number;
  correctLeft: number;
  type: string;
}

export interface Props extends InheritedProps {
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
}

const FahrzeugComp = ({
  fahrzeug,
  wrongWing,
  scale,
  correctLeft,
  type,
  showUIC,
}: Props) => {
  const { startprozent, endeprozent } = fahrzeug.positionamhalt;
  const start = Number.parseInt(startprozent, 10);
  const end = Number.parseInt(endeprozent, 10);

  const position = {
    left: `${(start - correctLeft) * scale}%`,
    width: `${(end - start) * scale}%`,
  };

  return (
    <Wrap
      closed={fahrzeug.status === 'GESCHLOSSEN'}
      wrongWing={wrongWing}
      data-testid={`reihungFahrzeug${fahrzeug.wagenordnungsnummer}`}
      style={position}
    >
      <Klasse klasse={fahrzeug.additionalInfo.klasse} />
      <Nummer>{fahrzeug.wagenordnungsnummer}</Nummer>
      <span>
        {Object.entries(fahrzeug.additionalInfo.icons).map(([key, enabled]) => {
          if (enabled) {
            // @ts-ignore this is correct, it's exact!
            const SpecificIcon = icons[key];

            return <SpecificIcon key={key} />;
          }

          return null;
        })}
      </span>
      {fahrzeug.additionalInfo.comfort && <ComfortIcon />}
      <WagenLink
        type={type}
        fahrzeugnummer={fahrzeug.fahrzeugnummer}
        fahrzeugtyp={fahrzeug.fahrzeugtyp}
      />
      {
        <ExtraInfo>
          <SitzplatzInfo
            wagenordnungsnummer={fahrzeug.wagenordnungsnummer}
            additionalInfo={fahrzeug.additionalInfo}
          />
          {showUIC && <UIC uic={fahrzeug.fahrzeugnummer} />}
        </ExtraInfo>
      }
    </Wrap>
  );
};

export default FahrzeugComp;
