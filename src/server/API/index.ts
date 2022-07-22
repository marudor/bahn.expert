import { RegisterRoutes } from './routes';
import cors from '@koa/cors';
// import KoaRouter from '@koa/router';
import router from './validationOverwrites';

router.use(
  cors({
    allowMethods: 'GET,POST',
    origin: '*',
    maxAge: 3600 * 24,
  }),
);
RegisterRoutes(router);

export default router;
