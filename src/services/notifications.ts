import { OneSignal } from 'react-native-onesignal';

export function tagUserCreate(userId: string) {
  OneSignal.User.addTag('userId', userId);
}

export function setUserEmail(email: string) {
  OneSignal.User.addEmail(email);
}
