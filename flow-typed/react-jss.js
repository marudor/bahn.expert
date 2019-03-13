declare module 'react-jss' {
  import type { AbstractComponent } from 'react';

  declare type WithStylesResult<Props, ClassesType> = (
    AbstractComponent<Props>
  ) => AbstractComponent<$Diff<Props, { classes: ClassesType }>>;
  declare type Styles<StyleObject: { [key: string]: any }> = $ObjMap<StyleObject, () => string>;
  declare type StyledProps<Props, StyleObject: { [key: string]: any }> = {|
    ...Props,
    classes: Styles<StyleObject>,
  |};
  declare type ReverseStyles<A> = $Call<<T>(Styles<T>) => T, A>;
  declare module.exports: <Props>(
    ReverseStyles<$ElementType<Props, 'classes'>>
  ) => WithStylesResult<Props, $ElementType<Props, 'classes'>>;
}
