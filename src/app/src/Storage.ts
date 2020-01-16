import AsyncStorage from '@react-native-community/async-storage';
import StorageInterface from 'shared/hooks/useStorage/StorageInterface';

export default class Storage implements StorageInterface {
  private data: Map<any, any> = new Map();

  private saveItem = (item: any[]) => {
    let value;

    try {
      value = JSON.parse(item[1]);
    } catch {
      [, value] = item;
    }
    this.data.set(item[0], value);
  };

  async init(): Promise<void> {
    const allKeys = await AsyncStorage.getAllKeys();
    const allValues = await AsyncStorage.multiGet(allKeys);

    allValues.forEach(this.saveItem);
  }

  get<T = any>(key: string): T {
    return this.data.get(key);
  }

  set<T = any>(key: string, value: T) {
    this.data.set(key, value);
    AsyncStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    this.data.delete(key);
    AsyncStorage.removeItem(key);
  }
}
