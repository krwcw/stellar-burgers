import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder, TOrdersData } from '@utils-types';

type TFeedState = {
  feeds: TOrdersData | null;
  userOrders: TOrder[];
  loading: boolean;
  error: string | null;
};

export const initialState: TFeedState = {
  feeds: null,
  userOrders: [],
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feed/fetchAll', async () => {
  const response = await getFeedsApi();
  return response;
});

export const fetchUserOrders = createAsyncThunk(
  'feed/fetchUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.feeds = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Ошибка загрузки заказов пользователя';
      });
  }
});

export default feedSlice.reducer;
