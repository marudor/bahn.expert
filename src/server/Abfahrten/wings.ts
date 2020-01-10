import { AxiosInstance } from 'axios';
import { getAttr, getBoolAttr, noncdAxios, parseTs } from './helper';
import { WingDefinition, WingInfo } from 'types/iris';
import xmljs, { Element } from 'libxmljs2';

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
  axios: AxiosInstance = noncdAxios
): Promise<WingDefinition> {
  const rawXml = (await axios.get(`/wingdef/${rawId1}/${rawId2}`)).data;
  const node = xmljs.parseXml(rawXml);

  const startNode = node.find<Element>('//wing-def/start');
  const endNode = node.find<Element>('//wing-def/end');

  return {
    start: parseNode(startNode[0]),
    end: parseNode(endNode[0]),
  };
}
