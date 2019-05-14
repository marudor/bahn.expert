import { ParsedProduct, ProdL } from 'types/HAFAS';

export default (product: ProdL): ParsedProduct => ({
  full: product.addName || product.name,
  line: product.prodCtx.line,
  number: product.prodCtx.num,
  type: product.prodCtx.catOut,
});
