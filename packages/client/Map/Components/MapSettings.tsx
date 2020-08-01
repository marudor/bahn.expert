import { AllowedHafasProfile } from 'types/HAFAS';
import { ChangeEvent, SyntheticEvent, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  NativeSelect,
  Switch,
} from '@material-ui/core';
import { MapContainer } from 'client/Map/container/MapContainer';
import { Settings } from '@material-ui/icons';
import { stopPropagation } from 'client/Common/stopPropagation';
import { useToggleState } from 'client/Common/hooks/useToggleState';
import styled from 'styled-components';

const TrainSettingsIcon = styled(Settings)`
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

export const MapSettings = () => {
  const [open, toggleOpen] = useToggleState();
  const onIconClick = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation();
      toggleOpen();
    },
    [toggleOpen]
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
  } = MapContainer.useContainer();

  const handleProfileChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setProfile(e.currentTarget.value as AllowedHafasProfile);
    },
    [setProfile]
  );

  return (
    <>
      <TrainSettingsIcon
        data-testid="trainSettingsIcon"
        onClick={onIconClick}
      />
      <Dialog open={open} onClose={toggleOpen} onClick={stopPropagation}>
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
                    // @ts-ignore
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
