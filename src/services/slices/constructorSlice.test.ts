import { store } from '../store';
import {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import { getConstructorItems } from '../selectors';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const mockIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0945',
    name: 'Соус с шипами Антарианского плоскоходца',
    type: 'sauce',
    proteins: 101,
    fat: 99,
    carbohydrates: 100,
    calories: 100,
    price: 88,
    image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
  }
];

describe('constructor slice', () => {
  beforeEach(() => {
    store.dispatch(clearConstructor());
  });

  test('должен добавлять булку в конструктор', () => {
    const bun = mockIngredients.find((ing) => ing.type === 'bun')!;

    store.dispatch(addBun(bun));

    const state = store.getState().burgerConstructor;
    expect(state.bun).toEqual(bun);
  });

  test('должен добавлять ингредиент в конструктор', () => {
    const mainIngredient = mockIngredients.find((ing) => ing.type === 'main')!;
    const constructorIngredient: TConstructorIngredient = {
      ...mainIngredient,
      id: `${mainIngredient._id}-${Date.now()}`
    };

    store.dispatch(addIngredient(constructorIngredient));

    const state = store.getState().burgerConstructor;
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(constructorIngredient);
  });

  test('должен заменять булку при добавлении новой булки', () => {
    const bun1 = mockIngredients.find((ing) => ing.type === 'bun')!;
    const bun2 = { ...bun1, _id: 'different-bun', name: 'Другая булка' };

    store.dispatch(addBun(bun1));
    store.dispatch(addBun(bun2));

    const state = store.getState().burgerConstructor;
    expect(state.bun).toEqual(bun2);
  });

  test('должен удалять ингредиент из конструктора', () => {
    const mainIngredient = mockIngredients.find((ing) => ing.type === 'main')!;
    const constructorIngredient: TConstructorIngredient = {
      ...mainIngredient,
      id: 'test-id-123'
    };

    store.dispatch(addIngredient(constructorIngredient));
    store.dispatch(removeIngredient('test-id-123'));

    const state = store.getState().burgerConstructor;
    expect(state.ingredients).toHaveLength(0);
  });

  test('должен изменять порядок ингредиентов', () => {
    const mainIngredient1: TConstructorIngredient = {
      ...mockIngredients.find((ing) => ing.type === 'main')!,
      id: '1'
    };
    const mainIngredient2: TConstructorIngredient = {
      ...mockIngredients.find((ing) => ing.type === 'sauce')!,
      id: '2'
    };

    store.dispatch(addIngredient(mainIngredient1));
    store.dispatch(addIngredient(mainIngredient2));

    let state = store.getState().burgerConstructor;
    expect(state.ingredients[0].id).toBe('1');
    expect(state.ingredients[1].id).toBe('2');

    store.dispatch(moveIngredient({ fromIndex: 0, toIndex: 1 }));

    state = store.getState().burgerConstructor;
    expect(state.ingredients[0].id).toBe('2');
    expect(state.ingredients[1].id).toBe('1');
  });

  test('должен очищать конструктор', () => {
    const bun = mockIngredients.find((ing) => ing.type === 'bun')!;
    const mainIngredient: TConstructorIngredient = {
      ...mockIngredients.find((ing) => ing.type === 'main')!,
      id: 'test-id'
    };

    store.dispatch(addBun(bun));
    store.dispatch(addIngredient(mainIngredient));
    store.dispatch(clearConstructor());

    const state = store.getState().burgerConstructor;
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });

  test('селектор getConstructorItems должен возвращать правильную структуру', () => {
    const bun = mockIngredients.find((ing) => ing.type === 'bun')!;
    const mainIngredient: TConstructorIngredient = {
      ...mockIngredients.find((ing) => ing.type === 'main')!,
      id: 'test-id'
    };

    store.dispatch(addBun(bun));
    store.dispatch(addIngredient(mainIngredient));

    const state = store.getState();
    const result = getConstructorItems(state);

    expect(result).toEqual({
      bun: bun,
      ingredients: [mainIngredient]
    });
  });
});
