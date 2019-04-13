// @flow
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { renderRoutes } from 'react-router-config';
import DateFnsUtils from '@date-io/date-fns';
import deLocale from 'date-fns/locale/de';
import React from 'react';
import routes from './routes';

const Routing = () => (
  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
    {renderRoutes(routes)}
  </MuiPickersUtilsProvider>
);

export default Routing;
