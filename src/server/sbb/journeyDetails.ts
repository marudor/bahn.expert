import { sbbAxios } from '@/server/sbb/sbbAxios';

function getJourneyDetailsRequest(jid: string) {
  return {
    operationName: 'getServiceJourneyById',
    variables: { id: jid, language: 'DE' },
    query:
      'query getServiceJourneyById($id: ID!, $language: LanguageEnum!) {\n  serviceJourneyById(id: $id, language: $language) {\n    id\n    stopPoints {\n      stopStatus\n      stopStatusFormatted\n      arrival {\n        time\n        delay\n        __typename\n      }\n      departure {\n        time\n        delay\n        __typename\n      }\n      accessibilityBoardingAlighting {\n        limitation\n        __typename\n      }\n      occupancy {\n        firstClass\n        secondClass\n        __typename\n      }\n      place {\n        id\n        name\n        __typename\n      }\n      arrival {\n        quayAimedName\n        time\n        quayRtName\n        quayChanged\n        __typename\n      }\n      departure {\n        quayAimedName\n        quayRtName\n        time\n        quayChanged\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
  };
}

export async function getJourneyDetails(jid: string): Promise<any> {
  const data = getJourneyDetailsRequest(jid);

  const result = (await sbbAxios.post('/', data)).data;

  return result;
}
