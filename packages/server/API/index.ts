import { RegisterRoutes } from './routes';
import cors from '@koa/cors';
// import KoaRouter from '@koa/router';
import router from './validationOverwrites';

// const router = new KoaRouter();

RegisterRoutes(router);
router.use(
  cors({
    allowMethods: 'GET,POST',
    origin: '*',
    maxAge: 3600 * 24,
  }),
);
export default router;
