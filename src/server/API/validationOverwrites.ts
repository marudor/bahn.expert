import { AllowedHafasProfile } from '@/types/HAFAS';
import KoaRouter from '@koa/router';

const router = new KoaRouter();

router.all('/api/hafas/(.*)', (ctx, next) => {
	const hafasProfile: any = ctx.query.profile;

	if (
		hafasProfile &&
		!Object.values(AllowedHafasProfile).includes(hafasProfile)
	) {
		ctx.query.profile = undefined;
	}
	ctx.response.set('hafasProfile', ctx.query.profile || AllowedHafasProfile.DB);

	return next();
});

export default router;
