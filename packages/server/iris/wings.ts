import { getAttr, getBoolAttr, irisGetRequest, parseTs } from './helper';
import xmljs from 'libxmljs2';
import type { Element } from 'libxmljs2';
import type { WingDefinition, WingInfo } from 'types/iris';

function parseNode(node: null | xmljs.Element): WingInfo | undefined {
  if (!node) return;

  const id = getAttr(node, 'eva');
  const title = getAttr(node, 'st-name');
  const pt = parseTs(getAttr(node, 'pt'));

  if (!id || !title || !pt) return;

  return {
    station: {
      id,
      title,
    },
    pt,
    fl: getBoolAttr(node, 'fl'),
  };
}

// https://iris.noncd.db.de/iris-tts/timetable/wingdef/-6341887980654835099-1903161343-1/-1687578433996553139-1903161343-1
// https://iris.noncd.db.de/iris-tts/timetable/wingdef/rawId1/rawId2
export default async function wingInfo(
  rawId1: string,
  rawId2: string,
): Promise<WingDefinition> {
  const rawXml = await irisGetRequest<string>(`/wingdef/${rawId1}/${rawId2}`);
  const node = xmljs.parseXml(rawXml);

  const startNode = node.find<Element>('//wing-def/start');
  const endNode = node.find<Element>('//wing-def/end');

  return {
    start: parseNode(startNode[0]),
    end: parseNode(endNode[0]),
  };
}
