declare module '@material-ui/styles' {
  export {
    default as createGenerateClassName,
  } from '@material-ui/styles/createGenerateClassName';
  export { default as getThemeProps } from '@material-ui/styles/getThemeProps';
  export { default as jssPreset } from '@material-ui/styles/jssPreset';
  export { default as makeStyles } from '@material-ui/styles/makeStyles';
  export { default as mergeClasses } from '@material-ui/styles/mergeClasses';
  export {
    default as ServerStyleSheets,
  } from '@material-ui/styles/ServerStyleSheets';
  export { default as styled } from '@material-ui/styles/styled';
  export {
    default as StylesProvider,
  } from '@material-ui/styles/StylesProvider';
  export { default as ThemeProvider } from '@material-ui/styles/ThemeProvider';
  export { default as useTheme } from '@material-ui/styles/useTheme';
  export {
    default as withStyles,
    CSSProperties,
    StyleRules,
    WithStyles,
  } from '@material-ui/styles/withStyles';
  export {
    default as withTheme,
    WithTheme,
    withThemeCreator,
  } from '@material-ui/styles/withTheme';

  import {
    Styles,
    StyleRules,
    StyleRulesCallback,
  } from '@material-ui/styles/withStyles';
  import { Theme as MuiTheme } from '@material-ui/core';
  import { Theme as MaruTheme } from 'maru';

  /**
   * This function doesn't really "do anything" at runtime, it's just the identity
   * function. Its only purpose is to defeat TypeScript's type widening when providing
   * style rules to `withStyles` which are a function of the `Theme`.
   *
   * @param styles a set of style mappings
   * @returns the same styles that were passed in
   */

  export type MergedTheme = MuiTheme & MaruTheme;

  export function createStyles<ClassKey extends string, Props extends object>(
    styles: StyleRulesCallback<MergedTheme, Props, ClassKey>
  ): StyleRulesCallback<MergedTheme, Props, ClassKey>;
}
