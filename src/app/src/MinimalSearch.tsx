import { AbfahrtenResult } from 'types/iris';
import { Button, ScrollView, Text, TextInput } from 'react-native';
import Axios from 'axios';
import React, { useCallback, useState } from 'react';
import useStorage from 'shared/hooks/useStorage';

Axios.defaults.baseURL = 'https://marudor.de';

let cancelGetAbfahrten = () => {};

export const fetchAbfahrten = async (
  stationId: string,
  lookahead: string,
  lookbehind: string
): Promise<AbfahrtenResult> => {
  cancelGetAbfahrten();
  const r = await Axios.get<AbfahrtenResult>(
    `/api/iris/v1/abfahrten/${stationId}`,
    {
      cancelToken: new Axios.CancelToken(c => {
        cancelGetAbfahrten = c;
      }),
      params: {
        lookahead,
        lookbehind,
      },
    }
  );

  return r.data;
};

const MinimalSearch = () => {
  const storage = useStorage();

  const [searchString, setSearchString] = useState<string>(
    storage.get('test') ?? ''
  );
  const [abfahrten, setAbfahrten] = useState<AbfahrtenResult | undefined>();
  const fetch = useCallback(() => {
    fetchAbfahrten(searchString, '150', '0').then(setAbfahrten);
    storage.set('test', searchString);
  }, [searchString, storage]);

  return (
    <ScrollView>
      <TextInput onChangeText={setSearchString} value={searchString} />
      <Button title="Search" onPress={fetch} />
      {abfahrten &&
        abfahrten.departures.map(a => (
          <Text key={a.rawId}>
            {a.train.name} -&gt; {a.destination}
          </Text>
        ))}
    </ScrollView>
  );
};

export default MinimalSearch;
