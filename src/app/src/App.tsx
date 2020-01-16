/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { SafeAreaView, StatusBar } from 'react-native';
import { StorageContext } from 'shared/hooks/useStorage';
import MinimalSearch from '@/MinimalSearch';
import React, { useEffect, useState } from 'react';
import Storage from './Storage';

const storage = new Storage();

const App = () => {
  const [loading, setLoading] = useState(true);

  // TODO: Async Splash
  useEffect(() => {
    storage.init().then(() => {
      setLoading(false);
    });
  }, []);
  if (loading) {
    return null;
  }

  return (
    <>
      <StorageContext.Provider value={storage}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <MinimalSearch />
        </SafeAreaView>
      </StorageContext.Provider>
    </>
  );
};

export default App;
