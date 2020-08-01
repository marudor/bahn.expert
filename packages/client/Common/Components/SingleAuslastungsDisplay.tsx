import { AuslastungsValue } from 'types/routing';
import Close from '@material-ui/icons/Close';
import Done from '@material-ui/icons/Done';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Help from '@material-ui/icons/Help';
import styled, { css, DefaultTheme } from 'styled-components';
import Warning from '@material-ui/icons/Warning';

function getIcon(auslastung?: AuslastungsValue) {
  switch (auslastung) {
    case AuslastungsValue.Gering:
      return <Done fontSize="inherit" />;
    case AuslastungsValue.Hoch:
      return <Warning fontSize="inherit" />;
    case AuslastungsValue.SehrHoch:
      return <ErrorOutline fontSize="inherit" />;
    case AuslastungsValue.Ausgebucht:
      return <Close fontSize="inherit" />;
    default:
      return <Help fontSize="inherit" />;
  }
}

function getBGColor(theme: DefaultTheme, auslastung?: AuslastungsValue) {
  switch (auslastung) {
    case AuslastungsValue.Gering:
      return theme.colors.green;
    case AuslastungsValue.Hoch:
      return theme.colors.yellow;
    case AuslastungsValue.SehrHoch:
      return theme.colors.orange;
    case AuslastungsValue.Ausgebucht:
      return theme.colors.red;
    default:
      return theme.palette.common.black;
  }
}

const ColorCss = css<Props>`
  ${({ theme, auslastung }) => {
    const backgroundColor = getBGColor(theme, auslastung);
    return css`
      background-color: ${backgroundColor};
      color: ${theme.palette.getContrastText(backgroundColor)};
    `;
  }}
`;
const Wrap = styled.span`
  font-size: 0.7em;
  display: inline-block;
  border-radius: 50%;
  text-align: center;
  padding: 0.2em;
  line-height: 0;
  color: white;
  ${ColorCss}
`;

export interface Props {
  auslastung?: AuslastungsValue;
}
export const SingleAuslastungsDisplay = (props: Props) => (
  <Wrap {...props}>{getIcon(props.auslastung)}</Wrap>
);
