declare module 'notistack' {
  import typeof Snackbar from '@material-ui/core/Snackbar/Snackbar';
  import type { Node, AbstractComponent } from 'react';

  declare export type SnackId = string | number;
  declare export type VariantType = 'default' | 'error' | 'success' | 'warning' | 'info';
  declare type OmitProps<Props, P> = $Exact<$Rest<Props, $ObjMapi<P, <V>(V) => $ElementType<Props, V>> | void>>;
  declare type OmittedSnackbarProps = OmitProps<React$ElementConfig<Snackbar>, { open: any, message: any }>;
  declare export type OptionsObject = {|
    ...OmittedSnackbarProps,
    key?: SnackId,
    variant?: VariantType,
    persist?: boolean,
    onClickAction?: Function,
    preventDuplicate?: boolean,
  |};

  declare export type WithSnackbarProps = {|
    enqueueSnackbar: (message: string | Node, options?: OptionsObject) => ?SnackId,
    closeSnackbar: (key: SnackId) => void,
  |};

  declare export type SnackbarProviderProps = {|
    ...OmittedSnackbarProps,
    maxSnack?: number,
    iconVaraint?: any,
    hideIconVariant?: boolean,
    onClickAction?: Function,
    preventDuplicate?: boolean,
    dense?: boolean,
  |};

  declare export function useSnackbar(): WithSnackbarProps;

  declare export function withSnackbar<P>(
    Component: AbstractComponent<P>
  ): AbstractComponent<$Diff<P, WithSnackbarProps>>;

  declare export var SnackbarProvider: React$ComponentType<SnackbarProviderProps>;
}
