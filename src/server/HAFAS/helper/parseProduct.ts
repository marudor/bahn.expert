import { getLineFromNumber } from '@/server/journeys/lineNumberMapping';
import type { Common, ParsedProduct, ProdL } from '@/types/HAFAS';

export default (product: ProdL, common: Common): ParsedProduct => {
  const operator =
    product.oprX === undefined ? undefined : common.opL[product.oprX];
  const number = product.prodCtx?.num ?? product.number;

  return {
    name: product.addName || product.name,
    line:
      product.prodCtx?.line ||
      product.prodCtx?.lineId ||
      product.prodCtx?.matchId ||
      product.matchId ||
      product.nameS ||
      getLineFromNumber(number),
    admin: product.prodCtx?.admin?.replaceAll('_', ''),
    number,
    type:
      product.prodCtx && (product.prodCtx.catOut || product.prodCtx.catOutL),
    operator,
  };
};
