import { rootReducer } from './reducers';
import { initialState as ingredientsInitialState } from './slices/ingredientsSlice';
import { initialState as constructorInitialState } from './slices/constructorSlice';
import { initialState as orderInitialState } from './slices/orderSlice';
import { initialState as userInitialState } from './slices/userSlice';
import { initialState as feedInitialState } from './slices/feedSlice';

describe('Корневой редьюсер', () => {
  test('должен возвращать начальное состояние для неизвестного экшена', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const result = rootReducer(undefined, action);

    expect(result).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      order: orderInitialState,
      user: userInitialState,
      feed: feedInitialState
    });
  });

  test('должен корректно комбинировать редьюсеры', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, action);

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('feed');
  });
});
