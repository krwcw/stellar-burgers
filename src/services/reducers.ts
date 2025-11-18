import { combineReducers } from 'redux';
import ingredientsReducer from './slices/ingredientsSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import constructorReducer from './slices/constructorSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer,
  burgerConstructor: constructorReducer
});

export default rootReducer;
