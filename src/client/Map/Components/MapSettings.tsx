import { AllowedHafasProfile } from 'types/HAFAS';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  NativeSelect,
  Switch,
} from '@material-ui/core';
import MapContainer from 'client/Map/container/MapContainer';
import React, { ChangeEvent, SyntheticEvent, useCallback } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import useStyles from './MappSettings.style';
import useToggleState from 'Common/hooks/useToggleState';

interface FormSwitchLabelProps {
  checked: boolean;
  toggle: () => void;
  label: string;
}
const FormSwitchLabel = ({ checked, toggle, label }: FormSwitchLabelProps) => (
  <FormControlLabel
    control={<Switch checked={checked} onChange={toggle} />}
    label={label}
  />
);

const MapSettings = () => {
  const classes = useStyles();
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
      // @ts-ignore
      setProfile(e.currentTarget.value);
    },
    [setProfile]
  );

  return (
    <>
      <SettingsIcon className={classes.icon} onClick={onIconClick} />
      <Dialog open={open} onClose={toggleOpen}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <FormSwitchLabel
            checked={includeFV}
            toggle={toggleIncludeFV}
            label="Fernverkehr"
          />
          <FormSwitchLabel
            checked={includeNV}
            toggle={toggleIncludeNV}
            label="Nahverkehr"
          />
          <FormSwitchLabel
            checked={onlyRT}
            toggle={toggleOnlyRT}
            label="Nur Echtzeitdaten"
          />
          <FormSwitchLabel
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
                {Object.keys(AllowedHafasProfile).map(allowedProfile => (
                  <option key={allowedProfile} value={allowedProfile}>
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

export default MapSettings;
