import { Common, ParsedProduct, ProdL } from 'types/HAFAS';

export default (product: ProdL, common: Common): ParsedProduct => ({
  name: product.addName || product.name,
  line:
    product.nameS ||
    product.matchId ||
    (product.prodCtx && (product.prodCtx.line || product.prodCtx.lineId)),
  admin: product.prodCtx?.admin,
  number: product.prodCtx?.num ?? product.number,
  type: product.prodCtx && (product.prodCtx.catOut || product.prodCtx.catOutL),
  operator: product.oprX !== undefined ? common.opL[product.oprX] : undefined,
  // @ts-expect-error
  raw: global.PROD ? undefined : product,
});
