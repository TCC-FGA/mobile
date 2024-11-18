import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDTO } from '~/dtos/UserDTO';
import { USER_STORAGE_KEY } from '~/storage/storageConfig';
import { storageUserSave, storageUserGet, storageUserRemove } from '~/storage/storageUser';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('storageUser', () => {
  const user: UserDTO = {
    user_id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: '',
    telephone: '',
    monthly_income: 0,
    cpf: '',
    birth_date: '',
    hashed_signature: null,
    photo: null,
    iptu: null,
    street: null,
    neighborhood: null,
    number: null,
    zip_code: null,
    city: null,
    state: null,
    marital_status: null,
    profession: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save user to storage', async () => {
    await storageUserSave(user);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(USER_STORAGE_KEY, JSON.stringify(user));
  });

  it('should get user from storage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(user));
    const result = await storageUserGet();
    expect(result).toEqual(user);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(USER_STORAGE_KEY);
  });

  it('should return empty object if no user is found in storage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const result = await storageUserGet();
    expect(result).toEqual({});
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(USER_STORAGE_KEY);
  });

  it('should remove user from storage', async () => {
    await storageUserRemove();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(USER_STORAGE_KEY);
  });
});
