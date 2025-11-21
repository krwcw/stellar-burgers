jest.mock('../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

import { store } from '../store';
import { fetchIngredients } from './ingredientsSlice';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Test Ingredient 1',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 200,
    image: 'image1.png',
    image_large: 'image1-large.png',
    image_mobile: 'image1-mobile.png'
  },
  {
    _id: '2',
    name: 'Test Ingredient 2',
    type: 'main',
    proteins: 15,
    fat: 8,
    carbohydrates: 25,
    calories: 150,
    price: 300,
    image: 'image2.png',
    image_large: 'image2-large.png',
    image_mobile: 'image2-mobile.png'
  }
];

describe('Редьюсер ингредиентов', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('должен обрабатывать начало загрузки ингредиентов', () => {
    (getIngredientsApi as jest.Mock).mockReturnValue(new Promise(() => {}));

    store.dispatch(fetchIngredients());

    const state = store.getState().ingredients;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен обрабатывать успешную загрузку ингредиентов', async () => {
    (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);

    await store.dispatch(fetchIngredients());

    const state = store.getState().ingredients;
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  test('должен обрабатывать ошибку загрузки ингредиентов', async () => {
    const errorMessage = 'Failed to fetch ingredients';
    (getIngredientsApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await store.dispatch(fetchIngredients());

    const state = store.getState().ingredients;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
