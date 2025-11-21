jest.mock('../../utils/burger-api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn()
}));

jest.mock('../../utils/cookie', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

import { store } from '../store';
import {
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  checkUserAuth,
  fetchUser
} from './userSlice';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '../../utils/burger-api';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('Редьюсер пользователя', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('должен обрабатывать начало авторизации', () => {
    (loginUserApi as jest.Mock).mockReturnValue(new Promise(() => {}));

    store.dispatch(
      loginUser({ email: 'test@example.com', password: 'password' })
    );

    const state = store.getState().user;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен обрабатывать успешную авторизацию', async () => {
    (loginUserApi as jest.Mock).mockResolvedValue({
      user: mockUser,
      accessToken: 'test-token',
      refreshToken: 'test-refresh-token'
    });

    await store.dispatch(
      loginUser({ email: 'test@example.com', password: 'password' })
    );

    const state = store.getState().user;
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  test('должен обрабатывать ошибку авторизации', async () => {
    const errorMessage = 'Failed to login';
    (loginUserApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await store.dispatch(
      loginUser({ email: 'test@example.com', password: 'password' })
    );

    const state = store.getState().user;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('должен обрабатывать начало регистрации', () => {
    (registerUserApi as jest.Mock).mockReturnValue(new Promise(() => {}));

    store.dispatch(
      registerUser({
        email: 'test@example.com',
        password: 'password',
        name: 'Test User'
      })
    );

    const state = store.getState().user;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен обрабатывать успешную регистрацию', async () => {
    (registerUserApi as jest.Mock).mockResolvedValue({
      user: mockUser,
      accessToken: 'test-token',
      refreshToken: 'test-refresh-token'
    });

    await store.dispatch(
      registerUser({
        email: 'test@example.com',
        password: 'password',
        name: 'Test User'
      })
    );

    const state = store.getState().user;
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
    expect(state.loading).toBe(false);
  });

  test('должен обрабатывать ошибку регистрации', async () => {
    const errorMessage = 'Failed to register';
    (registerUserApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await store.dispatch(
      registerUser({
        email: 'test@example.com',
        password: 'password',
        name: 'Test User'
      })
    );

    const state = store.getState().user;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('должен обрабатывать начало обновления пользователя', () => {
    (updateUserApi as jest.Mock).mockReturnValue(new Promise(() => {}));

    store.dispatch(updateUser({ name: 'New Name' }));

    const state = store.getState().user;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен обрабатывать успешное обновление пользователя', async () => {
    const updatedUser = { ...mockUser, name: 'Updated Name' };
    (updateUserApi as jest.Mock).mockResolvedValue({ user: updatedUser });

    await store.dispatch(updateUser({ name: 'Updated Name' }));

    const state = store.getState().user;
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(updatedUser);
  });

  test('должен обрабатывать ошибку обновления пользователя', async () => {
    const errorMessage = 'Failed to update user';
    (updateUserApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await store.dispatch(updateUser({ name: 'New Name' }));

    const state = store.getState().user;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('должен обрабатывать начало загрузки пользователя', () => {
    (getUserApi as jest.Mock).mockReturnValue(new Promise(() => {}));

    store.dispatch(fetchUser());

    const state = store.getState().user;
    expect(state.loading).toBe(true);
  });

  test('должен обрабатывать успешную загрузку пользователя', async () => {
    (getUserApi as jest.Mock).mockResolvedValue({ user: mockUser });

    await store.dispatch(fetchUser());

    const state = store.getState().user;
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  test('должен обрабатывать ошибку загрузки пользователя', async () => {
    (getUserApi as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch user')
    );

    await store.dispatch(fetchUser());

    const state = store.getState().user;
    expect(state.loading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  test('должен обрабатывать начало проверки аутентификации', () => {
    (getUserApi as jest.Mock).mockReturnValue(new Promise(() => {}));

    store.dispatch(checkUserAuth());

    const state = store.getState().user;
    expect(state.loading).toBe(true);
  });

  test('должен обрабатывать успешную проверку аутентификации', async () => {
    (getUserApi as jest.Mock).mockResolvedValue({ user: mockUser });

    await store.dispatch(checkUserAuth());

    const state = store.getState().user;
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  test('должен обрабатывать ошибку проверки аутентификации', async () => {
    (getUserApi as jest.Mock).mockRejectedValue(
      new Error('Failed to check auth')
    );

    await store.dispatch(checkUserAuth());

    const state = store.getState().user;
    expect(state.loading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  test('должен очищать пользователя при выходе', async () => {
    (logoutApi as jest.Mock).mockResolvedValue({});

    await store.dispatch(logoutUser());

    const state = store.getState().user;
    expect(state.user).toBeNull();
  });
});
