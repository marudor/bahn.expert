import loadable from '@loadable/component';
import Loading from 'client/Common/Components/Loading';

export default (fn: any) =>
  loadable(fn, {
    fallback: <Loading />,
  });
