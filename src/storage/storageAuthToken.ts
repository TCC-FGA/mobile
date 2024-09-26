import AsyncStorage from '@react-native-async-storage/async-storage';

import { AUTH_STORAGE_KEY } from './storageConfig';

export async function storageAuthTokenSave(token: string) {
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, token);
}

export async function storageAuthTokenGet() {
  const storage = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

  return storage;
}

export async function storageAuthTokenRemove() {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
}
