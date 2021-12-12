import { AllowedHafasProfile } from 'types/HAFAS';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  NativeSelect,
  Switch,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import { useCallback } from 'react';
import { useMapProvider } from 'client/Map/provider/MapProvider';
import { useToggleState } from 'client/Common/hooks/useToggleState';
import styled from '@emotion/styled';
import type { ChangeEvent, FC, SyntheticEvent } from 'react';

const SettingsIcon = styled(Settings)`
  position: absolute;
  top: 1em;
  right: 1em;
  color: black;
  z-index: 10000;
  cursor: pointer;
`;

interface FormSwitchLabelProps {
  checked: boolean;
  toggle: () => void;
  label: string;
  [key: string]: any;
}
const FormSwitchLabel = ({
  checked,
  toggle,
  label,
  ...extra
}: FormSwitchLabelProps) => (
  <FormControlLabel
    {...extra}
    control={<Switch checked={checked} onChange={toggle} />}
    label={label}
  />
);

export const MapSettings: FC = () => {
  const [open, toggleOpen] = useToggleState();
  const onIconClick = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation();
      toggleOpen();
    },
    [toggleOpen],
  );
  const {
    includeFV,
    toggleIncludeFV,
    includeNV,
    toggleIncludeNV,
    onlyRT,
    toggleOnlyRT,
    permanent,
    togglePermanent,
    profile,
    setProfile,
  } = useMapProvider();

  const handleProfileChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setProfile(e.currentTarget.value as AllowedHafasProfile);
    },
    [setProfile],
  );

  return (
    <>
      <SettingsIcon data-testid="trainSettingsIcon" onClick={onIconClick} />
      <Dialog fullWidth open={open} onClose={toggleOpen}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <FormSwitchLabel
            data-testid="includeFVSwitch"
            checked={includeFV}
            toggle={toggleIncludeFV}
            label="Fernverkehr"
          />
          <FormSwitchLabel
            data-testid="includeNVSwitch"
            checked={includeNV}
            toggle={toggleIncludeNV}
            label="Nahverkehr"
          />
          <FormSwitchLabel
            data-testid="onlyRTSwitch"
            checked={onlyRT}
            toggle={toggleOnlyRT}
            label="Nur Echtzeitdaten"
          />
          <FormSwitchLabel
            data-testid="permanentSwitch"
            checked={permanent}
            toggle={togglePermanent}
            label="Permanent Label"
          />
          <FormControlLabel
            control={
              <NativeSelect
                value={profile}
                name="profile"
                onChange={handleProfileChange}
              >
                {Object.keys(AllowedHafasProfile).map((allowedProfile) => (
                  <option
                    key={allowedProfile}
                    // @ts-expect-error works
                    value={AllowedHafasProfile[allowedProfile]}
                  >
                    {allowedProfile}
                  </option>
                ))}
              </NativeSelect>
            }
            label="HAFAS Provider"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
