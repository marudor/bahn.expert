import { RegisterRoutes } from './routes';
import cors from '@koa/cors';
// import KoaRouter from '@koa/router';
import { getApiRequestCounter } from 'server/admin';
import router from './validationOverwrites';

router.use(
  cors({
    allowMethods: 'GET,POST',
    origin: '*',
    maxAge: 3600 * 24,
  }),
);

router.use(async (ctx, next) => {
  const result = await next();
  try {
    if (ctx._matchedRoute) {
      getApiRequestCounter(ctx._matchedRoute.toString()).inc();
    }
  } catch {
    // ignore fails - we just not count it
  }
  return result;
});

RegisterRoutes(router);

export default router;
