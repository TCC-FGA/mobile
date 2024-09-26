import AsyncStorage from '@react-native-async-storage/async-storage';

import { USER_STORAGE_KEY } from './storageConfig';

import { UserDTO } from '~/dtos/UserDTO';

export async function storageUserSave(user: UserDTO) {
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export async function storageUserGet() {
  const storage = await AsyncStorage.getItem(USER_STORAGE_KEY);

  const user: UserDTO = storage ? JSON.parse(storage) : {};

  return user;
}

export async function storageUserRemove() {
  await AsyncStorage.removeItem(USER_STORAGE_KEY);
}
