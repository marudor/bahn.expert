import { ParsedProduct, ProdL } from 'types/HAFAS';

export default (product: ProdL): ParsedProduct => ({
  name: product.addName || product.name,
  line: product.prodCtx && (product.prodCtx.line || product.prodCtx.lineId),
  number: product.prodCtx && product.prodCtx.num,
  type: product.prodCtx && (product.prodCtx.catOut || product.prodCtx.catOutL),
});
