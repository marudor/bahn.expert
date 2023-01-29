import type {
  CommonProductInfo,
  CommonStop,
  ParsedCommon,
} from '@/types/HAFAS';

export const adjustProductOperator = (
  mainProduct: CommonProductInfo,
  common: ParsedCommon,
  stops?: CommonStop[],
): void => {
  if (!stops) return;
  const relevantProdX = new Set(
    stops.flatMap((s) => [s.aProdX, s.dProdX]).filter(Boolean),
  );
  const operatorNames = new Set<string>();
  if (mainProduct.operator?.name) {
    operatorNames.add(mainProduct.operator.name);
  }
  for (const prodX of relevantProdX) {
    const operatorName = common.prodL[prodX].operator?.name;
    if (operatorName) {
      operatorNames.add(operatorName);
    }
  }
  if (operatorNames.size && mainProduct.operator) {
    mainProduct.operator.name = [...operatorNames].join(', ');
  }
};
