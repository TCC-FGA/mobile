import { createContext, useEffect, useState } from 'react';

import { UserDTO } from '../dtos/UserDTO';
import { api } from '../services/api';
import { storageUserGet, storageUserRemove, storageUserSave } from '../storage/storageUser';

import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '~/storage/storageAuthToken';

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
};

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);

  async function userAndTokenUpdate(user: UserDTO, token: string) {
    try {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function storageUserAndToken(user: UserDTO, token: string) {
    try {
      await storageUserSave(user);
      await storageAuthTokenSave(token);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function loadUserData() {
    const user = await storageUserGet();
    const token = await storageAuthTokenGet();

    if (user && token) {
      userAndTokenUpdate(user, token);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post(
        '/auth/access-token',
        `grant_type=&username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&scope=&client_id=&client_secret=`
      );

      const { access_token } = data;

      const { data: user } = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      await storageUserAndToken(user, access_token);
      userAndTokenUpdate(user, access_token);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function signOut() {
    try {
      setUser({} as UserDTO);
      await storageUserRemove();
      await storageAuthTokenRemove();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}
