jest.mock('../../utils/burger-api', () => ({
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

import { store } from '../store';
import { createOrder, fetchOrderByNumber, clearOrder } from './orderSlice';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '1',
  ingredients: ['ingredient1', 'ingredient2'],
  status: 'done',
  name: 'Test Order',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 12345
};

describe('Редьюсер заказов', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store.dispatch(clearOrder());
  });

  test('должен обрабатывать начало создания заказа', () => {
    (orderBurgerApi as jest.Mock).mockReturnValue(new Promise(() => {}));

    store.dispatch(createOrder(['ingredient1', 'ingredient2']));

    const state = store.getState().order;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен обрабатывать успешное создание заказа', async () => {
    (orderBurgerApi as jest.Mock).mockResolvedValue({ order: mockOrder });

    await store.dispatch(createOrder(['ingredient1', 'ingredient2']));

    const state = store.getState().order;
    expect(state.loading).toBe(false);
    expect(state.order).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  test('должен обрабатывать ошибку создания заказа', async () => {
    const errorMessage = 'Failed to create order';
    (orderBurgerApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await store.dispatch(createOrder(['ingredient1', 'ingredient2']));

    const state = store.getState().order;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('должен обрабатывать начало загрузки заказа по номеру', () => {
    (getOrderByNumberApi as jest.Mock).mockReturnValue(new Promise(() => {}));

    store.dispatch(fetchOrderByNumber(12345));

    const state = store.getState().order;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен обрабатывать успешную загрузку заказа по номеру', async () => {
    (getOrderByNumberApi as jest.Mock).mockResolvedValue({
      orders: [mockOrder]
    });

    await store.dispatch(fetchOrderByNumber(12345));

    const state = store.getState().order;
    expect(state.loading).toBe(false);
    expect(state.order).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  test('должен обрабатывать ошибку загрузки заказа по номеру', async () => {
    const errorMessage = 'Failed to fetch order';
    (getOrderByNumberApi as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    await store.dispatch(fetchOrderByNumber(12345));

    const state = store.getState().order;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('должен очищать заказ', () => {
    store.dispatch(clearOrder());

    const state = store.getState().order;
    expect(state.order).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});
