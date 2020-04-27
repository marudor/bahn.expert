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
import MapContainer from 'client/Map/container/MapContainer';
import SettingsIcon from '@material-ui/icons/Settings';
import useStyles from './MappSettings.style';
import useToggleState from 'Common/hooks/useToggleState';

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
      setProfile(e.currentTarget.value as AllowedHafasProfile);
    },
    [setProfile]
  );

  return (
    <>
      <SettingsIcon
        data-testid="trainSettingsIcon"
        className={classes.icon}
        onClick={onIconClick}
      />
      <Dialog open={open} onClose={toggleOpen}>
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

export default MapSettings;
