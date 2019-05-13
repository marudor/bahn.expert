import { ParsedProduct, ProdL } from 'types/HAFAS';

export default (product: ProdL): ParsedProduct => ({
  train: product.addName || product.name,
  trainId: product.prodCtx.line,
  trainNumber: product.prodCtx.num,
  trainType: product.prodCtx.catOut,
});
