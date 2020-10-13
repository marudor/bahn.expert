import { CacheDatabases, createNewCache } from 'server/cache';
import type { Common, ParsedProduct, ProdL } from 'types/HAFAS';

const operatorCache = createNewCache<string, boolean>(
  100 * 6 * 60 * 60,
  CacheDatabases.Operators,
);

export default (product: ProdL, common: Common): ParsedProduct => {
  const operator =
    product.oprX !== undefined ? common.opL[product.oprX] : undefined;

  if (operator?.name) {
    void operatorCache.get(operator.name).then((val) => {
      if (!val) {
        void operatorCache.set(operator.name, true);
      }
    });
  }

  return {
    name: product.addName || product.name,
    line:
      product.prodCtx?.line ||
      product.prodCtx?.lineId ||
      product.prodCtx?.matchId ||
      product.matchId ||
      product.nameS,
    admin: product.prodCtx?.admin,
    number: product.prodCtx?.num ?? product.number,
    type:
      product.prodCtx && (product.prodCtx.catOut || product.prodCtx.catOutL),
    operator,
    // @ts-expect-error just debug
    raw: global.PROD ? undefined : product,
  };
};
