import { AuslastungsValue } from '@/types/routing';
import { Close, Done, ErrorOutline, Help, Warning } from '@mui/icons-material';
import styled from '@emotion/styled';
import type { FC } from 'react';
import type { Theme } from '@emotion/react';

function getIcon(auslastung?: AuslastungsValue) {
  switch (auslastung) {
    case AuslastungsValue.Gering: {
      return <Done fontSize="inherit" />;
    }
    case AuslastungsValue.Hoch: {
      return <Warning fontSize="inherit" />;
    }
    case AuslastungsValue.SehrHoch: {
      return <ErrorOutline fontSize="inherit" />;
    }
    case AuslastungsValue.Ausgebucht: {
      return <Close fontSize="inherit" />;
    }
    default: {
      return <Help fontSize="inherit" />;
    }
  }
}

const getColors = (backgroundColor: string, theme: Theme) => ({
  backgroundColor,
  color: theme.palette.getContrastText(backgroundColor),
});

const Container = styled.span<{ auslastung?: AuslastungsValue }>(
  {
    fontSize: '.7em',
    display: 'inline-block',
    borderRadius: '50%',
    textAlign: 'center',
    padding: '.2em',
    lineHeight: 0,
  },
  ({ theme, auslastung }) => {
    switch (auslastung) {
      case AuslastungsValue.Gering: {
        return getColors(theme.colors.green, theme);
      }
      case AuslastungsValue.Hoch: {
        return getColors(theme.colors.yellow, theme);
      }
      case AuslastungsValue.SehrHoch: {
        return getColors(theme.colors.orange, theme);
      }
      case AuslastungsValue.Ausgebucht: {
        return getColors(theme.colors.red, theme);
      }
      default: {
        return {};
      }
    }
  },
);

export interface Props {
  auslastung?: AuslastungsValue;
  className?: string;
}
export const SingleAuslastungsDisplay: FC<Props> = ({
  auslastung,
  className,
}) => {
  return (
    <Container className={className} auslastung={auslastung}>
      {getIcon(auslastung)}
    </Container>
  );
};
