// @flow
import './Substitute.scss';
import React from 'react';
import type { SubstituteRef } from 'types/abfahrten';

type OwnProps = {|
  +substitute: SubstituteRef,
|};
type Props = {| ...OwnProps |};

const Substitute = ({ substitute }: Props) => (
  <>
    <span className="Substitute">Ersatzzug für</span>
    <span className="Substitute">{substitute.train}</span>
  </>
);

export default React.memo<Props>(Substitute);
