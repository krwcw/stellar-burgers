jest.mock('../../utils/burger-api', () => ({
  getFeedsApi: jest.fn(),
  getOrdersApi: jest.fn()
}));

import { store } from '../store';
import { fetchFeeds, fetchUserOrders } from './feedSlice';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder, TOrdersData } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    ingredients: ['ingredient1', 'ingredient2'],
    status: 'done',
    name: 'Test Order 1',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 12345
  },
  {
    _id: '2',
    ingredients: ['ingredient3', 'ingredient4'],
    status: 'pending',
    name: 'Test Order 2',
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
    number: 12346
  }
];

const mockFeeds: TOrdersData = {
  orders: mockOrders,
  total: 100,
  totalToday: 10
};

describe('Редьюсер ленты заказов', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('должен обрабатывать начало загрузки ленты заказов', () => {
    (getFeedsApi as jest.Mock).mockReturnValue(new Promise(() => {}));

    store.dispatch(fetchFeeds());

    const state = store.getState().feed;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен обрабатывать успешную загрузку ленты заказов', async () => {
    (getFeedsApi as jest.Mock).mockResolvedValue(mockFeeds);

    await store.dispatch(fetchFeeds());

    const state = store.getState().feed;
    expect(state.loading).toBe(false);
    expect(state.feeds).toEqual(mockFeeds);
  });

  test('должен обрабатывать ошибку загрузки ленты заказов', async () => {
    const errorMessage = 'Failed to fetch feeds';
    (getFeedsApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await store.dispatch(fetchFeeds());

    const state = store.getState().feed;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('должен обрабатывать начало загрузки заказов пользователя', () => {
    (getOrdersApi as jest.Mock).mockReturnValue(new Promise(() => {}));

    store.dispatch(fetchUserOrders());

    const state = store.getState().feed;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен обрабатывать успешную загрузку заказов пользователя', async () => {
    (getOrdersApi as jest.Mock).mockResolvedValue(mockOrders);

    await store.dispatch(fetchUserOrders());

    const state = store.getState().feed;
    expect(state.loading).toBe(false);
    expect(state.userOrders).toEqual(mockOrders);
  });

  test('должен обрабатывать ошибку загрузки заказов пользователя', async () => {
    const errorMessage = 'Failed to fetch user orders';
    (getOrdersApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await store.dispatch(fetchUserOrders());

    const state = store.getState().feed;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
