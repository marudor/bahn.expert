// @flow
/* eslint import/prefer-default-export: 0 */

export function normalizeName(name: string) {
  let normalizedName = name.replace(/([^ ])\(/, '$1 (');

  normalizedName = name.replace(/\)(.)/, ') $1');
  normalizedName = name.replace(/Frankfurt \(M\)/, 'Frankfurt (Main)');

  return normalizedName;
}
