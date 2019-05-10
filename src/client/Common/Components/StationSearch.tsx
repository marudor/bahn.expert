import { Async } from 'react-select';
import { ControlProps } from 'react-select/lib/components/Control';
import { getStationsFromAPI } from 'Common/service/stationSearch';
import { MenuProps, NoticeProps } from 'react-select/lib/components/Menu';
import { MergedTheme, useTheme } from '@material-ui/styles';
import { OptionProps } from 'react-select/lib/components/Option';
import { PlaceholderProps } from 'react-select/lib/components/Placeholder';
import { SingleValueProps } from 'react-select/lib/components/SingleValue';
import { Station } from 'types/station';
import { StationSearchType } from 'Common/config';
import { StylesConfig } from 'react-select/lib/styles';
import { ValueContainerProps } from 'react-select/lib/components/containers';
import debounce from 'debounce-promise';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import React, { useCallback, useMemo } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useStyles from './StationSearch.style';

const debouncedGetStationFromAPI = debounce(getStationsFromAPI, 500);

function NoOptionsMessage(props: NoticeProps<any>) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }: any) {
  return <div ref={inputRef} {...props} />;
}

function Control(props: ControlProps<any>) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.TextFieldProps}
    />
  );
}

function Option(props: OptionProps<any>) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props: PlaceholderProps<any>) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props: SingleValueProps<any>) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props: ValueContainerProps<any>) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function Menu(props: MenuProps<any>) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

type OwnProps = {
  searchType?: StationSearchType;
  value?: Station;
  onChange: (s: Station) => any;
  autoFocus?: boolean;
  placeholder?: string;
};
type Props = OwnProps;

const StationSearch = ({
  onChange,
  value,
  autoFocus,
  placeholder,
  searchType,
}: Props) => {
  const classes = useStyles();
  const theme = useTheme<MergedTheme>();

  const selectStyles: StylesConfig = useMemo(
    () => ({
      dropdownIndicator: () => ({
        display: 'none',
      }),
      indicatorSeparator: () => ({
        display: 'none',
      }),
      container: () => ({
        flex: 1,
        position: 'relative',
      }),
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    }),
    [theme]
  );
  const loadOptions = useCallback(
    (term: string) => debouncedGetStationFromAPI(term, searchType),
    [searchType]
  );
  const getOptionLabel = useCallback((station: Station) => station.title, []);
  const getOptionValue = useCallback((station: Station) => station.id, []);

  return (
    <Async
      components={components}
      classes={classes}
      autoFocus={autoFocus}
      aria-label="Suche nach Bahnhof"
      styles={selectStyles}
      loadOptions={loadOptions}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      placeholder={placeholder}
      value={value || null}
      onChange={onChange as any}
    />
  );
};

export default StationSearch;
