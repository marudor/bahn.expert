declare module 'react-marquee' {
  import React from 'react';
  interface Props {
    text: string;
    hoverToStop?: boolean;
    loop?: boolean;
    leading?: number;
    trailing?: number;
    className?: string;
  }

  class Marquee extends React.Component<Props> {}

  export default Marquee;
}
