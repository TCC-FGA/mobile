import { createContext, useEffect, useState } from 'react';

import { UserDTO } from '../dtos/UserDTO';
import { api } from '../services/api';
import { storageUserGet, storageUserRemove, storageUserSave } from '../storage/storageUser';

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
};

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);

  async function loadUserData() {
    const user = await storageUserGet();

    if (user) {
      setUser(user);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post(
        '/auth/access-token',
        `grant_type=&username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&scope=&client_id=&client_secret=`
      );

      if (data.status !== 200) {
        setUser({
          email,
          password,
          name: 'John Doe',
          telephone: '11999999999',
          monthly_income: 5000,
          cpf: '12345678909',
          birth_date: '1990-01-01',
        });
      }
    } catch (error) {
      console.log(error);
      throw new Error('Invalid credentials');
    }
  }

  async function signOut() {
    try {
      setUser({} as UserDTO);
      await storageUserRemove();
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
