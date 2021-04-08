import type { Common, ParsedProduct, ProdL } from 'types/HAFAS';

export default (product: ProdL, common: Common): ParsedProduct => {
  const operator =
    product.oprX !== undefined ? common.opL[product.oprX] : undefined;

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
  };
};
