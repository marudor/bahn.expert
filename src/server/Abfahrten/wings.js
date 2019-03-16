// @flow
import { getAttr, getBoolAttr, parseTs } from './helper';
import { irisBase } from '.';
import axios from 'axios';
import xmljs from 'libxmljs';

function parseNode(node) {
  if (!node) return;

  return {
    station: {
      id: getAttr(node, 'eva'),
      title: getAttr(node, 'st-name'),
    },
    pt: parseTs(getAttr(node, 'pt')),
    fl: getBoolAttr(node, 'fl'),
  };
}

// https://iris.noncd.db.de/iris-tts/timetable/wingdef/-6341887980654835099-1903161343-1/-1687578433996553139-1903161343-1
// https://iris.noncd.db.de/iris-tts/timetable/wingdef/rawId1/rawId2
export default async function wingInfo(rawId1: string, rawId2: string) {
  const rawXml = (await axios.get(`${irisBase}/wingdef/${rawId1}/${rawId2}`)).data;
  const node = xmljs.parseXml(rawXml);

  const startNode = node.find('//wing-def/start');
  const endNode = node.find('//wing-def/end');

  return {
    start: parseNode(startNode[0]),
    end: parseNode(endNode[0]),
  };
}
