// @flow
declare module 'libxmljs' {
  declare export type XmlAttr = {
    name(): string,
    value(): ?string,
  };
  declare export type XmlNode = {
    get(childNode: string): ?XmlNode,
    find(xpath: string): XmlNode[],
    path(): string,
    map<U>((XmlNode) => U): U[],
    attr(name: string): ?XmlAttr,
    forEach((XmlNode) => any): void,
    attrs(): XmlAttr[],
  };
  declare function parseXml(rawXml: string): XmlNode;

  declare module.exports: {
    parseXml: typeof parseXml,
  };
}
