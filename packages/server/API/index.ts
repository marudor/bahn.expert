import { RegisterRoutes } from './routes';
// import KoaRouter from '@koa/router';
import router from './validationOverwrites';

// const router = new KoaRouter();

RegisterRoutes(router);
export default router;
