declare module 'react-loading-animation' {
  import * as React from 'react';
  export = ReactLoadingClass;

  namespace ReactLoadingClass {
    interface ReactLoadingProps {
      isLoading?: boolean;
      width?: number | string;
      height?: number | string;
      margin?: number;
      style?: object;
    }
  }
  class ReactLoadingClass extends React.Component<ReactLoadingClass.ReactLoadingProps, {}> { }
}
