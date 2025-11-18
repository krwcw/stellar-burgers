import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

export const getIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const getIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
export const getIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const getOrder = (state: RootState) => state.order.order;
export const getOrderLoading = (state: RootState) => state.order.loading;
export const getOrderError = (state: RootState) => state.order.error;

export const getUser = (state: RootState) => state.user.user;
export const getIsAuthChecked = (state: RootState) => state.user.isAuthChecked;
export const getUserLoading = (state: RootState) => state.user.loading;
export const getUserError = (state: RootState) => state.user.error;

export const getFeeds = (state: RootState) => state.feed.feeds;
export const getUserOrders = (state: RootState) => state.feed.userOrders;
export const getFeedLoading = (state: RootState) => state.feed.loading;
export const getFeedError = (state: RootState) => state.feed.error;

export const getConstructorState = (state: RootState) =>
  state.burgerConstructor;
export const getConstructorItems = createSelector(
  [getConstructorState],
  (constructorState) => ({
    bun: constructorState?.bun || null,
    ingredients: constructorState?.ingredients || []
  })
);
