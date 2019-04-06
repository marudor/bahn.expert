// @flow
import { handleActions } from 'redux-actions';
export type CommonRootState = {|
  features: Features,
|};

export default {
  features: handleActions<any, any>({}, {}),
};
