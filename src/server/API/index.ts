import { ApiRequestMetric } from '@/server/admin';
import { RegisterRoutes } from './routes';
import router from './validationOverwrites';

router.use(async (ctx, next) => {
  if (!ctx._matchedRoute) {
    return await next();
  }
  const end = ApiRequestMetric.startTimer();
  const result = await next();
  end({
    route: ctx._matchedRoute.toString(),
    status: ctx.status,
  });

  return result;
});

RegisterRoutes(router);

export default router;
