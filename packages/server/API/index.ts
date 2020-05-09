import { RegisterRoutes } from './routes';
import KoaRouter from '@koa/router';

const router = new KoaRouter();

RegisterRoutes(router);
export default router;
